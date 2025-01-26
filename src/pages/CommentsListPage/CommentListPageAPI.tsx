import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicCard from '../../components/Buttons/Card/Card';
import CommonButton from '../../components/Buttons/CommonButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GridWrapper from '../../components/Buttons/Wrapper/Wrapper';
import { cardHeaderStyles } from '../styles';
import NewCommentModal from '../../components/Modals/NewCommentModal';
import EditCommentModal from '../../components/Modals/EditCommentModal';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    CategoryResponse,
    UserResponse,
    PostResponse,
    PostDetailResponse,
} from '../../API';

interface Comment {
    content: string;
    userAlias: string;
    postID?: number;
    replies?: Comment[];
    owner?: boolean;
}

const CommentListPageAPI: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editContent, setEditContent] = useState<string>('');
    const [editPostID, setEditPostID] = useState<number | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchResults, setSearchResults] = useState<Comment[]>([]);
    const [replyToPostID, setReplyToPostID] = useState<number | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
    const idToken = localStorage.getItem('id_token');
    const navigate = useNavigate();
    const fetchComments = async () => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(Boolean);
            const postID = parseInt(pathParts[pathParts.length - 1], 10);

            const postsResponse = await fetch(`http://localhost:8080/posts?parentID=${postID}`, { method: 'GET', headers:{ Authorization: `Bearer ${idToken}`} });
            const postsData: PostResponse = await postsResponse.json();

            const commentsData = await Promise.all(
                postsData.payload.data.map(async (post) => {
                    try {
                        const userID = post.userID;
                        const userResponse = await fetch(`http://localhost:8080/users/${userID}`, { method: 'GET', headers:{ Authorization: `Bearer ${idToken}`} });
                        const userData: UserResponse = await userResponse.json();
                        const userAlias = userData.payload.data.userAlias;
                        return {
                            content: post.content,
                            userAlias: userAlias,
                            postID: post.postID,
                            replies: [],
                            owner: post.owner,
                        };
                    } catch (error) {
                        console.error(`Error fetching details for postID ${post.postID}:`, error);
                        return {
                            content: post.content,
                            userAlias: `User ${post.userID}`,
                            postID: post.postID,
                            replies: [],
                            owner: post.owner,
                        };
                    }
                })
            );
            setComments(commentsData);
            setSearchResults(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchReplies = async (postID: number) => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }
            const response = await fetch(`http://localhost:8080/posts?parentID=${postID}`, { method: 'GET' , headers:{ Authorization: `Bearer ${idToken}`}});
            const postsData: PostResponse = await response.json();

            const replies = await Promise.all(
                postsData.payload.data.map(async (post) => {
                    const userID = post.userID;
                    const userResponse = await fetch(`http://localhost:8080/users/${userID}`, { method: 'GET', headers:{ Authorization: `Bearer ${idToken}`} });
                    const userData: UserResponse = await userResponse.json();
                    const userAlias = userData.payload.data.userAlias;
                    return {
                        content: post.content,
                        userAlias: userAlias,
                        postID: post.postID,
                        replies: [],
                    };
                })
            );

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.postID === postID ? { ...comment, replies: replies } : comment
                )
            );
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };
    const addNewComment = async (data: Comment) => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(Boolean); 
            const categoryName = pathParts[0]?.charAt(0).toUpperCase() + pathParts[0]?.slice(1);
            const categoryResponse = await fetch(`http://localhost:8080/categories?name=${categoryName}`, { method: 'GET', headers:{ Authorization: `Bearer ${idToken}`} });
            const categoryData: CategoryResponse = await categoryResponse.json();
            const categoryID = categoryData.payload.data.categoryID;
            const userAlias = data.userAlias;
            const userResponse = await fetch(`http://localhost:8080/users?userAlias=${userAlias}`, { method: 'GET', headers:{ Authorization: `Bearer ${idToken}`} });
            const userData: UserResponse = await userResponse.json();
            const userID = userData.payload.data.userID;
            const postID = replyToPostID || parseInt(pathParts[pathParts.length - 1], 10); // Use replyToPostID if replying, otherwise use the topic's postID
            const requestBody = {
                post: {
                    parentPostID: postID,
                    userID: userID, 
                    categoryID: categoryID, 
                    content: data.content,
                },
                tags: [],
            };

            const response = await fetch('http://localhost:8080/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to add new Comment');
            }


            const result = await response.json();

            if (!replyToPostID) {
                setComments((prevComments) => [...prevComments, data]);
                setSearchResults((prevComments) => [...prevComments, data]);
            }

            setReplyToPostID(null);
            await fetchComments();
            setOpen(false);

        } catch (error) {
            console.error('Error adding new comment:', error);
        }
    };

    const updateComment = async () => {
        if (editPostID && editContent.trim() !== '') {
            try {
                if (!idToken) {
                    console.error('No ID token found. Redirecting to login...');
                    return navigate('/');
                }
                const response = await fetch(`http://localhost:8080/posts/${editPostID}?content=${editContent}`, {
                    method: 'POST', headers:{ Authorization: `Bearer ${idToken}`}
                });

                if (!response.ok) {
                    throw new Error('Failed to update the comment');
                }

                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.postID === editPostID ? { ...comment, content: editContent } : comment
                    )
                );
                await fetchComments();
                setEditOpen(false);
                setEditContent('');
                setEditPostID(null);
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    };

    const deleteComment = async (postID: number) => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }
            const response = await fetch(`http://localhost:8080/posts/${postID}`, {
                method: 'DELETE', headers:{ Authorization: `Bearer ${idToken}`}
            });

            if (!response.ok) {
                throw new Error('Failed to delete the comment');
            }

            setComments((prevComments) => prevComments.filter((comment) => comment.postID !== postID));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const getHeader = () => {
        const [topicContent, setTopicContent] = useState<string | null>(null);
        const [username, setUsername] = useState<string | null>(null);
    
        useEffect(() => {
            const fetchTopicDetails = async () => {
                try {
                    if (!idToken) {
                        console.error('No ID token found. Redirecting to login...');
                        return navigate('/');
                    }
                    const currentPath = window.location.pathname;
                    const pathParts = currentPath.split('/').filter(Boolean);
                    const postID = parseInt(pathParts[pathParts.length - 1], 10);
                    const postResponse = await fetch(`http://localhost:8080/posts/${postID}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${idToken}` },
                    });
                    const postData: PostDetailResponse = await postResponse.json();
                    const content = postData.payload.data.post.content;
                    const userID = postData.payload.data.post.userID;
                    const userResponse = await fetch(`http://localhost:8080/users/${userID}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${idToken}` },
                    });
                    const userData: UserResponse = await userResponse.json();
                    const userAlias = userData.payload.data.userAlias;
                    setTopicContent(content);
                    setUsername(userAlias);
                } catch (error) {
                    console.error('Error fetching topic details:', error);
                    setTopicContent('Unable to fetch topic details');
                    setUsername(null);
                }
            };
    
            fetchTopicDetails();
        }, []);
    
        const handleNavigateBack = () => {
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(Boolean);
            const previousPath = `/${pathParts.slice(0, -1).join('/')}`;
            navigate(previousPath);
        };
    
        return (
            <Box sx={cardHeaderStyles.wrapper}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Box onClick={handleNavigateBack} sx={{ cursor: 'pointer', marginRight: '16px', display: 'flex', alignItems: 'center' }}>
                        <ArrowBackIcon sx={{ marginRight: '8px' }} />
                    </Box>
                    <Box>
                        {topicContent && username ? (
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '20px' }}>
                                    {topicContent}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                                    Posted by: {username}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                Loading topic details...
                            </Typography>
                        )}
                    </Box>
                </Box>
                <CommonButton
                    variant="contained"
                    onClick={() => setOpen(true)}
                    size="large"
                    sx={cardHeaderStyles.addCommentButton}
                >
                    Add Comment
                </CommonButton>
            </Box>
        );
    };
    const toggleReplies = (postID: number) => {
        if (expandedReplies.has(postID)) {
            setExpandedReplies((prev) => {
                const updated = new Set(prev);
                updated.delete(postID);
                return updated;
            });
        } else {
            fetchReplies(postID);
            setExpandedReplies((prev) => new Set(prev).add(postID));
        }
    };

    const getContent = () => (
        <Box
            sx={{
                maxHeight: '600px', // Set the maximum height for the scrollable area
                overflowY: 'auto',  // Enable vertical scrolling
                padding: '16px',    // Add some padding for aesthetics
                border: '1px solid #e0e0e0', // Optional: Add border for clarity
                borderRadius: '8px', // Optional: Add rounded corners
                backgroundColor: '#f9f9f9', // Optional: Add a background color
            }}
        >
            {comments.length ? (
                comments.map((comment) => (
                    <Box
                        key={comment.postID}
                        sx={{
                            marginBottom: '20px',
                            padding: '16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            position: 'relative',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {comment.content}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'gray', marginBottom: '8px' }}>
                            Posted by: {comment.userAlias}
                        </Typography>
                        {comment.owner && (
                            <Box sx={{ display: 'flex', gap: '10px', position: 'absolute', top: '16px', right: '16px' }}>
                                <EditIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setEditPostID(comment.postID || null);
                                        setEditContent(comment.content);
                                        setEditOpen(true);
                                    }}
                                />
                                <DeleteIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => comment.postID && deleteComment(comment.postID)}
                                />
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <CommonButton
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    if (comment.postID) {
                                        setReplyToPostID(comment.postID);
                                        setOpen(true);
                                    } else {
                                        console.error('postID is undefined for this topic');
                                    }
                                }}
                            >
                                Reply
                            </CommonButton>
                            {expandedReplies.has(comment.postID!) ? (
                                <ExpandLessIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => toggleReplies(comment.postID!)}
                                />
                            ) : (
                                <ExpandMoreIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => toggleReplies(comment.postID!)}
                                />
                            )}
                        </Box>
                        {expandedReplies.has(comment.postID!) && comment.replies && comment.replies.length > 0 && (
                            <Box sx={{ marginLeft: '20px', marginTop: '10px' }}>
                                {comment.replies.map((reply) => (
                                    <Box
                                        key={reply.postID}
                                        sx={{
                                            marginBottom: '10px',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant="h6">{reply.content}</Typography>
                                        <Typography variant="subtitle2" sx={{ color: 'gray' }}>
                                            Posted by: {reply.userAlias}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                ))
            ) : (
                <Typography
                    align="center"
                    sx={{ margin: '40px 16px', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.3rem' }}
                >
                    No Comments for this topic yet.
                </Typography>
            )}
        </Box>
    );    
    return (
        <GridWrapper>
            <BasicCard header={getHeader()} content={getContent()} />
            <NewCommentModal open={open} onClose={() => setOpen(false)} addNewComment={addNewComment} />
            <EditCommentModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                content={editContent}
                setContent={setEditContent}
                onSubmit={updateComment}
            />
        </GridWrapper>
    );
};

export default CommentListPageAPI;
