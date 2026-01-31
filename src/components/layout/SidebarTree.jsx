import { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ChevronRight, Description, Folder } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarTree = ({ item, level = 0, parentPath = '/dashboard' }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Calculate full path for this item
    // Ensure item.route exists, fallback to # if not (avoids crash)
    const currentPath = `${parentPath}/${item.route || ''}`;

    // Determine if this item has children (Headings or SubHeadings)
    // Adjust based on your API response structure. 
    // Usually Topic has 'headings', Heading has 'subHeadings'.
    const children = item.headings || item.subHeadings || [];
    const hasChildren = children.length > 0;

    const handleClick = (e) => {
        if (hasChildren) {
            e.stopPropagation();
            setOpen(!open);
        } else {
            // Navigate to content page using the constructed path
            let type = 'SubHeading';
            if (level === 0) type = 'Topic';
            if (level === 1) type = 'Heading';

            navigate(currentPath, { state: { type, title: item.title } });
        }
    };

    // Explicit navigate handler if needed for leaf nodes handled by List button
    // But handleClick covers it. 
    // We can remove separate handleNavigate and just use handleClick logic.
    // Wait, the original had separate checking for hasChildren? 
    // Yes: onClick={hasChildren ? handleClick : handleNavigate}
    // But handleClick ALSO checks hasChildren.
    // Let's simplify.

    // Logic: 
    // If it has children: toggle expand.
    // If it is a leaf (or clicked content), navigate.
    // Actually, for "Headings" that have subheadings, clicking the TITLE should probably toggle OR navigate?
    // User expectation: If I click "React" (Topic), it goes to React page. The arrow toggles.
    // Material UI List item: The whole row is clickable.
    // If we want separate "Expand" arrow and "Navigate" body:
    // The previous code had an IconButton for expansion.
    // So the MAIN click should be navigate.

    // Let's restore the "Navigate on Click" + "Expand on Arrow" behavior if desired.
    // Original code: 
    // onClick={hasChildren ? handleClick : handleNavigate}
    // And Icon onClick calls setOpen.

    // If hasChildren is true, the main click was calling handleClick which did setOpen.
    // Meaning you COULD NOT navigate to a Topic Page if it had children?
    // That seems wrong if Topics have content.
    // "Topics" definitely have content (intro page). "Headings" usually have content.
    // So we should allow Navigation on main click, and Expansion on Arrow click.

    // Refined Logic:
    // Main Click -> Navigate
    // Arrow Click -> Toggle

    const handleMainClick = () => {
        let type = 'SubHeading';
        if (level === 0) type = 'Topic';
        if (level === 1) type = 'Heading';

        navigate(currentPath, { state: { type, title: item.title } });
    };

    const handleExpandClick = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    const isSelected = location.pathname === currentPath; // Exact match? Or includes?
    // Usually exact match is better for "Active" state of a page.

    return (
        <>
            <ListItemButton
                onClick={handleMainClick}
                sx={{ pl: level * 2 + 2, py: 0.5 }}
                selected={isSelected}
            >
                {hasChildren ? (
                    <IconButton size="small" onClick={handleExpandClick}>
                        {open ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                    </IconButton>
                ) : (
                    <Description fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                )}

                <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'primary.main' : 'text.primary'
                    }}
                />
            </ListItemButton>

            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                        {children.map((child) => (
                            <SidebarTree
                                key={child._id}
                                item={child}
                                level={level + 1}
                                parentPath={currentPath}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export default SidebarTree;
