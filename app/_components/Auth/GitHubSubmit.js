import { githubAuth } from "@/app/_lib/auth";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button } from "@mui/material";

function GitHubSubmit() {
  return (
    <Box component="form" action={githubAuth} noValidate sx={{ mt: 3 }}>
      <Button
        variant="outlined"
        type="submit"
        startIcon={<GitHubIcon />}
        fullWidth
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
}

export default GitHubSubmit;
