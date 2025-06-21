import React from 'react';
import { LiaSpinnerSolid } from "react-icons/lia";
import styles from './Spinner.module.css'; // Let's create a css module for it

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <LiaSpinnerSolid className={styles.spinner} />
    </div>
  );
};

export default Spinner;