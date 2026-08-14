const SCENARIOS = {
  chat: {
    title: "日常聊天与文字工作", model: "openrouter/free",
    summary: "适合第一次接入、日常问答、邮件润色、会议纪要、翻译和提纲整理。你不需要先理解模型差异，路由器会从当前可用的免费模型中选择。",
    steps: ["先用路由器完成任务原型，观察回答质量和稳定性。", "当任务变为代码、图像或超长文档时，再换到对应的专用模型。", "涉及事实、法律、财务、医疗等结论时，必须使用原始资料人工复核。"],
    example: "请把以下会议记录整理为：一、已确认决策；二、待办事项及负责人；三、风险与截止日期。不要补充原文没有的信息。",
    tools: "适合网页聊天、内部知识助手，以及任何支持 OpenRouter 标准接口的客户端。"
  },
  code: {
    title: "代码开发、调试与代码审查", model: "cohere/north-mini-code:free",
    summary: "适合函数实现、报错分析、重构建议、单元测试和代码解释。代码任务应提供最小可复现示例、语言版本、依赖和完整错误信息，而不是只贴一行报错。",
    steps: ["先说明目标、技术栈和不可修改的约束。", "给出相关文件，而不是整个无关项目；长项目按模块分批发送。", "要求模型先分析原因和修改方案，再生成补丁，并在本地运行测试。"],
    example: "Python 3.12 项目中，下面函数在空列表时抛出异常。请先说明根因，再给出最小修改补丁和三个 pytest 测试用例。",
    tools: "可作为 Claude Code、Hermes、Pi、Codex、OpenCode 等编程代理或命令行工具的候选后端模型；各工具是否支持 OpenRouter、模型 ID 填写位置和工具调用能力取决于其当前版本与官方文档。"
  },
  longdoc: {
    title: "长文档、代码库与日志分析", model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    summary: "适合合同、需求文档、论文、运行日志、多个源文件或大型代码库的提取、对比和摘要。页面显示的是 token 上下文，不等于固定中文字数；请根据实际输入长度分批处理。",
    steps: ["先提出结构化目标，例如提取条款、风险、冲突点和证据位置。", "内容过长时按章节或目录分段，并要求保留文件名、章节名和行号。", "最后把分段结论交给同一模型做汇总，但不要把模型摘要当作原始证据。"],
    example: "阅读以下三份合同，输出一张对比表：付款节点、违约责任、自动续期、数据归属、终止条件；每项都附上原文所在章节。",
    tools: "在 Claude Code、Codex、OpenCode 等可读取工作区文件的代理中，先限制允许读取的目录和文件类型，再让代理按模块分析；不要把密钥、客户隐私或生产数据库导出直接发送给第三方服务。"
  },
  multimodal: {
    title: "图片、音频与视频理解", model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    summary: "适合截图排错、表格和图表解读、视频内容摘要、音频转写后的核对等任务。模型支持的输入模态会变化，实际使用前应以模型卡片和 OpenRouter 模型详情为准。",
    steps: ["先确认当前模型卡片列出了你要上传的图片、音频或视频模态。", "对图片标明需要关注的区域；对视频或音频明确时间段和输出格式。", "要求模型区分“画面可直接观察到的内容”和“基于内容的推断”。"],
    example: "分析这张监控面板截图：列出所有红色告警、对应服务名和数值；无法从图片确定的内容请明确写“无法确认”。",
    tools: "适合支持附件输入的聊天界面或代理。若 Claude、Pi、Codex、OpenCode 等工具只传递文本，应先用其附件或工作区文件功能确认是否能把二进制文件交给模型。"
  },
  audio: {
    title: "音频与音乐生成实验", model: "google/lyria-3-pro-preview",
    summary: "用于探索文本或图片驱动的音频生成。此类模型可能是预览版本，参数、输出格式、限流和可用性都可能随时改变，不应用作唯一生产依赖。",
    steps: ["从短提示词和短时长样例开始验证输出格式。", "在提示词中描述情绪、节奏、乐器、场景和是否需要人声。", "商用前确认平台条款、模型许可、音乐版权和内容合规要求。"],
    example: "生成一段 20 秒、无歌词、温和科技感、适合企业产品演示开场的背景音乐；节奏平稳，避免模仿具体音乐人。",
    tools: "更适合直接调用支持音频输出的 API 或网页界面。通用代码代理通常更适合帮你编写调用和保存文件的代码，而不是直接试听和评估音频。"
  },
  safety: {
    title: "内容安全与风险初筛", model: "nvidia/nemotron-3.5-content-safety:free",
    summary: "适合在内容发布前做文本、图片的初步风险检查，例如暴力、仇恨、色情、隐私泄露或不当营销。它是辅助工具，不是法律意见，也不能替代人工审核。",
    steps: ["先定义你自己的审核规则、风险等级与处理动作。", "要求模型按规则返回机器可读的分类、理由和证据片段。", "对高风险、边界案例和误判申诉保留人工复核通道。"],
    example: "按“允许、需人工复核、拒绝”三档审核以下用户投稿；返回风险类别、置信说明和触发规则的原文片段。",
    tools: "可放在内容平台发布前的审核链路中。无论使用 Hermes、Pi、Codex、OpenCode 还是自建服务，都不要允许模型单独执行永久删除、封禁等不可逆动作。"
  },
  opensource: {
    title: "开源项目原型与多模态功能", model: "google/gemma-4-31b-it:free",
    summary: "适合开源项目原型、图文问答、截图说明和视频摘要等功能探索。免费可调用不等于模型权重、商标或训练数据的使用权完全无约束。",
    steps: ["先在 OpenRouter 模型详情和提供方页面核对当前许可条款。", "在 README 中说明调用的外部 API、数据流向和可能产生的费用。", "为模型不可用、限流和模型 ID 变化设计可配置的备用方案。"],
    example: "为一个开源文档工具设计“上传截图后提取表格”的功能：给出 API 输入、输出 JSON、失败重试和隐私提示的实现方案。",
    tools: "OpenCode、Pi、Hermes 等开放式编程工具通常适合做原型；建议把模型 ID 放进环境变量或配置文件，不要把它硬编码在业务逻辑里。"
  },
  lightweight: {
    title: "轻量、低延迟与批处理任务", model: "nvidia/nemotron-nano-9b-v2:free",
    summary: "适合分类、字段提取、格式转换、标签生成、短摘要和简单问答。小模型通常响应更快，但复杂推理、精确计算和高风险决策应使用更强模型或规则系统复核。",
    steps: ["把输出格式限制为 JSON、表格或固定字段，降低歧义。", "用十到二十条真实样本测试准确率与稳定性。", "对无法判断、缺少字段和低置信度结果设计回退到人工或更强模型的路径。"],
    example: "从每条工单中提取 category、priority、product、summary 四个字段；信息缺失时输出 null，不要猜测。",
    tools: "适合脚本批处理、自动化工作流和代理的低成本子任务。比如让 Claude Code、Codex 或 OpenCode 把复杂编码交给强模型，把文件分类、摘要交给轻量模型。"
  },
  performance: {
    title: "复杂推理与高质量初稿", model: "poolside/laguna-s-2.1:free",
    summary: "适合多步骤分析、方案比较、复杂代码设计和高质量初稿。免费模型可能限流、排队或临时不可用，因此生产工作流应预留超时、重试和备用模型。",
    steps: ["把复杂问题拆成事实收集、方案比较、决策建议三个阶段。", "要求模型列出假设、未知项和验证方式，而不是直接给确定结论。", "对关键数字、引用、代码安全性和最终决策执行独立验证。"],
    example: "比较单体服务与微服务两种改造路径：从团队规模、发布风险、可观测性、三年维护成本四方面分析，并列出每项的前提假设。",
    tools: "在 Claude Code、Codex、OpenCode、Pi 等代理中适合用于“先规划再执行”的阶段。建议限制代理的命令权限，要求先给计划与变更清单，确认后再写入文件。"
  },
  quickstart: {
    title: "快速上手与模型对比", model: "openrouter/free",
    summary: "不知道从哪里开始时，先用免费路由器完成一个小任务，再针对具体瓶颈选择专用模型。不要在没有评测的情况下，仅根据参数量或品牌判断模型优劣。",
    steps: ["准备三到五条与你真实业务相近的测试题。", "分别测试通用路由器、代码模型和多模态模型，记录质量、速度、失败率。", "确定默认模型和备用模型，并在配置中保留随时切换的能力。"],
    example: "建立一个评测表：任务名称、输入样例、预期结果、模型 ID、耗时、是否通过、人工备注；每次模型更新后复测。",
    tools: "可先在 OpenRouter 网页测试，再接入 Claude Code、Hermes、Pi、Codex、OpenCode 或自己的客户端。工具名称不决定模型能力，真正决定结果的是当前选择的模型、提示词、上下文和权限设置。"
  }
};

let allModels = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function formatTokens(value) {
  const tokens = Number(value);
  if (!Number.isFinite(tokens) || tokens <= 0) return "未提供";
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(tokens % 1000000 === 0 ? 0 : 1)}M token`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(tokens % 1000 === 0 ? 0 : 1)}K token`;
  return `${tokens} token`;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "未知" : date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
}

function getCompany(model) {
  return String(model.id || "unknown").split("/", 1)[0] || "unknown";
}

function getModality(model) {
  const architecture = model.architecture;
  if (architecture && typeof architecture === "object") {
    return `${architecture.input_modalities?.join("、") || "未知"} → ${architecture.output_modalities?.join("、") || "未知"}`;
  }
  const modality = model.modality;
  if (modality && typeof modality === "object") return `${modality.input || "未知"} → ${modality.output || "未知"}`;
  return modality ? String(modality) : "未提供";
}

async function loadData() {
  const grid = document.getElementById("modelGrid");
  try {
    const response = await fetch("data/models.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`请求失败：${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.free_models)) throw new Error("数据格式无效");
    allModels = data.free_models;
    renderHeader(data);
    populateCompanyFilter(data);
    renderModels(allModels);
    showScenario("chat");
  } catch (error) {
    grid.innerHTML = `<p class="error-message">模型数据加载失败：${escapeHtml(error.message)}。请稍后刷新重试。</p>`;
    console.error("加载模型数据失败：", error);
  }
}

function renderHeader(data) {
  document.getElementById("headerStats").innerHTML = `
    <div class="stat"><span class="stat-value">${Number(data.total_models) || 0}</span><span class="stat-label">全部模型</span></div>
    <div class="stat"><span class="stat-value">${Number(data.free_models_count) || 0}</span><span class="stat-label">免费模型</span></div>
    <div class="stat"><span class="stat-value">${formatDate(data.updated_at)}</span><span class="stat-label">数据更新时间（北京时间）</span></div>`;
}

function renderModels(models) {
  const grid = document.getElementById("modelGrid");
  if (!models.length) {
    grid.innerHTML = "<p>没有符合当前筛选条件的免费模型。</p>";
    return;
  }
  grid.innerHTML = models.map(model => {
    const company = getCompany(model);
    const pricing = model.pricing || {};
    const description = model.description || "OpenRouter API 未提供简介。";
    return `<article class="model-card">
      <div class="model-card-header"><code class="model-id">${escapeHtml(model.id)}</code><span class="tag free">免费</span></div>
      <h3 class="model-name">${escapeHtml(model.name || "未命名模型")}</h3>
      <div class="model-meta">
        <span class="tag company">${escapeHtml(company)}</span>
        <span class="tag">${escapeHtml(formatTokens(model.context_length))}</span>
        <span class="tag">${escapeHtml(getModality(model))}</span>
      </div>
      <p class="model-desc">${escapeHtml(description)}</p>
      <div class="model-footer"><span>输入：${escapeHtml(pricing.prompt ?? "0")}</span><span>输出：${escapeHtml(pricing.completion ?? "0")}</span></div>
    </article>`;
  }).join("");
}

function populateCompanyFilter(data) {
  const select = document.getElementById("companyFilter");
  const companies = Object.keys(data.companies || {}).sort();
  select.innerHTML = '<option value="all">全部公司</option>' + companies.map(company => {
    const count = data.companies[company].count;
    return `<option value="${escapeHtml(company)}">${escapeHtml(company)}（${Number(count) || 0}）</option>`;
  }).join("");
}

function filterModels() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const company = document.getElementById("companyFilter").value;
  renderModels(allModels.filter(model => {
    const matchesSearch = !search || String(model.id || "").toLowerCase().includes(search) || String(model.name || "").toLowerCase().includes(search);
    return matchesSearch && (company === "all" || getCompany(model) === company);
  }));
}

function showScenario(key) {
  const scenario = SCENARIOS[key];
  if (!scenario) return;
  const available = allModels.some(model => model.id === scenario.model);
  const availability = available
    ? "当前数据中可用；实际调用仍可能受限流、排队或提供方状态影响。"
    : "该推荐模型当前未出现在免费列表中，请从上方模型列表选择当前可用的同类模型。";
  const steps = scenario.steps.map((step, index) => `<li><span>${index + 1}</span>${escapeHtml(step)}</li>`).join("");
  document.getElementById("scenarioContent").innerHTML = `<article class="scenario-card">
    <div class="scenario-topline"><div><p class="scenario-eyebrow">推荐免费模型</p><h3>${escapeHtml(scenario.title)}</h3></div><code class="recommended-model">${escapeHtml(scenario.model)}</code></div>
    <p class="scenario-summary">${escapeHtml(scenario.summary)}</p>
    <div class="scenario-detail-grid">
      <section class="scenario-steps"><h4>建议工作流程</h4><ol>${steps}</ol></section>
      <section class="scenario-example"><h4>示例提示词</h4><blockquote>${escapeHtml(scenario.example)}</blockquote></section>
    </div>
    <div class="scenario-tools"><h4>工具接入建议</h4><p>${escapeHtml(scenario.tools)}</p></div>
    <p class="scenario-availability">${escapeHtml(availability)}</p>
  </article>`;
}

document.getElementById("searchInput").addEventListener("input", filterModels);
document.getElementById("companyFilter").addEventListener("change", filterModels);
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  showScenario(tab.dataset.tab);
}));

document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
}));

loadData();
