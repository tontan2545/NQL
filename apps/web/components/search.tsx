"use client";
import React, { useState } from "react";
import { Textarea } from "@ui/components/ui/textarea";
import { Loader2, Search as SearchIcon, SendIcon } from "lucide-react";
import { Button } from "@ui/components/button";

type Props = {};

const Search = (props: Props) => {
  const [val, setVal] = useState("");
  return (
    <div className="relative">
      <SearchIcon className="absolute w-6 h-6 top-4 left-4 text-muted-foreground/60" />
      <Textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        maxRows={4}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            console.log("submit");
          }
        }}
        className="border-[#9F9F9F] border-[1px] shadow-md rounded-xl resize-none pl-14 pr-[72px] py-[14px] text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
        placeholder="Enter your prompt"
      />
      <Button
        className="absolute right-[10px] top-[10px] flex py-1 px-3 items-center space-x-2 transition-all duration-150"
        disabled={val.length === 0}
      >
        {/* <Loader2 className="w-5 h-5 animate-spin" /> */}
        <SendIcon className="relative right-[1px] w-5 h-5" />
      </Button>
    </div>
  );
};

export default Search;
