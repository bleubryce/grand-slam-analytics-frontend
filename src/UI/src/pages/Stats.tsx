
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Stats = () => {
  const [loading, setLoading] = useState(true);
  
  const data = [
    { name: 'Game 1', runs: 4, hits: 9 },
    { name: 'Game 2', runs: 7, hits: 12 },
    { name: 'Game 3', runs: 2, hits: 5 },
    { name: 'Game 4', runs: 8, hits: 14 },
    { name: 'Game 5', runs: 5, hits: 11 },
    { name: 'Game 6', runs: 6, hits: 10 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Game Statistics</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-pulse col-span-2">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Game Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="runs" fill="#2563eb" name="Runs" />
                      <Bar dataKey="hits" fill="#4ade80" name="Hits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Batting Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Team Avg</span>
                    <span className="font-semibold">.287</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Runs</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RBIs</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stolen Bases</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pitching Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Team ERA</span>
                    <span className="font-semibold">3.42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strikeouts</span>
                    <span className="font-semibold">287</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WHIP</span>
                    <span className="font-semibold">1.18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Save %</span>
                    <span className="font-semibold">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
