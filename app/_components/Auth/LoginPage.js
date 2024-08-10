"use client";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ClientOnly from "../ClientOnly";
import GitHubSubmit from "./GitHubSubmit";
import GoogleSubmit from "./GoogleSubmit";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInSystem } from "@/app/_lib/auth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [pending, setIsPending] = useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsPending(true);

    try {
      await signInSystem({ email, password, rememberMe });
      toast.success("Signed in successfully!");

      router.push("/user/dashboard");
    } catch (error) {
      toast.error(`Authentication failed. ${error.message}`);
      setIsPending(false);
    }
  };

  return (
    <ClientOnly>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            maxWidth: "400px",
            width: "100%",
            padding: 3,
            boxShadow: 5,
            borderRadius: 2,
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <Avatar
              sx={{ m: 1 }}
              src="/images/logo.png"
              alt="Swift Support Logo"
            />
          </Link>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <Box
            sx={{ mb: 2 }}
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              required
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
              autoComplete="email"
            />
            <TextField
              fullWidth
              required
              label="Password"
              variant="outlined"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  color="primary"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mb: 2,
                mt: 2,
                "&.Mui-disabled": {
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(to bottom, #646669, #B5B8BB)",
                },
              }}
              disabled={pending}
            >
              {pending ? "Logging in..." : "Login"}
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }}>or</Divider>
          <Stack spacing={1}>
            <GitHubSubmit />
            <GoogleSubmit />
          </Stack>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Don&apos;t have an account? <Link href="/register">Sign Up</Link>
          </Typography>
        </Box>
      </Container>
    </ClientOnly>
  );
};

export default LoginPage;
