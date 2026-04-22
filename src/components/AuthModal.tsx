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
      <DialogTrigger className="inline-flex items-center justify-center text-sm font-semibold rounded-full transition-colors bg-primary text-primary-foreground px-5 py-2.5 border border-primary/65 hover:bg-primary/90">
        Sign In
      </DialogTrigger>
      <DialogContent className="sm:max-w-[430px] glass-card edge-highlight border-white/15 text-foreground rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-primary/25 to-accent/20 text-foreground p-5 border-b border-white/10">
          <DialogTitle className="font-semibold text-xl">
            {isSignUp ? "Create an account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            {isSignUp
              ? "Create your account with Supabase authentication."
              : "Sign in with your Supabase account to continue."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="bg-black/20 border-white/12 text-foreground rounded-xl px-3"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="bg-black/20 border-white/12 text-foreground rounded-xl px-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="bg-black/20 border-white/12 text-foreground rounded-xl px-3"
              />
            </div>
          </div>
          {feedback && (
            <p className={`text-sm ${feedback.tone === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {feedback.text}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || isAuthLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border border-primary/65"
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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
