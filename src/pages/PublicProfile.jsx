import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    Paper,
    Grid,
    Container,
    Button,
    Divider,
    Stack,
    CircularProgress,
    IconButton
} from '@mui/material';
import {
    GitHub,
    LinkedIn,
    Language,
    Person,
    ArrowBack,
    Email
} from '@mui/icons-material';
import { getUserProfile } from '../services/api';
import toast from 'react-hot-toast';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(userId);
                if (data.success) {
                    setProfile(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                toast.error("User not found");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId, navigate]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) return null;

    return (
        <Box sx={{
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: 6,
                        maxWidth: 1000,
                        mx: 'auto',
                        position: 'relative',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Top Actions */}
                    <Box sx={{ position: 'absolute', top: 32, left: 32 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'grey.100', color: 'text.primary' }
                            }}
                        >
                            Back
                        </Button>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
                        <Box sx={{ position: 'relative', mb: 3 }}>
                            <Avatar
                                src={profile.avatar}
                                alt={profile.username}
                                sx={{
                                    width: 140,
                                    height: 140,
                                    bgcolor: 'primary.main',
                                    fontSize: '3.5rem',
                                    mb: 2,
                                    border: '4px solid white',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                }}
                            >
                                {profile.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>

                        <Typography
                            variant="h3"
                            fontWeight="800"
                            gutterBottom
                            align="center"
                            sx={{
                                letterSpacing: '-0.5px',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                wordBreak: 'break-word',
                                px: 1,
                                lineHeight: 1.2
                            }}
                        >
                            {profile.username}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            align="center"
                            fontWeight="500"
                            sx={{
                                fontSize: { xs: '0.875rem', md: '1.1rem' },
                                wordBreak: 'break-word',
                                px: 2
                            }}
                        >
                            {profile.email}
                        </Typography>
                        {profile.role && (
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    px: 1.5,
                                    py: 0.5,
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }}
                            >
                                {profile.role}
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ mb: 6, borderColor: 'grey.100' }} />

                    <Stack spacing={6}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <Person color="primary" />
                                <Typography variant="h6" fontWeight="700">About</Typography>
                            </Stack>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                                {profile.fullName && (
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {profile.fullName}
                                    </Typography>
                                )}
                                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                    {profile.bio || 'No bio information added yet.'}
                                </Typography>
                            </Paper>
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <Language color="primary" />
                                <Typography variant="h6" fontWeight="700">Connect</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        fullWidth
                                        startIcon={<GitHub />}
                                        href={profile.socialLinks?.github || '#'}
                                        target={profile.socialLinks?.github ? "_blank" : undefined}
                                        disabled={!profile.socialLinks?.github}
                                        variant="outlined"
                                        sx={{ p: 1.5, borderRadius: 3, justifyContent: 'flex-start', textTransform: 'none', borderColor: 'grey.300', color: 'text.primary' }}
                                    >
                                        GitHub
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        fullWidth
                                        startIcon={<LinkedIn sx={{ color: '#0077b5' }} />}
                                        href={profile.socialLinks?.linkedin || '#'}
                                        target={profile.socialLinks?.linkedin ? "_blank" : undefined}
                                        disabled={!profile.socialLinks?.linkedin}
                                        variant="outlined"
                                        sx={{ p: 1.5, borderRadius: 3, justifyContent: 'flex-start', textTransform: 'none', borderColor: 'grey.300', color: 'text.primary' }}
                                    >
                                        LinkedIn
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        fullWidth
                                        startIcon={<Language sx={{ color: '#E91E63' }} />}
                                        href={profile.socialLinks?.website || '#'}
                                        target={profile.socialLinks?.website ? "_blank" : undefined}
                                        disabled={!profile.socialLinks?.website}
                                        variant="outlined"
                                        sx={{ p: 1.5, borderRadius: 3, justifyContent: 'flex-start', textTransform: 'none', borderColor: 'grey.300', color: 'text.primary' }}
                                    >
                                        Website
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default PublicProfile;
