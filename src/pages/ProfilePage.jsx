import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Container,
    Divider,
    Stack,
    InputAdornment,
    CircularProgress,
    Paper,
    IconButton,
    Grid
} from '@mui/material';
import {
    Save,
    GitHub,
    LinkedIn,
    Language,
    CameraAlt,
    Person,
    Email,
    Edit,
    Close
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api, { uploadImage } from '../services/api'; // Import uploadImage
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: '',
        avatar: '',
        github: '',
        linkedin: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || '',
                github: user.socialLinks?.github || '',
                linkedin: user.socialLinks?.linkedin || '',
                website: user.socialLinks?.website || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const data = await uploadImage(uploadData);
            setFormData(prev => ({ ...prev, avatar: data.url }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    website: formData.website
                }
            };
            await api.put('/auth/updatedetails', payload);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 0, md: 6 }, px: { xs: 0, md: 3 } }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 6 },
                    borderRadius: { xs: 0, md: 4 },
                    border: { xs: 'none', md: '1px solid' },
                    borderColor: 'divider',
                    maxWidth: 1000,
                    mx: 'auto',
                    position: 'relative'
                }}
            >
                {/* Top Actions */}
                <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outlined"
                            sx={{ borderRadius: 2, minWidth: 'auto', p: 1 }}
                        >
                            <Edit />
                        </Button>
                    ) : (
                        <IconButton onClick={() => setIsEditing(false)} color="error">
                            <Close />
                        </IconButton>
                    )}
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Avatar
                            src={formData.avatar}
                            alt={user?.username}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: 'primary.main',
                                fontSize: '3rem',
                                mb: 2,
                                border: isEditing ? '4px solid' : 'none',
                                borderColor: 'primary.light',
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {user?.username?.[0]?.toUpperCase()}
                        </Avatar>

                        {/* Wrapper for Camera Overlay */}
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        p: 1,
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                >
                                    {uploading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        <CameraAlt sx={{ color: 'white', fontSize: 20 }} />
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>

                    <Typography
                        variant="h3"
                        fontWeight="800"
                        gutterBottom
                        align="center"
                        sx={{
                            letterSpacing: '-0.5px',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            wordBreak: 'break-word'
                        }}
                    >
                        {user?.username}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        align="center"
                        fontWeight="500"
                        sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                    >
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {isEditing ? (
                    // --- EDIT MODE ---
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h6" fontWeight="700" gutterBottom>About</Typography>
                                <Stack spacing={3}>
                                    {/* Removed Avatar URL input since we have direct upload now, or kept as backup? User said "Add profile image and save it on supabase", likely wants visual upload. I'll keep URL input as read-only or remove it to avoid confusion. Better to keep it editable for power users or just remove it. I'll keep it but maybe move it down or label it clearly. Actually, typically you don't paste URLs if you have upload. I'll remove the manual URL input to simplify the UI as requested "only show content... add edit button". */}

                                    <TextField
                                        fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} variant="outlined" InputProps={{ sx: { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth label="Bio" name="bio" multiline rows={4} value={formData.bio} onChange={handleChange} variant="outlined" placeholder="Tell us about yourself..." InputProps={{ sx: { borderRadius: 2 } }}
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="h6" fontWeight="700" gutterBottom>Social Links</Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth label="GitHub" name="github" value={formData.github} onChange={handleChange} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><GitHub fontSize="small" /></InputAdornment>, sx: { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><LinkedIn fontSize="small" /></InputAdornment>, sx: { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth label="Website" name="website" value={formData.website} onChange={handleChange} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><Language fontSize="small" /></InputAdornment>, sx: { borderRadius: 2 } }}
                                    />
                                </Stack>
                            </Box>

                            <Button type="submit" variant="contained" size="large" disabled={loading || uploading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
                                {loading ? 'Saving...' : 'Save Details'}
                            </Button>
                        </Stack>
                    </form>
                ) : (
                    // --- VIEW MODE ---
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="h6" fontWeight="700" gutterBottom color="text.secondary" sx={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                About
                            </Typography>
                            <Box sx={{ pl: 2, borderLeft: '4px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="500" gutterBottom>
                                    {formData.fullName || 'No Name Set'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {formData.bio || 'No bio available yet.'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="700" gutterBottom color="text.secondary" sx={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Socials
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                {formData.github ? (
                                    <Button startIcon={<GitHub />} href={formData.github} target="_blank" variant="outlined" color="inherit">GitHub</Button>
                                ) : (
                                    <Button startIcon={<GitHub />} disabled variant="outlined">GitHub</Button>
                                )}
                                {formData.linkedin ? (
                                    <Button startIcon={<LinkedIn />} href={formData.linkedin} target="_blank" variant="outlined" color="primary">LinkedIn</Button>
                                ) : (
                                    <Button startIcon={<LinkedIn />} disabled variant="outlined">LinkedIn</Button>
                                )}
                                {formData.website ? (
                                    <Button startIcon={<Language />} href={formData.website} target="_blank" variant="outlined" color="secondary">Website</Button>
                                ) : (
                                    <Button startIcon={<Language />} disabled variant="outlined">Website</Button>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Paper>
        </Container>
    );
};

export default ProfilePage;
