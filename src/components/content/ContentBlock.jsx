import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { grey } from '@mui/material/colors';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import toast from 'react-hot-toast';

const CodeRenderer = ({ block }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(block.content);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ my: 2, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            {/* Code Header */}
            <Box
                sx={{
                    bgcolor: '#2d2d2d', // slightly lighter than code bg (usually #1e1e1e)
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #3e3e3e'
                }}
            >
                <Typography variant="caption" sx={{ color: '#aaa', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    {block.language || 'text'}
                </Typography>
                <Button
                    onClick={handleCopy}
                    size="small"
                    startIcon={copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                    sx={{
                        color: copied ? '#4ade80' : '#ddd',
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        '&:hover': {
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                    title="Copy code"
                >
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </Box>

            {/* Code Body */}
            <SyntaxHighlighter
                language={block.language || 'javascript'}
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{ margin: 0, borderRadius: 0 }}
            >
                {block.content}
            </SyntaxHighlighter>
        </Box>
    );
};

const ContentBlock = ({ block }) => {
    switch (block.type) {
        case 'heading':
            const level = block.level || 2;
            const variant = `h${level}`;
            const sizeMap = {
                1: '2.5rem',
                2: '2rem',
                3: '1.75rem',
                4: '1.5rem',
                5: '1.25rem',
                6: '1rem'
            };

            return (
                <Typography variant={variant} component={variant} sx={{
                    mt: 3,
                    mb: 2,
                    fontWeight: 'bold',
                    color: block.color || 'text.primary',
                    fontSize: sizeMap[level]
                }}>
                    {block.content}
                </Typography>
            );
        case 'paragraph':
            return (
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {block.content}
                </Typography>
            );
        case 'code':
            return <CodeRenderer block={block} />;
        case 'image':
            return (
                <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            maxWidth: '100%',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <img
                            src={block.content}
                            alt="Content"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                height: 'auto',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.padding = '40px';
                                e.target.style.backgroundColor = '#f5f5f5';
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial"%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </Box>
                </Box>
            );
        case 'table':
            return (
                <TableContainer
                    component={Paper}
                    sx={{
                        my: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        maxHeight: '600px',
                        maxWidth: '100%',
                        overflow: 'auto',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            bgcolor: 'background.default',
                            borderRadius: 1
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: 'divider',
                            borderRadius: 1,
                            '&:hover': {
                                bgcolor: 'text.secondary'
                            }
                        }
                    }}
                >
                    <Table sx={{ minWidth: 300 }}>
                        {block.content.hasHeader && block.content.cells.length > 0 && (
                            <TableHead>
                                <TableRow sx={{ bgcolor: block.content.headerColor || grey[300] }}>
                                    {block.content.showSerialNumbers && (
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '0.875rem',
                                                borderBottom: '2px solid',
                                                borderColor: 'divider',
                                                width: '50px',
                                                textAlign: 'center',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 10,
                                                bgcolor: block.content.headerColor || grey[300],
                                                color: block.content.headerTextColor || 'text.primary'
                                            }}
                                        >
                                            #
                                        </TableCell>
                                    )}
                                    {block.content.cells[0].map((cell, idx) => (
                                        <TableCell
                                            key={idx}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '0.875rem',
                                                borderBottom: '2px solid',
                                                borderColor: 'divider',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 10,
                                                bgcolor: block.content.headerColor || grey[300],
                                                color: block.content.headerTextColor || 'text.primary'
                                            }}
                                        >
                                            {cell || `Column ${idx + 1}`}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                        )}
                        <TableBody>
                            {block.content.cells
                                .slice(block.content.hasHeader ? 1 : 0)
                                .map((row, rowIdx) => (
                                    <TableRow
                                        key={rowIdx}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                bgcolor: 'action.hover'
                                            },
                                            '&:hover': {
                                                bgcolor: 'action.selected'
                                            }
                                        }}
                                    >
                                        {block.content.showSerialNumbers && (
                                            <TableCell
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem',
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {block.content.hasHeader ? rowIdx + 1 : rowIdx + 1}
                                            </TableCell>
                                        )}
                                        {row.map((cell, cellIdx) => (
                                            <TableCell
                                                key={cellIdx}
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {cell || '-'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        default:
            return null;
    }
};

export default ContentBlock;
