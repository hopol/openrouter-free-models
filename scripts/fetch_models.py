#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 OpenRouter 官方 API 获取可免费调用的模型，并写入静态站点数据文件。"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

API_URL = "https://openrouter.ai/api/v1/models"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = PROJECT_ROOT / "public" / "data" / "models.json"
TIMEOUT_SECONDS = 30


def fetch_models() -> list[dict[str, Any]]:
    """请求 OpenRouter 模型接口，并验证其基本返回结构。"""
    request = urllib.request.Request(
        API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "openrouter-free-models/1.0 (+https://github.com/hopol/openrouter-free-models)",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as error:
        raise RuntimeError(f"无法从 OpenRouter API 获取模型数据：{error}") from error

    models = payload.get("data")
    if not isinstance(models, list):
        raise RuntimeError("OpenRouter API 返回的数据格式不符合预期：缺少 data 列表。")
    return models


def is_free_model(model: dict[str, Any]) -> bool:
    """仅在输入和输出 token 单价均为零时认定为免费模型。"""
    pricing = model.get("pricing")
    if not isinstance(pricing, dict):
        return False

    try:
        return float(pricing["prompt"]) == 0.0 and float(pricing["completion"]) == 0.0
    except (KeyError, TypeError, ValueError):
        return False


def company_from_id(model_id: str) -> str:
    """从 provider/model 形式的模型 ID 提取提供方。"""
    return model_id.split("/", 1)[0] if "/" in model_id else "unknown"


def main() -> int:
    try:
        all_models = fetch_models()
    except RuntimeError as error:
        print(f"错误：{error}", file=sys.stderr)
        return 1

    # API 返回顺序可能变化；按模型 ID 排序使 Git 提交只反映实际数据变化。
    free_models = sorted(
        (model for model in all_models if is_free_model(model)),
        key=lambda model: str(model.get("id", "")).lower(),
    )

    companies: dict[str, list[dict[str, Any]]] = {}
    for model in free_models:
        company = company_from_id(str(model.get("id", "")))
        companies.setdefault(company, []).append(model)

    output = {
        "source": API_URL,
        "total_models": len(all_models),
        "free_models_count": len(free_models),
        "paid_models_count": len(all_models) - len(free_models),
        "free_models": free_models,
        "companies": {
            company: {
                "name": company,
                "count": len(models),
                "models": models,
            }
            for company, models in sorted(companies.items())
        },
    }

    # updated_at 只在数据真的变化时更新，避免定时任务每次都产生空提交。
    previous: dict[str, Any] = {}
    if OUTPUT_PATH.exists():
        try:
            with OUTPUT_PATH.open("r", encoding="utf-8") as file:
                previous = json.load(file)
        except (OSError, json.JSONDecodeError):
            previous = {}
    previous_without_timestamp = dict(previous)
    previous_timestamp = previous_without_timestamp.pop("updated_at", None)
    if previous_without_timestamp == output and previous_timestamp:
        output["updated_at"] = previous_timestamp
    else:
        output["updated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = OUTPUT_PATH.with_suffix(".json.tmp")
    with temporary_path.open("w", encoding="utf-8", newline="\n") as file:
        json.dump(output, file, ensure_ascii=False, indent=2)
        file.write("\n")
    os.replace(temporary_path, OUTPUT_PATH)

    print(f"全部模型：{len(all_models)}")
    print(f"免费模型：{len(free_models)}")
    print(f"已写入：{OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
