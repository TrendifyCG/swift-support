"use client";

import SignupPage from "@/app/_components/Auth/SignupPage";
import ClientOnly from "@/app/_components/ClientOnly";

function Register() {
  return (
    <ClientOnly>
      <SignupPage />;
    </ClientOnly>
  );
}

export default Register;
