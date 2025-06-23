import React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './MarkdownEditor.module.css';

const mdParser = new MarkdownIt();

const MarkdownEditor = ({ value, onChange, placeholder, height = 500 }) => {
  return (
    <div className={styles.editorWrapper}>
      <MdEditor
        value={value}
        style={{ height }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={({ text }) => onChange(text)}
        placeholder={placeholder}
        config={{
          view: {
            menu: true,
            md: true,
            html: false, // Tắt chế độ xem trước bên trong editor
          },
          canView: {
            menu: true,
            md: true,
            html: false,
            fullScreen: true,
            hideMenu: true,
          }
        }}
      />
    </div>
  );
};

export default React.memo(MarkdownEditor); 