import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) {
            navigate('/');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 4 }}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Join BrainDocs today
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Full Name"
                        name="fullName"
                        variant="outlined"
                        fullWidth
                        value={formData.fullName}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        fullWidth
                        value={formData.username}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem', mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </Paper>
        </Box>
    );
};

export default Signup;
