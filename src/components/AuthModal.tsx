"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthModal() {
  const { login, signUp, isAuthLoading } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const result = isSignUp
      ? await signUp(name, email, password)
      : await login(email, password);

    setIsSubmitting(false);

    if (result.error) {
      setFeedback({ tone: "error", text: result.error });
      return;
    }

    if (result.message) {
      setFeedback({ tone: "success", text: result.message });
      if (result.message.includes("Check your email")) {
        return;
      }
    }

    resetForm();
    setIsOpen(false);
  };

  const handleModeToggle = () => {
    setIsSignUp((prev) => !prev);
    setFeedback(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
      setIsSignUp(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex items-center justify-center text-sm font-bold transition-colors bg-card retro-bevel active:retro-bevel-inset text-foreground px-6 py-2">
        Sign In
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card retro-bevel border-none text-foreground rounded-none p-1">
        <DialogHeader className="bg-primary retro-bevel text-primary-foreground p-1 mb-2">
          <DialogTitle className="font-bold flex items-center justify-between px-1">
            {isSignUp ? "Create an account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/80 px-1">
            {isSignUp
              ? "Create your account with Supabase authentication."
              : "Sign in with your Supabase account to continue."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-3 pb-3">
          <div className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="bg-input border-none retro-bevel-inset text-foreground rounded-none px-2"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="bg-input border-none retro-bevel-inset text-foreground rounded-none px-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="bg-input border-none retro-bevel-inset text-foreground rounded-none px-2"
              />
            </div>
          </div>
          {feedback && (
            <p className={`text-sm font-bold ${feedback.tone === "error" ? "text-red-500" : "text-green-600"}`}>
              {feedback.text}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || isAuthLoading}
            className="w-full bg-card retro-bevel hover:retro-bevel-inset active:retro-bevel-inset text-foreground font-bold shadow-none rounded-none border-none"
          >
            {isSubmitting
              ? "Working..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </Button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleModeToggle}
              className="text-sm text-foreground hover:underline font-bold"
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
