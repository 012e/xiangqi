import React from 'react';

interface ErrorPopupProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ title = "Thất bại", message, onClose }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border border-red-300 rounded-lg p-5 shadow-lg text-center z-50">
      <h2 className="text-red-800 mb-2 font-bold">{title}</h2>
      <p className="text-red-800">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Đóng
      </button>
    </div>
  );
};

export default ErrorPopup;