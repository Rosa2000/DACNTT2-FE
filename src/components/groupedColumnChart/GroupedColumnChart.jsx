import React from 'react';
import { Column } from '@ant-design/charts';
import { Card } from 'antd';
import styles from './GroupedColumnChart.module.css';

const GroupedColumnChart = ({
  title,
  data,
  xField = 'category',
  yField = 'value',
  seriesField = 'type',
  colors = ['#58cc02', '#46a202'],
  columnRadius = [20, 20, 0, 0],
  animationDuration = 1000,
}) => {
  const config = {
    data,
    isGroup: true,
    xField,
    yField,
    seriesField,
    groupField: seriesField,
    columnStyle: {
      radius: columnRadius,
    },
    label: {
      position: 'top',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: colors,
    legend: {
      position: 'top',
      className: styles.legend,
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: animationDuration,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Card 
        title={<div className={styles.chartTitle}>{title}</div>}
        bordered={false}
      >
        <div className={styles.chartWrapper}>
          <Column {...config} />
        </div>
      </Card>
    </div>
  );
};

export default GroupedColumnChart; 