"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { logOut } from "@/app/_lib/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { css } from "@mui/system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const AvatarDropdown = ({ user, loading }) => {
  // const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const profilePhoto = user?.image_url?.startsWith("http")
    ? user?.image_url
    : `${process.env.NEXT_PUBLIC_URL}${user?.image_url}`;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!user) {
        toast.error("User not authenticated");
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        router.push("/login");
      }
      setLoggingOut(true);
      await logOut();
      handleClose();
    } catch (error) {
      toast.error("Failed to log out. Please try again later.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading)
    return (
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
    );

  return (
    <div>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          fontSize=".975rem"
          sx={(theme) => ({
            color: theme.palette.mode == "light" ? "#131b20" : "#ccc",
          })}
        >
          {user?.username}
        </Typography>
        <Avatar
          sx={{ m: 1, cursor: "pointer" }}
          src={profilePhoto}
          alt="Swift Support Logo"
          onClick={handleAvatarClick}
        />
      </Stack>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Paper sx={{ width: 220, maxWidth: "100%" }}>
          <Box sx={{ px: 2, py: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body1"
                fontWeight="medium"
                fontSize=".975rem"
              >
                {user?.username}
              </Typography>
              <Typography
                variant="body1"
                sx={css({
                  marginTop: "3px !important",
                  fontSize: ".775rem",
                })}
              >
                {user?.email}
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <MenuItem onClick={handleSubmit} disabled={loggingOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1" fontWeight="medium" fontSize=".975rem">
              Logout
            </Typography>
          </MenuItem>
        </Paper>
      </Menu>
    </div>
  );
};

export default AvatarDropdown;
