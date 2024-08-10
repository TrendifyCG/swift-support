"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import { useSupport } from "@/app/_context/SupportContext";

function ToggleColorMode() {
  const { state, toggleThemeMode } = useSupport();

  return (
    <Box sx={{ maxWidth: "32px", mr: 2 }}>
      <Button
        variant="text"
        onClick={toggleThemeMode}
        size="small"
        aria-label="button to toggle theme"
        sx={{
          minWidth: "32px",
          height: "32px",
          p: "4px",
          bgcolor: "rgba(156, 45, 255, 0.1)",
        }}
      >
        {state.themeMode === "dark" ? (
          <WbSunnyRoundedIcon fontSize="small" />
        ) : (
          <ModeNightRoundedIcon fontSize="small" />
        )}
      </Button>
    </Box>
  );
}

export default ToggleColorMode;
