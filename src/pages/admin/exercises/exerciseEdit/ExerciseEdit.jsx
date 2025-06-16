import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, Space, Radio } from 'antd';
import Layout from '../../../../components/layout/Layout';
import styles from './ExerciseEdit.module.css';
import { fetchExerciseById, clearCurrentExercise, updateExercise } from '../../../../slices/exerciseSlice';
import { fetchLessonById } from '../../../../slices/lessonSlice';

const { Option } = Select;
const { TextArea } = Input;

const ExerciseEdit = () => {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { currentExercise, loading, error } = useSelector((state) => state.exercises);
  const currentLesson = useSelector(state => state.lessons.currentLesson);

  const [exerciseType, setExerciseType] = useState('multiple_choice');
  const [options, setOptions] = useState([{ id: '1', text: '' }]);
  const [correctAnswer, setCorrectAnswer] = useState(undefined);

  const optionInputRefs = useRef([]);
  const prevOptionsLengthRef = useRef(options.length);

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(lessonId));
    }
    dispatch(fetchExerciseById(id));
    return () => {
      dispatch(clearCurrentExercise());
    };
  }, [dispatch, id, lessonId]);

  useEffect(() => {
    if (currentExercise) {
      form.setFieldsValue({
        title: currentExercise.title,
        description: currentExercise.description,
        type: currentExercise.type,
        duration: currentExercise.duration,
        content: currentExercise.content,
        correct_answer: currentExercise.type === 'fill_in' ? currentExercise.correct_answer : undefined,
      });
      setExerciseType(currentExercise.type);
      
      if (currentExercise.type === 'multiple_choice') {
        setOptions(currentExercise.options || [{ id: '1', text: '' }]);
      }
      setCorrectAnswer(currentExercise.correct_answer);
      console.log('currentExercise:', currentExercise.correct_answer);
    }
  }, [currentExercise, form]);

  useEffect(() => {
    optionInputRefs.current = optionInputRefs.current.slice(0, options.length);
    if (options.length > prevOptionsLengthRef.current) {
      const lastInputEl = optionInputRefs.current[options.length - 1];
      if (lastInputEl) {
        requestAnimationFrame(() => {
          lastInputEl.focus({ preventScroll: true });
        });
      }
    }
    prevOptionsLengthRef.current = options.length;
  }, [options]);

  useEffect(() => {
    form.resetFields();
    setOptions([{ id: '1', text: '' }]);
    setCorrectAnswer(undefined);
  }, [id]);

  const handleSubmit = async (values) => {
    const exerciseData = {
      ...values,
      status_id: 1,
      lesson_id: lessonId,
    };

    if (exerciseType === 'multiple_choice') {
      if (!options.every(opt => opt.text.trim() !== '') || options.length < 2) {
        message.error('Vui lòng nhập ít nhất 2 lựa chọn và không để trống.');
        return;
      }
      if (correctAnswer === undefined) {
        message.error('Vui lòng chọn đáp án đúng.');
        return;
      }
      exerciseData.options = options;
      exerciseData.correct_answer = correctAnswer;
    }

    try {
      console.log('exerciseData:', exerciseData);
      const resultAction = await dispatch(updateExercise({ id, data: exerciseData }));
      console.log('resultAction:', resultAction);
      if (updateExercise.fulfilled.match(resultAction)) {
        message.success('Cập nhật bài tập thành công!');
        navigate(`/admin/exercises/lesson/${lessonId}`);
      } else {
        message.error(resultAction.payload || 'Có lỗi xảy ra khi cập nhật bài tập!');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi cập nhật bài tập!');
    }
  };

  const handleAddOption = () => {
    setOptions(prev => [...prev, { id: String(prev.length + 1), text: '' }]);
  };

  const handleRemoveOption = (id) => {
    if (options.length <= 1) {
      message.warn('Phải có ít nhất một lựa chọn.');
      return;
    }
    const newOptions = options.filter(o => o.id !== id).map((opt, idx) => ({ ...opt, id: String(idx + 1) }));
    setOptions(newOptions);
    if (correctAnswer === id) setCorrectAnswer(undefined);
  };

  const handleOptionTextChange = (id, value) => {
    setOptions(options.map(o => o.id === id ? { ...o, text: value } : o));
  };

  return (
    <Layout role="admin" pageHeaderTitle={`Chỉnh sửa bài tập - ${currentLesson?.title || 'Bài học'}`}>
      <div className={styles.container}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          {error && <div className={styles.errorText}>{error}</div>}

          <Form.Item
            name="title" 
            label="Tiêu đề bài tập" 
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          > 
            <Input placeholder="Nhập tiêu đề bài tập" onChange={e => form.setFieldValue('title', e.target.value)}/>
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Mô tả"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập mô tả (không bắt buộc)" 
              onChange={e => form.setFieldValue('description', e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            name="type"
            label="Loại bài tập" 
            rules={[{ required: true, message: 'Vui lòng chọn loại bài tập!' }]}
          >
            <Select onChange={value => {
              setExerciseType(value);
              form.setFieldValue('type', value);
            }}>
              <Option value="multiple_choice">Trắc nghiệm</Option>
              <Option value="fill_in">Điền từ</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="content"
            label="Nội dung bài tập (Câu hỏi)" 
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài tập!' }]}
          >
            <TextArea rows={3} placeholder="Nhập nội dung bài tập..." onChange={e => form.setFieldValue('content', e.target.value)}/>    
          </Form.Item>

          {exerciseType === 'multiple_choice' && (
            <Form.Item label="Các lựa chọn & Đáp án đúng" required>
              {options.map((option, index) => (
                <Space key={option.id} className={styles.optionItem} align="baseline">
                  <Radio value={option.id} checked={correctAnswer === option.id} onChange={e => setCorrectAnswer(e.target.value)} />
                  <Input placeholder={`Lựa chọn ${index + 1}`} value={option.text} onChange={e => handleOptionTextChange(option.id, e.target.value)} className={styles.optionInput} ref={el => optionInputRefs.current[index] = el} />
                  {options.length > 1 && <Button type="link" danger onClick={() => handleRemoveOption(option.id)}>Xóa</Button>}
                </Space>
              ))}
              <Button type="dashed" onClick={handleAddOption} style={{ marginTop: '10px' }}>Thêm lựa chọn</Button>
            </Form.Item>
          )}

          {exerciseType === 'fill_in' && (
            <Form.Item name="correct_answer" label="Đáp án đúng (Điền từ)" rules={[{ required: true, message: 'Vui lòng nhập đáp án đúng!' }]}> 
              <Input 
                placeholder="Nhập đáp án cho câu hỏi điền từ" 
                value={form.getFieldValue('correct_answer')}
                onChange={e => {
                  form.setFieldValue('correct_answer', e.target.value);
                  setCorrectAnswer(e.target.value);
                }}
              /> 
            </Form.Item>
          )}

          <Form.Item name="duration" label="Thời gian làm bài (ví dụ: 30 minutes, 1 hour)"> 
            <Input placeholder="Không bắt buộc" />
          </Form.Item>

          <Space className={styles.formActions}>
            <Button onClick={() => navigate(`/admin/exercises/lesson/${lessonId}`)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Cập nhật bài tập</Button>
          </Space>
        </Form>
      </div>
    </Layout>
  );
};

export default ExerciseEdit;
