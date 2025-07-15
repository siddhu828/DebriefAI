import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Settings", path: "/settings" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" onClick={()=>navigate("/")}>Debrief.AI</Typography>
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.name}
              component={NavLink}
              to={item.path}
              sx={{
                color: "white",
                mx: 1,
                "&.active": {
                  fontWeight: "bold",
                  borderBottom: "2px solid white",
                },
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;