import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "../utils/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("/api/auth/register", { name, email, password },{withCredentials: true});
      toast.success("Registration Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: 400, padding: 4, borderRadius: 2, boxShadow: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h4" align="center">Register</Typography>
        <TextField label="Name" type="name" fullWidth size="large" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth size="large" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleRegister}>Register</Button>
        <Typography variant="body1" align="center">
          Already have an account?{" "}
          <Link component="button" onClick={() => navigate("/login")} underline="hover">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;