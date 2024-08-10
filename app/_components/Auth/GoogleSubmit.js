import { googleAuth } from "@/app/_lib/auth";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button } from "@mui/material";

function GoogleSubmit() {
  return (
    <Box component="form" action={googleAuth} noValidate sx={{ mt: 3 }}>
      <Button
        variant="outlined"
        type="submit"
        startIcon={<GoogleIcon />}
        fullWidth
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Login with Google
      </Button>
    </Box>
  );
}

export default GoogleSubmit;
