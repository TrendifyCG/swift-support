"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  IconButton,
  TextField,
  Typography,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  DialogActions,
  DialogTitle,
  Input,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { styled } from "@mui/system";

const FloatingButton = styled(IconButton)(({ theme, show }) => ({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  background: "linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)",
  color: "white",
  boxShadow: theme.shadows[4],
  "&:hover": {
    background: "linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)",
  },
  opacity: show,
  transition: "opacity 1s ease-in-out",
}));

const ChatWindow = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "600px",
    height: "600px",
    borderRadius: "10px",
    overflow: "hidden",
    background: "white",
    boxShadow: theme.shadows[5],
  },
}));

const PromptText = styled(Typography)(({ theme, show }) => ({
  position: "fixed",
  bottom: "90px",
  right: "20px",
  background: "rgba(0,0,0,0.7)",
  color: "white",
  borderRadius: "5px",
  padding: "10px",
  boxShadow: theme.shadows[4],
  opacity: show,
  transition: "opacity 1s ease-in-out",
}));

const languages = ["English", "Spanish", "French", "German", "Italian"];

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [file, setFile]=useState()
  const [openAttachDialog, setOpenAttachDialog] = useState(false);

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
  }

  function handleAttachClick() {
    setOpenAttachDialog(true);
  }

  function handleAttachClose() {
    setOpenAttachDialog(false);
  }

  /*function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Handle the file (upload, display, etc.)
      console.log("File attached:", file);
    }
    handleAttachClose();
  }*/

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function handleFileUpload(event) {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); 
    }
    handleAttachClose();
  }

  async function handleSendMessage() {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
    const base64File = reader.result.split(',')[1]; 
  
  
    
    const requestData = {
        language,
        message,
        file: {
          base64: base64File,
          type: file.type,
        },
      };

      try {
        const response = await fetch("/api/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("API Response:", data);
        } else {
          console.error("API Error:", data.error);
        }
      } catch (error) {
        console.error("Request Failed:", error);
      }
    }
    };
  

  return (
    <>
      <PromptText variant="body2" show={showPrompt ? 1 : 0}>
        Hey, how can I help you?
      </PromptText>
      <FloatingButton onClick={handleClickOpen} show={showPrompt ? 1 : 0}>
        <ChatIcon />
      </FloatingButton>
      <ChatWindow open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Stack
            paddingBottom={2}
            sx={{
              direction: {
                xs: "column",
                md: "row",
                lg: "row",
              },
              alignItems: "flex-start",
              flex: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Chat with Us
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={handleAttachClick}
              >
                Train Bot
              </Button>

              <FormControl variant="outlined">
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  label="Language"
                  sx={{
                    borderRadius: "10px",
                    height: "42px",
                    width: "150px",
                    "& .MuiSelect-select": {
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    },
                  }}
                >
                  {languages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ flexGrow: 1, overflowY: "auto" }}>
            {/* Chat messages will go here */}
          </Stack>
          <Box sx={{ mt: "auto" }}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              placeholder="Type your message..."
              InputProps={{
                endAdornment: (
                  <Button onClick={handleSendMessage} variant="contained" color="primary">
                    Send
                  </Button>
                ),
              }}
            />
          </Box>
        </Box>
      </ChatWindow>
      <Dialog open={openAttachDialog} onClose={handleAttachClose}>
        <DialogTitle>Attach PDF</DialogTitle>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            sx={{ mb: 2 }}
          />
          <DialogActions>
            <Button onClick={handleAttachClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
