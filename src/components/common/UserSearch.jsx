import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, Avatar, Typography, InputAdornment, IconButton } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../services/api';

// Simple Debounce hook implementation if not exists, 
// for now I'll implement logic inside or create a hook file if widely used. 
// I'll check if hook exists, if not I will just use setTimeout in useEffect.

const UserSearch = () => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputValue.length < 2) {
                setOptions([]);
                return;
            }

            setLoading(true);
            try {
                const data = await searchUsers(inputValue);
                if (data.success) {
                    // Start with Users, could ideally mix Topics too if desired, 
                    // but requirement says "search user and their profile"
                    setOptions(data.data.users || []);
                }
            } catch (error) {
                console.error("Search failed", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleSelect = (event, value) => {
        if (value) {
            navigate(`/dashboard/u/${value._id}`);
            // Clear search after selection?
            setInputValue('');
            setOptions([]);
            // setOpen(false); // Autocomplete handles this
        }
    };

    return (
        <Autocomplete
            id="user-search"
            sx={{
                width: '100%',
                maxWidth: { md: 400 },
                minWidth: { xs: 120, sm: 200 }
            }}
            open={open}
            onOpen={() => {
                if (inputValue.length > 0) setOpen(true);
            }}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            getOptionLabel={(option) => option.username}
            options={options}
            loading={loading}
            popupIcon={null} // Remove down arrow
            noOptionsText="No users found"
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                if (newInputValue.length > 0) {
                    setOpen(true);
                } else {
                    setOpen(false);
                }
            }}
            onChange={handleSelect}
            // Custom rendering for options
            renderOption={(props, option) => (
                <Box component="li" {...props} key={option._id}>
                    <Avatar
                        src={option.avatar}
                        alt={option.username}
                        sx={{ width: 28, height: 28, mr: 2 }}
                    >
                        {option.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">
                            {option.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {option.email}
                        </Typography>
                    </Box>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search users..."
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {loading ? <Typography variant="caption">Loading...</Typography> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                            borderRadius: '20px',
                            '& fieldset': { border: 'none' }, // Remove default border
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.08)',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                                boxShadow: '0 0 0 2px var(--mui-palette-primary-main)', // Using CSS variable or theme
                                // Or better:
                                border: '1px solid',
                                borderColor: 'primary.main'
                            }
                        }
                    }}
                />
            )}
        />
    );
};

export default UserSearch;
