import React from 'react';
import { useTheme } from '@/themes/ThemeContext';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'CTA';
  size?: 'sm' | 'md' | 'lg';
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const baseStyle = {
    padding: size === 'sm' ? '8px 12px' : size === 'lg' ? '12px 20px' : '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.main,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.text}`,
    },
    success: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: `1px solid ${theme.colors.text}`,
    },
    danger: {
      backgroundColor: '#f44336',
      color: '#fff',
      border: `1px solid ${theme.colors.text}`,
    },
    ghost: {
      backgroundColor: theme.colors.buttonGhost.bg,
      color: theme.colors.buttonGhost.text,
      border: `1px solid ${theme.colors.buttonGhost.text}`,
    },
    CTA: {
      backgroundColor: theme.colors.buttonCTA.bg,
      color: theme.colors.buttonCTA.text,
      border: `1px solid ${theme.colors.buttonCTA.bg}`,
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ModernButton;