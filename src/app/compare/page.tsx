"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { CATEGORIZED_MODELS, type ModelConfig, toModelOption } from "@/lib/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ComparePage() {
  const router = useRouter();
  const { setSelectedModel, selectedModel } = useChat();

  const handleCompareClick = (model: ModelConfig) => {
    setSelectedModel(toModelOption(model));
    router.push("/");
  };

  return (
    <div className="flex-1 overflow-y-auto soft-scroll p-4 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-slide">
        <div className="glass-card edge-highlight rounded-3xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="text-primary" />
            Compare Models
          </h1>
          <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-3xl">
            Analyze available categorized open-weights LLMs based on inference speed, cost, and typical use cases.
          </p>
        </div>

        {CATEGORIZED_MODELS.map((category) => (
          <div key={category.title} className="space-y-3">
            <div className="flex items-center gap-2 pl-2">
              {category.icon}
              <h2 className="text-lg md:text-xl font-semibold uppercase tracking-[0.16em] text-primary">{category.title}</h2>
            </div>

            <Card className="glass-card edge-highlight overflow-hidden rounded-3xl p-2 border-white/10">
              <div className="overflow-x-auto soft-scroll">
                <Table>
                  <TableHeader className="bg-black/15">
                    <TableRow className="border-b border-white/12">
                      <TableHead className="w-[250px] font-semibold text-foreground h-12">Model</TableHead>
                      <TableHead className="font-semibold text-foreground">Speed</TableHead>
                      <TableHead className="font-semibold text-foreground">Cost</TableHead>
                      <TableHead className="font-semibold text-foreground">Accuracy Score</TableHead>
                      <TableHead className="font-semibold text-foreground">Context Window</TableHead>
                      <TableHead className="font-semibold text-foreground">Best Use Case</TableHead>
                      <TableHead className="text-right text-foreground font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.models.map((model) => (
                      <TableRow
                        key={model.id}
                        className={`border-b border-white/8 transition-colors ${selectedModel.id === model.id ? "bg-primary/12" : "hover:bg-white/4"}`}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3 py-2">
                            <div className={`p-2 rounded-xl border ${model.recommended ? "bg-primary/15 border-primary/35" : "bg-black/25 border-white/10"}`}>
                              {model.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-foreground font-medium">{model.name}</span>
                              {model.badge && (
                                <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-semibold mt-0.5">
                                  {model.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/15 bg-black/20 text-foreground rounded-full">
                            {model.speed}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground font-medium">{model.cost}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full rounded-full h-2.5 bg-black/30 border border-white/10 max-w-[100px]">
                              <div
                                className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full"
                                style={{ width: `${model.accuracy}%` }}
                              />
                            </div>
                            <span className="text-xs text-foreground font-medium">{model.accuracy}/100</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground text-sm">{model.context}</TableCell>
                        <TableCell className="text-foreground max-w-[220px] truncate">{model.useCase}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleCompareClick(model)}
                            size="sm"
                            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/65 font-medium text-xs px-3"
                          >
                            {selectedModel.id === model.id ? "Active" : "Use Model"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
