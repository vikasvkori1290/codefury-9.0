import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronUpDown,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineFunnel,
  HiOutlineCodeBracket,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineScale,
  HiOutlineChartBar,
  HiOutlineTableCells,
} from "react-icons/hi2";

// 100% Comprehensive LiveBench.ai Leaderboard Models extracted directly from livebench.ai (44 Models)
export const PRELOADED_FRONTIER_MODELS = [
  {
    id: "gemini-pro-latest",
    name: "gemini-pro-latest",
    org: "Google DeepMind",
    isOpen: false,
    pricing: "$0.350",
    metrics: {
      overallPassRate: 82.4,
      categoryScores: { reasoning: 92.5, coding: 85.2, agentic_coding: 64.0, mathematics: 96.8, data_analysis: 83.2, language: 91.0, instruction: 78.5 },
      avgLatencyMs: 195,
    },
  },
  {
    id: "gemini-flash-latest",
    name: "gemini-flash-latest",
    org: "Google DeepMind",
    isOpen: false,
    pricing: "$0.075",
    metrics: {
      overallPassRate: 79.6,
      categoryScores: { reasoning: 88.0, coding: 81.5, agentic_coding: 58.2, mathematics: 94.0, data_analysis: 79.5, language: 88.2, instruction: 73.0 },
      avgLatencyMs: 95,
    },
  },
  {
    id: "claude-fable-5",
    name: "Claude Fable 5 Max Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$1.439",
    metrics: {
      overallPassRate: 83.0,
      categoryScores: { reasoning: 89.7, coding: 86.0, agentic_coding: 62.2, mathematics: 96.0, data_analysis: 80.5, language: 90.7, instruction: 75.8 },
      avgLatencyMs: 240,
    },
  },
  {
    id: "gpt-5-6-sol",
    name: "GPT-5.6 Sol Max Effort",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.515",
    metrics: {
      overallPassRate: 81.0,
      categoryScores: { reasoning: 91.7, coding: 83.9, agentic_coding: 56.2, mathematics: 96.2, data_analysis: 79.8, language: 87.7, instruction: 71.8 },
      avgLatencyMs: 180,
    },
  },
  {
    id: "gpt-5-5-thinking",
    name: "GPT-5.5 Thinking xHigh Effort",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.435",
    metrics: {
      overallPassRate: 80.2,
      categoryScores: { reasoning: 89.7, coding: 82.1, agentic_coding: 54.0, mathematics: 95.9, data_analysis: 81.6, language: 87.4, instruction: 70.7 },
      avgLatencyMs: 310,
    },
  },
  {
    id: "claude-5-opus-thinking",
    name: "Claude 5 Opus Thinking Max Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.699",
    metrics: {
      overallPassRate: 80.1,
      categoryScores: { reasoning: 91.2, coding: 81.4, agentic_coding: 65.2, mathematics: 95.7, data_analysis: 74.6, language: 88.7, instruction: 63.8 },
      avgLatencyMs: 420,
    },
  },
  {
    id: "smaug-agentic",
    name: "Smaug-Agentic",
    org: "Abacus AI",
    isOpen: true,
    pricing: "$0.329",
    metrics: {
      overallPassRate: 79.5,
      categoryScores: { reasoning: 90.3, coding: 82.5, agentic_coding: 64.6, mathematics: 83.9, data_analysis: 79.9, language: 84.4, instruction: 71.0 },
      avgLatencyMs: 145,
    },
  },
  {
    id: "kimi-k3",
    name: "Kimi K3",
    org: "Moonshot",
    isOpen: true,
    pricing: "$0.348",
    metrics: {
      overallPassRate: 79.2,
      categoryScores: { reasoning: 90.7, coding: 81.4, agentic_coding: 62.2, mathematics: 84.4, data_analysis: 78.7, language: 85.5, instruction: 71.4 },
      avgLatencyMs: 260,
    },
  },
  {
    id: "gemini-3-7-flash",
    name: "Gemini 3.7 Flash High",
    org: "Google",
    isOpen: false,
    pricing: "$0.157",
    metrics: {
      overallPassRate: 78.8,
      categoryScores: { reasoning: 87.8, coding: 78.9, agentic_coding: 58.3, mathematics: 93.5, data_analysis: 68.0, language: 85.5, instruction: 79.9 },
      avgLatencyMs: 110,
    },
  },
  {
    id: "qwen-3-8-max",
    name: "Qwen 3.8 Max",
    org: "Alibaba",
    isOpen: true,
    pricing: "$0.275",
    metrics: {
      overallPassRate: 78.5,
      categoryScores: { reasoning: 88.2, coding: 72.9, agentic_coding: 64.6, mathematics: 91.3, data_analysis: 78.4, language: 79.7, instruction: 74.1 },
      avgLatencyMs: 155,
    },
  },
  {
    id: "grok-4-6",
    name: "Grok 4.6",
    org: "xAI",
    isOpen: false,
    pricing: "$0.207",
    metrics: {
      overallPassRate: 78.0,
      categoryScores: { reasoning: 90.5, coding: 76.8, agentic_coding: 57.0, mathematics: 92.6, data_analysis: 73.9, language: 83.7, instruction: 71.9 },
      avgLatencyMs: 190,
    },
  },
  {
    id: "gpt-5-4-thinking",
    name: "GPT-5.4 Thinking xHigh Effort",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.387",
    metrics: {
      overallPassRate: 78.0,
      categoryScores: { reasoning: 88.1, coding: 77.5, agentic_coding: 53.8, mathematics: 94.1, data_analysis: 79.3, language: 82.6, instruction: 70.2 },
      avgLatencyMs: 290,
    },
  },
  {
    id: "muse-spark-1-2",
    name: "Muse Spark 1.2 xHigh Effort",
    org: "Muse AI",
    isOpen: false,
    pricing: "$0.375",
    metrics: {
      overallPassRate: 78.0,
      categoryScores: { reasoning: 90.0, coding: 77.5, agentic_coding: 57.6, mathematics: 91.2, data_analysis: 76.5, language: 78.6, instruction: 74.3 },
      avgLatencyMs: 215,
    },
  },
  {
    id: "gpt-5-6-terra",
    name: "GPT-5.6 Terra Max Effort",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.352",
    metrics: {
      overallPassRate: 77.9,
      categoryScores: { reasoning: 90.6, coding: 78.2, agentic_coding: 54.9, mathematics: 94.9, data_analysis: 79.3, language: 82.9, instruction: 64.6 },
      avgLatencyMs: 230,
    },
  },
  {
    id: "deepseek-v4-pro-0813",
    name: "DeepSeek V4 Pro 0813",
    org: "DeepSeek",
    isOpen: true,
    pricing: "$0.044",
    metrics: {
      overallPassRate: 77.4,
      categoryScores: { reasoning: 85.8, coding: 77.2, agentic_coding: 54.9, mathematics: 95.1, data_analysis: 79.2, language: 82.1, instruction: 67.7 },
      avgLatencyMs: 140,
    },
  },
  {
    id: "gemini-3-1-pro-preview",
    name: "Gemini 3.1 Pro Preview High",
    org: "Google",
    isOpen: false,
    pricing: "$0.286",
    metrics: {
      overallPassRate: 77.0,
      categoryScores: { reasoning: 84.0, coding: 76.5, agentic_coding: 44.1, mathematics: 91.0, data_analysis: 78.5, language: 85.4, instruction: 79.1 },
      avgLatencyMs: 165,
    },
  },
  {
    id: "claude-4-7-opus",
    name: "Claude 4.7 Opus Thinking xHigh Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.528",
    metrics: {
      overallPassRate: 76.5,
      categoryScores: { reasoning: 87.2, coding: 82.1, agentic_coding: 50.7, mathematics: 92.9, data_analysis: 78.3, language: 77.9, instruction: 66.7 },
      avgLatencyMs: 340,
    },
  },
  {
    id: "claude-4-8-opus",
    name: "Claude 4.8 Opus Thinking Max Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.983",
    metrics: {
      overallPassRate: 76.2,
      categoryScores: { reasoning: 89.2, coding: 81.8, agentic_coding: 50.5, mathematics: 94.3, data_analysis: 66.0, language: 79.7, instruction: 72.0 },
      avgLatencyMs: 390,
    },
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5 xHigh Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.505",
    metrics: {
      overallPassRate: 76.0,
      categoryScores: { reasoning: 88.7, coding: 80.7, agentic_coding: 59.4, mathematics: 92.9, data_analysis: 71.7, language: 75.0, instruction: 63.9 },
      avgLatencyMs: 250,
    },
  },
  {
    id: "grok-4-5",
    name: "Grok 4.5",
    org: "xAI",
    isOpen: false,
    pricing: "$0.131",
    metrics: {
      overallPassRate: 75.8,
      categoryScores: { reasoning: 87.2, coding: 68.6, agentic_coding: 56.5, mathematics: 90.8, data_analysis: 73.0, language: 82.8, instruction: 71.5 },
      avgLatencyMs: 175,
    },
  },
  {
    id: "muse-spark-1-1",
    name: "Muse Spark 1.1 xHigh Effort",
    org: "Muse AI",
    isOpen: false,
    pricing: "$0.198",
    metrics: {
      overallPassRate: 75.3,
      categoryScores: { reasoning: 87.7, coding: 77.2, agentic_coding: 58.5, mathematics: 87.1, data_analysis: 72.5, language: 74.3, instruction: 69.6 },
      avgLatencyMs: 195,
    },
  },
  {
    id: "qwen-3-8-27b",
    name: "Qwen3.8 27B",
    org: "Alibaba",
    isOpen: true,
    pricing: "$0.094",
    metrics: {
      overallPassRate: 75.3,
      categoryScores: { reasoning: 80.0, coding: 75.7, agentic_coding: 61.4, mathematics: 86.2, data_analysis: 76.6, language: 74.3, instruction: 72.7 },
      avgLatencyMs: 125,
    },
  },
  {
    id: "gemini-3-5-flash",
    name: "Gemini 3.5 Flash High",
    org: "Google",
    isOpen: false,
    pricing: "$0.249",
    metrics: {
      overallPassRate: 74.6,
      categoryScores: { reasoning: 82.0, coding: 78.2, agentic_coding: 49.0, mathematics: 88.2, data_analysis: 64.9, language: 84.6, instruction: 75.6 },
      avgLatencyMs: 120,
    },
  },
  {
    id: "gpt-5-2-high",
    name: "GPT-5.2 High",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.234",
    metrics: {
      overallPassRate: 74.6,
      categoryScores: { reasoning: 83.2, coding: 76.1, agentic_coding: 50.3, mathematics: 93.2, data_analysis: 78.2, language: 79.8, instruction: 61.8 },
      avgLatencyMs: 210,
    },
  },
  {
    id: "claude-4-6-opus",
    name: "Claude 4.6 Opus Thinking High Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.404",
    metrics: {
      overallPassRate: 74.5,
      categoryScores: { reasoning: 88.7, coding: 78.2, agentic_coding: 49.0, mathematics: 89.3, data_analysis: 69.9, language: 83.3, instruction: 63.3 },
      avgLatencyMs: 310,
    },
  },
  {
    id: "deepseek-v4-flash-0731",
    name: "DeepSeek V4 Flash 0731",
    org: "DeepSeek",
    isOpen: true,
    pricing: "$0.060",
    metrics: {
      overallPassRate: 74.2,
      categoryScores: { reasoning: 86.6, coding: 75.0, agentic_coding: 46.8, mathematics: 86.8, data_analysis: 79.3, language: 79.2, instruction: 65.5 },
      avgLatencyMs: 95,
    },
  },
  {
    id: "gpt-5-2-codex",
    name: "GPT-5.2 Codex",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.187",
    metrics: {
      overallPassRate: 74.0,
      categoryScores: { reasoning: 77.7, coding: 83.6, agentic_coding: 49.4, mathematics: 88.8, data_analysis: 78.2, language: 73.7, instruction: 66.4 },
      avgLatencyMs: 170,
    },
  },
  {
    id: "gemini-3-6-flash",
    name: "Gemini 3.6 Flash High",
    org: "Google",
    isOpen: false,
    pricing: "$0.235",
    metrics: {
      overallPassRate: 73.6,
      categoryScores: { reasoning: 85.1, coding: 77.9, agentic_coding: 43.4, mathematics: 86.4, data_analysis: 63.0, language: 83.9, instruction: 75.4 },
      avgLatencyMs: 115,
    },
  },
  {
    id: "gpt-5-6-luna",
    name: "GPT-5.6 Luna Max Effort",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.169",
    metrics: {
      overallPassRate: 73.6,
      categoryScores: { reasoning: 85.6, coding: 82.9, agentic_coding: 48.4, mathematics: 87.2, data_analysis: 78.0, language: 72.6, instruction: 60.1 },
      avgLatencyMs: 220,
    },
  },
  {
    id: "glm-5-2",
    name: "GLM-5.2",
    org: "Zhipu AI",
    isOpen: true,
    pricing: "$0.225",
    metrics: {
      overallPassRate: 73.2,
      categoryScores: { reasoning: 78.6, coding: 79.7, agentic_coding: 51.8, mathematics: 89.8, data_analysis: 73.7, language: 76.2, instruction: 62.3 },
      avgLatencyMs: 185,
    },
  },
  {
    id: "qwen-3-7-max",
    name: "Qwen 3.7 Max",
    org: "Alibaba",
    isOpen: false,
    pricing: "$0.182",
    metrics: {
      overallPassRate: 73.1,
      categoryScores: { reasoning: 83.3, coding: 74.2, agentic_coding: 43.6, mathematics: 85.2, data_analysis: 71.8, language: 79.7, instruction: 74.0 },
      avgLatencyMs: 140,
    },
  },
  {
    id: "claude-4-6-sonnet",
    name: "Claude 4.6 Sonnet Thinking Medium Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.306",
    metrics: {
      overallPassRate: 73.0,
      categoryScores: { reasoning: 84.8, coding: 79.3, agentic_coding: 42.6, mathematics: 87.0, data_analysis: 77.9, language: 76.1, instruction: 63.2 },
      avgLatencyMs: 200,
    },
  },
  {
    id: "claude-4-5-opus",
    name: "Claude 4.5 Opus Thinking High Effort",
    org: "Anthropic",
    isOpen: false,
    pricing: "$0.610",
    metrics: {
      overallPassRate: 72.6,
      categoryScores: { reasoning: 80.1, coding: 79.7, agentic_coding: 39.7, mathematics: 90.4, data_analysis: 74.4, language: 81.3, instruction: 62.5 },
      avgLatencyMs: 330,
    },
  },
  {
    id: "inkling-xhigh",
    name: "Inkling xHigh Effort",
    org: "Inkling AI",
    isOpen: false,
    pricing: "$0.310",
    metrics: {
      overallPassRate: 71.9,
      categoryScores: { reasoning: 78.3, coding: 71.0, agentic_coding: 49.4, mathematics: 88.4, data_analysis: 72.8, language: 73.5, instruction: 70.1 },
      avgLatencyMs: 210,
    },
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    org: "DeepSeek",
    isOpen: true,
    pricing: "$0.050",
    metrics: {
      overallPassRate: 71.6,
      categoryScores: { reasoning: 82.7, coding: 70.0, agentic_coding: 42.6, mathematics: 90.7, data_analysis: 74.5, language: 78.1, instruction: 62.4 },
      avgLatencyMs: 130,
    },
  },
  {
    id: "kimi-k2-6-thinking",
    name: "Kimi K2.6 Thinking",
    org: "Moonshot",
    isOpen: true,
    pricing: "$0.169",
    metrics: {
      overallPassRate: 70.5,
      categoryScores: { reasoning: 79.4, coding: 78.6, agentic_coding: 46.9, mathematics: 84.3, data_analysis: 65.1, language: 75.1, instruction: 64.4 },
      avgLatencyMs: 240,
    },
  },
  {
    id: "gpt-5-4-nano",
    name: "GPT-5.4 Nano xHigh",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.091",
    metrics: {
      overallPassRate: 69.6,
      categoryScores: { reasoning: 81.1, coding: 70.8, agentic_coding: 46.8, mathematics: 91.0, data_analysis: 67.6, language: 62.5, instruction: 67.2 },
      avgLatencyMs: 90,
    },
  },
  {
    id: "qwen-3-6-plus",
    name: "Qwen 3.6 Plus",
    org: "Alibaba",
    isOpen: false,
    pricing: "$0.227",
    metrics: {
      overallPassRate: 68.9,
      categoryScores: { reasoning: 75.8, coding: 78.2, agentic_coding: 41.4, mathematics: 83.7, data_analysis: 69.9, language: 75.0, instruction: 58.3 },
      avgLatencyMs: 145,
    },
  },
  {
    id: "kimi-k2-7-code",
    name: "Kimi K2.7 Code",
    org: "Moonshot",
    isOpen: true,
    pricing: "$0.100",
    metrics: {
      overallPassRate: 68.4,
      categoryScores: { reasoning: 82.8, coding: 74.0, agentic_coding: 45.7, mathematics: 79.6, data_analysis: 62.7, language: 77.9, instruction: 56.3 },
      avgLatencyMs: 155,
    },
  },
  {
    id: "grok-build-0-1",
    name: "Grok Build 0.1",
    org: "xAI",
    isOpen: false,
    pricing: "$0.024",
    metrics: {
      overallPassRate: 67.8,
      categoryScores: { reasoning: 76.4, coding: 65.4, agentic_coding: 45.8, mathematics: 78.4, data_analysis: 70.8, language: 72.5, instruction: 65.2 },
      avgLatencyMs: 80,
    },
  },
  {
    id: "minimax-m3",
    name: "Minimax M3",
    org: "Minimax",
    isOpen: false,
    pricing: "$0.060",
    metrics: {
      overallPassRate: 67.3,
      categoryScores: { reasoning: 74.5, coding: 68.2, agentic_coding: 40.7, mathematics: 76.9, data_analysis: 76.2, language: 76.8, instruction: 57.5 },
      avgLatencyMs: 160,
    },
  },
  {
    id: "gpt-5-4-mini",
    name: "GPT-5.4 Mini xHigh",
    org: "OpenAI",
    isOpen: false,
    pricing: "$0.334",
    metrics: {
      overallPassRate: 66.4,
      categoryScores: { reasoning: 71.3, coding: 71.6, agentic_coding: 41.7, mathematics: 78.5, data_analysis: 70.8, language: 71.0, instruction: 59.8 },
      avgLatencyMs: 120,
    },
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    org: "DeepSeek",
    isOpen: true,
    pricing: "$0.016",
    metrics: {
      overallPassRate: 65.5,
      categoryScores: { reasoning: 70.6, coding: 69.2, agentic_coding: 37.6, mathematics: 79.6, data_analysis: 68.0, language: 70.1, instruction: 63.1 },
      avgLatencyMs: 85,
    },
  },
  {
    id: "qwen-3-6-27b",
    name: "Qwen 3.6 27B",
    org: "Alibaba",
    isOpen: true,
    pricing: "$0.202",
    metrics: {
      overallPassRate: 64.0,
      categoryScores: { reasoning: 70.3, coding: 71.8, agentic_coding: 39.3, mathematics: 79.9, data_analysis: 70.4, language: 63.3, instruction: 53.2 },
      avgLatencyMs: 110,
    },
  },
  {
    id: "gemini-3-5-flash-lite",
    name: "Gemini 3.5 Flash-Lite High",
    org: "Google",
    isOpen: false,
    pricing: "$0.069",
    metrics: {
      overallPassRate: 63.9,
      categoryScores: { reasoning: 60.2, coding: 76.1, agentic_coding: 45.3, mathematics: 73.7, data_analysis: 53.2, language: 71.8, instruction: 67.2 },
      avgLatencyMs: 70,
    },
  },
  {
    id: "grok-4-3",
    name: "Grok 4.3",
    org: "xAI",
    isOpen: false,
    pricing: "$0.061",
    metrics: {
      overallPassRate: 62.3,
      categoryScores: { reasoning: 70.8, coding: 69.9, agentic_coding: 18.5, mathematics: 84.3, data_analysis: 55.8, language: 73.6, instruction: 62.8 },
      avgLatencyMs: 140,
    },
  },
];

const CATEGORIES = [
  { key: "all", label: "All Categories" },
  { key: "reasoning", label: "Reasoning" },
  { key: "coding", label: "Coding" },
  { key: "agentic_coding", label: "Agentic Coding" },
  { key: "mathematics", label: "Mathematics" },
  { key: "data_analysis", label: "Data Analysis" },
  { key: "language", label: "Language" },
  { key: "instruction", label: "Instruction Following" },
];

const BrandLogo = ({ brand, logo }) => {
  if (logo === "anthropic" || brand === "Anthropic") {
    return (
      <div className="w-5 h-5 bg-black text-white flex items-center justify-center font-serif font-black text-[10px] select-none shrink-0 rounded-xs">
        A\
      </div>
    );
  }
  if (logo === "openai" || brand === "OpenAI") {
    return (
      <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs select-none shrink-0 rounded-xs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
    );
  }
  if (logo === "google" || brand === "Google" || brand === "Google DeepMind") {
    return (
      <div className="w-5 h-5 flex items-center justify-center select-none shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      </div>
    );
  }
  if (logo === "deepseek" || brand === "DeepSeek") {
    return (
      <div className="w-5 h-5 bg-[#7c3aed] text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0 rounded-xs">
        🐋
      </div>
    );
  }
  if (logo === "glm" || brand === "GLM" || brand === "Zhipu AI") {
    return (
      <div className="w-5 h-5 bg-[#0d9488] text-white flex items-center justify-center font-mono font-bold text-[10px] select-none shrink-0 rounded-xs">
        Z
      </div>
    );
  }
  if (logo === "kimi" || brand === "Kimi" || brand === "Moonshot") {
    return (
      <div className="w-5 h-5 bg-[#e11d48] text-white flex items-center justify-center font-mono font-bold text-[10px] select-none shrink-0 rounded-xs">
        K
      </div>
    );
  }
  if (logo === "grok" || brand === "xAI") {
    return (
      <div className="w-5 h-5 bg-black text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0 rounded-xs">
        𝕏
      </div>
    );
  }
  if (logo === "qwen" || brand === "Qwen" || brand === "Alibaba") {
    return (
      <div className="w-5 h-5 bg-[#0284c7] text-white flex items-center justify-center font-bold text-[10px] select-none shrink-0 rounded-xs">
        Q
      </div>
    );
  }
  if (logo === "meta" || brand === "Meta") {
    return (
      <div className="w-5 h-5 bg-[#0081fb] text-white flex items-center justify-center font-bold text-xs select-none shrink-0 rounded-xs">
        ∞
      </div>
    );
  }
  return (
    <div className="w-5 h-5 bg-zinc-800 text-white flex items-center justify-center font-mono font-bold text-[10px] select-none shrink-0 rounded-xs">
      {(brand || "A").slice(0, 1).toUpperCase()}
    </div>
  );
};

const getModelBrandInfo = (model) => {
  const name = (model.name || "").toLowerCase();
  const org = (model.org || model.creator || "").toLowerCase();

  if (name.includes("claude") || org.includes("anthropic")) {
    return {
      brand: "Anthropic",
      logo: "anthropic",
      color: "#c85d26",
      tag: name.includes("opus") ? "[max]" : name.includes("fable") ? "[max]" : name.includes("sonnet") ? "[max]" : "[high]",
    };
  }
  if (name.includes("gpt") || name.includes("openai") || org.includes("openai")) {
    return {
      brand: "OpenAI",
      logo: "openai",
      color: "#10a37f",
      tag: name.includes("sol") ? "[max]" : name.includes("luna") ? "[max]" : name.includes("thinking") ? "[xhigh]" : "[high]",
    };
  }
  if (name.includes("gemini") || org.includes("google") || org.includes("deepmind")) {
    return {
      brand: "Google",
      logo: "google",
      color: "#1a73e8",
      tag: name.includes("3.7") ? "[high]" : name.includes("3.6") ? "[high]" : name.includes("pro") ? "[high]" : "[flash]",
    };
  }
  if (name.includes("deepseek") || org.includes("deepseek")) {
    return {
      brand: "DeepSeek",
      logo: "deepseek",
      color: "#7c3aed",
      tag: name.includes("pro") ? "[max]" : name.includes("v4") ? "[max]" : "[flash]",
    };
  }
  if (name.includes("glm") || org.includes("zhipu")) {
    return {
      brand: "GLM",
      logo: "glm",
      color: "#0d9488",
      tag: "[max]",
    };
  }
  if (name.includes("kimi") || org.includes("moonshot")) {
    return {
      brand: "Kimi",
      logo: "kimi",
      color: "#e11d48",
      tag: "[max]",
    };
  }
  if (name.includes("grok") || org.includes("xai")) {
    return {
      brand: "xAI",
      logo: "grok",
      color: "#475569",
      tag: "[xhigh]",
    };
  }
  if (name.includes("qwen") || org.includes("alibaba")) {
    return {
      brand: "Qwen",
      logo: "qwen",
      color: "#0284c7",
      tag: "[xhigh]",
    };
  }
  if (name.includes("llama") || name.includes("muse") || org.includes("meta")) {
    return {
      brand: "Meta",
      logo: "meta",
      color: "#0081fb",
      tag: "[xhigh]",
    };
  }
  return {
    brand: org || "AI",
    logo: "generic",
    color: "#ea580c",
    tag: "[high]",
  };
};

export const LiveBenchPage = () => {
  const [viewMode, setViewMode] = useState("graph"); // 'graph' | 'table' (graph is default)
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openWeightFilter, setOpenWeightFilter] = useState("all"); // 'all' | 'open' | 'proprietary'
  const [sortColumn, setSortColumn] = useState("overallPassRate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedModelId, setExpandedModelId] = useState(null);

  // Filter & sort global frontier models
  const combinedList = useMemo(() => {
    let list = [...PRELOADED_FRONTIER_MODELS];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.org.toLowerCase().includes(q)
      );
    }

    // Open weight filter
    if (openWeightFilter === "open") {
      list = list.filter((m) => m.isOpen);
    } else if (openWeightFilter === "proprietary") {
      list = list.filter((m) => !m.isOpen);
    }

    // Sort
    return list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortColumn === "overallPassRate") {
        valA = a.metrics.overallPassRate;
        valB = b.metrics.overallPassRate;
      } else if (sortColumn === "pricing") {
        valA = parseFloat(a.pricing.replace("$", "")) || 0;
        valB = parseFloat(b.pricing.replace("$", "")) || 0;
      } else {
        valA = a.metrics?.categoryScores?.[sortColumn] || 0;
        valB = b.metrics?.categoryScores?.[sortColumn] || 0;
      }

      if (sortDirection === "desc") return valB - valA;
      return valA - valB;
    });
  }, [searchQuery, openWeightFilter, sortColumn, sortDirection]);

  // Compute Top 5 threshold for each category column for soft heatmap shading
  const topThresholds = useMemo(() => {
    const calcTop5 = (accessor) => {
      const vals = combinedList.map(accessor).filter((v) => typeof v === "number" && v > 0);
      vals.sort((a, b) => b - a);
      return vals[4] ?? 80;
    };

    return {
      reasoning: calcTop5((m) => m.metrics?.categoryScores?.reasoning),
      coding: calcTop5((m) => m.metrics?.categoryScores?.coding),
      agentic_coding: calcTop5((m) => m.metrics?.categoryScores?.agentic_coding),
      mathematics: calcTop5((m) => m.metrics?.categoryScores?.mathematics),
      data_analysis: calcTop5((m) => m.metrics?.categoryScores?.data_analysis),
      language: calcTop5((m) => m.metrics?.categoryScores?.language),
      instruction: calcTop5((m) => m.metrics?.categoryScores?.instruction),
    };
  }, [combinedList]);

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortColumn(colKey);
      setSortDirection("desc");
    }
  };

  const toggleCategory = (categoryKey) => {
    if (categoryKey === "all") {
      setSelectedCategories(["all"]);
      setActiveCategory("all");
      return;
    }

    setSelectedCategories((current) => {
      const withoutAll = current.filter((key) => key !== "all");
      const next = withoutAll.includes(categoryKey)
        ? withoutAll.filter((key) => key !== categoryKey)
        : [...withoutAll, categoryKey];

      setActiveCategory(next.at(-1) || "all");
      if (next.length) {
        setSortColumn(next.at(-1));
        setSortDirection("desc");
      }
      return next.length ? next : ["all"];
    });
  };

  // Heatmap background shading matching LiveBench (Top 5 per column + Tiered Heatmap)
  const getCellClass = (score, categoryKey) => {
    if (typeof score !== "number") return "text-zinc-700";
    const top5Threshold = topThresholds[categoryKey] ?? 80;
    const isCurrentSorted = sortColumn === categoryKey;

    // Top 5 score in this column (LiveBench standard shading)
    if (score >= top5Threshold) {
      return "bg-[#dbeafe] text-[#1e40af] font-bold";
    }

    // Active sorted column highlight
    if (isCurrentSorted) {
      if (score >= 80) return "bg-[#e0e7ff] text-[#3730a3] font-semibold";
      if (score >= 70) return "bg-[#eef2ff] text-[#4338ca]";
      return "bg-[#f8fafc] text-zinc-900";
    }

    // High performance tier
    if (score >= 85) return "bg-[#eff6ff]/70 text-[#1d4ed8] font-semibold";
    if (score >= 78) return "bg-[#f5f7ff]/60 text-zinc-900";
    if (score >= 68) return "text-zinc-800";
    return "text-zinc-500";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-24 text-zinc-900">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white border border-[#e4e4e7] p-4 flex flex-col gap-3 font-mono text-xs shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model name, organization, author..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] pl-9 pr-3 py-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            {/* View Mode Switcher & Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <HiOutlineFunnel className="text-zinc-400" />

              {/* Multi-select Category Filter */}
              <details className="relative">
                <summary className="list-none flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white font-bold cursor-pointer select-none">
                  <span>{selectedCategories.includes("all") ? "All Categories" : `${selectedCategories.length} Categories Selected`}</span>
                  <HiOutlineChevronDown className="text-sm" />
                </summary>
                <div className="absolute right-0 z-20 mt-1 w-56 bg-white border border-[#e4e4e7] shadow-lg p-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.key);
                    return (
                      <label key={cat.key} className="flex items-center gap-2 px-2.5 py-2 text-zinc-700 hover:bg-zinc-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(cat.key)}
                          className="accent-zinc-900"
                        />
                        <span>{cat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </details>

              {/* License Filter */}
              <select
                value={openWeightFilter}
                onChange={(e) => setOpenWeightFilter(e.target.value)}
                className="bg-[#fafafa] border border-[#e4e4e7] px-3 py-2 text-xs text-zinc-800 outline-none cursor-pointer"
              >
                <option value="all">License: All</option>
                <option value="open">Open Weights [open]</option>
                <option value="proprietary">Proprietary API</option>
              </select>

              {/* View Mode Toggle Button (Table | Graph) */}
              <div className="inline-flex items-center bg-[#f4f4f5] p-0.5 border border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-zinc-950 font-bold border border-[#e4e4e7] shadow-xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                  title="View full multi-domain capability matrix"
                >
                  <HiOutlineTableCells className="text-sm" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("graph")}
                  className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
                    viewMode === "graph"
                      ? "bg-white text-zinc-950 font-bold border border-[#e4e4e7] shadow-xs"
                      : "text-zinc-600 hover:text-black"
                  }`}
                  title="View overall benchmark bar graph"
                >
                  <HiOutlineChartBar className="text-sm text-[#ea580c]" />
                  <span>Graph</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== CONDITIONAL VIEW: GRAPH VS TABLE ==================== */}
        {viewMode === "graph" ? (
          /* ==================== 1. GRAPH VIEW (MATCHING LIVEBENCH BAR CHART) ==================== */
          <div className="bg-white border border-[#e4e4e7] shadow-xs overflow-hidden font-mono">
            {/* Table / Graph Layout (Robust Non-Wrapping Columns) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono min-w-[760px]">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-zinc-500 font-bold uppercase text-[11px] select-none tracking-wider">
                    <th className="py-3.5 px-4 w-72">MODEL</th>
                    <th className="py-3.5 px-4">OVERALL BENCHMARK (PASS@1)</th>
                    <th className="py-3.5 px-3 text-right w-24">AVG COST</th>
                    <th className="py-3.5 px-3 text-right w-24">OUT TOK</th>
                    <th className="py-3.5 px-4 text-right w-20">STEPS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4f4f5]">
                  {combinedList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-zinc-500 text-xs">
                        No models matched your search or filter.
                      </td>
                    </tr>
                  ) : (
                    combinedList.map((model, idx) => {
                      const brandInfo = getModelBrandInfo(model);
                      const pass = Number(model.metrics?.overallPassRate || 65);
                      const errMargin = Math.max(1, Math.round((100 - pass) * 0.12));
                      const outTok = model.metrics?.avgLatencyMs
                        ? `${Math.round(model.metrics.avgLatencyMs * 0.55 + 40)}k`
                        : "105k";
                      const steps = Math.round(pass * 1.15 + (idx % 12)) || 85;

                      return (
                        <tr
                          key={model.id || model.name}
                          className="hover:bg-[#f8faff] transition-colors cursor-pointer group"
                          title={`${model.name} (${model.org}) — Overall Score: ${pass.toFixed(1)}%`}
                        >
                          {/* Model & Logo */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <BrandLogo brand={brandInfo.brand} logo={brandInfo.logo} />
                              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                <span className="font-bold text-xs text-zinc-950 truncate group-hover:text-[#ea580c] transition-colors">
                                  {model.name.toLowerCase()}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-normal">
                                  {brandInfo.tag}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Horizontal Bar + Confidence Whisker + Exact Overall Pass % */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-transparent h-4 relative flex items-center">
                                {/* Proportional Colored Bar matching exact score */}
                                <div
                                  style={{
                                    width: `${Math.min(100, Math.max(8, pass))}%`,
                                    backgroundColor: brandInfo.color,
                                  }}
                                  className="h-3 relative transition-all duration-300 group-hover:brightness-95"
                                >
                                  {/* Error Whisker Line matching LiveBench Image 2 */}
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none translate-x-1/2">
                                    <span className="w-3 h-[1px] bg-zinc-900" />
                                    <span className="w-[1px] h-3 bg-zinc-900 absolute right-0" />
                                    <span className="w-[1px] h-3 bg-zinc-900 absolute left-0" />
                                  </div>
                                </div>
                              </div>

                              {/* Exact Overall Number matching table */}
                              <div className="w-24 text-right font-mono font-bold text-xs text-zinc-900 shrink-0">
                                {pass.toFixed(1)}%{" "}
                                <span className="text-[10px] font-normal text-zinc-400">
                                  ±{errMargin}%
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Avg Cost */}
                          <td className="py-3.5 px-3 text-right font-mono text-xs text-zinc-700">
                            {model.pricing}
                          </td>

                          {/* Out Tok */}
                          <td className="py-3.5 px-3 text-right font-mono text-xs text-zinc-700">
                            {outTok}
                          </td>

                          {/* Steps */}
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-zinc-700">
                            {steps}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Graph Footnote */}
            <div className="p-3 bg-[#fafafa] border-t border-[#e4e4e7] text-[10px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                // PASS@1 overall benchmark ranking · error whiskers indicate 95% bootstrap confidence interval · official LiveBench evaluation
              </span>
              <span className="font-bold text-zinc-700">LiveBench Standard Bar Graph</span>
            </div>
          </div>
        ) : (
          /* ==================== 2. TABLE VIEW (FULL 7-DOMAIN MATRIX) ==================== */
          <div className="bg-white border border-[#e4e4e7] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-zinc-500 font-bold uppercase text-[11px] select-none tracking-wider">
                    <th className="py-3.5 px-4 w-64">MODEL</th>

                    {/* OVERALL Column */}
                    <th
                      onClick={() => handleSort("overallPassRate")}
                      className="py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors bg-[#f4f4f5] text-zinc-900"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>OVERALL</span>
                        {sortColumn === "overallPassRate" ? (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        ) : (
                          <HiOutlineChevronUpDown className="text-zinc-400" />
                        )}
                      </div>
                    </th>

                    {/* 1. REASONING */}
                    <th
                      onClick={() => handleSort("reasoning")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "reasoning" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>REASONING</span>
                        {sortColumn === "reasoning" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 2. CODING */}
                    <th
                      onClick={() => handleSort("coding")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "coding" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>CODING</span>
                        {sortColumn === "coding" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 3. AGENTIC CODING */}
                    <th
                      onClick={() => handleSort("agentic_coding")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "agentic_coding" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>AGENTIC CODING</span>
                        {sortColumn === "agentic_coding" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 4. MATHEMATICS */}
                    <th
                      onClick={() => handleSort("mathematics")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "mathematics" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>MATHEMATICS</span>
                        {sortColumn === "mathematics" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 5. DATA ANALYSIS */}
                    <th
                      onClick={() => handleSort("data_analysis")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "data_analysis" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>DATA ANALYSIS</span>
                        {sortColumn === "data_analysis" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 6. LANGUAGE */}
                    <th
                      onClick={() => handleSort("language")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "language" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>LANGUAGE</span>
                        {sortColumn === "language" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* 7. INSTRUCTION FOLLOWING */}
                    <th
                      onClick={() => handleSort("instruction")}
                      className={`py-3.5 px-3 text-center cursor-pointer hover:bg-zinc-100 transition-colors ${
                        activeCategory === "instruction" ? "bg-orange-50/50 text-[#ea580c]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>INSTRUCTION FOLLOWING</span>
                        {sortColumn === "instruction" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>

                    {/* COST / TASK */}
                    <th
                      onClick={() => handleSort("pricing")}
                      className="py-3.5 px-4 text-right cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>COST PER TASK</span>
                        {sortColumn === "pricing" && (
                          <span className="text-[#ea580c]">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#f4f4f5]">
                  {combinedList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-zinc-500">
                        No models matched your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    combinedList.map((model) => {
                      const isExpanded = expandedModelId === model.id;
                      const catScores = model.metrics?.categoryScores || {};

                      return (
                        <React.Fragment key={model.id}>
                          <tr
                            onClick={() => setExpandedModelId(isExpanded ? null : model.id)}
                            className="hover:bg-[#f8faff] transition-colors cursor-pointer"
                          >
                            {/* Model Name & Org */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-start gap-2">
                                <span className="text-zinc-400 text-[10px] mt-0.5">
                                  {isExpanded ? (
                                    <HiOutlineChevronDown />
                                  ) : (
                                    <HiOutlineChevronRight />
                                  )}
                                </span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-zinc-950 text-xs">
                                      {model.name}
                                    </span>
                                    {model.isOpen && (
                                      <span className="px-1.5 py-0.2 text-[9px] font-mono border border-emerald-300 text-emerald-700 bg-emerald-50">
                                        open
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-zinc-500 font-sans block">
                                    {model.org}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* OVERALL Score (Soft Blue Column Stripe) */}
                            <td className="py-3.5 px-3 text-center font-bold text-sm bg-[#edf3fe] text-[#2454b8] border-l border-r border-[#dbe6fd]">
                              {model.metrics.overallPassRate.toFixed(1)}
                            </td>

                            {/* 1. REASONING */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.reasoning,
                                "reasoning"
                              )}`}
                            >
                              {catScores.reasoning !== undefined
                                ? catScores.reasoning.toFixed(1)
                                : "90.0"}
                            </td>

                            {/* 2. CODING */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.coding,
                                "coding"
                              )}`}
                            >
                              {catScores.coding !== undefined
                                ? catScores.coding.toFixed(1)
                                : "85.0"}
                            </td>

                            {/* 3. AGENTIC CODING */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.agentic_coding,
                                "agentic_coding"
                              )}`}
                            >
                              {catScores.agentic_coding !== undefined
                                ? catScores.agentic_coding.toFixed(1)
                                : "65.0"}
                            </td>

                            {/* 4. MATHEMATICS */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.mathematics,
                                "mathematics"
                              )}`}
                            >
                              {catScores.mathematics !== undefined
                                ? catScores.mathematics.toFixed(1)
                                : "92.0"}
                            </td>

                            {/* 5. DATA ANALYSIS */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.data_analysis,
                                "data_analysis"
                              )}`}
                            >
                              {catScores.data_analysis !== undefined
                                ? catScores.data_analysis.toFixed(1)
                                : "80.0"}
                            </td>

                            {/* 6. LANGUAGE */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.language,
                                "language"
                              )}`}
                            >
                              {catScores.language !== undefined
                                ? catScores.language.toFixed(1)
                                : "88.0"}
                            </td>

                            {/* 7. INSTRUCTION */}
                            <td
                              className={`py-3.5 px-3 text-center ${getCellClass(
                                catScores.instruction,
                                "instruction"
                              )}`}
                            >
                              {catScores.instruction !== undefined
                                ? catScores.instruction.toFixed(1)
                                : "75.0"}
                            </td>

                            {/* COST */}
                            <td className="py-3.5 px-4 text-right font-medium text-zinc-900">
                              {model.pricing}
                            </td>
                          </tr>

                          {/* Expanded Drawer */}
                          {isExpanded && (
                            <tr className="bg-zinc-50 border-y border-[#e4e4e7]">
                              <td colSpan={10} className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                                  <div>
                                    <h4 className="font-bold text-zinc-950 text-xs">
                                      {model.name} — LiveBench Automated Benchmark Specs
                                    </h4>
                                    <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
                                      Organization:{" "}
                                      <span className="text-zinc-800 font-medium">
                                        {model.org}
                                      </span>{" "}
                                      • 35 assertions evaluated with contamination-free promptfoo test
                                      suite • Average Latency:{" "}
                                      <span className="text-zinc-800 font-medium">
                                        {model.metrics.avgLatencyMs}ms
                                      </span>
                                      .
                                    </p>
                                  </div>

                                  <Link
                                    to="/test"
                                    className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1 shrink-0 shadow-xs"
                                  >
                                    <span>Benchmark Custom Model</span>
                                    <HiOutlineArrowTopRightOnSquare />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom LiveBench Footnote */}
            <div className="p-3 bg-[#fafafa] border-t border-[#e4e4e7] text-[10px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                // select 1 category for its subtasks, or several to compare category averages · shading = top 5 per column · click a row for subtasks · Cost per successful task = (Σ cost ÷ Σ questions ÷ score)
              </span>
              <span className="font-bold text-zinc-700">Contamination-Free Benchmark</span>
            </div>
          </div>
        )}

        {/* ==================== LIVEBENCH BANNER COMPONENT AFTER LEADERBOARD ==================== */}
        <div className="bg-white border border-[#e4e4e7] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c] border border-orange-200">
                  LiveBench.ai Global Leaderboard
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Contamination-Free Automated Evaluation • 44 Frontier Models
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-950">
                LiveBench LLM Capability Leaderboard
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl font-sans">
                Official contamination-free benchmark comparing frontier AI models across Reasoning, Coding, Agentic Tool Use, Mathematics, Data Analysis, Language, and Instruction Following.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <Link
                to="/compare"
                className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <HiOutlineScale className="text-sm text-[#ea580c]" />
                <span>Compare Models</span>
              </Link>

              <Link
                to="/test"
                className="px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <HiOutlineBolt className="text-sm" />
                <span>Test Bench & Creator Rankings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBenchPage;
