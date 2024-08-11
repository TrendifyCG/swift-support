import { Avatar, Box, Stack, Typography } from "@mui/material";

function ChatMessage({ message, isBot, user, botSending }) {
  const profilePhoto = user?.image_url?.startsWith("http")
    ? user?.image_url
    : `${process.env.NEXT_PUBLIC_URL}${user?.image_url}`;

  return (
    <Stack
      direction={isBot ? "row" : "row-reverse"}
      spacing={2}
      alignItems="flex-start"
      mb={3}
    >
      <Avatar
        sx={{ m: 1 }}
        src={isBot ? "/images/support.png" : profilePhoto}
        alt={isBot ? "Bot Avatar" : "User Avatar"}
      />
      <Box
        sx={{
          maxWidth: "70%",
          p: 2,
          borderRadius: 2,
          backgroundColor: isBot ? "lightblue" : "lightgreen",
          boxShadow: 3,
          alignSelf: isBot ? "flex-start" : "flex-end",
        }}
      >
        <Typography variant="body2">{message}</Typography>
      </Box>
    </Stack>
  );
}

export default ChatMessage;
