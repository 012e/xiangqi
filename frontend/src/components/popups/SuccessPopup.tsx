import React from 'react';
import { createPopupStyles } from '../../styles';
import { Theme } from '../../themes/themes';

interface SuccessPopupProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ title = "Thành công", message, onClose }) => {
  const styles = createPopupStyles({} as Theme); // Replace with actual theme if available

  return (
    <div style={styles.containerSuccess}>
      <h2 style={styles.titleSuccess}>{title}</h2>
      <p style={styles.messageSuccess}>{message}</p>
      <button onClick={onClose} style={styles.buttonSuccess}>
        Đóng
      </button>
    </div>
  );
};

export default SuccessPopup;