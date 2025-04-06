
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart, Filter } from "lucide-react";

const Reports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const reportTemplates = [
    { id: 1, name: "Team Performance Summary", description: "Overview of team statistics and performance metrics", icon: BarChart },
    { id: 2, name: "Player Evaluation", description: "Detailed evaluation of individual player performance", icon: FileText },
    { id: 3, name: "Opponent Analysis", description: "Analysis of upcoming opponent's strengths and weaknesses", icon: Filter },
  ];

  const recentReports = [
    { id: 1, name: "Season Progress Report", date: "Apr 3, 2025", downloads: 12 },
    { id: 2, name: "Player Development Analysis Q1", date: "Mar 15, 2025", downloads: 8 },
    { id: 3, name: "Scouting Report - Yankees", date: "Mar 2, 2025", downloads: 15 },
    { id: 4, name: "Injury Impact Assessment", date: "Feb 25, 2025", downloads: 6 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 border rounded">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportTemplates.map((template) => (
                      <div key={template.id} className="p-4 border rounded">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <template.icon className="h-5 w-5 text-baseball-navy" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Generate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center p-2">
                      <div className="h-8 w-8 bg-gray-200 rounded mr-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center mr-2">
                        <FileText className="h-4 w-4 text-baseball-navy" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{report.name}</div>
                        <div className="text-xs text-muted-foreground">{report.date}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
