import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { Box, Typography, Paper, Divider, Stack } from '@mui/material';
import useAuthStore from "../store/authStore";
const API = import.meta.env.VITE_API_BASE_URL;
const Transcript = () => {
  const {id }= useParams();
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const auth = useAuthStore();
  const [actionItems, setActionItems] = useState([]);
  const [keyDecisions, setKeyDecisions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/api/transcripts/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
  
        setTranscript(res.data.transcript);
        setSummary(res.data.summary || []);
        setActionItems(res.data.actionItems || []);
        setKeyDecisions(res.data.keyDecisions || []);
        toast.success("Transcript loaded!");
      } catch (err) {
        toast.error("Failed to load transcript.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  return (
    <Box p={4}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography variant="h4" gutterBottom>
        Transcript & Summary
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <ClipLoader color="#1976d2" size={50} />
        </Box>
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* Transcript */}
          <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
            <Typography variant="h6" gutterBottom>📝 Transcript</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {transcript}
            </Typography>
          </Paper>

          {/* Summary */}
          
<Paper elevation={3} sx={{ flex: 1, p: 3 }}>
  <Typography variant="h6" gutterBottom> Summary</Typography>
  <Divider sx={{ mb: 2 }} />
  <ul style={{ paddingLeft: "1.2em" }}>
    {Array.isArray(summary) ? (summary.map((point, index) => (
      <li key={index}><Typography >{point}</Typography></li>
    ))
    ):(
      <Typography>No Summary Available</Typography>
    )
  }
  </ul>

  <Typography variant="h6" gutterBottom mt={3}> Action Items</Typography>
  <Divider sx={{ mb: 2 }} />
  <ul style={{ paddingLeft: "1.2em" }}>
    {actionItems.map((item, index) => (
      <li key={index}>
        <Typography variant="body1">{item}</Typography>
      </li>
    ))}
  </ul>

  <Typography variant="h6" gutterBottom mt={3}> Key Decisions</Typography>
  <Divider sx={{ mb: 2 }} />
  <ul style={{ paddingLeft: "1.2em" }}>
    {keyDecisions.map((decision, index) => (
      <li key={index}>
        <Typography variant="body1">{decision}</Typography>
      </li>
    ))}
  </ul>
</Paper>
        </Stack>
      )}
    </Box>
  );
};

export default Transcript;