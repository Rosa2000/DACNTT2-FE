// src/components/common/MarkdownViewer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // style cho code block
import styles from './MarkdownViewer.module.css';

const MarkdownViewer = ({ content }) => {
  return (
    <div className={styles.markdownContainer}>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      />
    </div>
  );
};

export default MarkdownViewer;
