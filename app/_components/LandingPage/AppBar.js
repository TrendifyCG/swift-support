"use client";

import { useState } from "react";

import ToggleColorMode from "@/app/_components/ToggleColorMode";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Avatar, Stack } from "@mui/material";
import Link from "next/link";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

function AppAppBar({ userLoading, user }) {
  const [open, setOpen] = useState(false);
  const [showAuth, setSHowAuth] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     setSHowAuth(false);
  //   } else {
  //     setSHowAuth(true);
  //   }
  // }, [user]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(128, 0, 128, 0.1), 1px 1.5px 2px -1px rgba(128, 0, 128, 0.2), 4px 4px 12px -2.5px rgba(128, 0, 128, 0.3)`
                  : `0 0 1px rgba(75, 0, 130, 0.7), 1px 1.5px 2px -1px rgba(75, 0, 130, 0.65), 4px 4px 12px -2.5px rgba(75, 0, 130, 0.65)`,
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ml: "-18px",
                px: 0,
              }}
            >
              <Stack direction="row" spacing={1}>
                <Avatar
                  src="/images/logo.png"
                  alt="Swift Support Logo"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  Swift Support
                </Typography>
              </Stack>
              {/* <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                }}
              >
                <MenuItem
                  onClick={() => scrollToSection("features")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="h6" color="text.primary">
                    Features
                  </Typography>
                </MenuItem>
              </Box> */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <ToggleColorMode />
                {!showAuth ? (
                  <>
                    <Link href="/login">
                      <Button
                        color="primary"
                        variant="text"
                        size="small"
                        component="p"
                      >
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        component="p"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/account/dashboard">
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      component="p"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </Box>
            </Box>

            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode />
                  </Box>
                  <MenuItem onClick={() => scrollToSection("features")}>
                    Features
                  </MenuItem>
                  <Divider />
                  {!showAuth ? (
                    <>
                      <MenuItem>
                        <Link href="/register">
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{ width: "100%" }}
                          >
                            Sign up
                          </Button>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link href="/login">
                          <Button
                            color="primary"
                            variant="outlined"
                            sx={{ width: "100%" }}
                          >
                            Sign in
                          </Button>
                        </Link>
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem>
                      <Link href="/account/dashboard">
                        <Button
                          color="primary"
                          variant="contained"
                          sx={{ width: "100%" }}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </MenuItem>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
