import React from 'react';
import styles from './QuestionCard.module.css';

const QuestionCard = ({ question, userAnswer, onSelect, onInput }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.question}>{question.content}</h3>

      {question.type === 'multiple_choice' && Array.isArray(question.options) && (
        <div className={styles.options}>
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${userAnswer === option.id ? styles.selected : ''}`}
              onClick={() => onSelect(question.id, option.id)}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}

      {question.type === 'fill_in' && (
        <div className={styles.fillIn}>
          <input
            type="text"
            className={styles.input}
            placeholder="Nhập câu trả lời của bạn"
            value={userAnswer || ''}
            onChange={(e) => onInput(question.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
