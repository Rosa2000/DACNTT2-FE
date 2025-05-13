import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from "../../../../components/layout/Layout";
import Card from "../../../../components/card/Card";
import styles from './Categories.module.css';
import { fetchLessons } from '../../../../slices/lessonSlice';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const levelCategories = [
    {
      id: 'beginner',
      title: 'Cơ bản',
      description: 'Bắt đầu với những bài ngữ pháp cơ bản, phù hợp cho người mới bắt đầu',
      level: 1,
      levelText: 'Beginner'
    },
    {
      id: 'intermediate',
      title: 'Trung bình',
      description: 'Nâng cao kỹ năng với các bài học phức tạp hơn',
      level: 2,
      levelText: 'Intermediate'
    },
    {
      id: 'advanced',
      title: 'Nâng cao',
      description: 'Chinh phục các bài học ngữ pháp nâng cao',
      level: 3,
      levelText: 'Advanced'
    }
  ];

  const tenseCategories = [
    {
      id: 'present',
      title: 'Thì hiện tại',
      description: 'Học về các thì hiện tại trong tiếng Anh',
      category: 'Thì hiện tại'
    },
    {
      id: 'past',
      title: 'Thì quá khứ',
      description: 'Học về các thì quá khứ trong tiếng Anh',
      category: 'Thì quá khứ'
    },
    {
      id: 'future',
      title: 'Thì tương lai',
      description: 'Học về các thì tương lai trong tiếng Anh',
      category: 'Thì tương lai'
    }
  ];

  const handleLevelClick = (level) => {
    dispatch(fetchLessons({ level }));
    navigate(`/user/lessons/level/${level}`);
  };

  const handleCategoryClick = (category) => {
    dispatch(fetchLessons({ category }));
    navigate(`/user/lessons/category/${category}`);
  };

  return (
    <Layout pageHeaderTitle="Danh sách bài học" pageHeaderSubtitle="Hãy chọn một bài học để bắt đầu hành trình học tập của bạn.">
      <div className={styles.container}>
        <section className={styles.section}>
          <h2>Học theo cấp độ</h2>
          <div className={styles.cardGrid}>
            {levelCategories.map((category) => (
              <Card
                key={category.id}
                subtitle={category.levelText}
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