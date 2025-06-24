import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message, Progress, Button, Card, Typography, Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import Layout from '../../../../components/layout/Layout';
import PageHeader from '../../../../components/pageHeader/PageHeader';
import styles from './TestDetail.module.css';
import { fetchExercisesByLessonId, submitExerciseResults } from '../../../../slices/exerciseSlice';
import { fetchLessonById, studyLesson } from '../../../../slices/lessonSlice';
import QuestionCard from '../../../../components/questionCard/QuestionCard';
import CustomSpinner from '../../../../components/spinner/Spinner';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const { Title, Text } = Typography;
const { confirm } = Modal;

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { exercises, loading: exercisesLoading, error } = useSelector((state) => state.exercises);
  const { currentLesson, loading: lessonLoading } = useSelector((state) => state.lessons);

  useEffect(() => {
    dispatch(fetchExercisesByLessonId(id));
    dispatch(fetchLessonById(id));
  }, [dispatch, id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !isTestStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTestStarted]);

  const handleStartTest = async () => {
    try {
      const lesson_id = parseInt(id);
      const status_id = 3; // Trạng thái đang làm bài kiểm tra

      await dispatch(studyLesson({ lesson_id, status_id, user_id: user.id })).unwrap();
      const exerciseData = await dispatch(fetchExercisesByLessonId(id)).unwrap();

      const initAnswers = exerciseData.map((q) => ({
        exercise_id: q.id,
        user_answer: '',
        status_id: 3
      }));

      await dispatch(submitExerciseResults({
        results: initAnswers,
        userId: user.id
      })).unwrap();

      setIsTestStarted(true);
      if (currentLesson?.duration) {
        setTimeLeft(currentLesson.duration * 60);
      }
      message.success('Bắt đầu bài kiểm tra!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi bắt đầu bài kiểm tra');
      console.error('Error starting test:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const performSubmit = async (isAutoSubmit = false) => {
    try {
      const results = exercises.map((q) => ({
        exercise_id: q.id,
        user_answer: userAnswers[q.id] || '',
        status_id: 5 // Hoàn thành
      }));

      dispatch(submitExerciseResults({
        results,
        userId: user.id
      })).unwrap();

      setShowResults(true);
      setIsTestStarted(false);
      setTimeLeft(null);
      if (isAutoSubmit) {
        message.success('Hết giờ! Bài kiểm tra đã được nộp tự động.');
      } else {
        message.success('Nộp bài thành công!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi nộp bài');
      console.error('Error submitting test:', error);
    }
  };

  const handleManualSubmit = () => {
    confirm({
      title: 'Xác nhận nộp bài',
      content: 'Bạn có chắc chắn muốn nộp bài kiểm tra? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.',
      okText: 'Nộp bài',
      cancelText: 'Hủy',
      onOk: () => performSubmit(false)
    });
  };
  
  const handleAutoSubmit = () => {
    performSubmit(true);
  };

  const calculateScore = () => {
    let correct = 0;
    exercises.forEach((q) => {
      const userAnswer = userAnswers[q.id];
      const correctAnswer = q.correct_answer;
      if (q.type === 'multiple_choice') {
        if (userAnswer === correctAnswer) correct++;
      } else if (q.type === 'fill_in') {
        if (userAnswer?.toLowerCase() === correctAnswer?.toLowerCase()) correct++;
      }
    });
    return ((correct / exercises.length) * 100).toFixed(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreadcrumbItems = () => [
    { title: 'Trang chủ', path: '/user/dashboard' },
    { title: 'Bài kiểm tra', path: '/user/tests' },
    { title: currentLesson?.title || 'Chi tiết', path: `/user/tests/${id}` }
  ];

  if (exercisesLoading || lessonLoading) {
    return (
      <Layout role="user">
        <div className={styles.spinnerContainer}>
          <CustomSpinner spinning={true} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="user">
        <div className={styles.error}>{error}</div>
      </Layout>
    );
  }

  if (!currentLesson) {
    return (
      <Layout role="user">
        <div className={styles.error}>Không tìm thấy bài kiểm tra.</div>
      </Layout>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = exercises.filter((q) => {
      const userAnswer = userAnswers[q.id];
      const correctAnswer = q.correct_answer;
      if (q.type === 'multiple_choice') {
        return userAnswer === correctAnswer;
      } else if (q.type === 'fill_in') {
        return userAnswer?.toLowerCase() === correctAnswer?.toLowerCase();
      }
      return false;
    }).length;

    return (
      <>
        <PageTitle title={`Kết quả: ${currentLesson.title}`} />
        <Layout role="user">
          <PageHeader 
            title={`Kết quả: ${currentLesson.title}`}
            breadcrumb={getBreadcrumbItems()}
          />
          <div className={styles.resultsContainer}>
            <Title level={2} className={styles.resultsTitle}>Kết quả bài kiểm tra</Title>
            <div className={styles.score}>Điểm số: {score}%</div>

            <div className={styles.actions}>
              <Button
                className={styles.actionButton}
                onClick={() => navigate('/user/tests')}
              >
                Quay lại danh sách
              </Button>
              <Button
                className={styles.actionButton}
                onClick={() => setShowDetail((prev) => !prev)}
              >
                {showDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
              </Button>
              <Button
                className={styles.actionButton}
                onClick={() => {
                  setShowResults(false);
                  setUserAnswers({});
                  setShowDetail(false);
                  if (currentLesson?.duration) {
                    setTimeLeft(currentLesson.duration * 60);
                  }
                  setIsTestStarted(true);
                }}
              >
                Làm lại
              </Button>
            </div>

            {showDetail && (
              <Card className={styles.detailCard}>
                <Title level={4} className={styles.detailTitle}>Chi tiết kết quả</Title>
                <ul>
                  {exercises.map((q, idx) => (
                    <li key={q.id} className={styles.detailItem}>
                      <div><b>Câu {idx + 1}:</b> {q.content}</div>
                      {q.type === 'multiple_choice' && q.options && (
                        <ul className={styles.detailOptions}>
                          {q.options.map(opt => (
                            <li
                              key={opt.id}
                              className={
                                opt.id === q.correct_answer
                                  ? styles.correctAnswer
                                  : opt.id === userAnswers[q.id]
                                  ? styles.wrongAnswer
                                  : ''
                              }
                            >
                              {opt.text}
                              {opt.id === q.correct_answer && ' (Đáp án đúng)'}
                              {opt.id === userAnswers[q.id] && opt.id !== q.correct_answer && ' (Bạn chọn)'}
                            </li>
                          ))}
                        </ul>
                      )}
                      {q.type === 'fill_in' && (
                        <div className={styles.detailFillIn}>
                          <div>
                            Đáp án đúng: <b>{q.correct_answer}</b>
                          </div>
                          <div>
                            Câu trả lời của bạn: <span className={
                              userAnswers[q.id]?.toLowerCase() === q.correct_answer?.toLowerCase() 
                              ? styles.correctAnswerText 
                              : styles.wrongAnswerText
                            }>
                              {userAnswers[q.id] || <i>Chưa trả lời</i>}
                            </span>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </Layout>
      </>
    );
  }

  if (isTestStarted) {
    return (
      <>
        <PageTitle title={currentLesson.title} />
        <Layout role="user">
          <PageHeader
            title={`Làm bài kiểm tra: ${currentLesson.title}`}
            breadcrumb={getBreadcrumbItems()}
          />
          <div className={styles.container}>
            <div className={styles.testHeader}>
              <Progress
                percent={((currentLesson.duration * 60 - timeLeft) / (currentLesson.duration * 60)) * 100}
                showInfo={false}
                strokeColor="#58cc02"
              />
              {timeLeft !== null && (
                <div className={styles.timer}>
                  <ClockCircleOutlined /> {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <div className={styles.questionList}>
              {exercises.map((question, index) => (
                <Card key={question.id} className={styles.questionListItem}>
                  <Title level={5}>Câu {index + 1}</Title>
                  <QuestionCard
                    question={question}
                    userAnswer={userAnswers[question.id]}
                    onSelect={handleAnswerChange}
                    onInput={handleAnswerChange}
                  />
                </Card>
              ))}
            </div>

            <div className={styles.navigation}>
              <Button
                type="primary"
                size="large"
                onClick={handleManualSubmit}
              >
                Nộp bài
              </Button>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  // Giao diện bắt đầu bài kiểm tra
  return (
    <>
      <PageTitle title={currentLesson.title} />
      <Layout role="user">
        <PageHeader
          title={currentLesson.title}
          breadcrumb={getBreadcrumbItems()}
        />
        <div className={styles.container}>
          <Card className={styles.startCard}>
            <div className={styles.testInfo}>
              <Title level={2}>{currentLesson.title}</Title>
              <p className={styles.description}>{currentLesson.description}</p>
              
              <div className={styles.testDetails}>
                <div className={styles.detailItem}>
                  <Text strong>Số câu hỏi:</Text> {exercises.length}
                </div>
                {currentLesson.duration && (
                  <div className={styles.detailItem}>
                    <Text strong>Thời gian:</Text> {currentLesson.duration} phút
                  </div>
                )}
                <div className={styles.detailItem}>
                  <Text strong>Loại câu hỏi:</Text> Trắc nghiệm & Điền từ
                </div>
              </div>

              <div className={styles.instructions}>
                <Title level={4}>Hướng dẫn:</Title>
                <ul>
                  <li>Đọc kỹ câu hỏi trước khi trả lời</li>
                  <li>Bạn có thể quay lại sửa câu trả lời trước khi nộp bài</li>
                  <li>Nộp bài khi đã hoàn thành tất cả câu hỏi</li>
                  {currentLesson.duration && (
                    <li>Bài kiểm tra sẽ tự động nộp khi hết thời gian</li>
                  )}
                </ul>
              </div>
            </div>

            <div className={styles.startActions}>
              <Button type="primary" size="large" onClick={handleStartTest} className={styles.startTestButton}>Bắt đầu kiểm tra</Button>
              <Button size="large" onClick={() => navigate('/user/tests')}>Quay lại</Button>
            </div>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default TestDetail; 