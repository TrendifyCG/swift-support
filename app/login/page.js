"use client";

import LoginPage from "@/app/_components/Auth/LoginPage";
import ClientOnly from "@/app/_components/ClientOnly";

function Login() {
  return (
    <ClientOnly>
      <LoginPage />
    </ClientOnly>
  );
}

export default Login;
