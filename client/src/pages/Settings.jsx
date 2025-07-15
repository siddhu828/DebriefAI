import { Typography, Container, Paper } from "@mui/material";

export default function Settings() {
  return (
    <Container maxWidth="md" sx={{ pt: 0 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          No settings available at the moment.
        </Typography>
      </Paper>
    </Container>
  );
}