import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../../../components/layout/Layout";
import Card from "../../../../components/card/Card";
import styles from './Categories.module.css';

const Categories = () => {
  const navigate = useNavigate();

  const levelCategories = [
    {
      id: 'beginner',
      title: 'Cơ bản',
      description: 'Bắt đầu với những bài ngữ pháp cơ bản, phù hợp cho người mới bắt đầu',
      level: 'beginner'
    },
    {
      id: 'intermediate',
      title: 'Trung bình',
      description: 'Nâng cao kỹ năng với các bài học phức tạp hơn',
      level: 'intermediate'
    },
    {
      id: 'advanced',
      title: 'Nâng cao',
      description: 'Chinh phục các bài học ngữ pháp nâng cao',
      level: 'advanced'
    }
  ];

  const tenseCategories = [
    {
      id: 'present',
      title: 'Thì hiện tại',
      description: 'Học về các thì hiện tại trong tiếng Anh',
      category: 'present'
    },
    {
      id: 'past',
      title: 'Thì quá khứ',
      description: 'Học về các thì quá khứ trong tiếng Anh',
      category: 'past'
    },
    {
      id: 'future',
      title: 'Thì tương lai',
      description: 'Học về các thì tương lai trong tiếng Anh',
      category: 'future'
    }
  ];

  const handleLevelClick = (level) => {
    navigate(`/lessons/level/${level}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/lessons/category/${category}`);
  };

  return (
    <Layout role="user">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Danh sách bài học</h1>
          <p>Hãy chọn một bài học để bắt đầu hành trình học tập của bạn.</p>
          
        </div>

        <section className={styles.section}>
          <h2>Học theo cấp độ</h2>
          <div className={styles.cardGrid}>
            {levelCategories.map((category) => (
              <Card
                key={category.id}
                subtitle={category.level}
                title={category.title}
                description={category.description}
                buttonText="Xem bài học"
                onClick={() => handleLevelClick(category.level)}
                outlined={true}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Học theo thì</h2>
          <div className={styles.cardGrid}>
            {tenseCategories.map((category) => (
              <Card
                key={category.id}
                subtitle={category.category}
                title={category.title}
                description={category.description}
                buttonText="Xem bài học"
                onClick={() => handleCategoryClick(category.category)}
                outlined={true}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Categories;