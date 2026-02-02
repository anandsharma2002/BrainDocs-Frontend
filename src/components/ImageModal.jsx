import { useState } from 'react';
import { Backdrop, Box, IconButton, Fade, Tooltip, Stack } from '@mui/material';
import { Close, ZoomIn, ZoomOut, RestartAlt, RotateRight } from '@mui/icons-material';

const ImageModal = ({ open, onClose, src, alt }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
    const handleReset = () => {
        setZoom(1);
        setRotation(0);
    };
    const handleRotate = () => setRotation(prev => prev + 90);

    const handleClose = () => {
        setZoom(1);
        setRotation(0);
        onClose();
    };

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 9999,
                bgcolor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(8px)'
            }}
            open={open}
            onClick={handleClose}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        outline: 'none'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Controls Bar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            zIndex: 10,
                            display: 'flex',
                            gap: 1,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            borderRadius: 4,
                            p: 1,
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <Tooltip title="Zoom Out">
                            <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
                                <ZoomOut />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Reset">
                            <IconButton onClick={handleReset} sx={{ color: 'white' }}>
                                <Box sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{Math.round(zoom * 100)}%</Box>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Zoom In">
                            <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
                                <ZoomIn />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Rotate">
                            <IconButton onClick={handleRotate} sx={{ color: 'white' }}>
                                <RotateRight />
                            </IconButton>
                        </Tooltip>

                        <Box sx={{ width: 1, bgcolor: 'rgba(255,255,255,0.2)', mx: 0.5 }} />

                        <Tooltip title="Close">
                            <IconButton onClick={handleClose} sx={{ color: '#ff4444', '&:hover': { bgcolor: 'rgba(255,68,68,0.1)' } }}>
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Image Container with Scroll for high zoom */}
                    <Box
                        sx={{
                            width: '95%',
                            height: '90%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'auto', // Allow scrolling if zoomed very large
                            '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbars for cleaner look
                        }}
                    >
                        <img
                            src={src}
                            alt={alt || "Full screen view"}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                cursor: zoom > 1 ? 'grab' : 'default'
                            }}
                            draggable={false}
                        />
                    </Box>
                </Box>
            </Fade>
        </Backdrop>
    );
};

export default ImageModal;
