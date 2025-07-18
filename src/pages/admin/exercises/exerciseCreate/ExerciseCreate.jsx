// ExerciseCreate.jsx (đã fix cảnh báo circular và validation)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, Space, Radio } from 'antd';
import Layout from '../../../../components/layout/Layout';
import styles from './ExerciseCreate.module.css';
import { createExercise } from '../../../../slices/exerciseSlice';
import { fetchLessonById } from '../../../../slices/lessonSlice';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const { Option } = Select;
const { TextArea } = Input;

const ExerciseCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const loading = useSelector(state => state.exercises.loading);
  const error = useSelector(state => state.exercises.error);
  const currentLesson = useSelector(state => state.lessons.currentLesson);

  const [exerciseType, setExerciseType] = useState('multiple_choice');
  const [options, setOptions] = useState([{ id: '1', text: '' }]);
  const [correctAnswer, setCorrectAnswer] = useState(undefined);

  const optionInputRefs = useRef([]);
  const prevOptionsLengthRef = useRef(options.length);

  const { lessonId } = useParams();

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(lessonId));
    }
  }, [dispatch, lessonId]);

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
      if (!correctAnswer) {
        message.error('Vui lòng chọn đáp án đúng.');
        return;
      }
  
      // Gán thủ công vào exerciseData vì Form không quản lý 2 giá trị này
      exerciseData.options = options;
      exerciseData.correct_answer = correctAnswer;
    }
  
    if (exerciseType === 'fill_in') {
      // Với dạng điền từ, correct_answer đã nằm trong values
      exerciseData.correct_answer = values.correct_answer;
    }

    try {
      const resultAction = await dispatch(createExercise(exerciseData));
      if (createExercise.fulfilled.match(resultAction)) {
        message.success('Thêm bài tập thành công!');
        navigate('/admin/exercises');
      } else {
        message.error(resultAction.payload || 'Có lỗi xảy ra khi thêm bài tập!');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi thêm bài tập!');
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
    <>
    <PageTitle title="Thêm bài tập mới" />
    <Layout role="admin" pageHeaderTitle={`Thêm bài tập mới - ${currentLesson?.title || 'Bài học'}`}>
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
            <Input placeholder="Nhập tiêu đề bài tập" onChange={e => form.setFieldValue('title', e.target.value)} />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
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
            initialValue="multiple_choice"
          >
            <Select onChange={(value) => {
              form.setFieldValue('type', value);
              setExerciseType(value);
              if (value === 'fill_in') {
                setCorrectAnswer(undefined);
                form.setFieldValue('correct_answer', '');
              } else {
                form.setFieldValue('correct_answer', undefined);
              }
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
            <TextArea rows={3} placeholder="Nhập nội dung bài tập..." onChange={e => form.setFieldValue('content', e.target.value)} />    
          </Form.Item>

          {exerciseType === 'multiple_choice' && (
            <>
              <div className={styles.formLabel}>Các lựa chọn & Đáp án đúng <span style={{ color: 'red' }}>*</span></div>
              {options.map((option, index) => (
                <Space key={option.id} className={styles.optionItem} align="baseline">
                  <Radio
                    value={option.id}
                    checked={correctAnswer === option.id}
                    onChange={e => {
                      const selected = e.target.value;
                      setCorrectAnswer(selected);
                      form.setFieldValue('correct_answer', selected);
                    }}
                  />
                  <Input
                    placeholder={`Lựa chọn ${index + 1}`}
                    value={option.text}
                    onChange={e => handleOptionTextChange(option.id, e.target.value)}
                    className={styles.optionInput}
                    ref={el => optionInputRefs.current[index] = el}
                  />
                  {options.length > 1 && (
                    <Button type="link" danger onClick={() => handleRemoveOption(option.id)}>Xóa</Button>
                  )}
                </Space>
              ))}
              <Button type="dashed" onClick={handleAddOption} style={{ marginTop: '10px' }}>Thêm lựa chọn</Button>
            </>
          )}

          {exerciseType === 'fill_in' && (
            <Form.Item name="correct_answer" label="Đáp án đúng (Điền từ)" rules={[{ required: true, message: 'Vui lòng nhập đáp án đúng!' }]}>
              <Input placeholder="Nhập đáp án cho câu hỏi điền từ" />
            </Form.Item>
          )}

          <Space className={styles.formActions}>
            <Button onClick={() => navigate('/admin/exercises')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Thêm bài tập</Button>
          </Space>
        </Form>
      </div>
    </Layout>
    </>
  );
};

export default ExerciseCreate;
