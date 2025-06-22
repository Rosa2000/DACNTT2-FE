import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import Layout from "../../../../components/layout/Layout";
import PageHeader from "../../../../components/pageHeader/PageHeader";
import styles from './ExerciseDetail.module.css';
import { fetchExercisesByLessonId, submitExerciseResults } from '../../../../slices/exerciseSlice';
import { fetchLessonById , clearCurrentLesson } from '../../../../slices/lessonSlice';
import QuestionCard from '../../../../components/questionCard/QuestionCard';
import CustomSpinner from '../../../../components/spinner/Spinner';

const ExerciseDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { exercises, loading: exercisesLoading, error } = useSelector((state) => state.exercises);
  const { currentLesson, loading: lessonLoading } = useSelector((state) => state.lessons);

  useEffect(() => {
    dispatch(fetchExercisesByLessonId(lessonId));
    if (!currentLesson || String(currentLesson.id) !== String(lessonId)) {
      dispatch(fetchLessonById(lessonId));
    }
  }, [dispatch, lessonId, currentLesson]);

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
    if (currentQuestionIndex === exercises.length - 1) {
      try {
        const results = Object.entries(userAnswers).map(([exerciseId, answer]) => ({
          exercise_id: Number(exerciseId),
          user_answer: answer,
          status_id: 5
        }));

        await dispatch(submitExerciseResults({ results, userId: user.id })).unwrap();

        message.success("Đã nộp bài thành công!");
        setShowResults(true);
      } catch (err) {
        message.error("Không thể nộp bài. Vui lòng thử lại.");
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
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

  if (exercisesLoading || lessonLoading) {
    return (
      <Layout role="user">
        <div className={styles.spinnerContainer}>
          <CustomSpinner spinning={true} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="user">
      <PageHeader 
        title={currentLesson ? `Bài tập: ${currentLesson.title}` : 'Bài tập'}
        breadcrumb={getBreadcrumbItems()}
      />
      <div className={styles.container}>
        {!error && exercises.length === 0 && (
          <div className={styles.error}>Không có dữ liệu bài tập cho bài học này.</div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {exercises.length > 0 && !showResults && (
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
              {currentQuestionIndex === 0 ? (
                <button
                  className={styles.secondaryButton}
                  onClick={() => navigate(`/user/lessons/${lessonId}`)}
                >
                  Quay lại bài học
                </button>
              ) : (
                <button
                  className={styles.secondaryButton}
                  onClick={handlePreviousQuestion}
                >
                  Câu trước
                </button>
              )}
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
                      {q.type === 'multiple_choice' && q.options && (
                        <ul style={{margin: '8px 0 8px 16px'}}>
                          {q.options.map(opt => (
                            <li
                              key={opt.id}
                              style={{
                                fontWeight: opt.id === q.correct_answer ? 'bold' : 'normal',
                                color:
                                  opt.id === q.correct_answer
                                    ? '#58cc02'
                                    : opt.id === userAnswers[q.id]
                                    ? '#f44336'
                                    : 'inherit'
                              }}
                            >
                              {opt.text}
                              {opt.id === q.correct_answer && ' (Đáp án đúng)'}
                              {opt.id === userAnswers[q.id] && opt.id !== q.correct_answer && ' (Bạn chọn)'}
                            </li>
                          ))}
                        </ul>
                      )}
                      {q.type !== 'multiple_choice' && (
                        <>
                          <div>
                            Đáp án đúng: <b>{q.correct_answer}</b>
                          </div>
                          <div>
                            Đáp án của bạn: <span style={{
                              color: userAnswers[q.id]?.toLowerCase() === q.correct_answer?.toLowerCase() ? '#58cc02' : '#f44336'
                            }}>
                              {userAnswers[q.id] || <i>Chưa trả lời</i>}
                            </span>
                          </div>
                        </>
                      )}
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
