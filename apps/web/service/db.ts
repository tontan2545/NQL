import { backendClient } from "@/utils/axios";
import { z } from "zod";

const executeSQLQueryKey = "execute-inference";

const getInferenceData = async (inferenceId: string) => {
  const { data } = await backendClient.get<{ sql: string; prompt: string }>(
    `/db/${inferenceId}`
  );
  return data;
};

const executeSQL = async (inferenceId: string) => {
  const { data } = await backendClient.get<unknown[]>(
    `/db/${inferenceId}/execute`
  );

  const schema = z.array(z.record(z.string()));
  const parsedData = schema.parse(data);

  return parsedData;
};

export const dbService = {
  executeSQLQueryKey,
  executeSQL,
  getInferenceData,
};
