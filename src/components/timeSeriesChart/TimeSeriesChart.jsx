import React from 'react';
import { Line } from '@ant-design/charts';
import { Card, Select } from 'antd';
import styles from './TimeSeriesChart.module.css';

const { Option } = Select;

const TimeSeriesChart = ({
  title,
  data,
  xField = 'date',
  yField = 'value',
  color = '#58cc02',
  pointSize = 5,
  pointShape = 'diamond',
  smooth = true,
  animationDuration = 1000,
  selectedMonths,
  onMonthsChange,
}) => {
  const config = {
    data,
    xField,
    yField,
    point: {
      size: pointSize,
      shape: pointShape,
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth,
    animation: {
      appear: {
        animation: 'path-in',
        duration: animationDuration,
      },
    },
    color,
  };

  return (
    <div className={styles.chartContainer}>
      <Card 
        title={<div className={styles.chartTitle}>{title}</div>}
        extra={
          <Select 
            value={selectedMonths} 
            style={{ width: 120 }} 
            onChange={onMonthsChange}
          >
            <Option value={3}>3 tháng</Option>
            <Option value={6}>6 tháng</Option>
            <Option value={12}>12 tháng</Option>
          </Select>
        }
      >
        <div className={styles.chartWrapper}>
          <Line {...config} />
        </div>
      </Card>
    </div>
  );
};

export default TimeSeriesChart; 