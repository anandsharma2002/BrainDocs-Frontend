import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, Typography, Button, Divider, CircularProgress, TextField, InputAdornment, IconButton, Toolbar } from '@mui/material';
import { Search, Close, Add, ExpandMore, ChevronRight, Menu as MenuIcon, Dashboard } from '@mui/icons-material';
import api from '../../services/api';
import SidebarTree from './SidebarTree';
import TopicModal from '../common/TopicModal';

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle, desktopOpen = true }) => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTopics = async () => {
        try {
            // Fetch basic topics list
            const res = await api.get('/topics');
            // For each topic, ideally we want the hierarchy.
            // But getting full hierarchy for ALL topics might be heavy.
            // For now, let's just list the roots. 
            // Better: 'getTopics' should typically return lists. 
            // SidebarTree will handle expansion if we fetch hierarchy on expand, 
            // OR we fetch full hierarchy at once.
            // Let's assume /topics returns the list and we map them.
            setTopics(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    // Filter topics based on search query
    const filterTopics = (topics, query) => {
        if (!query.trim()) return topics;

        const lowerQuery = query.toLowerCase();

        const matchesQuery = (item) => {
            return item.title.toLowerCase().includes(lowerQuery);
        };

        const filterRecursive = (item) => {
            const titleMatches = matchesQuery(item);
            const children = item.headings || item.subHeadings || [];
            const filteredChildren = children
                .map(filterRecursive)
                .filter(Boolean);

            if (titleMatches || filteredChildren.length > 0) {
                return {
                    ...item,
                    headings: item.headings ? filteredChildren : undefined,
                    subHeadings: item.subHeadings ? filteredChildren : undefined
                };
            }

            return null;
        };

        return topics.map(filterRecursive).filter(Boolean);
    };

    const filteredTopics = filterTopics(topics, searchQuery);

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar Spacer for Full-Width Navbar */}
            <Toolbar />
            <Divider />

            {/* Search Bar - Fixed at top */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchQuery('')}
                                    edge="end"
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />
            </Box>

            {/* Dashboard Button */}
            <Box sx={{ px: 2, py: 1 }}>
                <Button
                    fullWidth
                    variant="text"
                    startIcon={<Dashboard />}
                    onClick={() => {
                        handleDrawerToggle();
                        navigate('/dashboard');
                    }}
                    sx={{
                        justifyContent: 'flex-start',
                        color: 'text.primary',
                        fontWeight: 600,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    Dashboard
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : filteredTopics.length > 0 ? (
                    <List>
                        {filteredTopics.map((topic) => (
                            <SidebarTree key={topic._id} item={topic} parentPath="/dashboard" />
                        ))}
                    </List>
                ) : (
                    <Box p={2} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            No topics found
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    fullWidth
                    onClick={() => setModalOpen(true)}
                    sx={{
                        borderRadius: 3,
                        py: 1.2,
                        boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)'
                    }}
                >
                    New Page
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: 'width 0.2s' }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="persistent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                }}
                open={desktopOpen}
            >
                {drawerContent}
            </Drawer>

            <TopicModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onTopicCreated={fetchTopics}
            />
        </Box>
    );
};

export default Sidebar;
