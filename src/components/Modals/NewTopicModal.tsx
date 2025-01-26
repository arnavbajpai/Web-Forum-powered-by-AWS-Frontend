import React, { useState, useEffect } from 'react';
import BasicModal from '../Buttons/BasicModal/BasicModal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface NewTopicModalProps {
    open: boolean;
    onClose: () => void;
    addNewTopic: (data: TopicFormValues) => void;
}

interface TopicFormValues {
    title: string;
    content: string;
    userAlias: string;
    tags: string;
    postID?: number;
}

const defaultInputValues: TopicFormValues = {
    title: '',
    content: '',
    userAlias: '',
    tags: '',
    postID: 0,
};

const NewTopicModal: React.FC<NewTopicModalProps> = ({ open, onClose, addNewTopic }) => {
    const [values, setValues] = useState<TopicFormValues>(defaultInputValues);

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
        title: Yup.string().required('Title is required'),
        content: Yup.string().required('Content is required'),
        userAlias: Yup.string().required('Username is required.'),
        tags: Yup.string().required('Tags are required and must be separated by commas.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TopicFormValues>({
        resolver: yupResolver(validationSchema),
    });

    const addTopic: SubmitHandler<TopicFormValues> = (data) => {
        addNewTopic(data);
    };

    const handleChange = (value: TopicFormValues) => {
        setValues(value);
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open]);

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <TextField
                placeholder="Title"
                label="Title"
                required
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                value={values.title}
                onChange={(event) => handleChange({ ...values, title: event.target.value })}
            />
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
            <TextField
                placeholder="Tags"
                label="Tags"
                required
                {...register('tags')}
                error={!!errors.tags}
                helperText={errors.tags?.message}
                value={values.tags}
                onChange={(event) => handleChange({ ...values, tags: event.target.value })}
            />
        </Box>
    );

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            title="New topic"
            subTitle="Fill out inputs and hit 'submit' button."
            content={getContent()}
            onSubmit={handleSubmit(addTopic)}
        />
    );
};

export default NewTopicModal;
