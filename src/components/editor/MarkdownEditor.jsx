import React, { useEffect, useRef, useState } from 'react';
import { Space, Button, Tooltip } from 'antd';
import ReactMarkdown from 'react-markdown';
import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { search, findNext, findPrevious, searchKeymap } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  CodeOutlined,
  TableOutlined
} from '@ant-design/icons';
import styles from './MarkdownEditor.module.css';

const MarkdownEditor = ({ 
  value = "", 
  onChange,
  className 
}) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const [previewContent, setPreviewContent] = useState(value);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          markdown(),
          history(),
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...searchKeymap,
            ...completionKeymap,
            { key: "Mod-f", run: search },
            { key: "Mod-g", run: findNext },
            { key: "Mod-Shift-g", run: findPrevious }
          ]),
          autocompletion(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setPreviewContent(newContent);
              onChange?.(newContent);
            }
          }),
          EditorView.theme({
            "&": {
              height: "400px",
              fontSize: "14px",
              fontFamily: "monospace"
            },
            ".cm-content": {
              fontFamily: "monospace",
              padding: "10px 0"
            },
            ".cm-line": {
              padding: "0 10px"
            },
            ".cm-activeLine": {
              backgroundColor: "#f0f0f0"
            },
            ".cm-cursor": {
              borderLeft: "2px solid #1890ff"
            },
            ".cm-selectionBackground": {
              backgroundColor: "#e6f7ff"
            },
            ".cm-gutters": {
              backgroundColor: "#fafafa",
              borderRight: "1px solid #f0f0f0",
              color: "#999"
            },
            ".cm-tooltip": {
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            },
            ".cm-tooltip-autocomplete": {
              "& > ul": {
                fontFamily: "monospace",
                maxHeight: "200px",
                overflowY: "auto"
              },
              "& > ul > li": {
                padding: "4px 8px",
                cursor: "pointer"
              },
              "& > ul > li[aria-selected]": {
                backgroundColor: "#e6f7ff",
                color: "#1890ff"
              }
            }
          })
        ]
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current
      });
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  const insertText = (before, after = '') => {
    if (!viewRef.current) return;
    const { state, dispatch } = viewRef.current;
    const { selection } = state;
    const text = state.doc.toString();
    const selectedText = text.slice(selection.main.from, selection.main.to);
    const newText = text.slice(0, selection.main.from) + before + selectedText + after + text.slice(selection.main.to);
    
    dispatch({
      changes: {
        from: 0,
        to: text.length,
        insert: newText
      },
      selection: {
        anchor: selection.main.from + before.length,
        head: selection.main.from + before.length + selectedText.length
      }
    });
  };

  const insertHeading = (level) => {
    insertText('#'.repeat(level) + ' ');
  };

  const insertList = (ordered = false) => {
    if (!viewRef.current) return;
    const { state, dispatch } = viewRef.current;
    const { selection } = state;
    const text = state.doc.toString();
    const selectedText = text.slice(selection.main.from, selection.main.to);
    const lines = selectedText.split('\n');
    const newLines = lines.map((line, index) => {
      if (ordered) {
        return `${index + 1}. ${line}`;
      }
      return `- ${line}`;
    });
    const newText = text.slice(0, selection.main.from) + newLines.join('\n') + text.slice(selection.main.to);
    
    dispatch({
      changes: {
        from: 0,
        to: text.length,
        insert: newText
      }
    });
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:', 'https://');
    if (url) {
      insertText('[', `](${url})`);
    }
  };

  const insertCode = () => {
    insertText('```\n', '\n```');
  };

  const insertTable = () => {
    const table = `| Tiêu đề 1 | Tiêu đề 2 | Tiêu đề 3 |
|------------|------------|------------|
| Nội dung 1 | Nội dung 2 | Nội dung 3 |
| Nội dung 4 | Nội dung 5 | Nội dung 6 |`;
    insertText(table);
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <Space>
            <Tooltip title="Tiêu đề 1">
              <Button type="text" onClick={() => insertHeading(1)}>H1</Button>
            </Tooltip>
            <Tooltip title="Tiêu đề 2">
              <Button type="text" onClick={() => insertHeading(2)}>H2</Button>
            </Tooltip>
            <Tooltip title="Tiêu đề 3">
              <Button type="text" onClick={() => insertHeading(3)}>H3</Button>
            </Tooltip>
            <Tooltip title="In đậm">
              <Button type="text" icon={<BoldOutlined />} onClick={() => insertText('**', '**')} />
            </Tooltip>
            <Tooltip title="In nghiêng">
              <Button type="text" icon={<ItalicOutlined />} onClick={() => insertText('*', '*')} />
            </Tooltip>
            <Tooltip title="Gạch chân">
              <Button type="text" icon={<UnderlineOutlined />} onClick={() => insertText('__', '__')} />
            </Tooltip>
            <Tooltip title="Danh sách có thứ tự">
              <Button type="text" icon={<OrderedListOutlined />} onClick={() => insertList(true)} />
            </Tooltip>
            <Tooltip title="Danh sách không thứ tự">
              <Button type="text" icon={<UnorderedListOutlined />} onClick={() => insertList(false)} />
            </Tooltip>
            <Tooltip title="Chèn liên kết">
              <Button type="text" icon={<LinkOutlined />} onClick={insertLink} />
            </Tooltip>
            <Tooltip title="Chèn mã code">
              <Button type="text" icon={<CodeOutlined />} onClick={insertCode} />
            </Tooltip>
            <Tooltip title="Chèn bảng">
              <Button type="text" icon={<TableOutlined />} onClick={insertTable} />
            </Tooltip>
          </Space>
        </div>
        <div ref={editorRef} className={styles.editor} />
      </div>
      <div className={styles.preview}>
        <h3>Xem trước</h3>
        <div className={styles.previewContent}>
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor; 