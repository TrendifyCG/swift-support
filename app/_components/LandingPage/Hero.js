"use client";
import { alpha, Link } from "@mui/material";
import Box from "@mui/material/Box";
import { Mulish } from "next/font/google";
import { Nunito } from "next/font/google";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";

 const mulish=Mulish({
    subsets: ["latin"],
    display: "swap",
  })
const nunito=Nunito({
  subsets: ["latin"],
  display: "swap",
})
export default function Hero({ userLoading, user }) {
  const router = useRouter();
 
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #be75ff66, #FFF)"
            : `linear-gradient(#4E024F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: "center",
          pt: { xs: 14, sm: 13 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            // className="animated-text animatedFadeInUp fadeInUp"
            data-aos="fade-down"
            variant="h1"
            fontFamily={mulish.style.fontFamily}
            sx={{
              // display: "flex",
              // flexDirection: { xs: "column", md: "row" },
              alignSelf: {
                xs: "center",
                md: "flex-start",
              },
              
              textAlign: {
                xs: "center",
                md: "left",
              },
              fontSize: {
                xs: "clamp(1.5rem, 10vw, 2.5rem)",
                sm: "clamp(1.5rem, 10vw, 2.5rem)",
                md: "clamp(1.5rem, 10vw, 2.5rem)",
                lg: "clamp(1.5rem, 10vw, 2.5rem)",
              },
            }}
          >
            Elevate Your&nbsp;
            <Typography
              component="span"
              variant="h1"
            fontFamily={mulish.style.fontFamily}
              sx={{
                fontSize: {
                  xs: "clamp(1.5rem, 10vw, 2.5rem)",
                  sm: "clamp(1.5rem, 10vw, 2.5rem)",
                  md: "clamp(1.5rem, 10vw, 2.5rem)",
                  lg: "clamp(1.5rem, 10vw, 2.5rem)",
                },
                background:
                  "linear-gradient(to right, rgb(96, 88, 230), rgb(209, 88, 230))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Customer Support&nbsp;
            </Typography>
            <Typography
              component="span"
              
            fontFamily={mulish.style.fontFamily}
              variant="h1"
              sx={{
                fontSize: {
                  xs: "clamp(1.5rem, 10vw, 2.5rem)",
                  sm: "clamp(1.5rem, 10vw, 2.5rem)",
                  md: "clamp(1.5rem, 10vw, 2.5rem)",
                  lg: "clamp(1.5rem, 10vw, 2.5rem)",
                },
              }}
            >
              Management
            </Typography>
          </Typography>
          <Typography
            data-aos="fade-left"
            color="text.secondary"
            
            fontFamily={nunito.style.fontFamily}
            sx={{
              alignSelf: {
                xs: "center",
                md: "flex-start",
              },
              width: { sm: "100%", md: "80%" },
              textAlign: {
                xs: "center",
                md: "left",
              },
              animationDuration: 3,
            }}
          >
            Enhance your customer support with our intelligent chatbot. Deliver
            quick, personalized assistance, streamline interactions, and keep
            your customers satisfied around the clock.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            useFlexGap
            sx={{
              pt: 1,
              width: { xs: "100%", sm: "auto" },
              alignSelf: {
                xs: "center",
                md: "flex-start",
              },
              alignItems: {
                xs: "center",
                md: "flex-start",
              },
            }}
          >
            <Button variant="contained" sx={{fontFamily:mulish.style.fontFamily}} color="primary" data-aos="fade-up">
              Start now
            </Button>
          </Stack>
        </Stack>
        <Box
          data-aos="fade-up"
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: "center",
            height: { xs: 200, sm: 400 },
            width: "100%",
            backgroundImage:
              theme.palette.mode === "light"
                ? 'url("images/hero-bg.png")'
                : 'url("images/hero-bg.png")',
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            outlineColor:
              theme.palette.mode === "light"
                ? alpha("#BFCCD9", 0.5)
                : alpha("#9CCCFC", 0.1),
          })}
        />
      </Container>
    </Box>
  );
}
