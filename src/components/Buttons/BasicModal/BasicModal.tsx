import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CommonButton from '../CommonButton';
import { modalStyles } from './styles';

type BasicModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    subTitle?: string;
    content?: React.ReactNode;
    onSubmit?: () => void;
};

const BasicModal: React.FC<BasicModalProps> = ({ open, onClose, title, subTitle, content, onSubmit }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyles.wrapper}>
                <Typography
                    variant="h6"
                    component="h2"
                >
                    {title}
                </Typography>
                {subTitle && (
                    <Typography sx={{ mt: 2 }}>
                        {subTitle}
                    </Typography>
                )}
                {content}
                <Box sx={modalStyles.buttons}>
                    {onSubmit && (
                        <CommonButton
                            variant="contained"
                            onClick={onSubmit}
                        >
                            Submit
                        </CommonButton>
                    )}
                    <CommonButton onClick={onClose}>Cancel</CommonButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default BasicModal;