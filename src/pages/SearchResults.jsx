import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Divider } from '@mui/material';
import api from '../services/api';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ users: [], topics: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const res = await api.get(`/search?q=${query}`);
                setResults(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h5" mb={3}>Search Results for "{query}"</Typography>

            {/* Topics Section */}
            <Typography variant="h6" color="primary" mb={2}>Topics</Typography>
            {results.topics.length > 0 ? (
                <Grid container spacing={3} mb={4}>
                    {results.topics.map((topic) => (
                        <Grid item xs={12} sm={6} md={4} key={topic._id}>
                            <Card variant="outlined" sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
                                <CardContent>
                                    <Typography variant="h6" component={Link} to={`/dashboard/${topic.route}`} sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                        {topic.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1} noWrap>
                                        {topic.description || 'No description'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography mb={4} color="text.secondary">No topics found</Typography>
            )}

            <Divider />

            {/* Users Section */}
            <Typography variant="h6" color="primary" mt={4} mb={2}>Users</Typography>
            {results.users.length > 0 ? (
                <Grid container spacing={3}>
                    {results.users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user._id}>
                            <Card variant="outlined">
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}
                                    >
                                        {user.username[0].toUpperCase()}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">{user.fullName || user.username}</Typography>
                                        <Typography variant="body2" color="text.secondary">{user.bio || 'No bio'}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography color="text.secondary">No users found</Typography>
            )}
        </Box>
    );
};

export default SearchResults;
