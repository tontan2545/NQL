"use client";

import React, { useState } from "react";
import { format } from "sql-formatter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/tooltip";
import { CheckIcon, ClipboardIcon } from "lucide-react";

const SQL = () => {
  const [isCopied, setIsCopied] = useState(false);
  const sql = format(
    "SELECT film.title, COUNT(rental.rental_id) AS rental_count FROM film  JOIN inventory ON film.film_id = inventory.film_id JOIN rental ON inventory.inventory_id = rental.inventory_id GROUP BY film.title ORDER BY rental_count DESC LIMIT 10",
    {
      language: "postgresql",
    }
  );

  const copyToClipboard = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(sql);
    setTimeout(() => setIsCopied(false), 1500);
  };
  return (
    <div className="relative">
      <SyntaxHighlighter
        style={coy}
        customStyle={{
          backgroundColor: "transparent",
        }}
        wrapLongLines={true}
        language="sql"
      >
        {sql}
      </SyntaxHighlighter>
      <div className="absolute -top-4 -right-4">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              <div
                className="hover:bg-accent hover:text-accent-foreground px-3 py-[10px] rounded-sm"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
  //   return <p>Hello</p>;
};

export default SQL;
