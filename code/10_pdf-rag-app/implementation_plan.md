# 复杂 PDF 处理 RAG 系统实施计划（基于 Milvus 与阿里云生态）

根据参考文档 [pdf-rag处理方案.md](file:///d:/ZSP/Study/next-study/code/10_pdf-rag-app/pdf-rag%E5%A4%84%E7%90%86%E6%96%B9%E6%A1%88.md)，本项目将基于 **TypeScript + Node.js (v20+) + LangChain.js** 构建。
我们将引入 **Milvus** 作为向量数据库，并采用渐进式开发路线，逐步引入阿里云 OCR/文档智能解析、阿里云 OSS 存储和多模态图像召回能力。

---

## 🗺️ 阶段路线图 (v1 - v4)

### 🚀 v1: 文本型 PDF 基础 RAG
* **目标**：跑通最基础的文本解析、入库、向量检索与 LLM 回答流。
* **解析器**：使用 LangChain 的 `WebPDFLoader` 对文本型 PDF 进行逐页读取，若检测到纯图片（扫描件）则报错提示。
* **切分与处理**：进行基础的文本清洗（去异常换行与连字符），然后使用 `RecursiveCharacterTextSplitter` 进行固定大小的切片。
* **数据库**：
  * 向量库：使用 `@langchain/milvus` 将分块向量存储入 Milvus 对应的 `pdf_chunks` Collection。
  * 元数据：在本地 `src/db/db.json` 文件中持久化存储上传的文件记录，用于排重与状态标记。
* **检索与问答**：进行向量相似度搜索，拼接 Context（含来源与页码），调用 `ChatOpenAI` 产生包含引用页码的回答。

### 📊 v2: 布局感知与表格增强（Aliyun OCR / 阿里云文档智能）
* **目标**：解决多栏布局、表格内容语义断裂问题。
* **解析器**：引入阿里云文档智能服务（Document Mind）进行布局分析（Layout Analysis），将 PDF 解析为结构化的 Markdown 文档。
* **切分与处理**：使用 `MarkdownHeaderTextSplitter` 按文档标题层级（H1, H2, H3）进行高准确度的段落语义分块。
* **多向量检索**：针对表格数据，使用 LLM 生成摘要（Summary），向量库只索引【摘要】，Docstore（基于本地 JSON 缓存文件或 Redis）存储【原始 Markdown 表格】。检索命中摘要时，返回完整的表格数据喂给 LLM。

### 🖼️ v3: 图片/图表提取与 OSS 回显
* **目标**：抽取 PDF 中的非文本图表，并在回复时以图片形式回显。
* **图片处理**：通过阿里云文档智能提取 PDF 中的图片，将其上传到阿里云 OSS。若 OSS Bucket 为私有，则生成带时间戳的安全签名 URL (`signatureUrl`)。
* **多模态索引**：使用多模态 LLM (如 GPT-4o-mini 或 Gemini) 描述图片（Caption），并将图片描述向量化建立索引。
* **回显**：检索时命中图片描述，将图片 OSS URL 和描述作为引用传入上下文，大模型在回答中输出 `![Caption](OSS_URL)` 以进行图片回显。

### 🎯 v4: 混合检索与重排优化
* **目标**：提升专有名词和长尾查询召回率。
* **检索器**：构建 `EnsembleRetriever`，融合 Milvus 向量相似度检索（Dense）与本地/Milvus 的关键字匹配（Sparse/BM25）。
* **重排（Rerank）**：引入 Cohere Rerank，对混合检索召回的 20 个 Chunk 进行高精度重排，筛选出相关度最高的前 5 个分块送入大模型，提高回答质量并降低 Token 成本。

---

## 🛠️ 目录结构规划

我们将参考您的规范，建立以下清晰的职责边界目录：

```txt
code/10_pdf-rag-app/
├── package.json
├── tsconfig.json
├── .env.example
├── .env
├── README.md
├── pdf-rag处理方案.md          # 参考指南
└── src/
    ├── api/
    │   ├── upload.ts           # 文件上传与处理触发
    │   └── ask.ts              # RAG 问答接口
    ├── aliyun/
    │   ├── oss.ts              # 阿里云 OSS 上传与签名 (v3 引入)
    │   └── docmind.ts          # 阿里云文档智能 API 封装 (v2 引入)
    ├── db/
    │   ├── fileRepository.ts   # 管理 PDF 文件的元数据 (本地 JSON 存储)
    │   └── db.json             # 本地元数据存储文件 (自动生成)
    ├── rag/
    │   ├── types.ts            # 全局类型声明 (如 PdfChunk, PdfFileRecord)
    │   ├── hashFile.ts         # 计算文件 SHA256 排重
    │   ├── parsePdf.ts         # PDF 解析 (v1 使用 WebPDFLoader，v2+ 切换为阿里云)
    │   ├── detectPdfType.ts    # 识别 PDF 是否为扫描件
    │   ├── cleanText.ts        # 文本数据清洗
    │   ├── splitText.ts        # 文本切分器
    │   ├── embeddings.ts       # 统一 Embedding 模型接口
    │   ├── milvusStore.ts      # Milvus 向量库交互
    │   ├── retrieve.ts         # 混合检索与召回 (v4 引入 Rerank 与 Ensemble)
    │   ├── formatContext.ts    # 格式化检索上下文 (增加页码和原始链接标记)
    │   └── answer.ts           # RAG 提示词组装与大模型问答
    └── index.ts                # 命令行测试入口，支持通过命令指定运行 v1-v4 流程
```

---

## 📦 项目依赖清单

在项目初始化阶段，我们将安装以下版本的包：
* `@langchain/core`
* `@langchain/openai`
* `@langchain/milvus`
* `@langchain/community`
* `@langchain/textsplitters`
* `pdfjs-dist` (PDF 解析)
* `@zilliz/milvus2-sdk-node` (Milvus 底层通信依赖)
* `ali-oss` (OSS 工具)
* `@alicloud/docmind-api20220711` & `@alicloud/openapi-client` (阿里云文档智能)
* `dotenv` (环境变量)
* `typescript`, `@types/node`, `ts-node` (开发与运行环境)

---

## 环境变量配置模板 (`.env`)

```env
# 基础服务端口与环境
PORT=3000
NODE_ENV=development

# 阿里云 AccessKey ID 和 Secret (用于 OCR/文档智能与 OSS)
ALIYUN_ACCESS_KEY_ID=your_aliyun_access_key
ALIYUN_ACCESS_KEY_SECRET=your_aliyun_access_secret

# 阿里云 OSS 配置 (v3 图片回显必须)
ALIYUN_OSS_REGION=oss-cn-hangzhou
ALIYUN_OSS_BUCKET=your-bucket-name
ALIYUN_OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com

# 阿里云文档智能 (Document Mind) 接口地址 (v2 表格/布局必须)
ALIYUN_DOCMIND_ENDPOINT=docmind-api.cn-hangzhou.aliyuncs.com

# Milvus 向量库配置
MILVUS_URL=localhost:19530
# 如果使用带账号密码的 Milvus，可填：
# MILVUS_USERNAME=your_username
# MILVUS_PASSWORD=your_password

# 大语言模型配置 (OpenAI / 兼容 API)
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL_NAME=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Cohere API Key (v4 Rerank 可选)
COHERE_API_KEY=your_cohere_api_key
```

---

## 验证与演示计划

我们将在 `src/index.ts` 中构建一个命令行式交互工具：
1. **测试入库**：运行命令即可对指定 PDF 执行提取、切分、向量编码并上传 Milvus。
2. **测试检索与问答**：通过命令行输入提问，展示检索出的原始片段、引用的页码，并在 v3 模式下输出带 OSS 临时签名的 Markdown 图片标记，以验证回显功能是否通畅。

请您核对更新后的实施计划。如无异议，我们将开始初始化项目结构并安装依赖！
