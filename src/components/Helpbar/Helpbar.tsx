import React from 'react'
import CommonButton from '../Buttons/CommonButton'
import UserProfileButton from '../Buttons/UserProfile'
import { headerStyles } from './styles';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';


interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {

    
    return (
        <Box sx={headerStyles.wrapper}>
            <Box sx={headerStyles.topRow}>
                <Box sx={headerStyles.userProfileButton}>
                    <UserProfileButton
                        iconColor="default"
                    />
                </Box>
            </Box>
            <Box sx={headerStyles.middleRow}>
                <Typography
                    variant="h1"
                    color="black"
                    sx={headerStyles.title}
                >
                    {title}
                </Typography>
            </Box>
        </Box>
    )
}

export default Header