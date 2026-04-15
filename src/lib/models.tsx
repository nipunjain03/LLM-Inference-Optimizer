import React from "react";
import { Zap, Brain, Skull, DollarSign } from "lucide-react";

export interface ModelOption {
  id: string;
  name: string;
}

export interface ModelConfig extends ModelOption {
  icon: React.ReactNode;
  speed: string;
  cost: string;
  accuracy: number;
  context: string;
  useCase: string;
  badge?: string;
  recommended?: boolean;
}

export interface ModelCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  models: ModelConfig[];
}

export const DEFAULT_MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

export const CATEGORIZED_MODELS: ModelCategory[] = [
  {
    title: "Fast",
    description: "Quick models for lightweight prompts and low-latency replies.",
    icon: <Zap size={16} className="text-yellow-500" />,
    models: [
      {
        id: "meta-llama/Llama-3.2-1B-Instruct",
        name: "Llama 3.2 1B",
        icon: <Zap size={14} className="text-yellow-500" />,
        speed: "Extremely Fast",
        cost: "Very Low",
        accuracy: 74,
        context: "128k",
        useCase: "Quick Q&A, Draft Replies",
      },
      {
        id: "NousResearch/Hermes-2-Pro-Llama-3-8B",
        name: "Hermes 2 Pro 8B",
        icon: <DollarSign size={14} className="text-green-500" />,
        speed: "Fast",
        cost: "Low",
        accuracy: 84,
        context: "8k",
        useCase: "Helpful Chat, Instruction Following",
      },
    ],
  },
  {
    title: "Balanced",
    description: "Reliable chat models with strong quality and moderate latency.",
    icon: <Brain size={16} className="text-indigo-400" />,
    models: [
      {
        id: DEFAULT_MODEL_ID,
        name: "Llama 3 8B",
        icon: <Brain size={14} className="text-indigo-400" />,
        speed: "Fast",
        cost: "Low",
        accuracy: 86,
        context: "8k",
        useCase: "General Chat, QA, Coding Help",
        recommended: true,
        badge: "Recommended",
      },
    ],
  },
  {
    title: "Powerful",
    description: "High-capability models for deeper reasoning and richer answers.",
    icon: <Skull size={16} className="text-red-500" />,
    models: [
      {
        id: "meta-llama/Meta-Llama-3-70B-Instruct",
        name: "Llama 3 70B",
        icon: <Skull size={14} className="text-red-500" />,
        speed: "Medium",
        cost: "High",
        accuracy: 92,
        context: "8k",
        useCase: "Complex Reasoning, Detailed Responses",
      },
    ],
  },
];

export const ALL_MODELS: ModelConfig[] = CATEGORIZED_MODELS.flatMap(
  (category) => category.models,
);

export const DEFAULT_MODEL: ModelConfig =
  ALL_MODELS.find((model) => model.id === DEFAULT_MODEL_ID) ?? ALL_MODELS[0]!;

export function findModelById(modelId: string): ModelConfig | undefined {
  return ALL_MODELS.find((model) => model.id === modelId);
}

export function toModelOption(model: ModelConfig): ModelOption {
  return {
    id: model.id,
    name: model.name,
  };
}

export const DEFAULT_MODEL_OPTION: ModelOption = toModelOption(DEFAULT_MODEL);
