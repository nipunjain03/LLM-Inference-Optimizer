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
    <section className="flex-1 flex flex-col h-full relative px-3 md:px-5 pb-3 md:pb-4">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-45" />

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto soft-scroll pt-5 md:pt-6 pb-56 px-1 md:px-2 space-y-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && !isTyping && (
            <div className="glass-card edge-highlight rounded-3xl p-8 md:p-10 animate-rise">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary mb-3">Ready</p>
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground max-w-xl">
                Build and test inference prompts with faster feedback loops.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                Choose a model, send your first message, then fine-tune generation controls in the Optimize page.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 animate-rise ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 border ${
                  msg.role === "user"
                    ? "bg-accent/85 text-accent-foreground border-accent/60"
                    : "bg-primary/85 text-primary-foreground border-primary/60"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`group relative max-w-[88%] md:max-w-[78%] px-4 md:px-5 py-3.5 rounded-2xl border shadow-xl ${
                  msg.role === "user"
                    ? "bg-[#183251]/80 border-[#2b5a8d]/70 text-foreground"
                    : "bg-[#0c1f3f]/70 border-white/12 text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-[15px]">
                  {msg.content}
                </div>

                {msg.role === "ai" && (
                  <div className="absolute -bottom-7 left-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="text-muted-foreground hover:text-foreground transition flex items-center gap-1 text-xs"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-rise">
              <div className="w-9 h-9 rounded-2xl bg-primary/85 text-primary-foreground border border-primary/60 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="px-5 py-4 bg-[#0c1f3f]/70 border border-white/12 text-foreground flex items-center gap-2 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-3 md:px-6 pb-4 pt-16 pointer-events-none z-20">
        <div className="pointer-events-auto">
          <ChatInputWithModelSelector />
        </div>
      </div>
    </section>
  );
}
