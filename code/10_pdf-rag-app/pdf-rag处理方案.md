# RAG 中处理 PDF 文件的 Node.js 方案

本文档面向前端技术栈开发者，方案限定使用 TypeScript、Node.js、LangChain.js，不使用 Python 或其他后端语言。

## 1. 目标与假设

### 目标

- 支持 PDF 文件上传、解析、切分、向量化与检索。
- 支持基于 PDF 内容进行问答。
- 回答结果可以追溯到文件名、页码和原文片段。
- 技术栈适合接入 Next.js、Express、NestJS 等 Node.js 服务。

### 假设

- 第一版优先支持文本型 PDF。
- 扫描型 PDF 和复杂表格作为后续增强。
- 向量库使用 Milvus。
- Embedding 使用 OpenAI Embeddings。
- 原始 PDF 文件需要持久化保存，方便重建索引和排查问题。

## 2. 推荐技术栈

### 核心依赖

- Runtime：Node.js 20+
- 语言：TypeScript
- RAG 框架：LangChain.js
- PDF 解析：`@langchain/community`、`pdfjs-dist`
- 文本切分：`@langchain/textsplitters`
- Embedding：`@langchain/openai`
- 向量库：Milvus
- 文件存储：本地磁盘、S3、OSS 或 MinIO
- 元数据存储：PostgreSQL、SQLite 或 MySQL

### 安装依赖

```bash
npm install langchain @langchain/core @langchain/community @langchain/openai @langchain/milvus @langchain/textsplitters pdfjs-dist @zilliz/milvus2-sdk-node
```

### 为什么选择 Milvus

- 适合中大型向量数据规模。
- 支持本地部署，也可以使用 Zilliz Cloud。
- 支持标量字段过滤，方便按 `fileId`、`page`、`userId` 检索。
- 适合后续扩展多租户、多集合和更复杂的索引策略。

## 3. 整体流程

```txt
用户上传 PDF
   ↓
保存原始文件
   ↓
识别 PDF 类型：文本型 / 扫描型 / 混合型
   ↓
解析每页文本
   ↓
清洗文本
   ↓
按页码和段落切 chunk
   ↓
生成 embedding
   ↓
写入 Milvus
   ↓
用户提问
   ↓
问题向量化
   ↓
向量检索 + metadata filter
   ↓
拼接上下文
   ↓
LLM 生成答案
   ↓
返回答案和引用页码
```

## 4. PDF 入库流程

### 4.1 上传与文件记录

上传后先保存文件记录，不要直接把 PDF 丢给模型。

建议的文件记录结构：

```ts
type PdfFileRecord = {
  fileId: string;
  originalName: string;
  storagePath: string;
  sha256: string;
  pageCount?: number;
  status: "uploaded" | "processing" | "ready" | "failed";
  createdAt: string;
};
```

处理要点：

- 使用 `fileId` 作为业务唯一 ID。
- 使用 `sha256` 判断重复文件。
- 使用 `status` 记录处理状态。
- 保留原始 PDF，方便重新切分、重新 embedding 和排查解析问题。

### 4.2 判断 PDF 类型

PDF 通常分为三类：

| 类型 | 特征 | 处理方式 |
| --- | --- | --- |
| 文本型 PDF | 可以直接选中文本 | 使用 `WebPDFLoader` 或 `pdfjs-dist` |
| 扫描型 PDF | 每页主要是图片 | 需要 OCR |
| 混合型 PDF | 部分页有文字，部分是图片 | 文本解析 + OCR 兜底 |

第一版建议只支持文本型 PDF。检测到扫描型 PDF 时，直接提示用户需要 OCR。

### 4.3 使用 LangChain.js 解析 PDF

```ts
import fs from "fs/promises";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

export async function loadPdf(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const blob = new Blob([buffer], { type: "application/pdf" });

  const loader = new WebPDFLoader(blob, {
    parsedItemSeparator: " ",
  });

  return loader.load();
}
```

解析后需要为每页保留 metadata：

```ts
type PdfPageDocument = {
  pageContent: string;
  metadata: {
    fileId: string;
    fileName: string;
    pageNumber: number;
    source: string;
  };
};
```

不要把整份 PDF 拼成一个大字符串。按页保留文档结构，后续才能准确引用页码。

## 5. 文本清洗

PDF 解析结果常见问题：

- 页眉页脚重复。
- 页码混入正文。
- 多余空格。
- 异常断行。
- 连字符断词。
- 水印文字。

基础清洗函数：

```ts
export function cleanPdfText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/-\n/g, "")
    .trim();
}
```

页眉页脚处理建议：

- 统计每页顶部和底部重复出现的短行。
- 重复出现在 60% 以上页面的行，可以作为页眉页脚候选。
- 不要删除所有短行，标题也可能是短行。

## 6. Chunk 切分策略

推荐流程：

```txt
按页解析
   ↓
页内清洗
   ↓
页内按标题和段落优先切分
   ↓
过长内容使用 RecursiveCharacterTextSplitter
```

基础切分配置：

```ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 900,
  chunkOverlap: 150,
  separators: ["\n\n", "\n", "。", "！", "？", ".", " ", ""],
});
```

参数建议：

- 中文资料：`chunkSize` 建议 700 到 1200。
- 英文资料：`chunkSize` 建议 1000 到 1500。
- `chunkOverlap` 建议 100 到 200。
- 表格、制度、合同类文档可以稍小。
- 技术手册、论文类文档可以稍大。

Chunk metadata 建议：

```ts
type ChunkMetadata = {
  fileId: string;
  fileName: string;
  pageStart: number;
  pageEnd: number;
  chunkIndex: number;
  source: string;
  sha256: string;
};
```

## 7. Embedding 与向量入库

### 7.1 Embedding 模型选择

建议默认使用：

```ts
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
```

选择建议：

- 默认使用 `text-embedding-3-small`。
- 中文、法律、金融、医学、技术文档要求更高时，再评估 `text-embedding-3-large`。
- 不要一开始直接使用更贵的模型，先用真实问题评估召回效果。

### 7.2 初始化 Milvus

```ts
import { Milvus } from "@langchain/milvus";

const vectorStore = new Milvus(embeddings, {
  url: process.env.MILVUS_URL,
  collectionName: "pdf_chunks",
});
```

Milvus collection 需要保证 embedding 维度和模型一致。例如 `text-embedding-3-small` 默认 1536 维，collection 的向量字段也应使用 1536 维。

### 7.3 写入向量库

```ts
import { Document } from "@langchain/core/documents";

const chunkDocs = chunks.map((chunk, index) => {
  return new Document({
    pageContent: chunk.text,
    metadata: {
      fileId,
      fileName,
      pageStart: chunk.pageStart,
      pageEnd: chunk.pageEnd,
      chunkIndex: index,
      source: storagePath,
      sha256,
    },
  });
});

await vectorStore.addDocuments(chunkDocs);
```

入库注意事项：

- 重新处理同一个文件前，先按 `fileId` 删除旧 chunks。
- 不要只靠文件名判断唯一性。
- metadata 中必须保留页码信息。
- 如果要支持多租户，需要增加 `userId` 或 `tenantId`。

## 8. 查询与问答流程

### 8.1 请求结构

```ts
type AskPdfRequest = {
  question: string;
  fileIds?: string[];
  topK?: number;
};
```

服务端处理：

- 对 `question` 做 trim。
- 限制最大长度。
- 如果指定文件范围，使用 metadata filter。
- 多轮对话时，先将追问改写成独立问题。

### 8.2 向量检索

```ts
const filter = fileIds?.length
  ? `fileId in [${fileIds.map((id) => `"${id}"`).join(", ")}]`
  : undefined;

const docs = await vectorStore.similaritySearch(question, 8, filter);
```

参数建议：

- 初始 `topK` 使用 8。
- 答案经常缺信息时，提高到 12 到 20。
- 回答太散时，降低到 4 到 6。
- 多文件检索必须加 `fileId` filter，避免串文档。
- Milvus filter 字段需要在 collection schema 中作为标量字段存在，例如 `fileId`、`userId`、`pageStart`。

### 8.3 是否需要 Rerank

第一版可以不做 rerank。

如果检索质量不稳定，再做两阶段召回：

```txt
第一阶段：向量召回 topK = 20
第二阶段：rerank 后保留 topN = 5
```

不要一开始引入复杂 rerank。先验证基础召回是否达标。

### 8.4 构造上下文

```ts
function formatContext(docs) {
  return docs.map((doc, index) => {
    const meta = doc.metadata;
    return [
      `片段 ${index + 1}`,
      `文件：${meta.fileName}`,
      `页码：${meta.pageStart}-${meta.pageEnd}`,
      `内容：${doc.pageContent}`,
    ].join("\n");
  }).join("\n\n---\n\n");
}
```

上下文必须带来源信息，方便模型输出引用。

### 8.5 Prompt 模板

```txt
你是一个基于 PDF 内容回答问题的助手。

要求：
1. 只能根据提供的 PDF 片段回答。
2. 如果片段中没有答案，明确说“资料中没有找到依据”。
3. 回答要简洁、准确。
4. 每个关键结论后标注来源页码，例如：[文件名 p.3]。

问题：
{question}

PDF 片段：
{context}
```

## 9. 前端交互设计

建议前端状态：

```txt
uploaded → parsing → indexing → ready
```

页面结构建议：

- 左侧：PDF viewer。
- 右侧：问答面板。
- 答案下方：引用来源。
- 点击引用后跳转到 PDF 对应页码。

引用数据结构：

```ts
type Citation = {
  fileId: string;
  fileName: string;
  pageStart: number;
  pageEnd: number;
  chunkText: string;
};
```

PDF 预览可以使用：

- `react-pdf`
- `pdfjs-dist`

## 10. 扫描型 PDF 与 OCR

扫描型 PDF 需要 OCR。

可选 JS 方案：

- 浏览器端：`tesseract.js`
- Node 端：`tesseract.js`
- 云服务：Google Vision、Azure OCR、AWS Textract、阿里云 OCR

建议：

- V1 只支持文本型 PDF。
- 检测到扫描型 PDF 时提示用户：“该 PDF 需要 OCR，当前版本暂不支持。”
- V2 再接 OCR。

原因：

- OCR 慢。
- 表格容易乱。
- 中文 OCR 质量受清晰度影响很大。
- Node 端 PDF 渲染为图片会增加复杂度。

## 11. 表格处理策略

第一版建议：

- 表格按普通文本处理。
- 不追求结构还原。

如果 PDF 表格很多，再做增强：

- 使用 `pdfjs-dist` 获取文本坐标。
- 根据 y 坐标分行。
- 根据 x 坐标分列。
- 转成 Markdown table 后再 chunk。
- 表格 chunk 不要和正文混在一起。

表格 metadata 示例：

```ts
{
  contentType: "table",
  pageStart: 5,
  pageEnd: 5
}
```

## 12. 推荐目录结构

```txt
src/
  rag/
    ingestPdf.ts
    parsePdf.ts
    cleanText.ts
    splitText.ts
    milvusStore.ts
    retrieve.ts
    answer.ts
  api/
    upload.ts
    ask.ts
  db/
    pdfFiles.ts
```

职责说明：

- `ingestPdf.ts`：编排完整入库流程。
- `parsePdf.ts`：解析 PDF。
- `cleanText.ts`：清洗文本。
- `splitText.ts`：切分 chunk。
- `milvusStore.ts`：封装 Milvus。
- `retrieve.ts`：处理召回。
- `answer.ts`：构造 prompt 并调用模型。
- `upload.ts`：处理上传接口。
- `ask.ts`：处理问答接口。
- `pdfFiles.ts`：管理 PDF 元数据。

## 13. 最小可用版本路线

### V1：先做通

- 支持文本型 PDF。
- 每页解析。
- 清洗文本。
- chunk 切分。
- embedding。
- Milvus 检索。
- 回答带页码引用。

### V2：提升质量

- 页眉页脚去重。
- 多文件 filter。
- chunk 参数评测。
- 查询改写。
- 简单 rerank。

### V3：处理复杂 PDF

- OCR。
- 表格结构化。
- 图片说明。
- 章节目录识别。
- 高亮定位到 PDF 原文。

## 14. 关键原则

- 不要一开始做 Agentic RAG，先做稳定的两步式 RAG。
- 不要直接把整份 PDF 丢给模型。
- 不要丢掉页码 metadata。
- 不要过早做 OCR、表格结构化、复杂 rerank。
- 先用 20 到 50 个真实问题做召回评测，再调 chunk 和 topK。

## 15. 官方参考

- LangChain.js PDF Loader：https://docs.langchain.com/oss/javascript/integrations/document_loaders/web_loaders/pdf/
- LangChain.js Vector Stores：https://docs.langchain.com/oss/javascript/integrations/vectorstores/
- LangChain.js Milvus：https://docs.langchain.com/oss/javascript/integrations/vectorstores/milvus
- LangChain.js Retrieval：https://docs.langchain.com/oss/javascript/langchain/retrieval
- OpenAI Embeddings：https://developers.openai.com/api/docs/guides/embeddings

## 16. 关键功能伪代码拆分

下面伪代码按实际工程文件拆分，重点表达职责边界和调用关系，不追求可以直接复制运行。

### 16.1 `src/rag/types.ts`

```ts
export type PdfFileStatus = "uploaded" | "processing" | "ready" | "failed";

export type PdfFileRecord = {
  fileId: string;
  originalName: string;
  storagePath: string;
  sha256: string;
  pageCount?: number;
  status: PdfFileStatus;
  createdAt: string;
};

export type PdfPage = {
  fileId: string;
  fileName: string;
  pageNumber: number;
  text: string;
  source: string;
};

export type PdfChunk = {
  id: string;
  fileId: string;
  fileName: string;
  text: string;
  pageStart: number;
  pageEnd: number;
  chunkIndex: number;
  source: string;
  sha256: string;
};

export type AskPdfInput = {
  question: string;
  fileIds?: string[];
  topK?: number;
};
```

### 16.2 `src/rag/fileRepository.ts`

```ts
import type { PdfFileRecord, PdfFileStatus } from "./types";

export async function createPdfFileRecord(input: {
  originalName: string;
  storagePath: string;
  sha256: string;
}): Promise<PdfFileRecord> {
  return db.pdfFiles.insert({
    fileId: crypto.randomUUID(),
    originalName: input.originalName,
    storagePath: input.storagePath,
    sha256: input.sha256,
    status: "uploaded",
    createdAt: new Date().toISOString(),
  });
}

export async function updatePdfFileStatus(
  fileId: string,
  status: PdfFileStatus,
  extra?: Partial<PdfFileRecord>
) {
  await db.pdfFiles.update(fileId, {
    status,
    ...extra,
  });
}

export async function findPdfBySha256(sha256: string) {
  return db.pdfFiles.findFirst({
    where: { sha256 },
  });
}
```

### 16.3 `src/rag/hashFile.ts`

```ts
import fs from "fs";
import crypto from "crypto";

export async function hashFile(filePath: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}
```

### 16.4 `src/rag/parsePdf.ts`

```ts
import fs from "fs/promises";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import type { PdfPage } from "./types";

export async function parsePdfPages(input: {
  fileId: string;
  fileName: string;
  filePath: string;
}): Promise<PdfPage[]> {
  const buffer = await fs.readFile(input.filePath);
  const blob = new Blob([buffer], { type: "application/pdf" });

  const loader = new WebPDFLoader(blob, {
    parsedItemSeparator: " ",
  });

  const docs = await loader.load();

  return docs.map((doc, index) => ({
    fileId: input.fileId,
    fileName: input.fileName,
    pageNumber: doc.metadata?.loc?.pageNumber ?? index + 1,
    text: doc.pageContent,
    source: input.filePath,
  }));
}
```

### 16.5 `src/rag/detectPdfType.ts`

```ts
import type { PdfPage } from "./types";

export function detectPdfType(pages: PdfPage[]) {
  const totalTextLength = pages.reduce((sum, page) => {
    return sum + page.text.trim().length;
  }, 0);

  const avgTextLength = totalTextLength / Math.max(pages.length, 1);

  if (avgTextLength < 30) {
    return "scanned";
  }

  return "text";
}
```

### 16.6 `src/rag/cleanText.ts`

```ts
export function cleanPdfText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/-\n/g, "")
    .trim();
}
```

### 16.7 `src/rag/splitText.ts`

```ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { PdfChunk, PdfPage } from "./types";
import { cleanPdfText } from "./cleanText";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 900,
  chunkOverlap: 150,
  separators: ["\n\n", "\n", "。", "！", "？", ".", " ", ""],
});

export async function splitPdfPagesToChunks(input: {
  pages: PdfPage[];
  sha256: string;
}): Promise<PdfChunk[]> {
  const chunks: PdfChunk[] = [];

  for (const page of input.pages) {
    const cleanText = cleanPdfText(page.text);

    if (!cleanText) {
      continue;
    }

    const pageChunks = await splitter.splitText(cleanText);

    for (const text of pageChunks) {
      chunks.push({
        id: crypto.randomUUID(),
        fileId: page.fileId,
        fileName: page.fileName,
        text,
        pageStart: page.pageNumber,
        pageEnd: page.pageNumber,
        chunkIndex: chunks.length,
        source: page.source,
        sha256: input.sha256,
      });
    }
  }

  return chunks;
}
```

### 16.8 `src/rag/embeddings.ts`

```ts
import { OpenAIEmbeddings } from "@langchain/openai";

export function createEmbeddings() {
  return new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
}
```

### 16.9 `src/rag/milvusStore.ts`

```ts
import { Document } from "@langchain/core/documents";
import { Milvus } from "@langchain/milvus";
import type { PdfChunk } from "./types";
import { createEmbeddings } from "./embeddings";

export function createMilvusStore() {
  return new Milvus(createEmbeddings(), {
    url: process.env.MILVUS_URL,
    collectionName: "pdf_chunks",
  });
}

export async function deleteChunksByFileId(fileId: string) {
  const store = createMilvusStore();

  await store.delete({
    filter: `fileId == "${fileId}"`,
  });
}

export async function addPdfChunks(chunks: PdfChunk[]) {
  const store = createMilvusStore();

  const docs = chunks.map((chunk) => {
    return new Document({
      pageContent: chunk.text,
      metadata: {
        id: chunk.id,
        fileId: chunk.fileId,
        fileName: chunk.fileName,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        chunkIndex: chunk.chunkIndex,
        source: chunk.source,
        sha256: chunk.sha256,
      },
    });
  });

  await store.addDocuments(docs);
}
```

### 16.10 `src/rag/ingestPdf.ts`

```ts
import { hashFile } from "./hashFile";
import { parsePdfPages } from "./parsePdf";
import { detectPdfType } from "./detectPdfType";
import { splitPdfPagesToChunks } from "./splitText";
import { addPdfChunks, deleteChunksByFileId } from "./milvusStore";
import {
  createPdfFileRecord,
  findPdfBySha256,
  updatePdfFileStatus,
} from "./fileRepository";

export async function ingestPdf(input: {
  originalName: string;
  storagePath: string;
}) {
  const sha256 = await hashFile(input.storagePath);
  const existedFile = await findPdfBySha256(sha256);

  if (existedFile?.status === "ready") {
    return existedFile;
  }

  const file = await createPdfFileRecord({
    originalName: input.originalName,
    storagePath: input.storagePath,
    sha256,
  });

  try {
    await updatePdfFileStatus(file.fileId, "processing");

    const pages = await parsePdfPages({
      fileId: file.fileId,
      fileName: file.originalName,
      filePath: file.storagePath,
    });

    const pdfType = detectPdfType(pages);

    if (pdfType === "scanned") {
      throw new Error("该 PDF 疑似扫描件，当前版本需要 OCR 才能处理");
    }

    const chunks = await splitPdfPagesToChunks({
      pages,
      sha256,
    });

    await deleteChunksByFileId(file.fileId);
    await addPdfChunks(chunks);

    await updatePdfFileStatus(file.fileId, "ready", {
      pageCount: pages.length,
    });

    return {
      ...file,
      status: "ready",
      pageCount: pages.length,
    };
  } catch (error) {
    await updatePdfFileStatus(file.fileId, "failed");
    throw error;
  }
}
```

### 16.11 `src/rag/retrieve.ts`

```ts
import { createMilvusStore } from "./milvusStore";

export async function retrievePdfChunks(input: {
  question: string;
  fileIds?: string[];
  topK?: number;
}) {
  const store = createMilvusStore();
  const topK = input.topK ?? 8;

  const filter = input.fileIds?.length
    ? `fileId in [${input.fileIds.map((id) => `"${id}"`).join(", ")}]`
    : undefined;

  return store.similaritySearch(input.question, topK, filter);
}
```

### 16.12 `src/rag/formatContext.ts`

```ts
export function formatContext(docs) {
  return docs.map((doc, index) => {
    const meta = doc.metadata;

    return [
      `片段 ${index + 1}`,
      `文件：${meta.fileName}`,
      `页码：${meta.pageStart}-${meta.pageEnd}`,
      `内容：${doc.pageContent}`,
    ].join("\n");
  }).join("\n\n---\n\n");
}
```

### 16.13 `src/rag/answer.ts`

```ts
import { ChatOpenAI } from "@langchain/openai";
import { retrievePdfChunks } from "./retrieve";
import { formatContext } from "./formatContext";
import type { AskPdfInput } from "./types";

const model = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0,
});

export async function answerPdfQuestion(input: AskPdfInput) {
  const docs = await retrievePdfChunks({
    question: input.question,
    fileIds: input.fileIds,
    topK: input.topK,
  });

  const context = formatContext(docs);

  const prompt = `
你是一个基于 PDF 内容回答问题的助手。

要求：
1. 只能根据提供的 PDF 片段回答。
2. 如果片段中没有答案，明确说“资料中没有找到依据”。
3. 回答要简洁、准确。
4. 每个关键结论后标注来源页码，例如：[文件名 p.3]。

问题：
${input.question}

PDF 片段：
${context}
`;

  const result = await model.invoke(prompt);

  return {
    answer: result.content,
    citations: docs.map((doc) => ({
      fileId: doc.metadata.fileId,
      fileName: doc.metadata.fileName,
      pageStart: doc.metadata.pageStart,
      pageEnd: doc.metadata.pageEnd,
      chunkText: doc.pageContent,
    })),
  };
}
```

### 16.14 `src/api/upload.ts`

```ts
import { ingestPdf } from "../rag/ingestPdf";

export async function uploadPdfHandler(req, res) {
  const uploadedFile = await saveMultipartFile(req);

  const file = await ingestPdf({
    originalName: uploadedFile.originalName,
    storagePath: uploadedFile.path,
  });

  res.json({
    fileId: file.fileId,
    status: file.status,
    pageCount: file.pageCount,
  });
}
```

### 16.15 `src/api/ask.ts`

```ts
import { answerPdfQuestion } from "../rag/answer";

export async function askPdfHandler(req, res) {
  const result = await answerPdfQuestion({
    question: req.body.question,
    fileIds: req.body.fileIds,
    topK: req.body.topK,
  });

  res.json(result);
}
```

## 17. Milvus Collection 设计建议

Milvus collection 的字段建议如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | VarChar | chunk 唯一 ID |
| `vector` | FloatVector | embedding 向量 |
| `text` | VarChar | chunk 文本 |
| `fileId` | VarChar | PDF 文件 ID |
| `fileName` | VarChar | PDF 文件名 |
| `pageStart` | Int64 | chunk 起始页 |
| `pageEnd` | Int64 | chunk 结束页 |
| `chunkIndex` | Int64 | chunk 序号 |
| `source` | VarChar | 原始文件路径 |
| `sha256` | VarChar | 文件哈希 |

索引建议：

- 小规模先用 `AUTOINDEX`。
- 数据量变大后再根据实际召回速度和成本评估 `HNSW`、`IVF_FLAT` 等索引。
- 初期不要过早优化索引，先保证入库、过滤、召回链路正确。
