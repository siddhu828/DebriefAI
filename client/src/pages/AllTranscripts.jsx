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
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 460,
                  width:460,
                  overflow: 'hidden',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Transcript {index + 1}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {item.media?.name || "Untitled Media"}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {item.media?.format === "video" ? (
                    <video controls src={item.media?.url} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 4 }} />
                  ) : (
                    <audio controls src={item.media?.url} style={{ width: "100%" }} />
                  )}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Typography variant="subtitle2">Transcript:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    {item.transcript || "Transcript not available"}
                  </Typography>

                  <Typography variant="subtitle2">Summary:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    {item.summary?.length ? item.summary.join("\n") : "No summary available."}
                  </Typography>

                  <Typography variant="subtitle2">Action Items:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    {item.actionItems?.length ? item.actionItems.join("\n") : "No action items available."}
                  </Typography>

                  <Typography variant="subtitle2">Key Decisions:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {item.keyDecisions?.length ? item.keyDecisions.join("\n") : "No key decisions available."}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllTranscripts;