import React from 'react';
import { Column } from '@ant-design/charts';
import { Card } from 'antd';

const LearningProgressChart = () => {
  // Dữ liệu mẫu - sau này sẽ được thay thế bằng dữ liệu thực từ API
  const data = [
    { level: 'Beginner', completed: 75, inProgress: 25 },
    { level: 'Intermediate', completed: 45, inProgress: 35 },
    { level: 'Advanced', completed: 30, inProgress: 20 },
  ];

  // Chuyển đổi dữ liệu để phù hợp với định dạng của biểu đồ
  const transformedData = data.flatMap(item => [
    { level: item.level, type: 'Hoàn thành', value: item.completed },
    { level: item.level, type: 'Đang học', value: item.inProgress },
  ]);

  const config = {
    data: transformedData,
    isGroup: true,
    xField: 'level',
    yField: 'value',
    seriesField: 'type',
    groupField: 'type',
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: 'top',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: ['#1890ff', '#52c41a'],
    legend: {
      position: 'top',
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
  };

  return (
    <Card>
      <Column {...config} />
    </Card>
  );
};

export default LearningProgressChart; 