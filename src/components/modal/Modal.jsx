import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import Button from '../button/Button';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title || 'Xác nhận'}</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose} category="secondary">Hủy</Button>
          <Button onClick={onConfirm} category="success">Đồng ý</Button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal; 