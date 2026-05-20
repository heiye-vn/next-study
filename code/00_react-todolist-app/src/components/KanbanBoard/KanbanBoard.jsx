import { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Column } from '../Column/Column';
import { TodoModal } from '../TodoModal/TodoModal';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import styles from './KanbanBoard.module.css';

export function KanbanBoard() {
  const [todos, setTodos] = useLocalStorage('kanban-todos', []);
  
  // 移动端当前激活的 Tab 状态: 'pending' | 'in-progress' | 'completed'
  const [activeTab, setActiveTab] = useState('pending');
  
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedTodo, setSelectedTodo] = useState(null);

  // 确认删除对话框状态
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [todoToDeleteId, setTodoToDeleteId] = useState(null);

  // 依据状态对待办事项进行分组和过滤（使用 useMemo 缓存）
  const groupedTodos = useMemo(() => {
    const groups = {
      pending: [],
      'in-progress': [],
      completed: []
    };
    
    todos.forEach((todo) => {
      if (groups[todo.status]) {
        groups[todo.status].push(todo);
      }
    });

    // 按照创建时间降序排序（最新的显示在最上方）
    groups.pending.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    groups['in-progress'].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    groups.completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return groups;
  }, [todos]);

  // 打开新增待办模态框
  const openAddModal = () => {
    setModalMode('add');
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  // 打开编辑待办模态框
  const openEditModal = (todo) => {
    setModalMode('edit');
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  // 保存待办事项的回调（新增与编辑公用）
  const handleSaveTodo = ({ title, description }) => {
    if (modalMode === 'add') {
      const newTodo = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        title,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setTodos((prev) => [newTodo, ...prev]);
    } else if (modalMode === 'edit' && selectedTodo) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === selectedTodo.id
            ? { ...t, title, description }
            : t
        )
      );
    }
  };

  // 在看板列之间流转待办任务状态
  const handleMoveTodo = (id, newStatus) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // 触发删除确认对话框
  const triggerDelete = (id) => {
    setTodoToDeleteId(id);
    setIsConfirmOpen(true);
  };

  // 确认删除待办任务的回调
  const handleConfirmDelete = () => {
    if (todoToDeleteId) {
      setTodos((prev) => prev.filter((t) => t.id !== todoToDeleteId));
      setTodoToDeleteId(null);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.boardHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.mainTitle}>Todo Board</h1>
          <p className={styles.subtitle}>看板式待办事项管理系统</p>
        </div>
        <button 
          type="button" 
          className={styles.addBtn} 
          onClick={openAddModal}
          aria-label="新增待办任务"
        >
          <span className={styles.plusIcon}>+</span> Add Todo
        </button>
      </header>

      {/* 仅在移动端显示的 Tab 切换导航 */}
      <nav className={styles.tabNav} aria-label="看板列切换">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          <span className={styles.tabBadge}>{groupedTodos.pending.length}</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'in-progress' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In progress
          <span className={styles.tabBadge}>{groupedTodos['in-progress'].length}</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          <span className={styles.tabBadge}>{groupedTodos.completed.length}</span>
        </button>
      </nav>

      {/* 看板列网格容器 */}
      <div className={styles.boardGrid}>
        <div className={`${styles.columnCol} ${activeTab === 'pending' ? styles.colActive : styles.colInactive}`}>
          <Column
            title="Pending"
            statusId="pending"
            todos={groupedTodos.pending}
            onMove={handleMoveTodo}
            onEdit={openEditModal}
            onDelete={triggerDelete}
          />
        </div>

        <div className={`${styles.columnCol} ${activeTab === 'in-progress' ? styles.colActive : styles.colInactive}`}>
          <Column
            title="In progress"
            statusId="in-progress"
            todos={groupedTodos['in-progress']}
            onMove={handleMoveTodo}
            onEdit={openEditModal}
            onDelete={triggerDelete}
          />
        </div>

        <div className={`${styles.columnCol} ${activeTab === 'completed' ? styles.colActive : styles.colInactive}`}>
          <Column
            title="Completed"
            statusId="completed"
            todos={groupedTodos.completed}
            onMove={handleMoveTodo}
            onEdit={openEditModal}
            onDelete={triggerDelete}
          />
        </div>
      </div>

      {/* 模态弹层区（新增/编辑待办、确认删除） */}
      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTodo}
          initialData={selectedTodo}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="确认删除"
          message="您确定要删除这个待办任务吗？此操作无法撤销。"
          onConfirm={handleConfirmDelete}
          onClose={() => setIsConfirmOpen(false)}
        />
      )}
    </main>
  );
}
