import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, MenuBook, Home as HomeIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import GlobalNavbar from './GlobalNavbar';

const drawerWidth = 280;

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setDesktopOpen(!desktopOpen);
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        handleClose();
        navigate('/dashboard/profile');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <GlobalNavbar
                isDashboard={true}
                onSidebarToggle={handleDrawerToggle}
                mobileOpen={mobileOpen}
                desktopOpen={desktopOpen}
            />

            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} desktopOpen={desktopOpen} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, sm: 3 }, // Mobile: 0px, Desktop: 24px
                    mt: 8,
                    // Remove explicit ml and width calculation to rely on Flexbox
                    // The Sidebar sibling already takes up the space in the flex container
                    minWidth: 0, // Prevents flex child from overflowing
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
