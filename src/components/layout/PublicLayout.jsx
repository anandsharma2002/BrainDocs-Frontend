import { Box, Toolbar, Container, Typography, Link as MuiLink, Stack, IconButton } from '@mui/material';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import GlobalNavbar from './GlobalNavbar';

const PublicLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <GlobalNavbar isDashboard={false} />

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
                <Toolbar /> {/* Spacer for fixed Navbar */}
                <Outlet />
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 6, px: 2, mt: 'auto', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between" alignItems="center">
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                <Typography variant="h6" fontWeight={800} color="primary">BrainDocs</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                © 2026 BrainDocs. All rights reserved.
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={3}>
                            <MuiLink href="#" color="text.secondary" underline="hover">Terms</MuiLink>
                            <MuiLink href="#" color="text.secondary" underline="hover">Privacy</MuiLink>
                            <MuiLink href="#" color="text.secondary" underline="hover">Contact</MuiLink>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <IconButton color="inherit" size="small"><GitHub /></IconButton>
                            <IconButton color="inherit" size="small"><Twitter /></IconButton>
                            <IconButton color="inherit" size="small"><LinkedIn /></IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;
