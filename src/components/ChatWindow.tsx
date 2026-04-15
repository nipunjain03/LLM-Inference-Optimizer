"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Copy, Bot, User } from "lucide-react";
import { ChatInputWithModelSelector } from "./ChatInputWithModelSelector";

export function ChatWindow() {
  const { messages, isTyping } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Background Gradient */}

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-6 pb-48 px-4 md:px-8 space-y-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 retro-bevel ${
                  msg.role === "user"
                    ? "bg-card text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] px-5 py-3 retro-bevel ${
                  msg.role === "user"
                    ? "bg-secondary text-foreground"
                    : "bg-input text-foreground retro-bevel-inset"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Actions */}
                {msg.role === "ai" && (
                  <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1 text-xs"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground retro-bevel flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="px-5 py-4 bg-input text-foreground flex items-center gap-1.5 retro-bevel-inset">
                <div className="w-2 h-2 bg-foreground animate-pulse"></div>
                <div className="w-2 h-2 bg-foreground animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-foreground animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Box Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:px-8 pt-16 pointer-events-none">
        <div className="pointer-events-auto">
          <ChatInputWithModelSelector />
        </div>
      </div>
    </div>
  );
}
