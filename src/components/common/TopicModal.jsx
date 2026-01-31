import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TopicModal = ({ open, onClose, onTopicCreated }) => {
    const [type, setType] = useState('topic'); // topic, heading, subheading
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedHeading, setSelectedHeading] = useState('');
    const [topics, setTopics] = useState([]);
    const [headings, setHeadings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setType('topic');
            setTitle('');
            setDescription('');
            setSelectedTopic('');
            setSelectedHeading('');
        }
    }, [open]);

    // Fetch topics when needed (for Heading/SubHeading parent selection)
    useEffect(() => {
        if (open && (type === 'heading' || type === 'subheading')) {
            const fetchTopics = async () => {
                try {
                    const res = await api.get('/topics');
                    setTopics(res.data.data);
                } catch (err) {
                    console.error("Failed to fetch topics", err);
                    toast.error('Failed to load topics');
                }
            };
            fetchTopics();
        }
    }, [open, type]);

    // Fetch headings when a topic is selected (for SubHeading parent selection)
    useEffect(() => {
        if (type === 'subheading' && selectedTopic) {
            const fetchHeadings = async () => {
                try {
                    // Fetch hierarchy to get headings of the selected topic
                    const res = await api.get(`/topics/${selectedTopic}/hierarchy`);
                    setHeadings(res.data.data.headings || []);
                } catch (err) {
                    console.error("Failed to fetch headings", err);
                    toast.error('Failed to load headings');
                }
            };
            fetchHeadings();
        } else {
            setHeadings([]);
        }
    }, [selectedTopic, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'topic') {
                await api.post('/topics', { title, description });
            } else if (type === 'heading') {
                await api.post(`/topics/${selectedTopic}/headings`, { title });
            } else if (type === 'subheading') {
                await api.post(`/topics/headings/${selectedHeading}/subheadings`, { title });
            }

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`);
            onTopicCreated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || `Failed to create ${type}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Content</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {/* Content Type Selection */}
                        <TextField
                            select
                            label="Content Type"
                            fullWidth
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="topic">Heading (Root)</MenuItem>
                            <MenuItem value="heading">SubHeading</MenuItem>
                            <MenuItem value="subheading">Secondary Heading</MenuItem>
                        </TextField>

                        {/* Parent Topic Selection (Required for Heading & SubHeading) */}
                        {(type === 'heading' || type === 'subheading') && (
                            <TextField
                                select
                                label="Select Parent Heading"
                                fullWidth
                                required
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                {topics.map((t) => (
                                    <MenuItem key={t._id} value={t._id}>{t.title}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* Parent Heading Selection (Required for SubHeading) */}
                        {type === 'subheading' && (
                            <TextField
                                select
                                label="Select Parent SubHeading"
                                fullWidth
                                required
                                value={selectedHeading}
                                onChange={(e) => setSelectedHeading(e.target.value)}
                                disabled={!selectedTopic}
                            >
                                {headings.map((h) => (
                                    <MenuItem key={h._id} value={h._id}>{h.title}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* Title Input */}
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Enter title`}
                        />

                        {/* Description Input (Only for Topic) */}
                        {type === 'topic' && (
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TopicModal;
