import React from 'react';
import styles from './Input.module.css';

const Input = ({
  type = 'text',
  label,
  error,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input; 