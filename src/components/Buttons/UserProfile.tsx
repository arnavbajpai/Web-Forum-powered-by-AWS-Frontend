import React from 'react';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BasicMenu from './Menu';

interface UserAction {
    id: number;
    label: string;
    onClick?: () => void;
}

const userActions: UserAction[] = [
    {
        id: 0,
        label: 'Profile',
        onClick: () => {
            console.log('Profile clicked');
        }
    },
];

interface UserProfileButtonProps {
    iconColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    unreadMessages?: number;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ 
    iconColor = 'default', 
    unreadMessages = 0 
}) => {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const profileTooltip = unreadMessages 
        ? `${unreadMessages} unread profile updates` 
        : 'User Profile';

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
     
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title={profileTooltip}>
                <IconButton 
                    color={iconColor} 
                    onClick={unreadMessages > 0 ? handleOpen : undefined}
                >
                    <Badge 
                        badgeContent={unreadMessages} 
                        color="primary"
                    >
                        <AccountCircleIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <BasicMenu 
                open={open} 
                anchorEl={anchorEl} 
                handleClose={handleClose} 
                menuItems={userActions} 
            />
        </div>
    );
};

export default UserProfileButton;