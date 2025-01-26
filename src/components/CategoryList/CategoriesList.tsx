import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CategoryItems } from './consts/ListItems';
import { CategoryStyles } from './styles';
import { useNavigate } from "react-router-dom";

const CategoriesList = () => {
    const navigate = useNavigate();

    return (
        <Drawer
            sx={CategoryStyles.drawer}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Typography variant="h6" sx={CategoryStyles.title}>
                Categories
            </Typography>
            <Divider />
            <List>
                {CategoryItems.map((item, index) => (
                    <ListItem
                        button
                        key={item.id}
                        onClick={() => navigate(item.route)}
                    >
                        <ListItemIcon sx={CategoryStyles.icons}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            sx={CategoryStyles.text}
                            primary={item.label}
                        />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default CategoriesList;