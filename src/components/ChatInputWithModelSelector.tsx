"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, StopCircle, ChevronDown } from "lucide-react";
import {
  CATEGORIZED_MODELS,
  DEFAULT_MODEL,
  findModelById,
  toModelOption,
} from "@/lib/models";
import { getAccessToken } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function ChatInputWithModelSelector() {
  const { isTyping, setIsTyping, addMessage, selectedModel, setSelectedModel, settings } = useChat();
  const [input, setInput] = useState("");

  const activeModel = findModelById(selectedModel.id) ?? DEFAULT_MODEL;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Please sign in before sending a message.");
      }

      const userMessage = input;
      console.log("Sending model:", selectedModel.id);
      addMessage({
        role: "user",
        content: userMessage,
      });
      setInput("");
      setIsTyping(true);

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel.id,
          settings: {
            temperature: settings.temperature,
            max_tokens: settings.maxTokens,
            top_p: settings.topP,
            top_k: settings.topK,
            stream: false,
          },
        }),
      });

      if (!response.ok) {
        let errorMsg = `API error: ${response.status}`;
        try {
          const errData = await response.json();
          const detail = errData?.detail;

          if (detail?.error && detail?.requested) {
            errorMsg = `${detail.error} (requested: ${detail.requested})`;
          } else {
            errorMsg = detail?.error || detail || errorMsg;
          }
        } catch {
          errorMsg = (await response.text()) || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const responseString =
        typeof data.response === "string"
          ? data.response
          : Array.isArray(data.response)
            ? data.response[0]?.generated_text
            : data.response?.choices?.[0]?.message?.content;

      addMessage({
        role: "ai",
        content: responseString || "Empty response from model.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Backend Error:", error);
      addMessage({
        role: "ai",
        content: `Error connecting to Inference Node: ${errorMessage}`,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full relative">
      <div className="relative bg-card retro-bevel flex flex-col p-2 space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Optimus..."
          className="w-full min-h-[52px] max-h-72 resize-none bg-input retro-bevel-inset border-none px-2 py-3 text-foreground text-sm font-bold shadow-none rounded-none"
          rows={2}
        />

        <div className="flex items-center justify-between px-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap h-8 gap-2 bg-card text-foreground font-bold text-xs transition-colors focus:outline-none retro-bevel px-2 py-1 active:retro-bevel-inset">
              {activeModel.icon}
              <span>{activeModel.name}</span>
              <ChevronDown size={14} className="text-foreground ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px] bg-card retro-bevel rounded-none text-foreground p-1 shadow-none border-none max-h-[350px] overflow-y-auto">
              {CATEGORIZED_MODELS.map((category, idx) => (
                <DropdownMenuGroup key={category.title}>
                  <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold bg-primary text-primary-foreground mb-1 mt-1 first:mt-0 uppercase tracking-widest">
                    {category.icon}
                    {category.title}
                  </DropdownMenuLabel>
                  {category.models.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(toModelOption(model))}
                      className={`flex items-center gap-2 cursor-pointer py-1 px-1 rounded-none font-bold ${
                        selectedModel.id === model.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center bg-input retro-bevel-inset">
                        {model.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{model.name}</span>
                        {model.recommended && (
                          <span className="text-[9px] text-primary-foreground/80 lowercase">
                            recommended default
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {idx < CATEGORIZED_MODELS.length - 1 && (
                    <DropdownMenuSeparator className="bg-border" />
                  )}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center">
            {isTyping ? (
              <Button
                onClick={() => setIsTyping(false)}
                size="icon"
                className="w-8 h-8 bg-card text-foreground retro-bevel active:retro-bevel-inset shadow-none rounded-none"
              >
                <StopCircle size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                size="icon"
                className={`w-8 h-8 bg-card text-foreground retro-bevel shadow-none rounded-none transition-none ${!input.trim() ? "opacity-50 pointer-events-none" : "hover:bg-card active:retro-bevel-inset"}`}
                disabled={!input.trim()}
              >
                <Send size={14} className={input.trim() ? "ml-0.5" : ""} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
