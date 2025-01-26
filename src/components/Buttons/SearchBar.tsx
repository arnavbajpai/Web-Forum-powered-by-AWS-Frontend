import React, { ChangeEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface SearchBarProps {
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  searchBarWidth?: number | string;
  sx?: SxProps<Theme>;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...',
  onChange,
  searchBarWidth = '100%',
  sx 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      ...sx 
    }}>
      <SearchIcon sx={{ marginRight: '10px' }} />
      <Input
        placeholder={placeholder}
        onChange={onChange}
        sx={{
          width: searchBarWidth, 
          color: 'rgba(0, 0, 0, 0.6)', 
          fontSize: '1.1rem'
        }}
        disableUnderline
      />
    </Box>
  );
};

export default SearchBar;