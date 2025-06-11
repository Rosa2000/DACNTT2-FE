import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from "../../../../components/layout/Layout";
import PageHeader from "../../../../components/pageHeader/PageHeader";
import styles from './ExerciseDetail.module.css';
import { fetchExercisesByLessonId, submitExerciseResults } from '../../../../slices/exerciseSlice';
import { fetchLessonById } from '../../../../slices/lessonSlice';
import QuestionCard from '../../../../components/questionCard/QuestionCard';
import { doExercise } from '../../../../api/exerciseApi';

const ExerciseDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const { exercises, loading, error } = useSelector((state) => state.exercises);
  const { currentLesson } = useSelector((state) => state.lessons);

  useEffect(() => {
    dispatch(fetchExercisesByLessonId(lessonId));
    dispatch(fetchLessonById(lessonId));
  }, [dispatch, lessonId]);

  const getBreadcrumbItems = () => {
    if (!currentLesson) return [];
    const items = [{ title: 'Trang chủ', path: '/user' }];
    if (currentLesson.level) {
      const levelMap = { 1: 'Cơ bản', 2: 'Trung bình', 3: 'Nâng cao' };
      items.push({ title: levelMap[currentLesson.level], path: `/user/lessons/level/${currentLesson.level}` });
    } else if (currentLesson.category) {
      items.push({ title: currentLesson.category, path: `/user/lessons/category/${currentLesson.category}` });
    }
    items.push({ title: currentLesson.title, path: `/user/lessons/${lessonId}` });
    items.push({ title: 'Bài tập', path: '#' });
    return items;
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleAnswerInput = (questionId, text) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: text.trim() }));
  };

  const handleNextQuestion = async () => {
    const currentQuestion = exercises[currentQuestionIndex];
    const userId = localStorage.getItem('userId');
    const userAnswer = userAnswers[currentQuestion.id] || '';

    // Gửi request cập nhật câu trả lời cho câu hiện tại
    try {
      await doExercise([{
        exercise_id: currentQuestion.id,
        user_answer: userAnswer,
        status_id: 5
      }], userId);
    } catch (err) {
      console.error('Lỗi khi cập nhật câu trả lời:', err);
      // Có thể hiện toast hoặc thông báo lỗi ở đây nếu muốn
    }

    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Gửi toàn bộ kết quả nếu muốn, hoặc chỉ hiện kết quả
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
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

  return (
    <Layout role="user">
      <PageHeader 
        title={currentLesson ? `Bài tập: ${currentLesson.title}` : 'Bài tập'}
        breadcrumb={getBreadcrumbItems()}
      />
      <div className={styles.container}>
        {loading && <div className={styles.loading}>Đang tải...</div>}
        {!loading && error && <div className={styles.error}>{error}</div>}
        {!loading && exercises.length === 0 && !error && (
          <div className={styles.error}>Không có dữ liệu bài tập cho bài học này.</div>
        )}
        {!loading && exercises.length > 0 && !showResults && (
          <div className={styles.questionContainer}>
            <div className={styles.progress}>
              Câu hỏi {currentQuestionIndex + 1}/{exercises.length}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }}
                />
              </div>
            </div>
            <QuestionCard
              question={exercises[currentQuestionIndex]}
              userAnswer={userAnswers[exercises[currentQuestionIndex].id]}
              onSelect={handleAnswerSelect}
              onInput={handleAnswerInput}
            />
            <div className={styles.navigation}>
              <button
                className={styles.secondaryButton}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Câu trước
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={
                  userAnswers[exercises[currentQuestionIndex]?.id] === undefined ||
                  userAnswers[exercises[currentQuestionIndex]?.id] === ''
                }
              >
                {currentQuestionIndex === exercises.length - 1 ? 'Kết thúc' : 'Câu tiếp'}
              </button>
            </div>
          </div>
        )}
        {showResults && (
          <div className={styles.results}>
            <h2>Kết quả bài tập</h2>
            <div className={styles.score}>Điểm số: {calculateScore()}%</div>
            <div className={styles.actions}>
              <button onClick={() => navigate(`/user/lessons/${lessonId}`)}>Quay lại bài học</button>
              <button onClick={() => setShowDetail((prev) => !prev)}>
                {showDetail ? 'Ẩn chi tiết kết quả' : 'Xem chi tiết kết quả'}
              </button>
              <button onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setShowDetail(false);
              }}>Làm lại</button>
              
            </div>
            {showDetail && (
              <div className={styles.detailResult}>
                <h3>Chi tiết kết quả</h3>
                <ul>
                  {exercises.map((q, idx) => (
                    <li key={q.id} style={{marginBottom: 16}}>
                      <div><b>Câu {idx + 1}:</b> {q.content}</div>
                      <div>Đáp án đúng: <b>{q.type === 'multiple_choice' ? (q.options?.find(opt => opt.id === q.correct_answer)?.text || q.correct_answer) : q.correct_answer}</b></div>
                      <div>Đáp án của bạn: <span style={{color: userAnswers[q.id]?.toLowerCase() === q.correct_answer?.toLowerCase() ? '#2196f3' : '#f44336'}}>
                        {q.type === 'multiple_choice' ? (q.options?.find(opt => opt.id === userAnswers[q.id])?.text || userAnswers[q.id] || <i>Chưa trả lời</i>) : (userAnswers[q.id] || <i>Chưa trả lời</i>)}
                      </span></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExerciseDetail;
