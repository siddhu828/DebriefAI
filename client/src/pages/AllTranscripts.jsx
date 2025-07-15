// AllTranscripts.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AllTranscripts = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/transcripts/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setTranscripts(data.transcripts || []);
        else console.error("Error fetching transcripts");
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchTranscripts();
  }, [token]);

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">All Transcripts</Typography>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Stack>

      {transcripts.length === 0 ? (
        <Typography variant="body1">No transcripts available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {transcripts.map((item, index) => (
            <Grid item xs={12} md={6} key={item._id || index}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Transcript {index + 1}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {item.media?.name || "Untitled Media"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {item.media?.format === "video" ? (
                    <video controls src={item.media?.url} style={{ width: "100%" }} />
                  ) : (
                    <audio controls src={item.media?.url} style={{ width: "100%" }} />
                  )}
                </Box>

                <Typography variant="subtitle2" mt={2}>Transcript:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {item.transcript || "Transcript not available"}
                </Typography>

                <Typography variant="subtitle2" mt={2}>Summary:</Typography>
                {item.summary?.length ? (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {item.summary.join("\n")}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No summary available.
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllTranscripts;