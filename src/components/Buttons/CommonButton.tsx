import React from 'react'
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface CommonButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'inherit' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
  variant?: 'contained' | 'outlined' | 'text';
  onClick?: () => void;
}

const CommonButton: React.FC<CommonButtonProps> = ({ 
  children, 
  color = 'primary', 
  disabled = false, 
  size = 'medium', 
  sx, 
  variant = 'contained',
  onClick 
}) => {
    return (
        <Button
            color={color}
            disabled={disabled}
            size={size}
            sx={sx}
            variant={variant}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export default CommonButton