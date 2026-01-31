import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Typography, Container, Grid, Paper, Stack } from '@mui/material';
import { ArrowForward, AutoStories, Search, Security } from '@mui/icons-material';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Removed auto-redirect. Logged in users might want to see the landing page.
    // useEffect(() => {
    //     if (user) {
    //         navigate('/dashboard');
    //     }
    // }, [user, navigate]);

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,0) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,0) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,0) 0, transparent 50%)',
            pt: 4
        }}>
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] rounded-full bg-pink-300 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
                {/* Navbar Removed - Handled by GlobalNavbar via PublicLayout */}

                {/* Hero Section */}
                <Box textAlign="center" mb={15}>
                    <Typography variant="h1" fontWeight={800} gutterBottom sx={{
                        fontSize: { xs: '2.5rem', md: '4.5rem' },
                        lineHeight: 1.1,
                        mb: 3
                    }}>
                        Your Second Brain <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Documented Beautifully.
                        </span>
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
                        Organize your knowledge, track your learning, and build your personal documentation library with a stunning, hierarchical interface.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        {user ? (
                            <Link to="/dashboard">
                                <Button variant="contained" color="primary" sx={{ borderRadius: '50px', px: 3 }}>
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/signup">
                                <Button variant="contained" color="primary" sx={{ borderRadius: '50px', px: 3 }}>
                                    Start Building Free
                                </Button>
                            </Link>
                        )}
                        <Button variant="outlined" size="large" sx={{ fontSize: '1.1rem', py: 1.5, px: 4, borderRadius: '50px' }}>
                            Explore Demo
                        </Button>
                    </Stack>
                </Box>

                {/* Features Grid */}
                <Grid container spacing={4} mb={10}>
                    {[
                        { icon: <AutoStories fontSize="large" color="primary" />, title: 'Structured Content', desc: 'Create deep hierarchies with Topics, Headings, and Subheadings to organize complex information.' },
                        { icon: <Search fontSize="large" color="secondary" />, title: 'Instant Search', desc: 'Find anything instantly with our powerful global search across all your topics and content.' },
                        { icon: <Security fontSize="large" color="success" />, title: 'Secure & Private', desc: 'Your personal notes are private by default. Share specific topics when you are ready to show the world.' }
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper elevation={0} className="glass" sx={{ p: 4, height: '100%', borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                <Box mb={2} sx={{ p: 2, bgcolor: 'background.default', width: 'fit-content', borderRadius: 3 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary" lineHeight={1.6}>
                                    {feature.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
