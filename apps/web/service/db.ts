import { backendClient } from "@/utils/axios";

const executeSQLQueryKey = "execute-inference";

const getInferenceData = async (inferenceId: string) => {
  const { data } = await backendClient.get<{ sql: string; prompt: string }>(
    `/db/${inferenceId}`
  );
  return data;
};

const executeSQL = async (inferenceId: string) => {
  const { data } = await backendClient.get<Record<string, string>[]>(
    `/db/${inferenceId}/execute`
  );
  return data;
};

export const dbService = {
  executeSQLQueryKey,
  executeSQL,
  getInferenceData,
};
