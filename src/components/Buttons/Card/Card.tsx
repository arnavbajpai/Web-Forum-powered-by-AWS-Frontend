import React, { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { SxProps, Theme } from '@mui/material/styles';
import { cardStyles } from './styles';

interface BasicCardProps {
  header?: ReactNode;
  content: ReactNode;
  sx?: SxProps<Theme>;
}

const BasicCard: React.FC<BasicCardProps> = ({ 
  header, 
  content, 
  sx 
}) => {
  return (
    <Card sx={cardStyles}>
      {header}
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default BasicCard;