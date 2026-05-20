import { TodoCard } from '../TodoCard/TodoCard';
import styles from './Column.module.css';

/**
 * 看板状态列组件。
 * 
 * @param {object} props
 * @param {string} props.title - 列的显示名称。
 * @param {string} props.statusId - 列的状态标识符 ('pending', 'in-progress', 'completed')。
 * @param {Array} props.todos - 属于该列的待办事项列表。
 * @param {Function} props.onMove - 卡片状态流转回调函数。
 * @param {Function} props.onEdit - 卡片编辑回调函数。
 * @param {Function} props.onDelete - 卡片删除回调函数。
 */
export function Column({
  title,
  statusId,
  todos,
  onMove,
  onEdit,
  onDelete
}) {
  // 获取状态列头部装饰圆点对应的特定 CSS 类名
  const getStatusDotClass = () => {
    switch (statusId) {
      case 'pending': return styles.dotPending;
      case 'in-progress': return styles.dotProgress;
      case 'completed': return styles.dotCompleted;
      default: return '';
    }
  };

  const getEmptyStateMessage = () => {
    switch (statusId) {
      case 'pending': return '无待办任务，点击“Add Todo”新建一个吧';
      case 'in-progress': return '暂无进行中的任务';
      case 'completed': return '还没有已完成的任务，继续加油';
      default: return '暂无任务';
    }
  };

  return (
    <section 
      className={styles.column} 
      aria-labelledby={`col-header-${statusId}`}
    >
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={`${styles.statusDot} ${getStatusDotClass()}`} aria-hidden="true" />
          <h3 id={`col-header-${statusId}`} className={styles.title}>{title}</h3>
        </div>
        <span className={styles.badge} aria-label={`${todos.length} 项任务`}>
          {todos.length}
        </span>
      </header>

      <div className={styles.cardList}>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{getEmptyStateMessage()}</p>
          </div>
        )}
      </div>
    </section>
  );
}
