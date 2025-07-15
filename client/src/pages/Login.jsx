import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "../utils/axiosInstance";
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/login", { email, password },{withCredentials: true});
      const { user, token } = response.data;
      setUser(user, token);
      toast.success("Login Successful");
      navigate("/dashboard");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: 400, padding: 4, borderRadius: 2, boxShadow: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h4" align="center">Login</Typography>
        <TextField label="Email" type="email" fullWidth size="large" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth size="large" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleLogin}>Login</Button>
        <Typography variant="body1" align="center">
          Don’t have an account?{" "}
          <Link component="button" onClick={() => navigate("/")} underline="hover">Sign up</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;