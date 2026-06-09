# Node.js + LangChain.js 复杂 PDF RAG 演示项目

本项目旨在以循序渐进的方式，演示如何在 Node.js 和 LangChain.js 环境下构建一个可以处理复杂 PDF 文件的 RAG（检索增强生成）系统。

## 路线图 (Roadmap)

整个演进过程分为 4 个版本：

### 🚀 v1: 纯文本基础版 (Plain Text Baseline)
* **目标**：快速跑通最基础的 RAG 流程。
* **解析**：使用阿里云 OCR 或文档智能的基础接口，将 PDF 转换为纯文本，忽略表格结构和图片。
* **分块**：采用简单的 `RecursiveCharacterTextSplitter` 递归字符分块。
* **检索**：直接将文本分块向量化存入本地 `MemoryVectorStore`，使用基础向量相似度匹配，组装 Context 送给 LLM 问答。

### 📊 v2: 布局与表格增强版 (Layout & Table Aware)
* **目标**：解决复杂排版、多栏以及表格的语义割裂问题。
* **解析**：使用阿里云文档智能“文档解析”接口，获取保留标题层级与 HTML/Markdown 表格的结构化 Markdown。
* **分块**：使用 `MarkdownHeaderTextSplitter` 按文档标题层级进行切片，保证标题与内容语义不丢失。
* **检索**：引入 `MultiVectorRetriever`（多向量检索），对表格提取摘要进行索引，召回时返回完整 Markdown 表格。

### 🖼️ v3: 多模态图片与 OSS 联动版 (Multimodal & OSS Integration)
* **目标**：提取 PDF 中的图表与图片，支持向用户回显原始图片。
* **解析**：识别解析结果中的图片元素，并将图片上传到阿里云 OSS。
* **多模态**：使用多模态大模型（如 GPT-4o-mini 或 Gemini-flash）为图片生成详细的文本描述，并存入向量库索引。
* **回显**：检索时除召回文本外，同时召回匹配图片的 OSS URL，在问答界面回显真实的图片给用户。

### 🎯 v4: 生产级检索优化版 (Production-Grade Optimization)
* **目标**：提升专有名词召回率，减少上下文噪点。
* **检索**：将向量检索与基于词频的 BM25 关键字检索（Sparse Retrieval）相结合，进行混合检索（Ensemble Retriever）。
* **重排**：接入 Cohere Rerank 对检索出的片段进行二次重分过滤，确保送入大模型上下文的信息相关度最高。
