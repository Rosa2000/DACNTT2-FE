import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Spinner.module.css';

const CustomSpinner = ({ spinning = false, tip = '', children }) => {
  const customIcon = <LoadingOutlined style={{ fontSize: 36, color: '#58cc02' }} spin />;

  return (
    <Spin spinning={spinning} indicator={customIcon} tip={tip}>
      {children}
    </Spin>
  );
};

export default CustomSpinner;