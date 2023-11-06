import Search from "@/components/search";
import SQL from "@/components/sql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center pt-7">
      <div className="w-2/5 space-y-4">
        <Search />
        <Tabs defaultValue="SQL" className="w-full">
          <TabsList className="shadow-sm">
            <TabsTrigger value="SQL">SQL</TabsTrigger>
            <TabsTrigger value="Data">Data</TabsTrigger>
          </TabsList>
          <TabsContent
            value="SQL"
            className="shadow-sm bg-transparent border-[1px] border-border rounded-md p-8"
          >
            <SQL />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
