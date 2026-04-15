"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { DEFAULT_MODEL_OPTION, type ModelOption } from "@/lib/models";
import { getSupabaseClient } from "@/lib/supabase";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export interface InferenceSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  streaming: boolean;
}

export interface AuthResult {
  error: string | null;
  message: string | null;
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  settings: InferenceSettings;
  updateSettings: (newSettings: Partial<InferenceSettings>) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const defaultSettings: InferenceSettings = {
  temperature: 0.7,
  maxTokens: 512,
  topP: 0.9,
  topK: 50,
  streaming: true,
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(DEFAULT_MODEL_OPTION);
  const [settings, setSettings] = useState<InferenceSettings>(defaultSettings);
  const [isTyping, setIsTyping] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    async function initializeAuth() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setIsAuthLoading(false);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!isMounted) {
            return;
          }

          setSession(nextSession);
          setUser(nextSession?.user ?? null);
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch (error) {
        console.error("Supabase auth initialization failed:", error);

        if (!isMounted) {
          return;
        }

        setSession(null);
        setUser(null);
        setIsAuthLoading(false);
      }
    }

    void initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
    ]);
  };

  const clearMessages = () => setMessages([]);

  const updateSettings = (newSettings: Partial<InferenceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message, message: null };
      }

      return { error: null, message: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to sign in.",
        message: null,
      };
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { name } : undefined,
        },
      });

      if (error) {
        return { error: error.message, message: null };
      }

      if (!data.session) {
        return {
          error: null,
          message: "Check your email to confirm your account.",
        };
      }

      return {
        error: null,
        message: "Account created successfully.",
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to create your account.",
        message: null,
      };
    }
  };

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      clearMessages();
    } catch (error) {
      console.error("Supabase sign-out failed:", error);
    }
  };

  const isAuthenticated = Boolean(session?.access_token);

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        selectedModel,
        setSelectedModel,
        settings,
        updateSettings,
        isTyping,
        setIsTyping,
        session,
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
