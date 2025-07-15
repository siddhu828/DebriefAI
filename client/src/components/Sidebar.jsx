import React from "react"
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
}from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"

function Sidebar(){
    return(
        <Drawer
            variant="permanent"
            sx={{
                width:240,
                flexShrink:0,
                [`& .MuiDrawer-paper`]:{widht:240, boxSizing:"border-box"},
            }}
        >
            <List>
                <ListItem button>
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard"  />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Sidebar