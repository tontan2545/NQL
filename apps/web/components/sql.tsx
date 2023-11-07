"use client";

import React, { useState } from "react";
import { format } from "sql-formatter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/tooltip";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  sql: string;
  isLoading: boolean;
};

const SQL = ({ sql, isLoading }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const formattedSql = isLoading
    ? sql
    : format(sql, {
        language: "postgresql",
      });

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
        {formattedSql}
      </SyntaxHighlighter>
      <div className="absolute -top-6 -right-4">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              <div
                className="hover:bg-accent hover:text-accent-foreground px-3 py-[10px] rounded-sm"
                onClick={copyToClipboard}
              >
                <div className="relative w-5 h-5">
                  <AnimatePresence>
                    {isCopied ? (
                      <motion.div
                        key="check-icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute z-10"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="clipboard-icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute z-0"
                      >
                        <ClipboardIcon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SQL;
