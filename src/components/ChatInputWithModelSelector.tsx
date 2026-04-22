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
    <div className="max-w-4xl mx-auto w-full relative animate-rise">
      <div className="glass-card edge-highlight relative rounded-3xl flex flex-col p-3 md:p-4 space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Optimus..."
          className="w-full min-h-[56px] max-h-72 resize-none rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-foreground text-sm shadow-none"
          rows={2}
        />

        <div className="flex items-center justify-between gap-3 px-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap h-9 gap-2 rounded-xl bg-black/25 border border-white/12 text-foreground text-xs font-semibold transition-colors focus:outline-none px-3">
              {activeModel.icon}
              <span>{activeModel.name}</span>
              <ChevronDown size={14} className="text-muted-foreground ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[270px] bg-[#07162d] border border-white/12 rounded-2xl text-foreground p-1 shadow-2xl max-h-[350px] overflow-y-auto soft-scroll">
              {CATEGORIZED_MODELS.map((category, idx) => (
                <DropdownMenuGroup key={category.title}>
                  <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-semibold bg-primary/20 text-primary mb-1 mt-1 first:mt-0 uppercase tracking-[0.16em] rounded-lg">
                    {category.icon}
                    {category.title}
                  </DropdownMenuLabel>
                  {category.models.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(toModelOption(model))}
                      className={`flex items-center gap-2 cursor-pointer py-1.5 px-1.5 rounded-lg font-medium ${
                        selectedModel.id === model.id
                          ? "bg-primary/80 text-primary-foreground"
                          : "hover:bg-primary/15"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center rounded bg-black/30 border border-white/10">
                        {model.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{model.name}</span>
                        {model.recommended && (
                          <span className="text-[9px] text-muted-foreground lowercase">
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
                className="w-9 h-9 rounded-xl bg-accent/80 hover:bg-accent text-accent-foreground border border-accent/60"
              >
                <StopCircle size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                size="icon"
                className={`w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/60 shadow-lg transition-all ${!input.trim() ? "opacity-50 pointer-events-none" : "hover:translate-y-[-1px]"}`}
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
