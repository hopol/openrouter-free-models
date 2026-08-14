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

const I18N = {
  "zh-CN": { name:"简体中文", locale:"zh-CN", title:"OpenRouter 免费模型中心｜免费模型情报与选型建议", description:"实时查询 OpenRouter 当前可用的免费大模型，查看模型简介、上下文、模态能力及十个实际使用场景的选型建议。", labels:{ languageLabel:"选择语言", eyebrow:"OPENROUTER INTELLIGENCE DIRECTORY", heroTitle:"OpenRouter 免费模型中心", heroSubtitle:"面向开发者与企业团队的免费模型情报、能力概览与场景化选型建议", loading:"正在加载模型数据…", navModels:"模型目录", navScenarios:"选型建议", navGuide:"使用说明", navAbout:"关于数据", modelsKicker:"LIVE MODEL CATALOG", modelsTitle:"免费模型全景", modelsIntro:"仅列出输入与输出 token 单价均为零的模型。可用性和限流状态请以 OpenRouter 实际响应为准。", searchLabel:"搜索模型", searchPlaceholder:"搜索模型名称或 ID…", companyLabel:"筛选提供方", scenariosKicker:"PRACTICAL MODEL SELECTION", scenariosTitle:"场景化选型建议", scenariosIntro:"从真实工作任务出发选择模型；重要结果均应通过原始资料、测试或人工复核验证。", guideKicker:"WORKFLOW GUIDANCE", guideTitle:"如何可靠地使用免费模型", guideOneTitle:"先做小样本评测", guideOneText:"使用真实任务准备少量测试题，记录质量、速度、失败率和人工修改量。", guideTwoTitle:"为关键任务准备备用模型", guideTwoText:"免费模型会变化或限流。将模型 ID 配置化，并准备通用路由器或同类模型作为回退。", guideThreeTitle:"保护敏感信息", guideThreeText:"提交前移除密钥、个人信息、客户机密与生产数据；对代理工具设置最小权限。", aboutKicker:"DATA TRANSPARENCY", aboutTitle:"数据与服务说明", aboutText:"本目录通过 OpenRouter 官方模型接口自动更新。模型价格、功能、上下文窗口、限流和服务状态均可能变化。", sourceLabel:"数据来源：", updateLabel:"更新频率：", updateText:"每天两次自动检查；仅在数据变化时发布更新。", footerText:"OpenRouter 免费模型中心 · 自动更新的免费模型目录", authorPrefix:"作者博客：", allCompanies:"全部公司", totalModels:"全部模型", freeModels:"免费模型", updatedAt:"数据更新时间", free:"免费", input:"输入", output:"输出", noResults:"没有符合当前筛选条件的免费模型。", workflow:"建议工作流程", example:"示例提示词", toolAdvice:"工具接入建议", recommended:"推荐免费模型", available:"当前数据中可用；实际调用仍可能受限流、排队或提供方状态影响。", unavailable:"该推荐模型当前未出现在免费列表中，请从上方模型列表选择当前可用的同类模型。", scenarioChat:"日常聊天", scenarioCode:"代码开发", scenarioLongdoc:"长文档", scenarioMultimodal:"多模态", scenarioAudio:"音频实验", scenarioSafety:"内容安全", scenarioOpenSource:"开源原型", scenarioLightweight:"轻量任务", scenarioPerformance:"复杂推理", scenarioQuickStart:"快速上手" } },
  en: { name:"English", locale:"en-US", title:"OpenRouter Free Models Hub | Live Model Directory", description:"Discover currently free OpenRouter models, their capabilities, context windows, and practical model-selection guidance.", labels:{ languageLabel:"Select language", eyebrow:"OPENROUTER INTELLIGENCE DIRECTORY", heroTitle:"OpenRouter Free Models Hub", heroSubtitle:"Live free-model intelligence, capability overviews, and practical selection guidance for builders and teams.", loading:"Loading model data…", navModels:"Models", navScenarios:"Use cases", navGuide:"Guide", navAbout:"About", modelsKicker:"LIVE MODEL CATALOG", modelsTitle:"Free Model Directory", modelsIntro:"Only models with zero input and output token prices are listed. Availability and rate limits may change.", searchLabel:"Search models", searchPlaceholder:"Search model name or ID…", companyLabel:"Filter provider", scenariosKicker:"PRACTICAL MODEL SELECTION", scenariosTitle:"Practical Model Selection", scenariosIntro:"Choose from real work requirements; verify important results with sources, tests, or human review.", guideKicker:"WORKFLOW GUIDANCE", guideTitle:"Using Free Models Reliably", guideOneTitle:"Evaluate with real samples", guideOneText:"Use representative tasks and track quality, latency, failures, and manual edits.", guideTwoTitle:"Plan a fallback", guideTwoText:"Free models may change or be rate-limited. Keep model IDs configurable and define a fallback.", guideThreeTitle:"Protect sensitive data", guideThreeText:"Remove secrets, personal data, client information, and production data before sending requests.", aboutKicker:"DATA TRANSPARENCY", aboutTitle:"Data and Service Notes", aboutText:"This directory is automatically updated from the OpenRouter model API. Pricing, features, context windows, limits, and service status can change.", sourceLabel:"Source: ", updateLabel:"Update frequency: ", updateText:"Checked twice daily; published only when data changes.", footerText:"OpenRouter Free Models Hub · Automatically updated free-model directory", authorPrefix:"Author blog: ", allCompanies:"All providers", totalModels:"All models", freeModels:"Free models", updatedAt:"Updated", free:"Free", input:"Input", output:"Output", noResults:"No free models match the current filters.", workflow:"Recommended workflow", example:"Example prompt", toolAdvice:"Tool integration notes", recommended:"Recommended free model", available:"Present in the current dataset; requests may still be rate-limited, queued, or unavailable.", unavailable:"This recommendation is not in the current free-model list. Select a similar available model above.", scenarioChat:"Chat", scenarioCode:"Coding", scenarioLongdoc:"Long documents", scenarioMultimodal:"Multimodal", scenarioAudio:"Audio", scenarioSafety:"Safety", scenarioOpenSource:"Open source", scenarioLightweight:"Lightweight", scenarioPerformance:"Reasoning", scenarioQuickStart:"Quick start" } },
  es: { name:"Español", locale:"es-ES", title:"Modelos gratuitos de OpenRouter | Directorio actualizado", description:"Consulta modelos gratuitos de OpenRouter, capacidades, contexto y recomendaciones prácticas.", labels:{ languageLabel:"Seleccionar idioma", heroTitle:"Centro de modelos gratuitos de OpenRouter", heroSubtitle:"Información actualizada y recomendaciones prácticas para equipos y desarrolladores.", loading:"Cargando datos…", navModels:"Modelos", navScenarios:"Casos de uso", navGuide:"Guía", navAbout:"Información", modelsTitle:"Directorio de modelos gratuitos", modelsIntro:"Solo se muestran modelos con precio cero para tokens de entrada y salida.", searchPlaceholder:"Buscar nombre o ID…", scenariosTitle:"Recomendaciones por caso de uso", scenariosIntro:"Valida los resultados importantes con fuentes, pruebas o revisión humana.", guideTitle:"Uso fiable de modelos gratuitos", aboutTitle:"Datos y servicio", aboutText:"El directorio se actualiza automáticamente desde la API de OpenRouter.", footerText:"Centro de modelos gratuitos de OpenRouter", authorPrefix:"Blog del autor: ", allCompanies:"Todos los proveedores", totalModels:"Todos los modelos", freeModels:"Modelos gratuitos", updatedAt:"Actualizado", free:"Gratis", input:"Entrada", output:"Salida", noResults:"No hay modelos que coincidan.", workflow:"Flujo recomendado", example:"Ejemplo", toolAdvice:"Integración", recommended:"Modelo recomendado", available:"Disponible en los datos actuales; pueden existir límites.", unavailable:"El modelo no aparece actualmente en la lista gratuita.", scenarioChat:"Chat", scenarioCode:"Código", scenarioLongdoc:"Documentos largos", scenarioMultimodal:"Multimodal", scenarioAudio:"Audio", scenarioSafety:"Seguridad", scenarioOpenSource:"Código abierto", scenarioLightweight:"Ligero", scenarioPerformance:"Razonamiento", scenarioQuickStart:"Inicio rápido" } },
  ja: { name:"日本語", locale:"ja-JP", title:"OpenRouter 無料モデルセンター | 最新モデル一覧", description:"OpenRouter の無料モデル、能力、コンテキスト、実用的な選定ガイドを確認できます。", labels:{ languageLabel:"言語を選択", heroTitle:"OpenRouter 無料モデルセンター", heroSubtitle:"開発者とチームのための無料モデル情報と実践的な選定ガイド。", loading:"モデルデータを読み込み中…", navModels:"モデル", navScenarios:"用途", navGuide:"ガイド", navAbout:"データについて", modelsTitle:"無料モデル一覧", modelsIntro:"入力と出力 token の価格がともにゼロのモデルのみを表示します。", searchPlaceholder:"モデル名または ID を検索…", scenariosTitle:"用途別の選定ガイド", scenariosIntro:"重要な結果は、資料、テスト、または人による確認で検証してください。", guideTitle:"無料モデルを安全に使う方法", aboutTitle:"データとサービス", aboutText:"この一覧は OpenRouter API から自動更新されます。", footerText:"OpenRouter 無料モデルセンター", authorPrefix:"作者ブログ：", allCompanies:"すべての提供元", totalModels:"全モデル", freeModels:"無料モデル", updatedAt:"更新日時", free:"無料", input:"入力", output:"出力", noResults:"条件に一致するモデルはありません。", workflow:"推奨ワークフロー", example:"プロンプト例", toolAdvice:"ツール連携", recommended:"推奨無料モデル", available:"現在のデータにありますが、制限される場合があります。", unavailable:"このモデルは現在の無料一覧にありません。", scenarioChat:"チャット", scenarioCode:"コーディング", scenarioLongdoc:"長文書", scenarioMultimodal:"マルチモーダル", scenarioAudio:"音声", scenarioSafety:"安全性", scenarioOpenSource:"オープンソース", scenarioLightweight:"軽量", scenarioPerformance:"推論", scenarioQuickStart:"クイックスタート" } },
  ko: { name:"한국어", locale:"ko-KR", title:"OpenRouter 무료 모델 센터 | 최신 모델 목록", description:"OpenRouter 무료 모델, 기능, 컨텍스트 및 실용적인 모델 선택 가이드를 제공합니다.", labels:{ languageLabel:"언어 선택", heroTitle:"OpenRouter 무료 모델 센터", heroSubtitle:"개발자와 팀을 위한 무료 모델 정보 및 실무 선택 가이드.", loading:"모델 데이터를 불러오는 중…", navModels:"모델", navScenarios:"활용 사례", navGuide:"가이드", navAbout:"데이터 정보", modelsTitle:"무료 모델 디렉터리", modelsIntro:"입력과 출력 token 가격이 모두 0인 모델만 표시합니다.", searchPlaceholder:"모델 이름 또는 ID 검색…", scenariosTitle:"상황별 모델 선택", scenariosIntro:"중요한 결과는 원문, 테스트 또는 사람의 검토로 검증하세요.", guideTitle:"무료 모델을 안정적으로 사용하는 방법", aboutTitle:"데이터 및 서비스", aboutText:"이 디렉터리는 OpenRouter API에서 자동 업데이트됩니다.", footerText:"OpenRouter 무료 모델 센터", authorPrefix:"작성자 블로그: ", allCompanies:"모든 제공자", totalModels:"전체 모델", freeModels:"무료 모델", updatedAt:"업데이트", free:"무료", input:"입력", output:"출력", noResults:"조건에 맞는 모델이 없습니다.", workflow:"권장 워크플로", example:"프롬프트 예시", toolAdvice:"도구 연동", recommended:"추천 무료 모델", available:"현재 데이터에 있지만 제한될 수 있습니다.", unavailable:"현재 무료 목록에 없습니다.", scenarioChat:"채팅", scenarioCode:"코드", scenarioLongdoc:"긴 문서", scenarioMultimodal:"멀티모달", scenarioAudio:"오디오", scenarioSafety:"안전", scenarioOpenSource:"오픈 소스", scenarioLightweight:"경량", scenarioPerformance:"추론", scenarioQuickStart:"빠른 시작" } },
  fr: { name:"Français", locale:"fr-FR", title:"Modèles gratuits OpenRouter | Répertoire actualisé", description:"Découvrez les modèles gratuits OpenRouter, leurs capacités et des conseils pratiques de sélection.", labels:{ languageLabel:"Choisir la langue", heroTitle:"Centre des modèles gratuits OpenRouter", heroSubtitle:"Informations actualisées et conseils de sélection pour les développeurs et les équipes.", loading:"Chargement des données…", navModels:"Modèles", navScenarios:"Cas d’usage", navGuide:"Guide", navAbout:"À propos", modelsTitle:"Répertoire des modèles gratuits", modelsIntro:"Seuls les modèles dont les prix des tokens d’entrée et de sortie sont nuls sont affichés.", searchPlaceholder:"Rechercher un nom ou un ID…", scenariosTitle:"Sélection par cas d’usage", scenariosIntro:"Vérifiez les résultats importants par des sources, des tests ou une revue humaine.", guideTitle:"Utiliser les modèles gratuits de façon fiable", aboutTitle:"Données et service", aboutText:"Ce répertoire est mis à jour automatiquement depuis l’API OpenRouter.", footerText:"Centre des modèles gratuits OpenRouter", authorPrefix:"Blog de l’auteur : ", allCompanies:"Tous les fournisseurs", totalModels:"Tous les modèles", freeModels:"Modèles gratuits", updatedAt:"Mis à jour", free:"Gratuit", input:"Entrée", output:"Sortie", noResults:"Aucun modèle ne correspond aux filtres.", workflow:"Flux recommandé", example:"Exemple", toolAdvice:"Intégration", recommended:"Modèle gratuit recommandé", available:"Présent dans les données actuelles ; des limites peuvent s’appliquer.", unavailable:"Ce modèle n’apparaît pas dans la liste gratuite actuelle.", scenarioChat:"Chat", scenarioCode:"Code", scenarioLongdoc:"Documents longs", scenarioMultimodal:"Multimodal", scenarioAudio:"Audio", scenarioSafety:"Sécurité", scenarioOpenSource:"Open source", scenarioLightweight:"Léger", scenarioPerformance:"Raisonnement", scenarioQuickStart:"Démarrage rapide" } }
};

let allModels = [];
let currentLocale = "zh-CN";
let currentScenario = "chat";

function t(key) {
  return I18N[currentLocale].labels[key] || I18N["zh-CN"].labels[key] || key;
}

function selectInitialLocale() {
  const requested = new URLSearchParams(window.location.search).get("lang");
  const saved = window.localStorage.getItem("openrouter-language");
  const browser = navigator.language || "zh-CN";
  const match = Object.keys(I18N).find(code => browser.toLowerCase().startsWith(code.toLowerCase().split("-")[0]));
  return I18N[requested] ? requested : (I18N[saved] ? saved : (match || "zh-CN"));
}

function applyLocale(locale, updateUrl = true) {
  currentLocale = I18N[locale] ? locale : "zh-CN";
  const copy = I18N[currentLocale];
  document.documentElement.lang = currentLocale;
  document.title = copy.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", copy.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", copy.description);
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.getElementById("searchInput").setAttribute("aria-label", t("searchLabel"));
  document.getElementById("companyFilter").setAttribute("aria-label", t("companyLabel"));
  document.getElementById("scenarioTabs").setAttribute("aria-label", t("scenariosTitle"));
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", currentLocale);
    window.history.replaceState({}, "", url);
  }
  window.localStorage.setItem("openrouter-language", currentLocale);
  if (allModels.length) {
    populateCompanyFilter({ companies: allModels.reduce((result, model) => { const company = getCompany(model); result[company] = result[company] || { count: 0 }; result[company].count += 1; return result; }, {}) });
    filterModels();
    showScenario(currentScenario);
  }
}

function setupLanguageSelector() {
  const select = document.getElementById("languageSelect");
  select.innerHTML = Object.entries(I18N).map(([code, copy]) => `<option value="${code}">${escapeHtml(copy.name)}</option>`).join("");
  select.value = currentLocale;
  select.addEventListener("change", () => applyLocale(select.value));
}

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
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString(I18N[currentLocale].locale, { timeZone: "Asia/Shanghai", hour12: false });
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
    grid.innerHTML = `<p class="error-message">${escapeHtml(t("loading"))} ${escapeHtml(error.message)}</p>`;
    console.error("加载模型数据失败：", error);
  }
}

function renderHeader(data) {
  document.getElementById("headerStats").innerHTML = `
    <div class="stat"><span class="stat-value">${Number(data.total_models) || 0}</span><span class="stat-label">${escapeHtml(t("totalModels"))}</span></div>
    <div class="stat"><span class="stat-value">${Number(data.free_models_count) || 0}</span><span class="stat-label">${escapeHtml(t("freeModels"))}</span></div>
    <div class="stat"><span class="stat-value">${formatDate(data.updated_at)}</span><span class="stat-label">${escapeHtml(t("updatedAt"))}</span></div>`;
}

function renderModels(models) {
  const grid = document.getElementById("modelGrid");
  if (!models.length) {
    grid.innerHTML = `<p>${escapeHtml(t("noResults"))}</p>`;
    return;
  }
  grid.innerHTML = models.map(model => {
    const company = getCompany(model);
    const pricing = model.pricing || {};
    const description = model.description || "OpenRouter API 未提供简介。";
    return `<article class="model-card">
      <div class="model-card-header"><code class="model-id">${escapeHtml(model.id)}</code><span class="tag free">${escapeHtml(t("free"))}</span></div>
      <h3 class="model-name">${escapeHtml(model.name || "未命名模型")}</h3>
      <div class="model-meta">
        <span class="tag company">${escapeHtml(company)}</span>
        <span class="tag">${escapeHtml(formatTokens(model.context_length))}</span>
        <span class="tag">${escapeHtml(getModality(model))}</span>
      </div>
      <p class="model-desc">${escapeHtml(description)}</p>
      <div class="model-footer"><span>${escapeHtml(t("input"))}: ${escapeHtml(pricing.prompt ?? "0")}</span><span>${escapeHtml(t("output"))}: ${escapeHtml(pricing.completion ?? "0")}</span></div>
    </article>`;
  }).join("");
}

function populateCompanyFilter(data) {
  const select = document.getElementById("companyFilter");
  const companies = Object.keys(data.companies || {}).sort();
  select.innerHTML = `<option value="all">${escapeHtml(t("allCompanies"))}</option>` + companies.map(company => {
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

const SCENARIO_LABEL_KEYS = { chat:"scenarioChat", code:"scenarioCode", longdoc:"scenarioLongdoc", multimodal:"scenarioMultimodal", audio:"scenarioAudio", safety:"scenarioSafety", opensource:"scenarioOpenSource", lightweight:"scenarioLightweight", performance:"scenarioPerformance", quickstart:"scenarioQuickStart" };

const SCENARIO_FALLBACK_COPY = {
  en: { summary:"Use the recommended model as a starting point for this workflow. Match the task, input modality, and context length to the model card, then validate the result before production use.", steps:["Define the required output and constraints.","Provide only relevant context and use a structured format.","Test the output and keep a fallback model for failures or rate limits."], example:"State the task, constraints, expected output format, and the information that must not be invented.", tools:"Claude Code, Hermes, Pi, Codex, OpenCode and similar agents can use this model only when their current version supports OpenRouter. Check their official configuration and permission model first." },
  es: { summary:"Use el modelo recomendado como punto de partida. Compruebe la modalidad, el contexto y valide el resultado antes de usarlo en producción.", steps:["Defina el resultado y las restricciones.","Proporcione solo el contexto relevante y un formato estructurado.","Pruebe el resultado y prepare un modelo alternativo."], example:"Indique la tarea, las restricciones, el formato esperado y los datos que no se deben inventar.", tools:"Claude Code, Hermes, Pi, Codex, OpenCode y agentes similares solo pueden usar este modelo si su versión actual admite OpenRouter. Consulte su configuración oficial." },
  ja: { summary:"この用途では推奨モデルを出発点として使います。入力形式とコンテキスト長を確認し、本番利用前に結果を検証してください。", steps:["必要な出力と制約を定義します。","関連する情報だけを構造化して渡します。","結果をテストし、制限時の代替モデルを用意します。"], example:"タスク、制約、期待する出力形式、推測してはいけない情報を明確に指定してください。", tools:"Claude Code、Hermes、Pi、Codex、OpenCode などは、現在のバージョンが OpenRouter をサポートする場合のみ利用できます。公式設定と権限を確認してください。" },
  ko: { summary:"이 작업에는 추천 모델을 시작점으로 사용하세요. 입력 형식과 컨텍스트 길이를 확인하고 운영 전 결과를 검증해야 합니다.", steps:["필요한 결과와 제약 조건을 정의합니다.","관련 정보만 구조화하여 제공합니다.","결과를 테스트하고 제한 상황을 위한 대체 모델을 준비합니다."], example:"작업, 제약 조건, 기대 출력 형식 및 추측하면 안 되는 정보를 명확히 지정하세요.", tools:"Claude Code, Hermes, Pi, Codex, OpenCode 등의 도구는 현재 버전이 OpenRouter를 지원할 때만 사용할 수 있습니다. 공식 설정과 권한을 확인하세요." },
  fr: { summary:"Utilisez le modèle recommandé comme point de départ. Vérifiez les modalités, le contexte et le résultat avant toute utilisation en production.", steps:["Définissez le résultat attendu et les contraintes.","Fournissez uniquement le contexte utile dans un format structuré.","Testez le résultat et prévoyez un modèle de secours."], example:"Indiquez la tâche, les contraintes, le format attendu et les informations qui ne doivent pas être inventées.", tools:"Claude Code, Hermes, Pi, Codex, OpenCode et les agents similaires ne peuvent utiliser ce modèle que si leur version prend en charge OpenRouter. Vérifiez la configuration officielle." }
};

function showScenario(key) {
  const scenario = SCENARIOS[key];
  if (!scenario) return;
  const available = allModels.some(model => model.id === scenario.model);
  const availability = available ? t("available") : t("unavailable");
  const content = currentLocale === "zh-CN" ? scenario : SCENARIO_FALLBACK_COPY[currentLocale];
  const steps = content.steps.map((step, index) => `<li><span>${index + 1}</span>${escapeHtml(step)}</li>`).join("");
  const localizedTitle = t(SCENARIO_LABEL_KEYS[key]);
  document.getElementById("scenarioContent").innerHTML = `<article class="scenario-card">
    <div class="scenario-topline"><div><p class="scenario-eyebrow">${escapeHtml(t("recommended"))}</p><h3>${escapeHtml(localizedTitle)}</h3></div><code class="recommended-model">${escapeHtml(scenario.model)}</code></div>
    <p class="scenario-summary">${escapeHtml(content.summary)}</p>
    <div class="scenario-detail-grid">
      <section class="scenario-steps"><h4>${escapeHtml(t("workflow"))}</h4><ol>${steps}</ol></section>
      <section class="scenario-example"><h4>${escapeHtml(t("example"))}</h4><blockquote>${escapeHtml(content.example)}</blockquote></section>
    </div>
    <div class="scenario-tools"><h4>${escapeHtml(t("toolAdvice"))}</h4><p>${escapeHtml(content.tools)}</p></div>
    <p class="scenario-availability">${escapeHtml(availability)}</p>
  </article>`;
}

document.getElementById("searchInput").addEventListener("input", filterModels);
document.getElementById("companyFilter").addEventListener("change", filterModels);
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  currentScenario = tab.dataset.tab;
  showScenario(currentScenario);
}));

document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
}));

applyLocale(selectInitialLocale(), false);
setupLanguageSelector();
loadData();
