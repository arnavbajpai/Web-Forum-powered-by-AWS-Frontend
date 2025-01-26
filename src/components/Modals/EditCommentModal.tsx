import React, { useState, useEffect } from 'react';
import BasicModal from '../Buttons/BasicModal/BasicModal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface EditCommentModalProps {
    open: boolean;
    onClose: () => void;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => Promise<void>;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({ open, onClose, content, setContent, onSubmit }) => {
    const modalStyles = {
        inputFields: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginBottom: '15px',
            '.MuiFormControl-root': {
                marginBottom: '20px',
            },
        },
    };

    const validationSchema = Yup.object().shape({
        content: Yup.string().required('Content is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ content: string }>({
        resolver: yupResolver(validationSchema),
        defaultValues: { content },
    });

    useEffect(() => {
        if (open) {
            setContent(content); 
        }
    }, [open, content, setContent]);

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            title="Edit Comment"
            subTitle="Edit the comment content and click 'Submit'."
            content={
                <Box sx={modalStyles.inputFields}>
                    <TextField
                        placeholder="Content"
                        label="Content"
                        required
                        {...register('content')}
                        error={!!errors.content}
                        helperText={errors.content?.message}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>
            }
            onSubmit={handleSubmit(onSubmit)}
        />
    );
};

export default EditCommentModal;