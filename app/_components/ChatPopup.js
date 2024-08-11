"use client";

import { saveFeedback } from "../_lib/data-service";
import { DeleteForeverRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Rating,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/system";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../_context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

import { useSupport } from "../_context/SupportContext";
import {
  deleteFile,
  deleteFileMetadata,
  getConversations,
  getUserFile,
  saveConversations,
  saveFileMetadata,
} from "../_lib/data-service";
import ChatMessage from "./Backend/Chats/ChatMessage";

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
  const [value, setValue] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState(languages[0]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileId, setFileId] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [openAttachDialog, setOpenAttachDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [deletingFile, setDeletingFile] = useState(false);
  const initialBotMessage = "Hello! How can I assist you today?";
  const [botSending, setBotSending] = useState(false);
  const [pdfContent, setPdfContent] = useState("");
  const [pdfId, setPdfId] = useState("");
  const hasFetchedLastMessage = useRef(false);

  const { state, updateConversationList, dispatch } = useSupport();

  const memoizedConversationListLength = useMemo(
    () => state.conversationList.length,
    [state.conversationList]
  );

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
    setOpenFeedbackDialog(false);
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

  async function handleFileUpload(event) {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setUploadingFile(true);
      try {
        const data = await uploadFile(uploadedFile);
        setFileUrl(data.fileUrl);
        setFileId(data.id);
        setUploadingFile(false);
      } catch (error) {
        console.log(error);
        toast.error("File upload failed. Please try again.");
        setUploadingFile(false);
      } finally {
        handleAttachClose();
      }
    }
  }

  const handleRemoveFile = async () => {
    setDeletingFile(true);
    try {
      const filePath = `files/${fileId}`;
      await deleteFile(filePath);
      await deleteFileMetadata(pdfId);
      toast.success("File removed successfully.");
      setFileUrl("");
      setFileId("");
      setPdfContent("");
      setPdfId("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove file. Please try again later.");
    } finally {
      setDeletingFile(false);
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.fileUrl;

        const responseFile = await fetch("/api/parsePdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl }),
        });

        if (!responseFile.ok) {
          throw new Error("Failed to fetch PDF content");
        }

        const dataFile = await responseFile.json();
        setPdfContent(dataFile.text);

        const metadataObject = {
          userId: user.uid,
          content: dataFile.text,
          fileUrl: fileUrl || null,
          fileId: data.id || null,
          timestamp: new Date().toISOString(),
        };

        const filemetaId = await saveFileMetadata(metadataObject);
        setPdfId(filemetaId);
        return data;
      } else {
        throw new Error("File upload failed.");
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast.error(error.message);
    }
  };

  async function handleSendMessage(e) {
    e.preventDefault();

    if (!message) {
      toast.error("Please enter a message.");
      return;
    }

    if (!user && !loading) {
      toast.error("User is not authenticated");
      return;
    }

    const newMessage = {
      userId: user.uid,
      userMessage: message,
      botMessage: null,
      fileUrl: fileUrl || null,
      fileId: fileId || null,
      filemetaId: pdfId || null,
      language,
      timestamp: new Date().toISOString(),
    };

    updateConversationList([...state.conversationList, newMessage]);
    setMessage("");
    setBotSending(true);

    try {
      const requestData = {
        language,
        message,
        pdfContent: pdfContent || null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedConversation = {
          ...newMessage,
          botMessage: data.response,
        };

        updateConversationList((prevList) => [
          ...prevList.slice(0, -1),
          { ...newMessage, botMessage: data.response },
        ]);

        // setBotSending(false);
        await saveConversations(updatedConversation);
      } else {
        // setBotSending(false);
        throw new Error(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      updateConversationList((prevList) =>
        prevList.map((conv) =>
          conv.timestamp === newMessage.timestamp
            ? { ...conv, botMessage: "Failed to send. Please try again." }
            : conv
        )
      );
    } finally {
      setBotSending(false);
    }
  }

  const sendFeedback = async () => {
    try {
      const feed = {
        uid: user?.uid,
        feedback: feedback,
        rating: value,
      };
      const save = await saveFeedback(feed);
      toast.success("Thanks for your feedback!");
      handleFeedbackClose();
    } catch (error) {
      toast.error("Request failed:", error);
    }
  };
  useEffect(() => {
    if (!user || memoizedConversationListLength <= 0) return;

    const fetchLastMessage = async () => {
      try {
        const content = await getUserFile(user);

        if (content?.id) {
          setFileId(content.data.fileId);
          setPdfContent(content.data.content);
          setFileUrl(content.data.fileUrl);
          setPdfId(content.id);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching last message:", error.message);
      }
    };

    if (!hasFetchedLastMessage.current && memoizedConversationListLength > 0) {
      fetchLastMessage();
      hasFetchedLastMessage.current = true;
    }
  }, [user, memoizedConversationListLength]);

  useEffect(() => {
    if (!user || memoizedConversationListLength > 0) return;

    const fetchConversations = async () => {
      dispatch({ type: "SET_CONVERSATION_LOADING", payload: true });

      try {
        const conversations = await getConversations(user);

        updateConversationList(conversations);
      } catch (error) {
        toast.error("Error fetching conversations:", error);
      } finally {
        dispatch({ type: "SET_CONVERSATION_LOADING", payload: false });
      }
    };

    fetchConversations();
  }, [user, dispatch, updateConversationList, memoizedConversationListLength]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.conversationList]);

  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }

  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [open]);

  return (
    <>
      <PromptText variant="body2" show={showPrompt ? 1 : 0}>
        Hey 👋, I&apos;m here
      </PromptText>
      <FloatingButton onClick={handleClickOpen} show={showPrompt ? 1 : 0}>
        <ChatIcon />
      </FloatingButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={(theme) => ({
          "& .MuiDialog-paper": {
            width: "600px",
            height: "600px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "white",
            boxShadow: theme.shadows[5],
          },
        })}
      >
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
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Chat with Us</Typography>
                  <Button
                    onClick={handleFeedbackClick}
                    variant="contained"
                    color="primary"
                  >
                    Give Feedback
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  {!fileUrl ? (
                    <Button
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      onClick={handleAttachClick}
                    >
                      Train Bot
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<DeleteForeverRounded />}
                      onClick={handleRemoveFile}
                      disabled={deletingFile}
                      sx={{
                        "&.Mui-disabled": {
                          color: "#fff",
                          backgroundImage:
                            "linear-gradient(to bottom, #646669, #B5B8BB)",
                        },
                      }}
                    >
                      {deletingFile ? "Removing..." : "Remove Pdf"}
                    </Button>
                  )}

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
              <Stack spacing={2} sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                {state.conversationList.length === 0 ? (
                  <ChatMessage
                    message={initialBotMessage}
                    isBot={true}
                    user={user}
                    botSending={botSending}
                  />
                ) : (
                  state.conversationList
                    .slice()
                    .sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    )
                    .map((conversation, index) => (
                      <div key={index}>
                        <ChatMessage
                          message={conversation.userMessage}
                          isBot={false}
                          user={user}
                          botSending={botSending}
                        />
                        <ChatMessage
                          message={conversation.botMessage}
                          isBot={true}
                          user={user}
                          botSending={botSending}
                        />
                      </div>
                    ))
                )}
                <div ref={endOfMessagesRef} />
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
      </Dialog>
      <Dialog open={openAttachDialog} onClose={handleAttachClose}>
        <DialogTitle>Attach PDF</DialogTitle>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            sx={{ mb: 2 }}
          />
          {uploadingFile && <CircularProgress sx={{ mb: 2 }} />}
          <DialogActions>
            <Button onClick={handleAttachClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={openFeedbackDialog} onClose={handleFeedbackClose}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 1rem",
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "23px",
            }}
          >
            Leave Feedback
          </DialogTitle>
          <IconButton onClick={handleFeedbackClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Stack>{" "}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Typography component="legend" sx={{ marginRight: "3px" }}>
              Rate Conversation:
            </Typography>
            <Rating
              name="product-rating"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Stack>
          <TextField
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Enter your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2, marginTop: "1rem" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendFeedback}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
