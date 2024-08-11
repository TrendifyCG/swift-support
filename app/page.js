"use client";

import ClientOnly from "@/app/_components/ClientOnly";
import AppBar from "@/app/_components/LandingPage/AppBar";
import Features from "@/app/_components/LandingPage/Features";
import Footer from "@/app/_components/LandingPage/Footer";
import Hero from "@/app/_components/LandingPage/Hero";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
import ChatPopup from "@/app/_components/ChatPopup";
import { useSupport } from "@/app/_context/SupportContext";
import { useAuth } from "@/app/_context/AuthContext";

export default function LandingPage() {
  const { user, loading: userLoading } = useAuth();

  const { state } = useSupport();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });

    AOS.refresh();
  }, [state.themeMode]);

  return (
    <ClientOnly>
      <CssBaseline />
      <AppBar user={user} userLoading={userLoading} />
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Features />
        <Footer />
        {!userLoading && <ChatPopup />}
      </Box>
    </ClientOnly>
  );
}
