"use client";
import React, { useState } from "react";
import { Textarea } from "@ui/components/textarea";
import {
  AlertCircle,
  Github,
  Loader2,
  Search as SearchIcon,
  SendIcon,
} from "lucide-react";
import { Button } from "@ui/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@ui/components/dialog";
import Image from "next/image";

type Props = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSearch: () => Promise<void>;
  isLoading: boolean;
};

const Search = ({ prompt, setPrompt, isLoading, onSearch }: Props) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute w-6 h-6 top-4 left-4 text-muted-foreground/60" />
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxRows={4}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await onSearch();
          }
        }}
        className="bg-white border-[#9F9F9F] border-[1px] shadow-md rounded-xl resize-none pl-14 pr-[72px] py-[14px] text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
        placeholder="Enter your prompt"
      />
      <Button
        className="absolute right-[10px] top-[10px] flex py-1 px-3 items-center space-x-2 transition-all duration-150"
        disabled={prompt.length === 0 || isLoading}
        onClick={onSearch}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <SendIcon className="relative right-[1px] w-5 h-5" />
        )}
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto rounded-full text-muted-foreground hover:text-muted-foreground p-1 h-min mr-0"
            >
              <AlertCircle className="w-5 h-5" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[425px] pt-8 space-y-3">
          <div className="flex justify-center items-center gap-3">
            <Image src="/github.svg" alt="github-logo" width={36} height={36} />
            <p className="text-2xl font-semibold">tontan2545/NQL</p>
          </div>
          <Image
            src="/nql-repo.png"
            alt="nql-repo-qr-code"
            width={350}
            height={350}
            className="mx-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
