import React from 'react';
import { Line } from '@ant-design/charts';
import { Card } from 'antd';

const UserGrowthChart = () => {
  // Dữ liệu mẫu - sau này sẽ được thay thế bằng dữ liệu thực từ API
  const data = [
    { date: '2024-01', users: 100 },
    { date: '2024-02', users: 150 },
    { date: '2024-03', users: 200 },
    { date: '2024-04', users: 280 },
    { date: '2024-05', users: 350 },
    { date: '2024-06', users: 420 },
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'users',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: '#1890ff',
  };

  return (
    <Card>
      <Line {...config} />
    </Card>
  );
};

export default UserGrowthChart; 