import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useTranscriptStore from "../store/useTranscriptStore";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";



function Upload() {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { file, setFile } = useTranscriptStore();
  const [error, setError] = useState("");
  const auth = useAuthStore();
  const [savedId, setSavedId] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    const isAudioOrVideo =
      selected && (selected.type.startsWith("audio/") || selected.type.startsWith("video/"));

    if (isAudioOrVideo) {
      setFile(selected);
      setError("");
      toast.success(`${selected.type.startsWith("video/") ? "Video" : "Audio"} file selected!`);
    } else {
      setFile(null);
      setError("Please upload a valid audio or video file.");
      toast.error("Invalid file type. Upload audio/video only.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "debrief.AI");

    const res = await fetch("https://api.cloudinary.com/v1_1/dzve0febp/auto/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed.");
    return { url: data.secure_url, format: data.resource_type };
  };

  const saveToBackend = async (url, format) => {
    const res = await fetch("http://localhost:5050/api/upload/save-media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ url, format }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save media");
    return data;
  };

  const handleSaveOnly = async () => {
    if (!file) return toast.error("No file selected.");
    toast.info("Saving file...");
    setIsSaving(true);
    try {
      const { url, format } = await uploadToCloudinary();
      const result = await saveToBackend(url, format);
      setSavedId(result._id);
      toast.success("File uploaded and saved to database!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error saving file.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={0}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Upload Your Audio/Video File
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Accepted formats: MP3, WAV, AAC, MP4, WEBM, etc.
        </Typography>

        <input
          type="file"
          accept="audio/*,video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={triggerFileInput}
          >
            Choose File
          </Button>
          {file && (
            <Typography variant="body1" color="primary">
              {file.name}
            </Typography>
          )}
        </Stack>

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            disabled={!file || isSaving}
            onClick={handleSaveOnly}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Go to dashboard after saving
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Upload;