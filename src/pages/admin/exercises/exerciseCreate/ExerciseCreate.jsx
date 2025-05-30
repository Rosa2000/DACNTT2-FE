// ExerciseCreate.jsx (đã chỉnh để tránh nhảy focus vào MarkdownEditor khi nhập lựa chọn)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, Space, InputNumber, Radio } from 'antd';
import Layout from '../../../../components/layout/Layout';
import styles from './ExerciseCreate.module.css';
import { createExercise } from '../../../../slices/exerciseSlice';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const ExerciseCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const loading = useSelector(state => state.exercises.loading);
  const error = useSelector(state => state.exercises.error);
  const { lessons } = useSelector(state => state.lessons);

  const [exerciseType, setExerciseType] = useState('multiple_choice');
  const [options, setOptions] = useState([{ id: '1', text: '' }]);
  const [correctAnswer, setCorrectAnswer] = useState(undefined);
  const [content, setContent] = useState('');

  const optionInputRefs = useRef([]);
  const prevOptionsLengthRef = useRef(options.length);

  const location = useLocation();
  const lessonId = location.state?.lessonId;

  useEffect(() => {
    dispatch(fetchLessons({ page: 1, pageSize: 1000 }));
  }, [dispatch]);

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
    let exerciseData = {
      ...values,
      status_id: 1,
      content: content,
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
      const resultAction = await dispatch(createExercise(exerciseData));
      if (createExercise.fulfilled.match(resultAction)) {
        message.success('Thêm bài tập thành công!');
        navigate(`/admin/exercises/lesson/${lessonId}`);
      } else {
        message.error(resultAction.payload || 'Có lỗi xảy ra khi thêm bài tập!');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi thêm bài tập!');
    }
  };

  const handleAddOption = () => {
    setOptions(prevOptions => [...prevOptions, { id: String(prevOptions.length + 1), text: '' }]);
  };

  const handleRemoveOption = (id) => {
    if (options.length <= 1) {
      message.warn('Phải có ít nhất một lựa chọn.');
      return;
    }
    const newOptions = options.filter(option => option.id !== id);
    setOptions(newOptions.map((opt, index) => ({ ...opt, id: String(index + 1) })));
    if (correctAnswer === id) {
      setCorrectAnswer(undefined);
    }
  };

  const handleOptionTextChange = (id, value) => {
    setOptions(options.map(option => option.id === id ? { ...option, text: value } : option));
  };

  const handleContentChange = (e) => {
    const { value } = e.target;
    setContent(value);
    form.setFieldsValue({ content: value });
  };

  return (
    <Layout role="admin" pageHeaderTitle="Thêm bài tập mới">
      <div className={styles.container}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          initialValues={{ type: 'multiple_choice', status_id: 1 }}
        >
          {error && <div className={styles.errorText}>{error}</div>}

          <Form.Item name="title" label="Tiêu đề bài tập" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}> <Input placeholder="Nhập tiêu đề bài tập" /> </Form.Item>
          <Form.Item name="description" label="Mô tả"> <TextArea rows={3} placeholder="Nhập mô tả (không bắt buộc)" /> </Form.Item>

          <Form.Item name="lesson_id" label="Bài học liên quan" rules={[{ required: true, message: 'Vui lòng chọn bài học!' }]}> <Select placeholder="Chọn bài học" showSearch optionFilterProp="children"> {lessons && lessons.map(lesson => (<Option key={lesson.id} value={lesson.id}>{lesson.title}</Option>))} </Select> </Form.Item>

          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập!' }]}> <Select placeholder="Chọn loại bài tập" onChange={value => setExerciseType(value)}> <Option value="multiple_choice">Trắc nghiệm</Option> <Option value="fill_in">Điền từ</Option> </Select> </Form.Item>

          <Form.Item label="Nội dung bài tập (Câu hỏi)" required>
            <Input.TextArea 
              rows={3}
              onChange={handleContentChange}
              placeholder="Nhập nội dung bài tập..."
              value={content}
            />
            <Form.Item name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung bài tập!'}]} noStyle>
              <Input style={{ display: 'none' }} />
            </Form.Item>
          </Form.Item>

          {exerciseType === 'multiple_choice' && (
            <Form.Item label="Các lựa chọn & Đáp án đúng" required>
              {options.map((option, index) => (
                <Space key={option.id} className={styles.optionItem} align="baseline">
                  <Radio 
                    value={option.id} 
                    checked={correctAnswer === option.id}
                    onChange={e => setCorrectAnswer(e.target.value)}
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
              <Button type="dashed" onClick={handleAddOption} style={{ marginTop: '10px' }}>
                Thêm lựa chọn
              </Button>
            </Form.Item>
          )}

          {exerciseType === 'fill_in' && (
            <Form.Item name="correct_answer" label="Đáp án đúng (Điền từ)" rules={[{ required: true, message: 'Vui lòng nhập đáp án đúng!' }]}> <Input placeholder="Nhập đáp án cho câu hỏi điền từ" /> </Form.Item>
          )}

          <Form.Item name="duration" label="Thời gian làm bài (ví dụ: 30 minutes, 1 hour)"> <Input placeholder="Không bắt buộc" /> </Form.Item>

          <Space className={styles.formActions}>
            <Button onClick={() => navigate(`/admin/exercises/lesson/${lessonId}`)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}> Thêm bài tập </Button>
          </Space>
        </Form>
      </div>
    </Layout>
  );
};

export default ExerciseCreate;
