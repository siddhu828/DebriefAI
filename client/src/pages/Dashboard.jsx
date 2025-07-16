import { Typography, Box, Button, Stack, Divider, Paper, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore"; 
const API = import.meta.env.VITE_API_BASE_URL;
function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [recordings, setRecordings] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch(`${API}/api/audio/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(!response.ok) {
          const errorText = await response.text();
          console.log("server responding with:", errorText);
        }
        const data = await response.json();
        if (response.ok) {
          setRecordings(data.audios || []);
        } else {
          console.error("Failed to fetch recordings");
        }
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    const fetchUploads = async () => {
      try {
        const response = await fetch(`${API}/api/upload/user-media`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUploads(data.media || []);
        } else {
          console.error("Failed to fetch uploads");
        }
      } catch (error) {
        console.error("Error fetching uploads:", error);
      }
    };
    const fetchTranscripts = async () => {
      try {
        const response = await fetch(`${API}/api/transcripts/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTranscripts(data.transcripts || []);
        }
      } catch (err) {
        console.error("Error fetching transcripts:", err.message);
      }
    };
    fetchTranscripts();
    fetchRecordings();
    fetchUploads();
  }, [token]);

  const getShortText = (text, limit = 30) => {
    if (!text) return "Not available";
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };

  return (
    <Box p={0}>
      {/* Top bar with Logout */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Welcome to Your Dashboard</Typography>
        <Button color="error" variant="outlined" onClick={() => navigate('/')}>
          Logout
        </Button>
      </Stack>

      {/* Intro and Action Buttons */}
      <Typography variant="body1" mb={2}>
        Upload your meeting or record directly to generate transcripts and summaries.
      </Typography>
      <Stack direction="row" spacing={2} mb={4}>
        <Button variant="contained" onClick={() => navigate('/upload')}>
          Upload File
        </Button>
        <Button variant="outlined" onClick={() => navigate('/record')}>
          Record Audio
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ✅ Recent Uploads Section */}
      <Typography variant="h5" gutterBottom>
        Recent Uploads
      </Typography>
      {uploads.length === 0 ? (
        <Typography variant="body2" mb={2}>No uploads found.</Typography>
      ) : (
        <Grid container spacing={2} mb={4}>
          {uploads.map((upload, index) => (
            <Grid item xs={12} md={4} key={upload._id || index}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="subtitle1">Upload {index + 1}</Typography>
                <Typography variant="body2" gutterBottom>
                  Uploaded on: {new Date(upload.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ width: "100%", height: 160, mt: 1 }}>
                  {upload.format === "video" || upload.url.includes("video") ? (
                    <video
                      controls
                      src={upload.url}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <audio
                      controls
                      src={upload.url}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </Box>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mt: 2, marginTop: "auto" }}
                  onClick={() => navigate(`/transcripts/${upload._id}`)}
                >
                  Go to Transcript/Summary
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Summary Section */}
      <Divider sx={{ my: 3 }} />
<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
  <Typography variant="h5">Saved Transcripts & Summary:</Typography>
  <Button size="small" onClick={() => navigate('/all-transcripts')}>
    View All
  </Button>
</Stack>

{transcripts.length === 0 ? (
  <Typography variant="body2" mb={2}>No transcripts saved yet.</Typography>
) : (
  <Grid container spacing={2} mb={4}>
    {transcripts.map((item, index) => (
      <Grid item xs={12} md={4} key={item._id || index}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 360,
            maxHeight: 360,
            maxWidth: 360,
            minWidth: 360,
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Transcript {index + 1}
          </Typography>

          <Box mt={1}>
            {item.media?.format === "video" ? (
              <video
                controls
                src={item.media?.url}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ) : (
              <audio
                controls
                src={item.media?.url}
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 4,
                }}
              />
            )}
          </Box>

          <Box mt={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Transcript:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: "3rem",
              }}
            >
              {getShortText(item.transcript, 50)}
            </Typography>
          </Box>

          <Box mt={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Summary:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: "3rem",
              }}
            >
              {item.summary?.length
                ? getShortText(item.summary.join(" "), 50)
                : "No summary available."}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>
)}

      {/* 🆕 Recent Records Section */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        Recent Records
      </Typography>
      {recordings.length === 0 ? (
        <Typography variant="body2">No recordings found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {recordings.map((record, index) => (
            <Grid item xs={12} md={4} key={record._id || index}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Recording {index + 1}</Typography>
                <audio controls src={record.url} style={{ width: "100%", marginTop: 8 }} />
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/transcripts/${record._id}`)}
                >
                  Go to Transcript/Summary
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;