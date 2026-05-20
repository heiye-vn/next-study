import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmDialog.module.css';

/**
 * 基于 React Portal 渲染的复用确认对话框组件。
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - 对话框是否打开。
 * @param {string} props.title - 对话框标题。
 * @param {string} props.message - 描述性的警告信息。
 * @param {Function} props.onConfirm - 点击确认按钮时的回调函数。
 * @param {Function} props.onClose - 点击取消/关闭时的回调函数。
 * @param {string} [props.confirmText="删除"] - 确认按钮的文本内容。
 * @param {string} [props.cancelText="取消"] - 取消按钮的文本内容。
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = '删除',
  cancelText = '取消'
}) {
  const confirmBtnRef = useRef(null);

  // 监听键盘事件（按 Esc 键关闭）
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // 自动聚焦确认按钮，防范误触提交，同时支持键盘快速操作
    if (confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }

    // 弹窗打开时锁定页面滚动
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.dialog} 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className={styles.header}>
          <h3 id="confirm-dialog-title" className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.content}>
          <p id="confirm-dialog-desc" className={styles.message}>{message}</p>
        </div>

        <div className={styles.footer}>
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            ref={confirmBtnRef}
            className={styles.confirmBtn} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
