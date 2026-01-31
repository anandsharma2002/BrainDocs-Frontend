import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Menu, MenuItem, useTheme, useMediaQuery, Stack, Avatar, Container, Divider } from '@mui/material';
import { Menu as MenuIcon, MenuBook, Close, Dashboard, Person, Logout } from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserSearch from '../common/UserSearch';

const GlobalNavbar = ({ isDashboard = false, onSidebarToggle, mobileOpen, desktopOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleProfileMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleCloseMenu();
        logout();
        navigate('/login');
    };

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Features', path: '/features' },
        { title: 'About', path: '/about' },
    ];

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                boxShadow: 'none',
            }}
        >
            <Container maxWidth={isDashboard ? false : "lg"}>
                <Toolbar disableGutters={!isDashboard} sx={{ px: isDashboard ? 2 : 0 }}>
                    {/* Left: Sidebar Toggle (Dashboard only) & Logo */}
                    <Box display="flex" alignItems="center">
                        {isDashboard && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={onSidebarToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Box
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <MenuBook sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(45deg, #7c3aed 30%, #ec4899 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.5px',
                                    display: { xs: 'none', sm: 'block' } // Hide on small mobile
                                }}
                            >
                                BrainDocs
                            </Typography>
                        </Box>
                    </Box>



                    {/* Dashboard Search */}
                    {isDashboard && (
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', ml: { xs: 1, md: 0 } }}>
                            <UserSearch />
                        </Box>
                    )}

                    {!isDashboard && <Box sx={{ flexGrow: 1 }} />}

                    {/* Desktop Navigation Links (Public Pages only) */}
                    {!isDashboard && !isMobile && (
                        <Stack direction="row" spacing={1} sx={{ mr: 4 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.title}
                                    component={Link}
                                    to={link.path}
                                    variant={location.pathname === link.path ? "soft" : "text"}
                                    color={location.pathname === link.path ? "primary" : "inherit"}
                                    sx={{ fontWeight: 600, borderRadius: 2 }}
                                >
                                    {link.title}
                                </Button>
                            ))}
                        </Stack>
                    )}

                    {/* Right: User Menu or Auth Buttons */}
                    {user ? (
                        <Box>
                            <IconButton
                                size="large"
                                onClick={handleProfileMenu}
                                color="inherit"
                                sx={{
                                    p: 0.5,
                                    border: '2px solid transparent',
                                    '&:hover': { border: `2px solid ${theme.palette.primary.light}` }
                                }}
                            >
                                <Avatar
                                    src={user.avatar}
                                    alt={user.username}
                                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                >
                                    {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                            >
                                <MenuItem onClick={() => { handleCloseMenu(); navigate('/dashboard'); }}>
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={() => { handleCloseMenu(); navigate('/dashboard/profile'); }}>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Stack direction="row" spacing={1}>
                            <Button component={Link} to="/login" variant="text" color="inherit">
                                Log in
                            </Button>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: '50px', px: 3 }}
                            >
                                Get Started
                            </Button>
                        </Stack>
                    )}

                    {/* Mobile Menu Toggle (Public Pages) */}
                    {!isDashboard && isMobile && (
                        <IconButton
                            color="inherit"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            sx={{ ml: 1 }}
                        >
                            {mobileMenuOpen ? <Close /> : <MenuIcon />}
                        </IconButton>
                    )}
                </Toolbar>

                {/* Mobile Navigation Drawer/Menu (Public) */}
                {!isDashboard && mobileMenuOpen && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            boxShadow: 3,
                            p: 2,
                            display: { md: 'none' }
                        }}
                    >
                        <Stack spacing={2}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.title}
                                    component={Link}
                                    to={link.path}
                                    fullWidth
                                    variant={location.pathname === link.path ? "contained" : "text"}
                                    color={location.pathname === link.path ? "primary" : "inherit"}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.title}
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Container>
        </AppBar >
    );
};

export default GlobalNavbar;
