import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, CircularProgress, Divider, Breadcrumbs, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, Container } from '@mui/material';
import { Edit, Visibility, NavigateNext, Delete } from '@mui/icons-material';
import api from '../services/api';
import ContentBlock from '../components/content/ContentBlock';
import ContentEditor from '../components/content/ContentEditor';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TopicPage = () => {
    // Get slugs from URL
    const { topicSlug, headingSlug, subHeadingSlug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [contentData, setContentData] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Resolved Item (Topic/Heading/SubHeading)
    const [currentItem, setCurrentItem] = useState(null);
    const [itemType, setItemType] = useState('Topic'); // Topic, Heading, SubHeading
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        if (currentItem) {
            setEditTitle(currentItem.title);
            setEditDescription(currentItem.description || '');
        }
    }, [currentItem, editMode]);

    useEffect(() => {
        const resolveAndFetch = async () => {
            setLoading(true);
            try {
                // 1. Fetch All Topics to find Root Topic by Slug
                // Optimize: If we had a getTopicBySlug endpoint, it would be better.
                const topicsRes = await api.get('/topics');
                const allTopics = topicsRes.data.data;

                console.log("DEBUG: topicSlug =", topicSlug);
                console.log("DEBUG: allTopics =", allTopics);

                const topic = allTopics.find(t => t.route === topicSlug);

                if (!topic) {
                    throw new Error("Topic not found");
                }

                console.log("DEBUG: Found topic =", topic);
                console.log("DEBUG: Topic description =", topic.description);

                let targetId = topic._id;
                let type = 'Topic';
                let resolvedItem = topic;

                // 2. If deeper, fetch Hierarchy
                if (headingSlug) {
                    const hierarchyRes = await api.get(`/topics/${topic._id}/hierarchy`);
                    const fullTopic = hierarchyRes.data.data; // Topic with populated headings

                    const heading = fullTopic.headings.find(h => h.route === headingSlug);
                    if (!heading) throw new Error("Heading not found");

                    targetId = heading._id;
                    type = 'Heading';
                    resolvedItem = heading;

                    // 3. If even deeper
                    if (subHeadingSlug) {
                        const subHeading = heading.subHeadings.find(sh => sh.route === subHeadingSlug);
                        if (!subHeading) throw new Error("SubHeading not found");

                        targetId = subHeading._id;
                        type = 'SubHeading';
                        resolvedItem = subHeading;
                    }
                }

                console.log("DEBUG: Resolved item =", resolvedItem);
                console.log("DEBUG: Resolved item description =", resolvedItem.description);

                setCurrentItem(resolvedItem);
                setItemType(type);

                // 4. Fetch Content for the resolved ID
                // Note: Content might not exist yet -> 404 is okay, means empty content
                try {
                    const contentRes = await api.get(`/content/${targetId}`);
                    setContentData(contentRes.data.data);
                } catch (contentErr) {
                    if (contentErr.response?.status === 404) {
                        setContentData(null); // No content yet
                    } else {
                        throw contentErr;
                    }
                }

            } catch (err) {
                console.error("Error resolving topic:", err);
                toast.error(err.message || "Failed to load page");
                setContentData(null);
                setCurrentItem(null);
            } finally {
                setLoading(false);
            }
        };

        resolveAndFetch();
    }, [topicSlug, headingSlug, subHeadingSlug]);

    const handleSaveContent = async (blocks) => {
        if (!currentItem) return;

        try {
            // 1. Update Content Blocks
            await api.put(`/content/${currentItem._id}`, {
                referenceId: currentItem._id,
                referenceModel: itemType,
                blocks
            });

            // 2. Update Entity Details (Title/Description) if changed
            // Normalize description values for comparison (treat null/undefined as empty string)
            const normalizedCurrentDescription = currentItem.description || '';
            const normalizedEditDescription = editDescription || '';

            if (editTitle !== currentItem.title || normalizedEditDescription !== normalizedCurrentDescription) {
                let updateEndpoint = '';
                if (itemType === 'Topic') updateEndpoint = `/topics/${currentItem._id}`;
                else if (itemType === 'Heading') updateEndpoint = `/topics/headings/${currentItem._id}`;
                else if (itemType === 'SubHeading') updateEndpoint = `/topics/subheadings/${currentItem._id}`;

                if (updateEndpoint) {
                    await api.put(updateEndpoint, { title: editTitle, description: editDescription });
                    // Provide immediate feedback by updating local state
                    setCurrentItem(prev => ({ ...prev, title: editTitle, description: editDescription }));
                }
            }

            setContentData({ ...contentData, blocks });
            setEditMode(false);
            toast.success('Content and details saved!');
        } catch (err) {
            toast.error('Failed to save content');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!currentItem) return;
        setLoading(true);
        try {
            if (itemType === 'Topic') {
                await api.delete(`/topics/${currentItem._id}`);
            } else if (itemType === 'Heading') {
                // Now we have this route
                await api.delete(`/topics/headings/${currentItem._id}`);
            } else if (itemType === 'SubHeading') {
                // And this one
                await api.delete(`/topics/subheadings/${currentItem._id}`);
            }
            toast.success('Deleted successfully');
            navigate('/dashboard');
            // Force reload sidebar? The navigate to /dashboard might not trigger sidebar refresh if it's persistent. 
            // In a real optimized app, we should update the context/query cache instead of full reload.
            // For now, this works to ensure the deleted topic disappears.
            window.location.href = '/dashboard';
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete');
            setLoading(false);
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    if (!currentItem) return <Typography align="center" mt={4}>Item not found</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 0, px: { xs: 2, md: 4 } }}>
            {/* Breadcrumbs and Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                    <MuiLink underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                        Dashboard
                    </MuiLink>
                    <Typography color="text.primary">{currentItem.title}</Typography>
                </Breadcrumbs>

                {/* Delete Icon */}
                {(user?.role === 'SuperAdmin' || true) && (
                    <Button
                        color="error"
                        onClick={() => setDeleteDialogOpen(true)}
                        startIcon={<Delete />}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Delete
                    </Button>
                )}
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                {editMode ? (
                    <TextField
                        fullWidth
                        variant="standard"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Page Title"
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '2.125rem',
                                fontWeight: 'bold',
                                p: 0
                            }
                        }}
                    />
                ) : (
                    <Typography variant="h4" fontWeight="bold">
                        {currentItem.title}
                    </Typography>
                )}
            </Box>

            {(editMode || currentItem.description) && (
                <Box sx={{
                    mb: 4,
                    p: editMode ? 0 : 1,
                    bgcolor: editMode ? 'transparent' : '#f5f3ff',
                    borderRadius: 2,
                    borderLeft: editMode ? 'none' : '4px solid #7c3aed',
                    boxShadow: editMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    {editMode ? (
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Add a description..."
                            variant="outlined"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            sx={{ bgcolor: 'background.paper' }}
                        />
                    ) : (
                        <Typography variant="body1" sx={{ color: '#5b21b6', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {currentItem.description}
                        </Typography>
                    )}
                </Box>
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Floating Edit Button (Only visible when NOT in edit mode) */}
            {(!editMode && (user?.role === 'SuperAdmin' || true)) && (
                <Tooltip title="Edit Mode" placement="left">
                    <IconButton
                        onClick={() => setEditMode(true)}
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            zIndex: 1000,
                            bgcolor: 'primary.main',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                            p: 2,
                            '&:hover': {
                                bgcolor: 'primary.dark',
                                boxShadow: '0 6px 24px rgba(124, 58, 237, 0.5)'
                            }
                        }}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
            )}

            {editMode ? (
                <ContentEditor
                    initialBlocks={contentData?.blocks || []}
                    onSave={handleSaveContent}
                    onExitEdit={() => setEditMode(false)}
                />
            ) : (
                <Box>
                    {contentData?.blocks && contentData.blocks.length > 0 ? (
                        contentData.blocks.map((block, index) => (
                            <ContentBlock key={index} block={block} />
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center" mt={4}>
                            No content yet. Click "Edit Mode" to add some.
                        </Typography>
                    )}
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this page? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TopicPage;
