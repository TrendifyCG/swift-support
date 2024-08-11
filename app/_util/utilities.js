import { v4 as uuidv4 } from "uuid";
import fs from 'fs'
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from 'path';

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  color: theme.palette.mode === "light" ? "#131B20" : "#F0F7FF",
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(255, 255, 255, 1)"
      : "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(24px)",

  boxShadow:
    theme.palette.mode === "light"
      ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
      : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return {
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: open ? drawerWidth : isLargeScreen ? theme.spacing(7) : 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backdropFilter: "blur(24px)",
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(9, 14, 16, 0.6)",
      boxSizing: "border-box",
      overflowX: "hidden",
      ...(isLargeScreen && {
        width: open ? drawerWidth : theme.spacing(7),
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    },
  };
});

export const generateUniqueId = () => {
  return uuidv4();
};

export const generateUsername = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 9;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

async function saveFileLocally(base64, type) {
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileName =
    generateUsername() + (type === "application/pdf" ? ".pdf" : ".csv");
  const filePath = path.join(tempDir, fileName);
  const buffer = Buffer.from(base64, "base64");

  fs.writeFileSync(filePath, buffer);

  return filePath;
}

export async function uploadDoc(fileData,apiKey) {
  const fileManager = new GoogleAIFileManager(apiKey);
  const { base64, type } = fileData;

  const filePath = await saveFileLocally(base64, type);

  if (type === "application/pdf" || type === "text/csv") {
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: type,
      displayName: generateUsername(),
    });

    fs.unlinkSync(filePath);

    return uploadResponse.file.uri;
  } else {
    throw new Error("Unsupported file type");
  }
}

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1];
      resolve(base64File);
    };
    reader.onerror = reject;
  });
}
