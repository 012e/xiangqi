import React from 'react';
import { createPopupStyles } from '../../styles';
import { Theme } from '../../themes/themes';

interface ErrorPopupProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ title = "Thất bại", message, onClose }) => {
  const styles = createPopupStyles({} as Theme); // Replace with actual theme if available

  return (
    <div style={styles.containerError}>
      <h2 style={styles.titleError}>{title}</h2>
      <p style={styles.messageError}>{message}</p>
      <button onClick={onClose} style={styles.buttonError}>
        Đóng
      </button>
    </div>
  );
};

export default ErrorPopup;