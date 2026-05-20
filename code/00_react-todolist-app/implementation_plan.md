# React 看板待办事项应用 (Kanban TodoList) 实现方案

本项目将基于 React 19 和原生 CSS 模块 (CSS Modules) 实现一个美观、响应式且功能完善的看板式 TodoList 应用。

## 功能分析与面试加分项梳理

作为面试题目，除了实现基本功能外，更应体现良好的**编码规范、React 思维、组件设计能力以及工程化素养**：

1. **状态管理与数据流**：
   - 使用 React 的单向数据流。所有待办事项的状态都统一管理在顶层（或使用自定义 Hook），通过 Props 传递更新函数。
   - 使用自定义 Hook `useLocalStorage` 封装状态持久化，保持主组件逻辑清晰。
   - 使用 `useMemo` 对不同状态（Pending、In Progress、Completed）的待办事项进行分类过滤，避免多余的重渲染计算。

2. **组件化设计**：
   - 职责单一原则：将看板拆分为 `KanbanBoard`、`Column`、`TodoCard`、`TodoModal` 等高内聚、低耦合的组件。
   - 避免全局样式污染：采用 Vite 默认支持的 **CSS Modules** (`.module.css`)，实现样式局部作用域。
   - 复用性：新增与编辑复用同一个 `TodoModal` 组件，通过传入的 `mode`（'add' | 'edit'）或 `initialData` 区分。

3. **极致交互与移动端适配**：
   - **响应式设计**：
     - **桌面端**：三栏式横向看板布局，一目了然。
     - **移动端 (≤ 768px)**：若直接上下堆叠三栏会导致页面过长、滚动疲劳。我们将设计**顶部 Tab 标签切换栏**，并在切换时加入平滑的过渡动画，提供类原生 App 的体验。
   - **交互动效**：添加卡片悬浮升起、按钮轻微缩放、模态框淡入淡出等微动效。

4. **高级 React 模式与可访问性 (a11y) & 安全**：
   - **React Portal**：使用 `createPortal` 将模态框 (Modal) 挂载到 `document.body`，避免受到父组件 `overflow: hidden` 或 `z-index` 的层级限制。
   - **焦点管理与键盘支持**：模态框打开时自动聚焦到第一个输入框；支持按下 `Esc` 键关闭模态框。
   - **安全防御**：遵循 XSS 防御规范，所有文本直接使用 React JSX 自带的防注入机制进行渲染。输入框进行空值校验和超长文本截断，防止布局崩溃。

---

## 模块设计

每个待办事项的结构设计：
```typescript
interface Todo {
  id: string;          // 唯一ID，使用 crypto.randomUUID()
  title: string;       // 标题
  description: string; // 描述信息
  status: 'pending' | 'in-progress' | 'completed'; // 状态
  createdAt: string;   // 创建时间
}
```

### 状态流转规则：
- **Pending (待处理)**：
  - 点击 `move` ⏩ 流转至 `In progress`
  - 点击 `edit` ✏️ 打开编辑弹窗
  - 支持删除操作
- **In progress (进行中)**：
  - 点击 `move` ⏪ 流转回 `Pending`
  - 点击 `complete` ⏩ 流转至 `Completed`
  - 支持删除操作
- **Completed (已完成)**：
  - 点击 `move` ⏪ 流转回 `In progress`
  - 支持删除操作

---

## Proposed Changes

### 1. 核心与基础配置

#### [MODIFY] [index.html](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/index.html)
- 更改页面 `<title>` 为 `Kanban Todo List`，并引入 Google 字体 (Outfit/Inter) 提升视觉档次。

#### [MODIFY] [index.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/index.css)
- 定义设计系统的全局 CSS 变量（色彩方案包括深色/浅色模式、阴影、圆角、过渡时间等），设置全局 Box-Sizing 重置。

---

### 2. 自定义 Hooks

#### [NEW] [useLocalStorage.js](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/hooks/useLocalStorage.js)
- 实现一个通用的本地存储状态同步 Hook，用于持久化 Todo 数据。

---

### 3. 公共与业务组件

#### [NEW] [TodoModal.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/TodoModal/TodoModal.jsx) & [TodoModal.module.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/TodoModal/TodoModal.module.css)
- 弹窗组件（新增与编辑公用）。
- 使用 `createPortal` 渲染，处理输入验证，带有毛玻璃模糊背景 (glassmorphism) 和打开动效。
- 提供 A11y 键盘事件支持（按 Esc 关闭）。

#### [NEW] [ConfirmDialog.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/ConfirmDialog/ConfirmDialog.jsx) & [ConfirmDialog.module.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/ConfirmDialog/ConfirmDialog.module.css)
- 自定义二次确认弹窗，替换浏览器默认的 `confirm()`，以保障视觉一致性及非阻塞线程安全。

#### [NEW] [TodoCard.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/TodoCard/TodoCard.jsx) & [TodoCard.module.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/TodoCard/TodoCard.module.css)
- 渲染单张卡片，包括标题、长描述的处理、创建时间。
- 根据所属列的类型渲染不同的操作按钮（如 move, edit, complete, delete）。

#### [NEW] [Column.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/Column/Column.jsx) & [Column.module.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/Column/Column.module.css)
- 渲染一列（Pending / In progress / Completed）。
- 包含列标题、当前列的任务统计、以及空状态展示。

#### [NEW] [KanbanBoard.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/KanbanBoard/KanbanBoard.jsx) & [KanbanBoard.module.css](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/components/KanbanBoard/KanbanBoard.module.css)
- 看板主组件。整合状态、标题头及“新增待办”按钮。
- 管理 Tab 状态（移动端下）与模态框状态。

#### [MODIFY] [App.jsx](file:///d:/ZSP/Study/next-study/code/00_react-todolist-app/src/App.jsx)
- 清理脚手架预设内容，渲染 `<KanbanBoard />` 组件。

---

## Verification Plan

### 安全性验证 (Security Checklist)
- [ ] 确保无 `dangerouslySetInnerHTML` 调用，防范 XSS 攻击。
- [ ] 无原生 `alert()` / `confirm()`，均使用自定义弹窗。
- [ ] 所有渲染的用户输入内容（待办标题、描述）都采用 JSX 的标准插值表达式，确保自动 HTML 转义。
- [ ] 处理超长文字输入（如连续无空格的字符），通过 `word-break: break-word` 防范 UI 撑破溢出。

### 自动化与手动测试
- 使用本地开发服务器运行 `http://localhost:5174/` 进行以下操作：
  1. **新增待办**：验证表单输入校验（不能为空），成功后弹窗关闭。
  2. **状态流转**：
     - Pending 卡片点击 `move` 是否流向 In progress。
     - In progress 卡片点击 `complete` 流向 Completed，点击 `move` 回流向 Pending。
     - Completed 卡片点击 `move` 回流向 In progress。
  3. **编辑待办**：点击 Pending 的 `edit` 是否正常回显并修改标题/描述。
  4. **删除待办**：点击删除，弹出确认对话框，确认后成功从列表中移除。
  5. **响应式验证**：通过浏览器控制台切换至 Mobile 视图（例如 iPhone 12/Pro），验证 Tab 菜单是否显示、列卡片是否按 Tab 切换呈现，排版是否合理，有无横向溢出滚动条。
  6. **持久化验证**：刷新页面，验证新建的任务及状态是否仍然保留（Local Storage）。
