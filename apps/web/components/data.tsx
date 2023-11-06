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
  const { data } = useQuery({
    queryKey: [dbService.executeSQLQueryKey, inferenceId],
    queryFn: () => dbService.executeSQL(inferenceId!),
    enabled: !!inferenceId,
  });
  console.log(data);
  return !data ? (
    <Skeleton className="w-full h-80" />
  ) : (
    <div className="max-h-96 overflow-scroll">
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0">
            {Object.keys(data[0]).map((key) => (
              <TableHead>{key}</TableHead>
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
