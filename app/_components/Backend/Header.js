"use client";

import ToggleColorMode from "@/app/_components/ToggleColorMode";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import AvatarDropdown from "./AvatarDropdown";
import { useSupport } from "@/app/_context/SupportContext";
import { useAuth } from "@/app/_context/AuthContext";

function Header({ toggleDrawer, open }) {
  const { user, loading } = useAuth();

  return (
    <Toolbar
      sx={{
        pr: "24px", // keep right padding when drawer closed
      }}
    >
      {!open && (
        <Stack direction="row" spacing={1} sx={{ mr: 4 }}>
          <Link href="/admin/dashboard">
            <Avatar
              src="/images/logo.png"
              alt="StoreSmart Logo"
              sx={{ width: 30, height: 30 }}
            />
          </Link>
        </Stack>
      )}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          marginRight: "36px",
          ...(open && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Dashboard
      </Typography>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <ToggleColorMode />
        <AvatarDropdown user={user} loading={loading} />
      </Stack>
    </Toolbar>
  );
}

export default Header;
