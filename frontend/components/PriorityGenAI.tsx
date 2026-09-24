import React from 'react'
import { UseMutateFunction } from "@tanstack/react-query";
import { Loader2 } from 'lucide-react';
import { HiLightningBolt } from 'react-icons/hi';

type PriorityGenAIProps = {
  mutate: UseMutateFunction<string, Error, void, unknown>;
  isPending: boolean;
  description: string;
};

const PriorityGenAI = ({mutate, isPending, description}: PriorityGenAIProps) => {
  return (
    <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending || !description.trim()}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-[length:300%_100%] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:animate-[gradient_2s_linear_infinite] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
        {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
        <HiLightningBolt size={15} />
        )}
        <span>{isPending ? "Generating..." : "AI Generate Priority"}</span>
    </button>
  )
}

export default PriorityGenAI
