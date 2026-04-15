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
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Settings2 className="text-primary" />
            Inference Optimization
          </h1>
          <p className="text-foreground mt-2 text-lg">
            Fine-tune the mathematical parameters guiding model output generation. Changes apply globally to your chat context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-none retro-bevel rounded-none">
            <CardHeader className="bg-primary text-primary-foreground p-2 retro-bevel m-1">
              <CardTitle className="text-lg font-bold">Temperature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <CardDescription className="text-foreground font-bold">
                Controls randomness. Lower values provide focused, deterministic answers. Higher values push creative unpredictability.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-bold">Value</span>
                <span className="text-sm font-bold bg-input px-2 py-1 retro-bevel-inset">
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

          <Card className="bg-card border-none retro-bevel rounded-none">
            <CardHeader className="bg-primary text-primary-foreground p-2 retro-bevel m-1">
              <CardTitle className="text-lg font-bold">Max Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <CardDescription className="text-foreground font-bold">
                Limits output length. Controls the absolute maximum length of the generated response.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-bold">Value</span>
                <span className="text-sm font-bold bg-input px-2 py-1 retro-bevel-inset">
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

          <Card className="bg-card border-none retro-bevel rounded-none">
            <CardHeader className="bg-primary text-primary-foreground p-2 retro-bevel m-1">
              <CardTitle className="text-lg font-bold">Top-P (Nucleus)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <CardDescription className="text-foreground font-bold">
                Restricts generation vocabulary to the cumulative probability tokens.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-bold">Value</span>
                <span className="text-sm font-bold bg-input px-2 py-1 retro-bevel-inset">
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

          <Card className="bg-card border-none retro-bevel rounded-none">
            <CardHeader className="bg-primary text-primary-foreground p-2 retro-bevel m-1">
              <CardTitle className="text-lg font-bold">Top-K</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <CardDescription className="text-foreground font-bold">
                Restricts vocabulary to the top K most probable tokens before sampling.
              </CardDescription>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-sm font-bold">Value</span>
                <span className="text-sm font-bold bg-input px-2 py-1 retro-bevel-inset">
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

          <Card className="bg-card border-none retro-bevel rounded-none md:col-span-2">
            <CardHeader className="bg-primary text-primary-foreground p-2 retro-bevel m-1">
              <CardTitle className="text-lg font-bold">Streaming Response</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col space-y-4">
              <CardDescription className="text-foreground font-bold">
                Stream the inference payload incrementally back to your browser as it generates.
              </CardDescription>
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-bold text-sm">Enable Streaming</Label>
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
