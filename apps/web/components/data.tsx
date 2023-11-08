"use client";

import { dbService } from "@/service/db";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@ui/components/skeleton";
import { useSearchParams } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/table";

const Data = () => {
  const searchParams = useSearchParams();
  const inferenceId = searchParams.get("inference-id");
  const { data, error, isError, isFetching } = useQuery({
    queryKey: [dbService.executeSQLQueryKey, inferenceId],
    queryFn: () => dbService.executeSQL(inferenceId!),
    enabled: !!inferenceId,
  });
  if (isFetching) return <Skeleton className="w-full h-80" />;
  if (isError)
    return (
      <div className="flex p-4 rounded-md justify-center items-center text-white bg-red-600">
        <pre>{JSON.stringify(JSON.parse(error.message), null, 2)}</pre>
      </div>
    );
  if (!data) return null;
  return (
    <div className="p-4 max-h-96 overflow-scroll rounded-md scroll-smooth">
      <Table className="rounded-sm overflow-clip">
        <TableHeader>
          <TableRow className="sticky top-0">
            {Object.keys(data[0]).map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={`row-${idx}`}>
              {Object.values(row).map((value) => (
                <TableCell key={`${value}-${idx}`}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Data;
