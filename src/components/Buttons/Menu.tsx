import React from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface MenuItem {
  label: string;
  onClick?: () => void;
}

const BasicMenu = ({ 
  anchorEl, 
  handleClose, 
  open, 
  menuItems 
}: { 
  anchorEl: HTMLElement | null, 
  handleClose: () => void, 
  open: boolean, 
  menuItems: MenuItem[] 
}) => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={`${item.label}-${index}`}
            onClick={() => {
              item.onClick?.();
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    )
}

export default BasicMenu