"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ClientOnly from "@/app/_components/ClientOnly";
import GitHubSubmit from "@/app/_components/Auth/GitHubSubmit";
import GoogleSubmit from "@/app/_components/Auth/GoogleSubmit";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signUpSystem } from "@/app/_lib/auth";
import { toast } from "react-toastify";
import { checkUserExistsByUsername } from "@/app/_lib/data-service";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const usernameExists = await checkUserExistsByUsername(username);

      if (usernameExists) {
        throw new Error("Username already taken.");
      }

      await signUpSystem({ username, email, password });
      toast.success("Signed up successfully!");

      router.push("/user/dashboard");
    } catch (error) {
      if (error.code) {
        if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters.");
        } else {
          toast.error(`Authentication failed. ${error.message}`);
        }
      } else {
        toast.error(error.message);
        setIsPending(false);
      }
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
            Signup
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              autoComplete="username"
              margin="normal"
              type="text"
            />
            <TextField
              fullWidth
              required
              label="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              type="email"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
              {pending ? "Signing Up..." : "Sign Up"}
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
            Already have an account? <Link href="/login">Sign In</Link>
          </Typography>
        </Box>
      </Container>
    </ClientOnly>
  );
};

export default SignupPage;
