"use client";

import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const chatMessages = [
  { user: "support", text: "Hello! How can I assist you today?" },
  { user: "customer", text: "I need help with my account." },
  {
    user: "support",
    text: "Sure, I can help with that. What seems to be the problem?",
  },
  { user: "customer", text: "I forgot my password." },
  {
    user: "support",
    text: "No problem! I'll guide you through the reset process.",
  },
  { user: "customer", text: "Thank you! I appreciate it." },
  { user: "support", text: "You're welcome! Let's get started." },
  { user: "customer", text: "Okay, I'm there." },
];

const ChatText = ({ text, user }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      marginBottom: 2,
      textAlign: user === "support" ? "left" : "right",
      flexDirection: user === "support" ? "row" : "row-reverse",
    }}
  >
    <Box
      component="img"
      src={user === "support" ? "/images/support.png" : "/images/customer.png"}
      alt={`${user} avatar`}
      sx={{ width: 40, height: 40, borderRadius: "50%", marginRight: 1 }}
    />
    <Box
      sx={{
        maxWidth: "80%",
        padding: 1,
        borderRadius: 2,
        backgroundColor: user === "support" ? "#E0F7FA" : "#EDE7F6",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          color: user === "support" ? "#1976D2" : "#8E24AA",
        }}
      >
        <Typewriter
          words={[text]}
          loop={1}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </Typography>
    </Box>
  </Box>
);

const ChatBox = () => {
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    const timers = chatMessages.map((message, index) =>
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, message]);
      }, index * 4500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        padding: 2,
        borderRadius: 2,
        minHeight: 400,
        width: "100%",
        height: 500,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        background:
          theme.palette.mode == "light"
            ? "linear-gradient(to bottom right, #ECEFF1, #F1FBFF)"
            : "linear-gradient(to bottom right, #161C20, #211D1D)",
        boxShadow:
          theme.palette.mode === "light"
            ? `0 0 1px rgba(128, 0, 128, 0.1), 1px 1.5px 2px -1px rgba(128, 0, 128, 0.2), 4px 4px 12px -2.5px rgba(128, 0, 128, 0.3)`
            : `0 0 1px rgba(75, 0, 130, 0.7), 1px 1.5px 2px -1px rgba(75, 0, 130, 0.65), 4px 4px 12px -2.5px rgba(75, 0, 130, 0.65)`,
      })}
    >
      {visibleMessages.map((message, index) => (
        <ChatText key={index} text={message.text} user={message.user} />
      ))}
    </Paper>
  );
};

export default function Features() {
  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid
        container
        spacing={6}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Grid
          item
          xs={10}
          md={10}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <div>
            <Typography
              data-aos="fade-up"
              component="h2"
              variant="h4"
              color="text.primary"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              Enhance Your Customer Support
            </Typography>
            <Typography
              data-aos="fade-up"
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              Experience top-notch customer support with our AI-powered chatbot.
              Designed to handle inquiries efficiently, provide instant
              responses, and ensure a seamless interaction with your clients.
              Discover how our solution can elevate your support management.
            </Typography>
          </div>

          <Card
            data-aos="fade-up"
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                m: "auto",
                width: "100%",
                height: 500,
              }}
            >
              <ChatBox />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
