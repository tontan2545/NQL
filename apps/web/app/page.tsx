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
import { useToast } from "@ui/components/use-toast";
import { Button } from "@ui/components/button";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("SQL");
  const [sql, setSql] = useState<string | null>(null);
  const { toast } = useToast();
  const animationDuration = 0.2;
  const router = useRouter();

  const exampleQuestions = [
    "which movie has the most inventory and how much is it left in the inventory",
    "What are the top 3 best selling films?",
    "มีลูกค้ากี่คนบ้างที่มาจากแคนาดา",
    "นักแสดงที่สร้างรายได้การเช่ามากที่สุด",
    "How much business, in dollars, each store brought in.",
  ];

  useEffect(() => {
    const inferenceId = searchParams.get("inference-id");

    if (inferenceId) {
      const getInferenceData = async () => {
        try {
          const data = await dbService.getInferenceData(inferenceId);
          setSql(data.sql);
          setPrompt(data.prompt);
        } catch (e) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: (e as unknown as Error).message,
          });
        }
      };

      getInferenceData();
    }

    setIsLoading(false);
  }, []);

  const onSearch = useCallback(async () => {
    if (prompt.length === 0) return;
    setSql(null);
    setIsLoading(true);
    try {
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
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (e as unknown as Error).message,
      });
    }

    setIsLoading(false);
    setTab("SQL");
  }, [prompt]);

  const onQuestionExampleSelect = async (question: string) =>
    setPrompt(question);

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
        {!isLoading && !sql && (
          <div className="flex justify-center flex-wrap w-full gap-x-4 gap-y-3">
            {exampleQuestions.map((question) => (
              <Button
                size="sm"
                variant="secondary"
                key={question}
                onClick={() => onQuestionExampleSelect(question)}
                className="font-normal min-w-max hover:bg-slate-100"
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
