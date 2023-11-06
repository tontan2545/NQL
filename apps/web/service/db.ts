import { backendClient } from "@/utils/axios";

const executeSQLQueryKey = "execute-inference";

const executeSQL = async (inferenceId: string) => {
  const { data } = await backendClient.get<Record<string, string>[]>(
    `/db/${inferenceId}/execute`
  );
  return data;
};

export const dbService = {
  executeSQLQueryKey,
  executeSQL,
};
