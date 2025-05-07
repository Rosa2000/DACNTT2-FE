import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../../../../components/layout/Layout";
import styles from './LessonDetail.module.css';

const LessonDetail = () => {
  const { id } = useParams();

  // Mock data - In real app, this would come from an API
  const lessonData = {
    'present-simple': {
      title: 'Hiện tại đơn',
      subtitle: 'Present Simple',
      description: 'Thì hiện tại đơn được sử dụng để diễn tả thói quen, sự thật hiển nhiên và các hành động lặp đi lặp lại.',
      content: [
        {
          type: 'section',
          title: 'Cấu trúc',
          content: [
            'Khẳng định: S + V(s/es)',
            'Phủ định: S + do/does + not + V',
            'Nghi vấn: Do/Does + S + V?'
          ]
        },
        {
          type: 'section',
          title: 'Cách sử dụng',
          content: [
            'Diễn tả thói quen hàng ngày',
            'Diễn tả sự thật hiển nhiên',
            'Diễn tả lịch trình, thời khóa biểu',
            'Diễn tả suy nghĩ và cảm xúc ở hiện tại'
          ]
        },
        {
          type: 'section',
          title: 'Dấu hiệu nhận biết',
          content: [
            'always, usually, often, sometimes, rarely, never',
            'every day/week/month/year',
            'once/twice/three times a day/week/month'
          ]
        },
        {
          type: 'example',
          title: 'Ví dụ',
          content: [
            'I always go to school by bus.',
            'The sun rises in the east.',
            'The train leaves at 8 AM every day.',
            'I think English is interesting.'
          ]
        }
      ]
    }
  };

  const lesson = lessonData[id] || {
    title: 'Bài học không tồn tại',
    subtitle: 'Not Found',
    description: 'Xin lỗi, bài học này không tồn tại hoặc đã bị xóa.',
    content: []
  };

  return (
    <Layout role="user">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{lesson.title}</h1>
          <p className={styles.subtitle}>{lesson.subtitle}</p>
          <p className={styles.description}>{lesson.description}</p>
        </div>

        <div className={styles.content}>
          {lesson.content.map((section, index) => (
            <div key={index} className={styles.section}>
              <h2>{section.title}</h2>
              {section.type === 'section' ? (
                <ul className={styles.list}>
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className={styles.examples}>
                  {section.content.map((example, i) => (
                    <div key={i} className={styles.example}>
                      {example}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.button}>Bắt đầu bài tập</button>
          <button className={`${styles.button} ${styles.outlined}`}>Quay lại</button>
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetail;
