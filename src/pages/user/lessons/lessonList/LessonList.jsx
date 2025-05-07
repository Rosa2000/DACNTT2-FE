import React from 'react';
import Layout from "../../../../components/layout/Layout";
import LessonHorizontalCard from "../../../../components/lessonHorizontalCard/LessonHorizontalCard";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import styles from './LessonList.module.css';

const lessons = [
  {
    id: 1,
    title: 'Thì hiện tại đơn',
    level: 'Dễ',
    type: 'Ngữ pháp cơ bản',
    score: 10,
    description: 'Học về cấu trúc, cách dùng và dấu hiệu nhận biết của thì hiện tại đơn trong tiếng Anh.'
  },
  {
    id: 3,
    title: 'Thì tương lai đơn',
    level: 'Dễ',
    type: 'Ngữ pháp cơ bản',
    score: 10,
    description: 'Giới thiệu về thì tương lai đơn, cấu trúc và ví dụ minh họa.'
  },
  {
    id: 2,
    title: 'Thì quá khứ đơn',
    level: 'Trung bình',
    type: 'Ngữ pháp cơ bản',
    score: 10,
    description: 'Tìm hiểu về thì quá khứ đơn, cách chia động từ và các trường hợp sử dụng.'
  },
  {
    id: 4,
    title: 'So sánh hơn',
    level: 'Nâng cao',
    type: 'So sánh',
    score: 15,
    description: 'Cách sử dụng so sánh hơn trong tiếng Anh, các trường hợp đặc biệt.'
  },
  {
    id: 5,
    title: 'Câu điều kiện loại 1',
    level: 'Trung bình',
    type: 'Câu điều kiện',
    score: 20,
    description: 'Hướng dẫn chi tiết về câu điều kiện loại 1, cấu trúc và ví dụ.'
  }
];

const LessonList = () => {
  return (
    <Layout role="user">
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <Breadcrumb items={[
            { label: 'Học tập', to: '/study' },
            { label: 'Ngữ pháp' }
          ]} />
          <h1 className={styles.heading}>Ngữ pháp</h1>
          {lessons.map(lesson => (
            <LessonHorizontalCard
              key={lesson.id}
              title={lesson.title}
              level={lesson.level}
              type={lesson.type}
              score={lesson.score}
              description={lesson.description}
              buttonText="Làm bài"
              onButtonClick={() => alert(`Đi tới bài ${lesson.title}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default LessonList;