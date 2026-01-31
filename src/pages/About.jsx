import { Box, Container, Typography, Paper, Avatar, Stack } from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box textAlign="center" mb={8}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    About <span style={{ color: '#ec4899' }}>BrainDocs</span>
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                    The personal knowledge base designed for the modern learner.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Our Mission
                </Typography>
                <Typography paragraph color="text.secondary" fontSize="1.1rem" lineHeight={1.8}>
                    In the fast-paced world of technology, keeping track of what you learn is just as important as the learning itself. BrainDocs was born from a simple need: a better way to document, organize, and retrieve programming concepts, implementation details, and project notes.
                </Typography>
                <Typography paragraph color="text.secondary" fontSize="1.1rem" lineHeight={1.8}>
                    Traditional note-taking apps are often too generic, while full-blown wikis can be overkill. BrainDocs sits right in the sweet spot - offering structured, hierarchical documentation with a rich, block-based editor that feels intuitive to developers and creators alike.
                </Typography>

                <Box my={6}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Why BrainDocs?
                    </Typography>
                    <Typography paragraph color="text.secondary" fontSize="1.1rem" lineHeight={1.8}>
                        We believe that documentation should be beautiful. It should be a joy to write and a pleasure to read. By focusing on a clean, distraction-free interface and powerful organizational tools, we empower you to build a "Second Brain" that grows with you.
                    </Typography>
                </Box>

                <Box sx={{ mt: 8, pt: 8, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
                        Built for You
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" mb={4}>
                        Whether you are a student, a professional developer, or a lifelong learner, BrainDocs is your companion in the journey of knowledge.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default About;
