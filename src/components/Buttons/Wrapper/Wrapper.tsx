import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material/styles';
import { WrapperStyles } from './styles'

interface WrapperProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const GridWrapper: React.FC<WrapperProps> = ({ children, sx }) => {
  return (
    <Grid 
      item 
      xs={12} 
      sx={WrapperStyles}
    >
      {children}
    </Grid>
  );
};

export default GridWrapper;