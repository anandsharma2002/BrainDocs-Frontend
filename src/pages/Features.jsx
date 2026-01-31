import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { AutoStories, Search, Security, DragIndicator, Edit, Code, Speed, Devices } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const features = [
    { icon: <AutoStories fontSize="large" color="primary" />, title: 'Hierarchical Documentation', desc: 'Structure your knowledge deeply with Topics, Headings, and Subheadings.' },
    { icon: <Search fontSize="large" color="secondary" />, title: 'Lightning Fast Search', desc: 'Global search that instantly finds topics, content blocks, and users.' },
    { icon: <Edit fontSize="large" color="success" />, title: 'Rich Content Editor', desc: 'Block-based editor supporting Text, Images, Code, Tables, and more.' },
    { icon: <DragIndicator fontSize="large" color="action" />, title: 'Drag & Drop Organization', desc: 'Intuitively reorder content blocks, rows, and columns with simple drag gestures.' },
    { icon: <Code fontSize="large" color="error" />, title: 'Syntax Highlighting', desc: 'Beautiful code blocks with support for multiple languages and themes.' },
    { icon: <Devices fontSize="large" color="info" />, title: 'Fully Responsive', desc: 'Access your documentation from any device - mobile, tablet, or desktop.' },
    { icon: <Security fontSize="large" color="warning" />, title: 'Role-Based Access', desc: 'Secure your content with Admin and User roles. Keep sensitive docs private.' },
    { icon: <Speed fontSize="large" color="primary" />, title: 'Real-time Updates', desc: 'Changes are saved instantly. Collaborate without conflict.' },
];

const Features = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box textAlign="center" mb={10}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    Everything you need to <br />
                    <span style={{ color: '#7c3aed' }}>Master Your Knowledge.</span>
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
                    BrainDocs is packed with powerful features designed to help you organize, document, and share your brilliance.
                </Typography>
                <Button component={Link} to="/signup" variant="contained" size="large" sx={{ borderRadius: '50px', px: 4 }}>
                    Start Using BrainDocs Free
                </Button>
            </Box>

            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                    borderColor: 'primary.light'
                                }
                            }}
                        >
                            <Box mb={2} sx={{ p: 1.5, bgcolor: 'background.default', width: 'fit-content', borderRadius: 2 }}>
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
    );
};

export default Features;
