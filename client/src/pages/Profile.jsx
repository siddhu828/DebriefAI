import { Container, Typography, Avatar, Box, Paper } from "@mui/material";

export default function Profile() {
  return (
    <Container maxWidth="sm" sx={{ pt: 0 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar alt="User" src="/avatar.png" sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6">Siddhant Tiwari</Typography>
            <Typography variant="body2" color="text.secondary">
              sid@example.com
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}