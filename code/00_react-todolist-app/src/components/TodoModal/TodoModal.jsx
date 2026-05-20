import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './TodoModal.module.css';

/**
 * 用于创建/编辑待办事项的复用模态框组件，基于 React Portal 渲染。
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - 模态框是否打开。
 * @param {Function} props.onClose - 关闭模态框的回调函数。
 * @param {Function} props.onSave - 保存待办事项的回调函数，接收 { title, description }。
 * @param {object} [props.initialData] - 用于编辑模式的初始数据。
 */
export function TodoModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');
  
  const titleInputRef = useRef(null);
  const isEdit = !!initialData;

  // 在组件挂载/卸载时管理自动聚焦、锁定滚动以及键盘 Escape 监听
  useEffect(() => {
    // 自动聚焦标题输入框
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    // 锁定页面背景滚动
    document.body.style.overflow = 'hidden';

    // 监听 Escape 键
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 简易的前端输入验证
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('请输入待办事项的标题');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    onSave({
      title: trimmedTitle,
      description: description.trim()
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-modal-title"
      >
        <div className={styles.header}>
          <h2 id="todo-modal-title" className={styles.modalTitle}>
            {isEdit ? '编辑待办事项' : '新增待办事项'}
          </h2>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose} 
            aria-label="关闭弹窗"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="todo-title" className={styles.label}>
              标题 <span className={styles.required}>*</span>
            </label>
            <input
              id="todo-title"
              type="text"
              ref={titleInputRef}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="请输入任务标题..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              maxLength={100}
            />
            {error && <span className={styles.errorText} role="alert">{error}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="todo-desc" className={styles.label}>描述</label>
            <textarea
              id="todo-desc"
              className={styles.textarea}
              placeholder="请输入任务的详细描述描述（选填）..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className={styles.charCount}>
              {description.length}/500 字
            </div>
          </div>

          <div className={styles.footer}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={onClose}
            >
              取消
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
