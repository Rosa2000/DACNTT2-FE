import React from 'react';
import { Line } from '@ant-design/charts';
import { Card } from 'antd';
import styles from './TimeSeriesChart.module.css';

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
        bordered={false}
      >
        <div className={styles.chartWrapper}>
          <Line {...config} />
        </div>
      </Card>
    </div>
  );
};

export default TimeSeriesChart; 