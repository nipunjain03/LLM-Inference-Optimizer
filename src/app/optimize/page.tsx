"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export default function OptimizePage() {
  const { settings, updateSettings } = useChat();

  return (
    <div className="flex-1 overflow-y-auto soft-scroll p-4 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-slide">
        <div className="glass-card edge-highlight rounded-3xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            <Settings2 className="text-primary" />
            Inference Optimization
          </h1>
          <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-3xl">
            Fine-tune the mathematical parameters guiding model output generation. Changes apply globally to your chat context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card edge-highlight rounded-3xl border-white/12">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold">Temperature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Controls randomness. Lower values provide focused, deterministic answers. Higher values push creative unpredictability.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-medium">Value</span>
                <span className="text-sm font-semibold bg-black/25 px-3 py-1 rounded-full border border-white/10">
                  {settings.temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.temperature]}
                min={0}
                max={2}
                step={0.01}
                onValueChange={(val) => updateSettings({ temperature: Array.isArray(val) ? val[0] : val })}
                className="cursor-pointer"
              />
            </CardContent>
          </Card>

          <Card className="glass-card edge-highlight rounded-3xl border-white/12">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold">Max Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Limits output length. Controls the absolute maximum length of the generated response.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-medium">Value</span>
                <span className="text-sm font-semibold bg-black/25 px-3 py-1 rounded-full border border-white/10">
                  {settings.maxTokens}
                </span>
              </div>
              <Slider
                value={[settings.maxTokens]}
                min={1}
                max={4096}
                step={1}
                onValueChange={(val) => updateSettings({ maxTokens: Array.isArray(val) ? val[0] : val })}
                className="cursor-pointer"
              />
            </CardContent>
          </Card>

          <Card className="glass-card edge-highlight rounded-3xl border-white/12">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold">Top-P (Nucleus)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Restricts generation vocabulary to the cumulative probability tokens.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-medium">Value</span>
                <span className="text-sm font-semibold bg-black/25 px-3 py-1 rounded-full border border-white/10">
                  {settings.topP.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[settings.topP]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(val) => updateSettings({ topP: Array.isArray(val) ? val[0] : val })}
                className="cursor-pointer"
              />
            </CardContent>
          </Card>

          <Card className="glass-card edge-highlight rounded-3xl border-white/12">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold">Top-K</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Restricts vocabulary to the top K most probable tokens before sampling.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-medium">Value</span>
                <span className="text-sm font-semibold bg-black/25 px-3 py-1 rounded-full border border-white/10">
                  {settings.topK}
                </span>
              </div>
              <Slider
                value={[settings.topK]}
                min={1}
                max={100}
                step={1}
                onValueChange={(val) => updateSettings({ topK: Array.isArray(val) ? val[0] : val })}
                className="cursor-pointer"
              />
            </CardContent>
          </Card>

          <Card className="glass-card edge-highlight rounded-3xl border-white/12 md:col-span-2">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-semibold">Streaming Response</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col space-y-4">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Stream the inference payload incrementally back to your browser as it generates.
              </CardDescription>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <Label className="text-foreground font-medium text-sm">Enable Streaming</Label>
                <Switch
                  checked={settings.streaming}
                  onCheckedChange={(val) => updateSettings({ streaming: val })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
