"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { logOut } from "@/app/_lib/auth";
import { Button } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

function Dashboard() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, loading } = useAuth();

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      if (!user) {
        toast.error("User not authenticated");
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        router.push("/login");
      }
      setLoggingOut(true);
      await logOut();
      //   handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to log out. Please try again later.");
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <div>
      <Button onClick={handleLogout} disabled={loggingOut}>
        {" "}
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
