import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message, Progress, Button, Card, Space, Typography, Modal } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Layout from '../../../components/layout/Layout';
import PageHeader from '../../../components/pageHeader/PageHeader';
import styles from './TestDetail.module.css';
import { fetchExercisesByLessonId, submitExerciseResults } from '../../../slices/exerciseSlice';
import { fetchLessonById, studyLesson, clearCurrentLesson } from '../../../slices/lessonSlice';
import QuestionCard from '../../../components/questionCard/QuestionCard';

const { Title, Text } = Typography;
const { confirm } = Modal;

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { exercises, loading, error } = useSelector((state) => state.exercises);
  const { currentLesson } = useSelector((state) => state.lessons);

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
          handleSubmitTest();
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
      const status_id = 5; // Trạng thái đang làm bài kiểm tra

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
      // Set timer nếu có duration
      if (currentLesson?.duration) {
        setTimeLeft(currentLesson.duration * 60); // Convert to seconds
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    confirm({
      title: 'Xác nhận nộp bài',
      content: 'Bạn có chắc chắn muốn nộp bài kiểm tra? Không thể thay đổi sau khi nộp.',
      okText: 'Nộp bài',
      cancelText: 'Tiếp tục làm',
      onOk: async () => {
        try {
          const results = exercises.map((q) => ({
            exercise_id: q.id,
            user_answer: userAnswers[q.id] || '',
            status_id: 4 // Hoàn thành
          }));

          await dispatch(submitExerciseResults({
            results,
            userId: user.id
          })).unwrap();

          setShowResults(true);
          setIsTestStarted(false);
          setTimeLeft(null);
          message.success('Nộp bài thành công!');
        } catch (error) {
          message.error('Có lỗi xảy ra khi nộp bài');
          console.error('Error submitting test:', error);
        }
      }
    });
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

  if (loading) {
    return (
      <Layout role="user">
        <div className={styles.loading}>Đang tải...</div>
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
      <Layout role="user">
        <PageHeader 
          title={`Kết quả: ${currentLesson.title}`}
          breadcrumb={getBreadcrumbItems()}
        />
        <div className={styles.container}>
          <Card className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <Title level={2}>Kết quả bài kiểm tra</Title>
              <div className={styles.scoreDisplay}>
                <div className={styles.scoreCircle}>
                  <span className={styles.scoreNumber}>{score}%</span>
                </div>
                <div className={styles.scoreDetails}>
                  <p>Đúng: {correctAnswers}/{exercises.length} câu</p>
                  <p>Sai: {exercises.length - correctAnswers} câu</p>
                </div>
              </div>
            </div>
            
            <div className={styles.resultActions}>
              <Button 
                type="primary" 
                onClick={() => navigate('/user/tests')}
              >
                Quay lại danh sách
              </Button>
              <Button 
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setUserAnswers({});
                }}
              >
                Xem lại bài làm
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isTestStarted) {
    return (
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
              <Button 
                type="primary" 
                size="large"
                onClick={handleStartTest}
                disabled={exercises.length === 0}
              >
                Bắt đầu kiểm tra
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/user/tests')}
              >
                Quay lại
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentQuestion = exercises[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;

  return (
    <Layout role="user">
      <PageHeader 
        title={`Bài kiểm tra: ${currentLesson.title}`}
        breadcrumb={getBreadcrumbItems()}
      />
      
      <div className={styles.container}>
        {/* Header với timer và progress */}
        <Card className={styles.testHeader}>
          <div className={styles.headerContent}>
            <div className={styles.progressSection}>
              <Text strong>Câu hỏi {currentQuestionIndex + 1}/{exercises.length}</Text>
              <Progress 
                percent={progress} 
                size="small" 
                showInfo={false}
                strokeColor="#58cc02"
              />
            </div>
            
            {timeLeft !== null && (
              <div className={styles.timerSection}>
                <ClockCircleOutlined className={styles.timerIcon} />
                <Text strong className={styles.timerText}>
                  {formatTime(timeLeft)}
                </Text>
              </div>
            )}
          </div>
        </Card>

        {/* Câu hỏi hiện tại */}
        {currentQuestion && (
          <Card className={styles.questionCard}>
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              userAnswer={userAnswers[currentQuestion.id]}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              isTestMode={true}
            />
          </Card>
        )}

        {/* Navigation buttons */}
        <Card className={styles.navigationCard}>
          <div className={styles.navigationButtons}>
            <Space>
              <Button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Câu trước
              </Button>
              
              {currentQuestionIndex < exercises.length - 1 ? (
                <Button 
                  type="primary"
                  onClick={handleNextQuestion}
                >
                  Câu tiếp
                </Button>
              ) : (
                <Button 
                  type="primary"
                  onClick={handleSubmitTest}
                >
                  Nộp bài
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TestDetail; 