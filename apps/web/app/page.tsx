"use client";

import Search from "@/components/search";
import SQL from "@/components/sql";
import { Skeleton } from "@ui/components/skeleton";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { inferenceService } from "@/service/inference";
import { useRouter, useSearchParams } from "next/navigation";
import Data from "@/components/data";
import { Tab } from "@/types/tabs";
import { tabLabels } from "@/constants/tabs";
import { dbService } from "@/service/db";
import { motion } from "framer-motion";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("SQL");
  const [sql, setSql] = useState<string | null>(null);
  const animationDuration = 0.2;

  const router = useRouter();

  useEffect(() => {
    const inferenceId = searchParams.get("inference-id");

    if (inferenceId) {
      const getInferenceData = async () => {
        const data = await dbService.getInferenceData(inferenceId);
        setSql(data.sql);
        setPrompt(data.prompt);
      };

      getInferenceData();
    }

    setIsLoading(false);
  }, []);

  const onSearch = useCallback(async () => {
    if (prompt.length === 0) return;
    setSql(null);
    setIsLoading(true);
    const response = await inferenceService.runInference(prompt);
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      const processText = async ({
        done,
        value,
      }: ReadableStreamReadResult<Uint8Array>) => {
        if (done) {
          return;
        }

        const text = decoder.decode(value);
        setSql(text);

        try {
          const nextResult = await reader.read();
          await processText(nextResult);
        } catch (e) {
          console.log(e);
        }
      };
      const initialResult = await reader.read();
      await processText(initialResult);
    }
    router.push(`?inference-id=${response.headers.get("X-Inference-ID")}`);
    setIsLoading(false);
  }, [prompt]);

  return (
    <div className="flex flex-col w-full items-center pt-7">
      <div className="w-2/5 space-y-4 min-w-[600px]">
        <Search
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSearch={onSearch}
        />
        {sql && (
          <Tabs
            value={tab}
            onValueChange={(e) => {
              setTab(e as Tab);
            }}
            className="w-full"
          >
            <TabsList className="shadow-sm">
              {Object.keys(tabLabels).map((k) => (
                <TabsTrigger key={k} value={k}>
                  {tabLabels[k as Tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="SQL">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: animationDuration }}
              >
                <SQL sql={sql} isLoading={isLoading} />
              </motion.div>
            </TabsContent>

            <TabsContent value="DATA">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: animationDuration }}
              >
                <Data />
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
        {isLoading && !sql && (
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-80" />
          </div>
        )}
      </div>
    </div>
  );
}
