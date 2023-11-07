export const tabs = ["SQL", "DATA"] as const;

export const tabLabels: Record<(typeof tabs)[number], string> = {
  SQL: "SQL",
  DATA: "Data",
};
