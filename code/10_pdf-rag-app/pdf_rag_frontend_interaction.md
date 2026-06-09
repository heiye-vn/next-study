# PDF RAG 前端高级交互与视觉设计方案

本方案设计了一套专为 RAG（检索增强生成）系统量身打造的高颜值、流畅的前端交互规范。方案采用 **双栏分屏（Split Screen）** 布局，并实现了**问答与 PDF 原文的“双向联动”检索回显**。

---

## 一、 核心交互逻辑与页面布局

整个界面分为 **左侧（PDF 文档与结构预览区）** 和 **右侧（智能问答与检索分析区）**。

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] PDF RAG Hub                                                  [Upload PDF] [⚙️ API Settings] |
+---------------------------------------------------------------------------------------------------+
|  File Explorer  |             Left Panel: PDF Viewer             |       Right Panel: Chat Panel      |
|                 |                                                |                                    |
| [📄 DocA.pdf]   |  +------------------------------------------+  |  User: 什么是 AP-9080 的最大额度？  |
|   - p.12 (Active)|  | [Page 12]                                |  |                                    |
| [📄 DocB.pdf]   |  |                                          |  |  Assistant: 根据文档，最大额度为...   |
|   - Indexing    |  |     +------------------------------+     |  |  +------------------------------+  |
|                 |  |     | Highlighted text box or      |     |  |  | 📊 表格数据：                |  |
|                 |  |     | extracted table shown here   |     |  |  | [ 额度 ] [ 期限 ]            |  |
|                 |  |     +------------------------------+     |  |  | [ 100W ] [ 36M  ]            |  |
|                 |  |                                          |  |  +------------------------------+  |
|                 |  |  🖼️ [Extracted image shown in document] |  |  | 引用来源：                     |  |
|                 |  |                                          |  |  | 🏷️ [DocA.pdf p.12]            |  |
|                 |  +------------------------------------------+  |  | 🖼️ [图表_12.png] (点击查看大图) |  |
|                 |  [<] Page 12 / 80 [>]                 [🔍]    |  |  +------------------------------+  |
+-----------------+----------------------------------------------+------------------------------------+
|  [Status] Connected | Vector DB: Milvus | CPU: 12%                                                 |
+---------------------------------------------------------------------------------------------------+
```

---

## 二、 核心交互流程设计

### 1. 上传与解析流程 (Upload & Ingestion Pipeline)
* **Drag-and-Drop 交互**：当用户将 PDF 拖入上传区时，虚线边框产生渐变光晕（Gradient Glow）动画。
* **状态机流转**：
  * **Uploaded**（上传完成） $\rightarrow$ 按钮显示灰色 Loading。
  * **Parsing**（OCR 识别/文档智能解析中） $\rightarrow$ 循环波浪进度条，展示解析速度及当前解析页码（如 `第 5/20 页`）。
  * **Indexing**（向量化与 Milvus 写入中） $\rightarrow$ 呼吸灯效果，代表向量编码与存储写入。
  * **Ready**（就绪） $\rightarrow$ 绿色钩型微动效，卡片滑入左侧文件树。

### 2. 流式问答与引用生成 (Streaming & Citation)
* **流式输出（Streaming）**：回答采用 Server-Sent Events (SSE) 协议进行逐字流式打字输出，给用户极佳的响应反馈。
* **引用标注（Citations）**：回答生成完毕后，下方渐显（Fade-in）引用卡片。
  * 文本引用卡片：标记为 `📄 [文件名] p.12`。
  * 图片引用卡片：标记为 `🖼️ [图片摘要.png]`。

### 3. “引用-原文” 深度联动（Highlight & Go-to-Page）
当用户点击右侧回答下方的引用卡片（例如 `[DocA.pdf p.12]`）时，触发联动逻辑：
1. **自动切换文件**：如果左侧当前不是 `DocA.pdf`，则平滑切换为该文件。
2. **平滑滚动跳转**：左侧 PDF 渲染区平滑滚动至第 12 页。
3. **坐标高亮（Target Highlighting）**：
   * 在左侧 PDF 的渲染页面上，将对应的文本段落或表格区域蒙上一层半透明的淡紫色高亮背景框（`rgba(139, 92, 246, 0.2)`）。
   * 边缘伴随呼吸动画，引导用户视觉焦点。

---

## 三、 React + TypeScript 状态管理与核心组件设计

在 React (Next.js / Vite) 中，我们可以通过统一的 Context 或 State 来驱动这种联动关系。

### 1. 定义数据结构类型 (`types.ts`)

```typescript
export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  citations?: Citation[];
}

export interface Citation {
  fileId: string;
  fileName: string;
  pageStart: number;
  pageEnd: number;
  highlightText?: string;
  bbox?: number[]; // 阿里云文档智能返回的四角坐标像素 [x1, y1, x2, y2, ...]
  imageUrl?: string; // v3 模式下 OSS 图片链接
}
```

### 2. 核心联动组件逻辑 (`PDFViewerAndChat.tsx`)

```tsx
import React, { useState } from "react";

export default function RAGDashboard() {
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(1);
  const [highlightBox, setHighlightBox] = useState<number[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 处理点击引用标签，实现左侧 PDF 跳转和高亮
  const handleCitationClick = (citation: Citation) => {
    setActiveFileId(citation.fileId);
    setActivePage(citation.pageStart);
    if (citation.bbox) {
      setHighlightBox(citation.bbox);
    } else {
      setHighlightBox(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. 左侧文件树与 PDF 渲染面板 */}
      <div className="w-1/2 flex flex-col border-r border-slate-800">
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <h2 className="text-lg font-bold text-violet-400">PDF 阅读器</h2>
        </div>
        
        {/* PDF 核心视图容器 */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-slate-900">
          {activeFileId ? (
            <div className="relative border border-slate-700 bg-white text-slate-900 shadow-2xl rounded-lg p-8 w-[595px] h-[842px]">
              {/* PDF 内容渲染占位（生产中替换为 WebPDFLoader 或 react-pdf 组件） */}
              <p className="text-xs text-slate-400 absolute top-2 right-2">第 {activePage} 页</p>
              <div className="mt-8">
                <p className="leading-relaxed">... 渲染 PDF 页面的文字内容 ...</p>
                
                {/* 如果存在坐标高亮区域，使用绝对定位渲染半透明高亮框 */}
                {highlightBox && (
                  <div 
                    className="absolute bg-violet-500/20 border border-violet-500 rounded animate-pulse"
                    style={{
                      left: `${highlightBox[0]}px`,
                      top: `${highlightBox[1]}px`,
                      width: `${highlightBox[2] - highlightBox[0]}px`,
                      height: `${highlightBox[3] - highlightBox[1]}px`,
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm">请在右侧提问或点击文档开始阅读</div>
          )}
        </div>
      </div>

      {/* 2. 右侧 AI 问答聊天面板 */}
      <div className="w-1/2 flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-violet-400 font-mono">RAG Assistant</h2>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Milvus Connected
          </span>
        </div>

        {/* 聊天消息区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                msg.sender === "user" 
                  ? "bg-violet-600 text-white rounded-br-none" 
                  : "bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                
                {/* 渲染引用卡片 */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                    {msg.citations.map((cite, i) => (
                      <button
                        key={i}
                        onClick={() => handleCitationClick(cite)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-violet-300 font-mono transition-all duration-200"
                      >
                        📄 {cite.fileName} p.{cite.pageStart}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 输入框组件 */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="relative flex items-center bg-slate-950 rounded-xl border border-slate-800 focus-within:border-violet-500 transition-all duration-300 px-4 py-2">
            <input 
              type="text" 
              placeholder="向 PDF 助手提问..." 
              className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none placeholder-slate-500"
            />
            <button className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-lg transition-all duration-200 shadow-md shadow-violet-600/20 font-bold">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 四、 视觉美化与体验微交互 (Premium Style Guide)

为了让应用具有极强的现代感，我们推荐采用 **极客黑（Slate-950）与紫罗兰（Violet-500）** 渐变设计体系：

### 1. 磨砂玻璃质感 (Glassmorphic Sensation)
所有的控制面板、文件目录卡片、以及弹出对话框均建议应用 CSS 的 `backdrop-filter` 实现玻璃背透磨砂：
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### 2. 上传交互过渡动画
上传区域拖拽激活状态的 CSS 实现：
```css
@keyframes border-pulse {
  0% { border-color: rgba(139, 92, 246, 0.4); }
  50% { border-color: rgba(139, 92, 246, 1); }
  100% { border-color: rgba(139, 92, 246, 0.4); }
}

.dropzone-active {
  animation: border-pulse 1.5s infinite ease-in-out;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
}
```

### 3. 高亮闪烁框 (Target Pulse)
在 PDF 渲染区实现定位高亮区域的视觉引导：
```css
@keyframes target-glow {
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
}

.highlight-box-active {
  animation: target-glow 2s infinite;
  background-color: rgba(139, 92, 246, 0.2);
}
```
