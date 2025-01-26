import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicCard from '../../components/Buttons/Card/Card';
import SearchBar from '../../components/Buttons/SearchBar';
import CommonButton from '../../components/Buttons/CommonButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GridWrapper from '../../components/Buttons/Wrapper/Wrapper';
import { cardHeaderStyles } from '../styles';
import NewTopicModal from '../../components/Modals/NewTopicModal';
import {
    CategoryResponse,
    UserResponse,
    PostResponse,
    PostDetailResponse,
} from '../../API';

interface Topic {
    title: string;
    content: string;
    userAlias: string;
    tags: string;
    postID?: number; 
    owner?: boolean;
}

const TopicListPageAPI: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState<Topic[]>([]);
    const [searchResults, setSearchResults] = useState<Topic[]>([]);
    const navigate = useNavigate();

    const idToken = localStorage.getItem('id_token');


    const fetchTopics = async () => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }

            const currentPath = window.location.pathname.replace('/', '');
            const capitalizedPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

            const categoryResponse = await fetch(`http://localhost:8080/categories?name=${capitalizedPath}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const categoryData: CategoryResponse = await categoryResponse.json();
            const categoryID = categoryData.payload.data.categoryID;

            if (!categoryID) {
                console.error('No valid categoryID found');
                return;
            }

            const postsResponse = await fetch(`http://localhost:8080/posts?categoryID=${categoryID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const postsData: PostResponse = await postsResponse.json();

            const topics = await Promise.all(
                postsData.payload.data.map(async (post) => {
                    try {
                        const postDetailResponse = await fetch(`http://localhost:8080/posts/${post.postID}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${idToken}`,
                            },
                        });
                        const postDetailData: PostDetailResponse = await postDetailResponse.json();

                        const tags = postDetailData.payload.data?.tags?.map((tag) => tag.tagName).join(', ') || 'No Tags';

                        const userResponse = await fetch(`http://localhost:8080/users/${post.userID}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${idToken}`,
                            },
                        });

                        const userData: UserResponse = await userResponse.json();
                        const userAlias = userData.payload.data.userAlias;

                        return {
                            title: post.title,
                            content: post.content,
                            userAlias: userAlias,
                            tags,
                            postID: post.postID,
                            owner: post.owner,
                        };
                    } catch (error) {
                        console.error(`Error fetching details for postID ${post.postID}:`, error);
                        return {
                            title: post.title,
                            content: post.content,
                            userAlias: `User ${post.userID}`,
                            tags: 'No Tags',
                            postID: post.postID,
                            owner: post.owner,
                        };
                    }
                })
            );

            setTopic(topics);
            setSearchResults(topics);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, [idToken, navigate]);

    const addNewTopic = async (data: Topic) => {
        try {
            if (!idToken) {
                console.error('No ID token found. Redirecting to login...');
                return navigate('/');
            }

            const tagsArray = data.tags.split(',').map((tag) => tag.trim());
            const currentPath = window.location.pathname.replace('/', '');
            const capitalizedPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

            const categoryResponse = await fetch(`http://localhost:8080/categories?name=${capitalizedPath}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const categoryData: CategoryResponse = await categoryResponse.json();
            const categoryID = categoryData.payload.data.categoryID;

            const userResponse = await fetch(`http://localhost:8080/users?userAlias=${data.userAlias}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const userData: UserResponse = await userResponse.json();
            const userID = userData.payload.data.userID;

            const requestBody = {
                post: {
                    userID: userID,
                    categoryID: categoryID,
                    title: data.title,
                    content: data.content,
                    isTopic: true,
                },
                tags: tagsArray,
            };

            const response = await fetch('http://localhost:8080/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Failed to add new topic');
            }

            setOpen(false);
            await fetchTopics();
        } catch (error) {
            console.error('Error adding new topic:', error);
        }
    };

    const handleSearch = (value: string) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === '') {
            setTopic(searchResults);
        } else {
            const filteredData = searchResults.filter((item) =>
                Object.keys(item).some((key) =>
                    item[key as keyof Topic]?.toString().toLowerCase().includes(lowercasedValue)
                )
            );
            setTopic(filteredData);
        }
    };

    const handleViewTopic = (postID: number) => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/${postID}`);
    };
    const handleDeleteTopic = async (postID: number) => {
        if (!idToken) {
            console.error('No ID token found. Redirecting to login...');
            return navigate('/');
        }

        try {
            const response = await fetch(`http://localhost:8080/posts/${postID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete post with ID ${postID}`);
            }

            setTopic((prevTopics) => prevTopics.filter((topic) => topic.postID !== postID));
            setSearchResults((prevResults) => prevResults.filter((topic) => topic.postID !== postID));
        } catch (error) {
            console.error(`Error deleting topic with ID ${postID}:`, error);
        }
    };

    const getHeader = () => (
        <Box sx={cardHeaderStyles.wrapper}>
            <SearchBar
                placeholder="Search topics by tag."
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)}
                searchBarWidth="720px"
            />
            <CommonButton
                variant="contained"
                onClick={() => setOpen(true)}
                size="large"
                sx={cardHeaderStyles.addTopicButton}
            >
                Add Topic
            </CommonButton>
        </Box>
    );

    const getContent = () => (
        <Box
            sx={{
                maxHeight: '600px', 
                overflowY: 'auto',  
                padding: '16px',    
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                backgroundColor: '#f9f9f9', 
            }}
        >
            {topic.length ? (
                topic.map((topicItem, index) => (
                    <Box
                        key={index}
                        sx={{
                            marginBottom: '20px',
                            padding: '16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            position: 'relative',
                        }}
                    >
                        {topicItem.owner && (
                            <CommonButton
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    zIndex: 1,
                                }}
                                onClick={() => {
                                    if (topicItem.postID) {
                                        handleDeleteTopic(topicItem.postID);
                                    } else {
                                        console.error('postID is undefined for this topic');
                                    }
                                }}
                            >
                                Delete
                            </CommonButton>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {topicItem.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'gray', marginBottom: '8px' }}>
                            Posted by: {topicItem.userAlias}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', marginBottom: '16px' }}>
                            Tags: {topicItem.tags}
                        </Typography>
                        <CommonButton
                            variant="contained"
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: '16px',
                                bottom: '16px',
                            }}
                            onClick={() => {
                                if (topicItem.postID) {
                                    handleViewTopic(topicItem.postID);
                                } else {
                                    console.error('postID is undefined for this topic');
                                }
                            }}
                        >
                            View this topic
                        </CommonButton>
                    </Box>
                ))
            ) : (
                <Typography
                    align="center"
                    sx={{
                        margin: '40px 16px',
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: '1.3rem',
                    }}
                >
                    No Topics for this project yet
                </Typography>
            )}
        </Box>
    );
    

    return (
        <GridWrapper>
            <BasicCard header={getHeader()} content={getContent()} />
            <NewTopicModal open={open} onClose={() => setOpen(false)} addNewTopic={addNewTopic} />
        </GridWrapper>
    );
};
export default TopicListPageAPI;