import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './MarkdownEditor.module.css';

const MarkdownEditor = ({ 
  value = "", 
  onChange,
  className,
  placeholder
}) => {
  const options = {
    spellChecker: false,
    status: false,
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'code',
      'table',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide'
    ],
    placeholder: placeholder,
    autofocus: true,
    minHeight: '500px'
  };

  return (
    <div className={`${styles.editorWrapper} ${className || ''}`}>
      <SimpleMDE
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  );
};

export default MarkdownEditor; 