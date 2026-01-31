import { Box, Typography, Button, Paper, Grid, Container } from '@mui/material';
import { Add, School, Bolt } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box mb={6} textAlign="center">
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Welcome to BrainDocs, {user?.username}!
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Your personal knowledge base. Select a topic from the sidebar or start something new.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    sx={{ mt: 2 }}
                    // Note: Actual topic creation is handled via the Sidebar modal, 
                    // this is just a call to action leading visually to the sidebar
                    onClick={() => {
                        // In a real app, might open the modal directly or highlight the "New Topic" button
                        alert("Use the '+ NEW TOPIC' button in the sidebar to create a topic!");
                    }}
                >
                    Create New Topic
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" mb={2} gap={1}>
                            <School color="primary" fontSize="large" />
                            <Typography variant="h5" fontWeight={600}>
                                Start Learning
                            </Typography>
                        </Box>
                        <Typography color="text.secondary">
                            Click on any topic in the sidebar to view its content.
                            Topics are organized hierarchically with headings and subheadings.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" mb={2} gap={1}>
                            <Bolt color="secondary" fontSize="large" />
                            <Typography variant="h5" fontWeight={600}>
                                Boost Productivity
                            </Typography>
                        </Box>
                        <Typography color="text.secondary">
                            Use the global search bar in the top navigation to find any topic,
                            user, or specific content instantly.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardHome;
