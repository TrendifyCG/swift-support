"use client";
import { Nunito, Roboto} from '@next/font/google';
import React, { useEffect, useState } from "react";
import {
  Button,
  Rating,
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import { convertFileToBase64 } from "@/app/_util/utilities";
import { useAuth } from "../_context/AuthContext";
import Link from "next/link";

const nunito = Nunito({
  weight: ['400', '500', '700'],
  style: ['italic'],
  subsets:['latin']
});
const roboto=Roboto({
  weight: ['400', '500', '700'],
  style: ['italic'],
  subsets:['latin']
});

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
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(2);
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback]=useState("")
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState(languages[0]);
  const [file, setFile] = useState();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [openAttachDialog, setOpenAttachDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
  }

  function handleAttachClick() {
    setOpenAttachDialog(true);
  }

  function handleFeedbackClick() {
    setOpenFeedbackDialog(true);
  }


  function handleAttachClose() {
    setOpenAttachDialog(false);
  }
  function handleFeedbackClose() {
    setOpenAttachDialog(false);
  }

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
      toast.error("Please enter a message.");
      return;
    }

    if (!user && !loading) {
      toast.error("User is not authenticated");
      return;
    }

    let requestData = {
      language,
      message,
    };

    if (file) {
      setUploadingFile(true);
      try {
        const base64File = await convertFileToBase64(file);

        requestData.file = {
          base64: base64File,
          type: file.type,
        };
      } catch (error) {
        toast.error("Failed to process the file. Please try again.");
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    try {
      // Send the request to the server
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("DATA: ", data);
        // const conversationData = {
        //   userId: user.user_id,
        //   user_message: message,
        //   bot_message: output,
        //   sender: systemInstruction,
        //   file_url: file || file.type || file.base64 ? file : null,
        //   language: language,
        //   timestamp: new Date().toISOString(),
        // };

        // await saveConversations(conversationData);
      } else {
        console.error("API Error:", data.error);
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Request Failed:", error);
    }
  }

  return (
    <>
      <PromptText variant="body2" show={showPrompt ? 1 : 0}>
        Hey 👋, I&apos;m here
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
          {!user && !loading ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  You are not Authenticated. Login to continue
                </Typography>
                <Link href="/login">
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "160px",
                        md: "160px",
                        lg: "160px",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <>
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
                      <Button
                        onClick={handleSendMessage}
                        variant="contained"
                        color="primary"
                      >
                        Send
                      </Button>
                    ),
                  }}
                />
              </Box>
            </>
          )}
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

      <Dialog  open={openFeedbackDialog} onClose={handleFeedbackClose}>
       <DialogTitle sx={{fontSize:"23px",fontFamily:roboto.style.fontFamily}}>Leave Feedback</DialogTitle>
      <Box sx={{p:3,display:"flex", flexDirection:"column"}}>
      <Stack sx={{display:"flex", flexDirection:"row"}}>
      <Typography component="legend"   sx={{ fontFamily: nunito.style.fontFamily }}>Rate Conversation:</Typography>
      <Rating
        name="product-rating"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
       <TextField      
            type="text"
            fullWidth
            variant='outlined'
            placeholder='Enter your feedback...'
            onChange={(e)=>setFeedback(e.target.value)}
            sx={{ mb: 2 }}
          />
         
      </Stack>
      </Box>
</Dialog>
    </>
  );
}
