"use client";

import {
  QueryClient,
  QueryClientProvider as QCProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QCProvider client={queryClient}>{children}</QCProvider>;
}
