# OpenRouter 免费模型中心

一个零后端的静态网站：自动列出 OpenRouter 当前输入、输出价格都为零的模型，提供模型简介、搜索筛选，以及十个常见使用场景的选型建议。

- 项目仓库：`https://github.com/hopol/openrouter-free-models`
- 数据来源：`https://openrouter.ai/api/v1/models`
- 站点部署方式：Cloudflare Pages 的 **Git 仓库连接部署**
- 自动更新：每天两次，由 GitHub Actions 更新 `public/data/models.json`

> **“免费”的判定方式**：仅当 OpenRouter API 返回的 `pricing.prompt` 和 `pricing.completion` 均为 `0` 时，才会列入本站。模型可用性、限流规则和免费资格会变化，请在实际调用前再以 OpenRouter 的模型详情与价格为准。

## 功能

- 自动抓取 OpenRouter 官方模型接口。
- 按提供方展示当前免费模型。
- 显示模型 ID、名称、简介、上下文长度、输入输出模态与价格字段。
- 按模型名称、模型 ID、提供方搜索和筛选。
- 内置日常聊天、代码开发、长文档、多模态、音频、内容安全、开源原型、轻量任务、复杂推理、快速上手等十个选型场景。
- 每个场景提供推荐理由、建议工作流程、可复制改写的提示词示例，以及接入 Claude Code、Hermes、Pi、Codex、OpenCode 等代理工具时的注意事项。
- 每天北京时间 08:00、20:00 自动检查并更新数据；数据没有变化时不会产生无意义提交。

## 项目结构

```text
openrouter-free-models/
├── .github/workflows/daily-update.yml  # 每日两次更新数据
├── public/                             # Cloudflare Pages 发布目录
│   ├── index.html                      # 网页结构
│   ├── styles.css                      # 网页样式
│   ├── app.js                          # 网页逻辑
│   └── data/models.json                # 自动生成的模型数据
├── scripts/fetch_models.py             # 从 OpenRouter 获取数据
├── generate_initial.py                 # 兼容入口，调用上面的脚本
├── package.json                        # 常用命令说明，无第三方依赖
├── LICENSE                             # MIT 许可证
└── README.md
```

## 本地运行

### 条件

- Python 3.10 或更新版本。
- 可访问 `https://openrouter.ai/api/v1/models` 的网络。

本项目只使用 Python 标准库，**不需要**安装任何 Python 或 Node.js 第三方依赖。

### 操作

```bash
# 获取仓库
git clone https://github.com/hopol/openrouter-free-models.git
cd openrouter-free-models

# 下载最新模型数据
python scripts/fetch_models.py

# 启动静态文件服务器
python -m http.server 8000 --directory public
```

在浏览器打开 `http://localhost:8000`。不要直接双击 `index.html` 打开，因为浏览器可能阻止本地页面读取 JSON 数据。

Windows 上如果 `python` 命令无效，请改用：

```powershell
py scripts/fetch_models.py
py -m http.server 8000 --directory public
```

## 给小白的 Cloudflare Pages 部署教程（2026）

Cloudflare 的控制台菜单与深层链接会调整，因此**不要依赖旧教程中的 `/pages/create`、`/workers-&-pages/pages/create` 等固定地址**；这些链接可能显示 404。请始终从 Cloudflare 控制台首页进入，再按界面菜单操作。

### 部署前准备

1. 注册并登录 GitHub：`https://github.com/`。
2. 注册并登录 Cloudflare：`https://dash.cloudflare.com/`。
3. 在 GitHub 创建一个空仓库，例如 `openrouter-free-models`。
4. 将本项目全部文件推送到该仓库的默认分支（通常为 `main`）。

如果你不熟悉 GitHub：在仓库页面选择 **Add file → Upload files**，把本项目中的文件和文件夹上传，再点击 **Commit changes** 即可。务必上传 `.github`、`public` 和 `scripts` 目录；其中以点开头的 `.github` 在某些文件管理器中可能被隐藏。

### 第一步：从控制台首页进入 Pages

1. 打开并登录 `https://dash.cloudflare.com/`。
2. 在左侧导航中选择 **Workers & Pages**、**计算（Compute）** 或名称相近的入口。Cloudflare 可能会调整菜单文字。
3. 点击右上角的 **Create**、**Create application** 或 **创建应用程序**。
4. 选择 **Pages**。
5. 选择 **Connect to Git**、**Import an existing Git repository** 或“连接 Git 仓库”。

> 如果页面首先让你选择 Workers 或 Pages，请选择 **Pages**；本项目是静态网站，不是 Worker 服务。

### 第二步：授权并选择 GitHub 仓库

1. 首次使用时点击连接 GitHub，并按提示授权 Cloudflare 访问仓库。
2. 在仓库列表中选择你刚才上传项目的仓库。
3. 选择生产分支：通常为 `main`。
4. 继续到构建设置页面。

### 第三步：填写正确的构建设置

这是最容易出错的一步。本项目的站点文件已经在 `public` 内，模型数据由 GitHub Actions 写入 `public/data/models.json`，所以 **不需要在 Cloudflare 构建阶段运行 Python**。

| Cloudflare 设置项 | 应填写的值 |
|---|---|
| 框架预设（Framework preset） | `None`、`无`，或静态 HTML 对应选项 |
| 构建命令（Build command） | **留空**；若界面强制要求，填 `exit 0` |
| 构建输出目录（Build output directory） | `public` |
| 根目录（Root directory） | 留空或 `/` |
| 环境变量 | 不需要填写 |

不要填写下列旧配置：

- 不要把输出目录填写成 `data`、项目根目录或 `public/data`。
- 不要把构建命令填写成 `python scripts/fetch_models.py`。Cloudflare Pages 的构建环境不是本项目更新数据的职责，数据更新由 GitHub Actions 完成。
- 不需要 Cloudflare API 令牌、不需要账户 ID、不需要 `CLOUDFLARE_ACCOUNT_ID` 密钥。

### 第四步：发布与检查

1. 点击 **Save and Deploy**、**Deploy** 或“保存并部署”。
2. 等待构建完成。首次发布通常需要数分钟。
3. Cloudflare 会给出 `https://你的项目名.pages.dev` 形式的地址。
4. 打开该地址，确认首页出现模型统计、模型卡片和“使用场景推荐”。
5. 在地址栏打开 `https://你的项目名.pages.dev/data/models.json`；若能看到 JSON 数据，说明发布目录设置正确。

### 第五步：确认自动更新已经启用

1. 打开 GitHub 仓库的 **Actions** 标签。
2. 找到“更新免费模型数据”工作流。
3. 点击工作流，再点击 **Run workflow** 手动运行一次。
4. 若 OpenRouter 数据有变化，工作流会提交 `public/data/models.json`。
5. 因为 Cloudflare Pages 已连接 Git 仓库，新的提交会自动触发一次部署；可在 Cloudflare 项目的 **Deployments** 页面查看状态。

工作流计划以 UTC 计时：`00:00` 与 `12:00`，即北京时间 `08:00` 与 `20:00`。GitHub 的计划任务可能延迟几分钟，这是正常现象。

### 需要自定义域名（可选）

部署成功后，在 Cloudflare 项目中进入 **Custom domains**（自定义域）或名称相近的菜单，点击添加域名，按提示完成 DNS 配置即可。首次使用建议先确认 `.pages.dev` 地址工作正常，再绑定自己的域名。

## 手动更新数据

在项目根目录运行：

```bash
python scripts/fetch_models.py
```

脚本会请求官方 API，并只覆盖：

```text
public/data/models.json
```

脚本失败时会返回非零状态码，旧数据文件不会被半写入或清空。

## 使用场景速查

| 场景 | 首选模型 | 说明 |
|---|---|---|
| 不知道怎么选 | `openrouter/free` | 自动选择当前可用免费模型 |
| 日常问答、改写 | `openrouter/free` | 入门最简单 |
| 代码补全、解释、重构 | `cohere/north-mini-code:free` | 代码任务优先尝试 |
| 长文档或代码库 | `nvidia/nemotron-3-ultra-550b-a55b:free` | 以实时数据中的上下文长度为准 |
| 图像、音频、视频理解 | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 先检查当前模型模态是否可用 |
| 音频生成实验 | `google/lyria-3-pro-preview` | 预览模型，不建议作为唯一生产依赖 |
| 内容安全辅助审核 | `nvidia/nemotron-3.5-content-safety:free` | 仍应保留人工审核 |
| 开源原型 | `google/gemma-4-31b-it:free` | 上线前应单独核对许可证 |
| 简单、低延迟任务 | `nvidia/nemotron-nano-9b-v2:free` | 适合提取、分类、格式转换 |
| 复杂推理、长文本初稿 | `poolside/laguna-s-2.1:free` | 重要结果必须核验 |

这些推荐是使用方向，不构成可用性、性能、许可或服务等级承诺。

## 常见问题

### 页面显示“模型数据加载失败”

检查下列地址是否可访问：

```text
https://你的项目名.pages.dev/data/models.json
```

若显示 404，Cloudflare 的“构建输出目录”填写错误；应为 `public`。若 JSON 地址可打开但页面仍失败，请打开浏览器开发者工具查看控制台错误，并确认 `public/app.js` 已一并上传。

### GitHub Actions 无法推送更新

进入 GitHub 仓库 **Settings → Actions → General → Workflow permissions**，选择 **Read and write permissions**，保存后重新手动运行工作流。工作流文件中已经声明了 `contents: write` 权限，但仓库设置也不能禁止写入。

### 为什么模型数量与以前不同？

模型清单是实时 API 数据，不是固定的手工列表。提供方可能新增、下线模型，或修改价格与免费资格，因此数量变化属于预期行为。

### 为什么静态站点也能每日更新？

网站本身不运行服务器。GitHub Actions 每天两次生成新的 JSON 并提交到仓库；Cloudflare Pages 监听到新的 Git 提交后重新发布静态文件。

## 许可证

MIT License。
