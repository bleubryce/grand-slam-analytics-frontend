
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Database, Server, RefreshCcw, FileSearch } from "lucide-react";

const Database = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("players");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const tables = [
    { id: "players", name: "Players", count: 250, lastUpdated: "Apr 5, 2025" },
    { id: "teams", name: "Teams", count: 30, lastUpdated: "Apr 5, 2025" },
    { id: "games", name: "Games", count: 486, lastUpdated: "Apr 6, 2025" },
    { id: "statistics", name: "Statistics", count: 12480, lastUpdated: "Apr 6, 2025" },
    { id: "injuries", name: "Injuries", count: 42, lastUpdated: "Apr 4, 2025" },
  ];

  const sampleSchema = [
    { column: "id", type: "INT", constraints: "PRIMARY KEY" },
    { column: "first_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column: "last_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column: "position", type: "VARCHAR(10)", constraints: "NOT NULL" },
    { column: "team_id", type: "INT", constraints: "FOREIGN KEY" },
    { column: "jersey_number", type: "INT", constraints: "" },
    { column: "batting_hand", type: "CHAR(1)", constraints: "" },
    { column: "throwing_hand", type: "CHAR(1)", constraints: "" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Database</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <FileSearch className="mr-2 h-4 w-4" />
              Query Builder
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tables.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13,288</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">345 MB</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>View and manage your baseball analytics database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-full max-w-md"></div>
                <div className="border rounded">
                  <div className="h-10 border-b bg-gray-100"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 border-b last:border-0"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-5 mb-6">
                    {tables.map(table => (
                      <TabsTrigger key={table.id} value={table.id}>{table.name}</TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {tables.map(table => (
                    <TabsContent key={table.id} value={table.id}>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{table.name} Table</h3>
                          <p className="text-sm text-muted-foreground">
                            {table.count} records • Last updated: {table.lastUpdated}
                          </p>
                        </div>
                        <Button size="sm">
                          <Database className="mr-2 h-4 w-4" />
                          Export Table
                        </Button>
                      </div>
                      
                      <div className="border rounded">
                        <div className="bg-muted px-4 py-2 grid grid-cols-3 text-sm font-medium">
                          <div>Column</div>
                          <div>Type</div>
                          <div>Constraints</div>
                        </div>
                        <div className="divide-y">
                          {sampleSchema.map((column, i) => (
                            <div key={i} className="px-4 py-3 grid grid-cols-3">
                              <div className="font-medium">{column.column}</div>
                              <div className="text-sm">{column.type}</div>
                              <div className="text-sm text-muted-foreground">{column.constraints}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Database;
