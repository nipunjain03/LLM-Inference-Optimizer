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
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="text-primary" />
            Compare Models
          </h1>
          <p className="text-foreground mt-2 text-lg">
            Analyze available categorized open-weights LLMs based on inference speed, cost, and typical use cases.
          </p>
        </div>

        {CATEGORIZED_MODELS.map((category) => (
          <div key={category.title} className="space-y-3">
            <div className="flex items-center gap-2 pl-2">
              {category.icon}
              <h2 className="text-xl font-bold uppercase tracking-widest text-primary">{category.title}</h2>
            </div>

            <Card className="bg-card border-none retro-bevel overflow-hidden rounded-none p-1">
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-b-2 border-border">
                    <TableHead className="w-[250px] font-bold text-foreground h-12">Model</TableHead>
                    <TableHead className="font-bold text-foreground">Speed</TableHead>
                    <TableHead className="font-bold text-foreground">Cost</TableHead>
                    <TableHead className="font-bold text-foreground">Accuracy Score</TableHead>
                    <TableHead className="font-bold text-foreground">Context Window</TableHead>
                    <TableHead className="font-bold text-foreground">Best Use Case</TableHead>
                    <TableHead className="text-right text-foreground font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.models.map((model) => (
                    <TableRow
                      key={model.id}
                      className={`border-b border-border transition-colors ${selectedModel.id === model.id ? "bg-primary/10" : "hover:bg-secondary"}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3 py-2">
                          <div className={`bg-input p-2 border-none shadow-sm ${model.recommended ? "retro-bevel" : "retro-bevel-inset"}`}>
                            {model.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground font-bold">{model.name}</span>
                            {model.badge && (
                              <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-0.5">
                                {model.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border bg-input text-foreground retro-bevel-inset rounded-none">
                          {model.speed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground font-medium">{model.cost}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-input rounded-none h-3 retro-bevel-inset max-w-[100px]">
                            <div
                              className="bg-primary h-3"
                              style={{ width: `${model.accuracy}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-foreground font-bold">{model.accuracy}/100</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-bold text-sm">{model.context}</TableCell>
                      <TableCell className="text-foreground max-w-[200px] truncate">{model.useCase}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleCompareClick(model)}
                          size="sm"
                          className="bg-card hover:bg-secondary text-foreground transition-colors retro-bevel hover:retro-bevel-inset rounded-none shadow-none font-bold text-xs px-2"
                        >
                          {selectedModel.id === model.id ? "Active" : "Use Model"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
