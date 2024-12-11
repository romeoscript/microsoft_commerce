"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/components/reusables/input/InputComponent";
import Button from "@/components/reusables/buttons/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = new URLSearchParams(window.location.search).get("token");

    try {
      const res = await fetch("/api/password-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        toast.success("Password reset successful! Redirecting to login...");
        setLoading(false);

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await res.json();
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 shadow-md flex flex-col gap-4 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-3xl text-center text-accent font-bold">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Please enter your new password below.
        </p>

        <InputComponent
          label="New Password"
          placeholder="New Password"
          value={newPassword}
          password
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
        />

        <Button
          type="submit"
          title="Reset Password"
          color="accent"
          isLoading={loading}
        />
        <Link href={"/"} className="text-center text-blue-700">Home</Link>
      </form>

      <ToastContainer />
    </div>
  );
}
