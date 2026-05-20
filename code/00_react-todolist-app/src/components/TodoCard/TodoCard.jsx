import styles from './TodoCard.module.css';

/**
 * 单个待办事项卡片组件。
 * 
 * @param {object} props
 * @param {object} props.todo - 待办事项的数据对象。
 * @param {Function} props.onMove - 状态流转回调函数 (id, newStatus)。
 * @param {Function} props.onEdit - 编辑待办事项回调函数 (todo)。
 * @param {Function} props.onDelete - 删除待办事项回调函数 (id)。
 */
export function TodoCard({ todo, onMove, onEdit, onDelete }) {
  const { id, title, description, status, createdAt } = todo;

  // 格式化日期的辅助函数
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className={styles.card} aria-labelledby={`todo-title-${id}`}>
      <header className={styles.header}>
        <h4 id={`todo-title-${id}`} className={styles.title}>{title}</h4>
        
        {/* 针对当前状态的特定操作按钮 */}
        <div className={styles.actions}>
          {status === 'pending' && (
            <>
              <button 
                type="button" 
                className={styles.actionBtn}
                onClick={() => onMove(id, 'in-progress')}
                aria-label="将任务移入进行中"
              >
                move
              </button>
              <button 
                type="button" 
                className={styles.actionBtn}
                onClick={() => onEdit(todo)}
                aria-label="编辑任务"
              >
                edit
              </button>
            </>
          )}

          {status === 'in-progress' && (
            <>
              <button 
                type="button" 
                className={styles.actionBtn}
                onClick={() => onMove(id, 'pending')}
                aria-label="将任务退回待处理"
              >
                move
              </button>
              <button 
                type="button" 
                className={`${styles.actionBtn} ${styles.successText}`}
                onClick={() => onMove(id, 'completed')}
                aria-label="完成任务"
              >
                complete
              </button>
            </>
          )}

          {status === 'completed' && (
            <button 
              type="button" 
              className={styles.actionBtn}
              onClick={() => onMove(id, 'in-progress')}
              aria-label="将任务退回进行中"
            >
              move
            </button>
          )}
        </div>
      </header>

      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      <footer className={styles.footer}>
        <time className={styles.time} dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
        <button 
          type="button" 
          className={styles.deleteBtn}
          onClick={() => onDelete(id)}
          aria-label="删除任务"
        >
          {/* 简易的删除按钮 */}
          删除
        </button>
      </footer>
    </article>
  );
}
