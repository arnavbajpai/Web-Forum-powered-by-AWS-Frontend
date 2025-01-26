import React, { useState, useEffect } from 'react';
import BasicModal from '../Buttons/BasicModal/BasicModal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface NewCommentModalProps {
    open: boolean;
    onClose: () => void;
    addNewComment: (data: CommentFormValues) => void;
}

interface CommentFormValues {
    content: string;
    userAlias: string;
    postID?: number;
}

const defaultInputValues: CommentFormValues = {
    content: '',
    userAlias: '',
};

const NewCommentModal: React.FC<NewCommentModalProps> = ({ open, onClose, addNewComment }) => {
    const [values, setValues] = useState<CommentFormValues>(defaultInputValues);

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
        userAlias: Yup.string().required('Username is required.')
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentFormValues>({
        resolver: yupResolver(validationSchema),
    });

    const addComment: SubmitHandler<CommentFormValues> = (data) => {
        addNewComment(data);
    };

    const handleChange = (value: CommentFormValues) => {
        setValues(value);
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open]);

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <TextField
                placeholder="Content"
                label="Content"
                required
                {...register('content')}
                error={!!errors.content}
                helperText={errors.content?.message}
                value={values.content}
                onChange={(event) => handleChange({ ...values, content: event.target.value })}
            />
            <TextField
                placeholder="Username"
                label="Username"
                required
                {...register('userAlias')}
                error={!!errors.userAlias}
                helperText={errors.userAlias?.message}
                value={values.userAlias}
                onChange={(event) => handleChange({ ...values, userAlias: event.target.value })}
            />
        </Box>
    );

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            title="New Comment"
            subTitle="Fill out inputs and hit 'submit' button."
            content={getContent()}
            onSubmit={handleSubmit(addComment)}
        />
    );
};

export default NewCommentModal;
