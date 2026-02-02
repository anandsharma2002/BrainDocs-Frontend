import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Select, MenuItem, IconButton, Typography, Paper, ToggleButton, ToggleButtonGroup, LinearProgress, CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Switch } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Delete, Add, Save, Cancel, TextFields, Article, Code, Image as ImageIcon, DragIndicator, CloudUpload, CheckCircle, TableChart, DragHandle, SwapHoriz, Link as LinkIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBlock = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children(attributes, listeners)}
        </div>
    );
};

// Sortable Table Column Component
const SortableTableColumn = React.memo(({ id, colIdx }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                p: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            <DragIndicator
                sx={{ fontSize: 16, color: 'text.secondary' }}
            />
            <Typography variant="caption" color="text.secondary">
                Col {colIdx + 1}
            </Typography>
        </Box>
    );
});

// Sortable Table Row Component
const SortableTableRow = React.memo(({ id, rowIdx, row, blockIndex, columns, hasHeader, showSerialNumbers, headerColor, headerTextColor, updateTableCell }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            sx={{
                display: 'grid',
                gridTemplateColumns: `40px repeat(${columns}, minmax(150px, 1fr))`,
                gap: 0.5,
                mb: 0.5
            }}
        >
            {/* Row Drag Handle */}
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                <DragIndicator
                    sx={{ fontSize: 16, color: 'text.secondary', transform: 'rotate(90deg)' }}
                />
                {showSerialNumbers && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                        {hasHeader
                            ? (rowIdx === 0 ? '' : rowIdx)
                            : rowIdx + 1
                        }
                    </Typography>
                )}
            </Box>

            {/* Row Cells */}
            {row.map((cell, colIdx) => (
                <TextField
                    key={`${rowIdx}-${colIdx}`}
                    value={cell}
                    onChange={(e) => updateTableCell(blockIndex, rowIdx, colIdx, e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    sx={{
                        '& .MuiInputBase-root': {
                            bgcolor: rowIdx === 0 && hasHeader ? headerColor : 'background.paper',
                            borderRadius: 1,
                            fontSize: '0.875rem'
                        },
                        '& .MuiInputBase-input': {
                            fontWeight: rowIdx === 0 && hasHeader ? 'bold' : 'normal',
                            color: rowIdx === 0 && hasHeader ? (headerTextColor || 'text.primary') : 'text.primary',
                            '-webkit-text-fill-color': rowIdx === 0 && hasHeader ? (headerTextColor || 'text.primary') : 'unset',
                        },
                    }}
                />
            ))}
        </Box>
    );
});

const ContentEditor = ({ initialBlocks = [], onSave, onExitEdit }) => {
    // Ensure all blocks have a unique ID
    const [blocks, setBlocks] = useState(() =>
        initialBlocks.map(b => ({ ...b, id: b.id || b._id || `block-${Math.random().toString(36).substr(2, 9)}` }))
    );
    const [saving, setSaving] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addBlock = (type) => {
        const newBlock = {
            id: `temp-${Date.now()}`, // Temporary ID for new blocks
            type,
            content: type === 'table'
                ? {
                    rows: 1,
                    columns: 2,
                    hasHeader: true,
                    showSerialNumbers: false,
                    headerColor: '#e0e0e0',
                    headerTextColor: '#000000',
                    cells: [['', '']]
                }
                : type === 'links'
                    ? { items: [{ text: '', url: '' }], showSerialNumbers: false }
                    : '',
            language: type === 'code' ? 'javascript' : undefined,
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
    };

    // Helper to update link item
    const updateLink = (blockIndex, linkIndex, field, value) => {
        const newBlocks = [...blocks];
        let content = newBlocks[blockIndex].content;

        // Migrate legacy array structure to object on edit
        if (Array.isArray(content)) {
            content = { items: [...content], showSerialNumbers: false };
        } else {
            content = { ...content, items: [...content.items] };
        }

        content.items[linkIndex] = { ...content.items[linkIndex], [field]: value };
        newBlocks[blockIndex].content = content;
        setBlocks(newBlocks);
    };

    // Helper to add link item
    const addLinkItem = (blockIndex) => {
        const newBlocks = [...blocks];
        let content = newBlocks[blockIndex].content;

        if (Array.isArray(content)) {
            content = { items: [...content], showSerialNumbers: false };
        } else {
            content = { ...content, items: [...content.items] };
        }

        content.items.push({ text: '', url: '' });
        newBlocks[blockIndex].content = content;
        setBlocks(newBlocks);
    };

    // Helper to remove link item
    const removeLinkItem = (blockIndex, linkIndex) => {
        const newBlocks = [...blocks];
        let content = newBlocks[blockIndex].content;

        if (Array.isArray(content)) {
            content = { items: content.filter((_, i) => i !== linkIndex), showSerialNumbers: false };
        } else {
            content = { ...content, items: content.items.filter((_, i) => i !== linkIndex) };
        }

        newBlocks[blockIndex].content = content;
        setBlocks(newBlocks);
    };

    const toggleLinkSerialNumbers = (blockIndex) => {
        const newBlocks = [...blocks];
        let content = newBlocks[blockIndex].content;

        if (Array.isArray(content)) {
            content = { items: [...content], showSerialNumbers: true };
        } else {
            content = { ...content, showSerialNumbers: !content.showSerialNumbers };
        }

        newBlocks[blockIndex].content = content;
        setBlocks(newBlocks);
    };

    const updateBlock = (index, field, value) => {
        const newBlocks = [...blocks];
        newBlocks[index][field] = value;
        setBlocks(newBlocks);
    };

    // Helper function to resize table cells array
    const resizeTableCells = (oldCells, newRows, newCols) => {
        const resized = Array(newRows).fill(null).map((_, rowIdx) =>
            Array(newCols).fill(null).map((_, colIdx) =>
                oldCells[rowIdx]?.[colIdx] || ''
            )
        );
        return resized;
    };

    // Update table configuration (rows, columns, hasHeader)
    const updateTableConfig = (index, field, value) => {
        const newBlocks = [...blocks];
        const tableContent = newBlocks[index].content;

        if (field === 'rows' || field === 'columns') {
            const newRows = field === 'rows' ? parseInt(value) || 1 : tableContent.rows;
            const newCols = field === 'columns' ? parseInt(value) || 1 : tableContent.columns;

            newBlocks[index].content = {
                ...tableContent,
                rows: newRows,
                columns: newCols,
                cells: resizeTableCells(tableContent.cells, newRows, newCols)
            };
        } else {
            newBlocks[index].content = {
                ...tableContent,
                [field]: value
            };
        }

        setBlocks(newBlocks);
    };

    // Update individual table cell
    const updateTableCell = useCallback((index, rowIdx, colIdx, value) => {
        setBlocks(prevBlocks => {
            const newBlocks = [...prevBlocks];
            const oldCells = newBlocks[index].content.cells;

            // Only map the specific row that changed, keep other rows as is
            const newCells = oldCells.map((row, rIdx) => {
                if (rIdx !== rowIdx) return row;
                // Only map the specific cell that changed
                return row.map((cell, cIdx) => (cIdx === colIdx ? value : cell));
            });

            newBlocks[index] = {
                ...newBlocks[index],
                content: {
                    ...newBlocks[index].content,
                    cells: newCells
                }
            };

            return newBlocks;
        });
    }, []);

    // Handle row drag end
    const handleRowDragEnd = (index, event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const newBlocks = [...blocks];
        const cells = [...newBlocks[index].content.cells];
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);

        const reorderedCells = arrayMove(cells, oldIndex, newIndex);
        newBlocks[index].content.cells = reorderedCells;
        setBlocks(newBlocks);
    };

    // Handle column drag end
    const handleColumnDragEnd = (index, event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const newBlocks = [...blocks];
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);

        const cells = newBlocks[index].content.cells.map(row => {
            return arrayMove([...row], oldIndex, newIndex);
        });
        newBlocks[index].content.cells = cells;
        setBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        setBlocks(newBlocks);
    };

    const handleImageUpload = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image must be less than 5MB');
            return;
        }

        // Set uploading state
        const newBlocks = [...blocks];
        newBlocks[index].uploading = true;
        setBlocks(newBlocks);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('image', file);

            // Get token from localStorage
            const token = localStorage.getItem('token');

            // Upload to backend
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/upload/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            // Update block with image URL
            const updatedBlocks = [...blocks];
            updatedBlocks[index].content = data.url;
            updatedBlocks[index].uploading = false;
            setBlocks(updatedBlocks);

            toast.success('Image uploaded successfully!');

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload image');

            // Remove uploading state
            const updatedBlocks = [...blocks];
            updatedBlocks[index].uploading = false;
            setBlocks(updatedBlocks);
        }

        // Clear the input
        event.target.value = '';
    };

    const handleSaveClick = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmSave = async () => {
        setConfirmDialogOpen(false);
        setSaving(true);
        // Re-assign orders based on current index
        // Remove temporary IDs if backend generates them, or keep them? 
        // Backend usually ignores extra fields or we can sanitize.
        // But importantly, map current order to 'order' field.
        const orderedBlocks = blocks.map((b, i) => ({
            ...b,
            order: i,
            // If it's a temp id starting with temp-, maybe remove it? 
            // Better to let backend handle it or keep it if it's used as reference.
            // For now, we send it as is.
        }));
        await onSave(orderedBlocks);
        setSaving(false);
    };

    const handleCancelSave = () => {
        setConfirmDialogOpen(false);
    };

    return (
        <Box>
            <Box sx={{ mb: 4, pr: 12 }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={blocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {blocks.map((block, index) => (
                            <SortableBlock key={block.id} id={block.id}>
                                {(attributes, listeners) => (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            mb: 3,
                                            position: 'relative',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 4,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {/* Drag Handle */}
                                                <IconButton
                                                    size="small"
                                                    {...attributes}
                                                    {...listeners}
                                                    sx={{
                                                        cursor: 'grab',
                                                        opacity: 0.5,
                                                        '&:hover': { opacity: 1, bgcolor: 'action.hover' },
                                                        '&:active': { cursor: 'grabbing' }
                                                    }}
                                                >
                                                    <DragIndicator fontSize="small" />
                                                </IconButton>

                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        textTransform: 'uppercase',
                                                        fontWeight: 'bold',
                                                        letterSpacing: 1,
                                                        color: 'primary.main',
                                                        bgcolor: 'primary.lighter',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    {block.type}
                                                </Typography>
                                            </Box>

                                            <IconButton
                                                size="small"
                                                onClick={() => removeBlock(index)}
                                                sx={{
                                                    color: '#d32f2f',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(211, 47, 47, 0.08)',
                                                        color: '#c62828'
                                                    }
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Content Input Based on Type */}
                                        {block.type === 'heading' && (
                                            <Box display="flex" flexDirection="column" gap={2}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
                                                        px: 1.5,
                                                        py: 1.5,
                                                        borderRadius: 2.5,
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0,0,0,0.08)',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                                    }}
                                                >
                                                    <ToggleButtonGroup
                                                        value={block.level || 2}
                                                        exclusive
                                                        onChange={(e, newLevel) => {
                                                            if (newLevel !== null) updateBlock(index, 'level', newLevel);
                                                        }}
                                                        size="small"
                                                        aria-label="heading level"
                                                        sx={{
                                                            '& .MuiToggleButton-root': {
                                                                border: 'none',
                                                                borderRadius: '8px !important',
                                                                mx: 0.5,
                                                                px: 2,
                                                                py: 0.5,
                                                                fontWeight: '600',
                                                                color: 'text.secondary',
                                                                fontSize: '0.85rem',
                                                                '&.Mui-selected': {
                                                                    color: 'primary.main',
                                                                    bgcolor: 'primary.lighter',
                                                                    zIndex: 1
                                                                },
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(0,0,0,0.04)'
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(level => (
                                                            <ToggleButton key={level} value={level} aria-label={`h${level}`}>
                                                                H{level}
                                                            </ToggleButton>
                                                        ))}
                                                    </ToggleButtonGroup>

                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            border: '2px solid white',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s',
                                                            '&:hover': { transform: 'scale(1.1)' },
                                                            bgcolor: block.color || '#000000'
                                                        }}
                                                    >
                                                        <input
                                                            type="color"
                                                            value={block.color || '#000000'}
                                                            onChange={(e) => updateBlock(index, 'color', e.target.value)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '-50%',
                                                                left: '-50%',
                                                                width: '200%',
                                                                height: '200%',
                                                                padding: 0,
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                opacity: 0
                                                            }}
                                                            title="Heading Color"
                                                        />
                                                    </Box>
                                                </Paper>

                                                <TextField
                                                    fullWidth
                                                    label="Heading Text"
                                                    placeholder="Enter heading..."
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(index, 'content', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            fontSize: block.level === 1 ? '1.5rem' : block.level === 2 ? '1.25rem' : '1rem',
                                                            fontWeight: 'bold',
                                                            color: block.color || 'inherit'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {block.type === 'paragraph' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder="Enter text content..."
                                                value={block.content}
                                                onChange={(e) => updateBlock(index, 'content', e.target.value)}
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: 'background.paper'
                                                    }
                                                }}
                                            />
                                        )}

                                        {block.type === 'code' && (
                                            <Box>
                                                <Select
                                                    value={block.language}
                                                    onChange={(e) => updateBlock(index, 'language', e.target.value)}
                                                    size="small"
                                                    sx={{ mb: 1, minWidth: 120 }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 170,
                                                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                                            },
                                                        },
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="bash">Bash/Shell</MenuItem>
                                                    <MenuItem value="c">C</MenuItem>
                                                    <MenuItem value="cpp">C++</MenuItem>
                                                    <MenuItem value="C#">C#</MenuItem>
                                                    <MenuItem value="css">CSS</MenuItem>
                                                    <MenuItem value="go">Go</MenuItem>
                                                    <MenuItem value="html">HTML</MenuItem>
                                                    <MenuItem value="java">Java</MenuItem>
                                                    <MenuItem value="javascript">JavaScript</MenuItem>
                                                    <MenuItem value="json">JSON</MenuItem>
                                                    <MenuItem value="jsx">JSX (React)</MenuItem>
                                                    <MenuItem value="kotlin">Kotlin</MenuItem>
                                                    <MenuItem value="markdown">Markdown</MenuItem>
                                                    <MenuItem value="php">PHP</MenuItem>
                                                    <MenuItem value="python">Python</MenuItem>
                                                    <MenuItem value="rust">Rust</MenuItem>
                                                    <MenuItem value="sql">SQL</MenuItem>
                                                    <MenuItem value="swift">Swift</MenuItem>
                                                    <MenuItem value="tsx">TSX (React TypeScript)</MenuItem>
                                                    <MenuItem value="typescript">TypeScript</MenuItem>
                                                    <MenuItem value="xml">XML</MenuItem>
                                                    <MenuItem value="yaml">YAML</MenuItem>
                                                </Select>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    placeholder="Paste code here..."
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(index, 'content', e.target.value)}
                                                    sx={{ fontFamily: 'monospace' }}
                                                />
                                            </Box>
                                        )}

                                        {block.type === 'table' && (
                                            <Box>
                                                {/* Table Configuration */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2, alignItems: 'flex-start' }}>
                                                    <TextField
                                                        label="Rows"
                                                        type="number"
                                                        size="small"
                                                        value={block.content.rows}
                                                        onChange={(e) => updateTableConfig(index, 'rows', e.target.value)}
                                                        inputProps={{ min: 1, max: 20 }}
                                                        sx={{ width: 80 }}
                                                    />
                                                    <TextField
                                                        label="Columns"
                                                        type="number"
                                                        size="small"
                                                        value={block.content.columns}
                                                        onChange={(e) => updateTableConfig(index, 'columns', e.target.value)}
                                                        inputProps={{ min: 1, max: 10 }}
                                                        sx={{ width: 80 }}
                                                    />

                                                    {/* Header Row Configuration Group */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Header Row:
                                                            </Typography>
                                                            <ToggleButtonGroup
                                                                value={block.content.hasHeader}
                                                                exclusive
                                                                onChange={(e, val) => {
                                                                    if (val !== null) updateTableConfig(index, 'hasHeader', val);
                                                                }}
                                                                size="small"
                                                                sx={{ height: 32 }}
                                                            >
                                                                <ToggleButton value={true} sx={{ px: 2, py: 0.5 }}>ON</ToggleButton>
                                                                <ToggleButton value={false} sx={{ px: 2, py: 0.5 }}>OFF</ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </Box>

                                                        {/* Header Background Color - Under Header Row */}
                                                        {block.content.hasHeader && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                    Header Background Color:
                                                                </Typography>
                                                                <Box
                                                                    component="input"
                                                                    type="color"
                                                                    value={block.content.headerColor || '#e0e0e0'}
                                                                    onChange={(e) => updateTableConfig(index, 'headerColor', e.target.value)}
                                                                    sx={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        p: 0,
                                                                        border: '1px solid #9e9e9e',
                                                                        borderRadius: '50%',
                                                                        cursor: 'pointer',
                                                                        bgcolor: 'transparent',
                                                                        overflow: 'hidden',
                                                                        // Force circle for WebKit (Chrome, Safari, Edge)
                                                                        '&::-webkit-color-swatch-wrapper': {
                                                                            padding: 0,
                                                                        },
                                                                        '&::-webkit-color-swatch': {
                                                                            border: 'none',
                                                                            borderRadius: '50%',
                                                                        },
                                                                        // Force circle for Firefox
                                                                        '&::-moz-color-swatch': {
                                                                            border: 'none',
                                                                            borderRadius: '50%',
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* Serial No Configuration Group */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Serial No:
                                                            </Typography>
                                                            <ToggleButtonGroup
                                                                value={block.content.showSerialNumbers || false}
                                                                exclusive
                                                                onChange={(e, val) => {
                                                                    if (val !== null) updateTableConfig(index, 'showSerialNumbers', val);
                                                                }}
                                                                size="small"
                                                                sx={{ height: 32 }}
                                                            >
                                                                <ToggleButton value={true} sx={{ px: 2, py: 0.5 }}>ON</ToggleButton>
                                                                <ToggleButton value={false} sx={{ px: 2, py: 0.5 }}>OFF</ToggleButton>
                                                            </ToggleButtonGroup>
                                                        </Box>

                                                        {/* Header Text Color - Under Serial No (as requested) */}
                                                        {block.content.hasHeader && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                    Header Color:
                                                                </Typography>
                                                                <Box
                                                                    component="input"
                                                                    type="color"
                                                                    value={block.content.headerTextColor || '#000000'}
                                                                    onChange={(e) => updateTableConfig(index, 'headerTextColor', e.target.value)}
                                                                    sx={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        p: 0,
                                                                        border: '1px solid #9e9e9e',
                                                                        borderRadius: '50%',
                                                                        cursor: 'pointer',
                                                                        bgcolor: 'transparent',
                                                                        overflow: 'hidden',
                                                                        // Force circle for WebKit (Chrome, Safari, Edge)
                                                                        '&::-webkit-color-swatch-wrapper': {
                                                                            padding: 0,
                                                                        },
                                                                        '&::-webkit-color-swatch': {
                                                                            border: 'none',
                                                                            borderRadius: '50%',
                                                                        },
                                                                        // Force circle for Firefox
                                                                        '&::-moz-color-swatch': {
                                                                            border: 'none',
                                                                            borderRadius: '50%',
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Table Editor Grid */}
                                                <Box
                                                    sx={{
                                                        overflowX: 'auto',
                                                        overflowY: 'auto',
                                                        maxHeight: '500px',
                                                        maxWidth: '100%',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
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
                                                    {/* Row Drag-and-Drop Context */}
                                                    <DndContext
                                                        sensors={sensors}
                                                        collisionDetection={closestCenter}
                                                        onDragEnd={(event) => handleRowDragEnd(index, event)}
                                                    >
                                                        <SortableContext
                                                            items={block.content.cells.map((_, idx) => `row-${idx}`)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {/* Column Headers with Drag Handles */}
                                                            <Box sx={{ mb: 1 }}>
                                                                <DndContext
                                                                    sensors={sensors}
                                                                    collisionDetection={closestCenter}
                                                                    onDragEnd={(event) => handleColumnDragEnd(index, event)}
                                                                >
                                                                    <SortableContext
                                                                        items={Array.from({ length: block.content.columns }, (_, idx) => `col-${idx}`)}
                                                                        strategy={horizontalListSortingStrategy}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                display: 'grid',
                                                                                gridTemplateColumns: `40px repeat(${block.content.columns}, minmax(150px, 1fr))`,
                                                                                gap: 0.5,
                                                                                mb: 1,
                                                                                position: 'sticky',
                                                                                top: 0,
                                                                                zIndex: 10,
                                                                                bgcolor: 'background.default',
                                                                                pt: 1
                                                                            }}
                                                                        >
                                                                            <Box /> {/* Empty space for row drag handle column */}
                                                                            {Array.from({ length: block.content.columns }).map((_, colIdx) => (
                                                                                <SortableTableColumn
                                                                                    key={colIdx}
                                                                                    id={`col-${colIdx}`}
                                                                                    colIdx={colIdx}
                                                                                />
                                                                            ))}
                                                                        </Box>
                                                                    </SortableContext>
                                                                </DndContext>
                                                            </Box>

                                                            {block.content.cells.map((row, rowIdx) => (
                                                                <SortableTableRow
                                                                    key={rowIdx}
                                                                    id={`row-${rowIdx}`}
                                                                    rowIdx={rowIdx}
                                                                    row={row}
                                                                    blockIndex={index}
                                                                    columns={block.content.columns}
                                                                    hasHeader={block.content.hasHeader}
                                                                    showSerialNumbers={block.content.showSerialNumbers}
                                                                    headerColor={block.content.headerColor}
                                                                    headerTextColor={block.content.headerTextColor}
                                                                    updateTableCell={updateTableCell}
                                                                />
                                                            ))}
                                                        </SortableContext>
                                                    </DndContext>
                                                </Box>
                                            </Box>
                                        )}

                                        {block.type === 'image' && (
                                            <Box>
                                                {/* File Upload Button */}
                                                {!block.content && (
                                                    <Box>
                                                        <input
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            id={`image-upload-${index}`}
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, index)}
                                                        />
                                                        <label htmlFor={`image-upload-${index}`}>
                                                            <Button
                                                                variant="outlined"
                                                                component="span"
                                                                startIcon={<CloudUpload />}
                                                                fullWidth
                                                                sx={{
                                                                    py: 2,
                                                                    borderStyle: 'dashed',
                                                                    borderWidth: 2,
                                                                    '&:hover': {
                                                                        borderStyle: 'dashed',
                                                                        borderWidth: 2,
                                                                        bgcolor: 'action.hover'
                                                                    }
                                                                }}
                                                            >
                                                                Upload Image
                                                            </Button>
                                                        </label>
                                                    </Box>
                                                )}

                                                {/* Upload Progress */}
                                                {block.uploading && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                                            <CircularProgress size={20} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                Uploading image...
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress />
                                                    </Box>
                                                )}

                                                {/* Image Preview */}
                                                {block.content && !block.uploading && (
                                                    <Box>
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                mb: 2
                                                            }}
                                                        >
                                                            <img
                                                                src={block.content}
                                                                alt="Uploaded"
                                                                style={{
                                                                    width: '100%',
                                                                    maxHeight: '400px',
                                                                    objectFit: 'contain',
                                                                    display: 'block'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E';
                                                                }}
                                                            />
                                                        </Box>

                                                        {/* Change Image Button */}
                                                        <input
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            id={`image-change-${index}`}
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, index)}
                                                        />
                                                        <label htmlFor={`image-change-${index}`}>
                                                            <Button
                                                                variant="outlined"
                                                                component="span"
                                                                size="small"
                                                                startIcon={<CloudUpload />}
                                                            >
                                                                Change Image
                                                            </Button>
                                                        </label>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}

                                        {block.type === 'links' && (
                                            <Box display="flex" flexDirection="column" gap={2}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Links Collection
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="caption" color="text.secondary">Serial No:</Typography>
                                                        <Switch
                                                            size="small"
                                                            checked={!Array.isArray(block.content) && block.content.showSerialNumbers}
                                                            onChange={() => toggleLinkSerialNumbers(index)}
                                                        />
                                                    </Box>
                                                </Box>
                                                {(Array.isArray(block.content) ? block.content : block.content.items).map((link, linkIndex) => (
                                                    <Box key={linkIndex} display="flex" gap={2} alignItems="flex-start">
                                                        <TextField
                                                            label="Link Text"
                                                            placeholder="e.g. Official Docs"
                                                            value={link.text}
                                                            onChange={(e) => updateLink(index, linkIndex, 'text', e.target.value)}
                                                            size="small"
                                                            sx={{ flex: 1 }}
                                                        />
                                                        <TextField
                                                            label="URL"
                                                            placeholder="https://..."
                                                            value={link.url}
                                                            onChange={(e) => updateLink(index, linkIndex, 'url', e.target.value)}
                                                            size="small"
                                                            sx={{ flex: 2 }}
                                                        />
                                                        <IconButton
                                                            onClick={() => removeLinkItem(index, linkIndex)}
                                                            disabled={(Array.isArray(block.content) ? block.content : block.content.items).length === 1}
                                                            color="error"
                                                            size="small"
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                                <Button
                                                    startIcon={<Add />}
                                                    onClick={() => addLinkItem(index)}
                                                    size="small"
                                                    sx={{ alignSelf: 'flex-start' }}
                                                >
                                                    Add Another Link
                                                </Button>
                                            </Box>
                                        )}
                                    </Paper>
                                )}
                            </SortableBlock>
                        ))}
                    </SortableContext>
                </DndContext>
            </Box>

            {/* Action Bar */}
            <Paper
                elevation={3}
                sx={{
                    p: 1.5,
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 'auto',
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.6rem', mb: -1 }}>ADD</Typography>

                <Tooltip title="Add Heading" placement="left">
                    <IconButton onClick={() => addBlock('heading')} color="primary"><TextFields /></IconButton>
                </Tooltip>
                <Tooltip title="Add Paragraph" placement="left">
                    <IconButton onClick={() => addBlock('paragraph')} color="primary"><Article /></IconButton>
                </Tooltip>
                <Tooltip title="Add Links" placement="left">
                    <IconButton onClick={() => addBlock('links')} color="primary"><LinkIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Add Code Block" placement="left">
                    <IconButton onClick={() => addBlock('code')} color="primary"><Code /></IconButton>
                </Tooltip>
                <Tooltip title="Add Image" placement="left">
                    <IconButton onClick={() => addBlock('image')} color="primary"><ImageIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Add Table" placement="left">
                    <IconButton onClick={() => addBlock('table')} color="primary"><TableChart /></IconButton>
                </Tooltip>

                <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider', my: 1 }} />

                {/* View Mode / Cancel */}
                <Tooltip title="Cancel & Exit" placement="left">
                    <IconButton onClick={onExitEdit} color="default" sx={{ bgcolor: 'action.hover' }}>
                        <Cancel />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Save Content" placement="left">
                    <IconButton
                        color="primary"
                        onClick={handleSaveClick}
                        disabled={saving}
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, p: 1.5 }}
                    >
                        <Save />
                    </IconButton>
                </Tooltip>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancelSave}
                aria-labelledby="save-dialog-title"
                aria-describedby="save-dialog-description"
            >
                <DialogTitle id="save-dialog-title">
                    Save Content?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="save-dialog-description">
                        Are you sure you want to save these changes? This will update the content permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelSave} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSave} variant="contained" color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContentEditor;
