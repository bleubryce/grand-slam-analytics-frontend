
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Performance = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const performanceData = [
    { month: 'Apr', batting: 0.310, league: 0.258 },
    { month: 'May', batting: 0.287, league: 0.262 },
    { month: 'Jun', batting: 0.305, league: 0.268 },
    { month: 'Jul', batting: 0.325, league: 0.271 },
    { month: 'Aug', batting: 0.290, league: 0.267 },
    { month: 'Sep', batting: 0.278, league: 0.260 }
  ];
  
  const pitchingData = [
    { month: 'Apr', era: 3.8, league: 4.1 },
    { month: 'May', era: 3.5, league: 4.0 },
    { month: 'Jun', era: 3.2, league: 4.2 },
    { month: 'Jul', era: 3.9, league: 4.3 },
    { month: 'Aug', era: 3.3, league: 4.1 },
    { month: 'Sep', era: 3.0, league: 3.9 }
  ];
  
  const playerPerformanceData = [
    { player: 'Johnson', average: 0.328, hr: 16, rbi: 68 },
    { player: 'Martinez', average: 0.302, hr: 24, rbi: 82 },
    { player: 'Thompson', average: 0.275, hr: 12, rbi: 45 },
    { player: 'Garcia', average: 0.315, hr: 8, rbi: 53 },
    { player: 'Wilson', average: 0.265, hr: 28, rbi: 94 }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Performance Analysis</h1>
        
        <Tabs defaultValue="team">
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="team">Team Performance</TabsTrigger>
              <TabsTrigger value="batting">Batting Analysis</TabsTrigger>
              <TabsTrigger value="pitching">Pitching Analysis</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="team">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="animate-pulse lg:col-span-2">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Season Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="batting" name="Team Avg" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                          <Area type="monotone" dataKey="league" name="League Avg" stroke="#6b7280" fill="#6b7280" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Batting Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="batting" name="Team AVG" stroke="#2563eb" strokeWidth={2} />
                          <Line type="monotone" dataKey="league" name="League AVG" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pitching Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pitchingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="era" name="Team ERA" stroke="#2563eb" strokeWidth={2} />
                          <Line type="monotone" dataKey="league" name="League ERA" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="batting">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="animate-pulse lg:col-span-2">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Top Batters Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={playerPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="player" />
                          <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                          <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="average" name="AVG" fill="#2563eb" />
                          <Bar yAxisId="right" dataKey="hr" name="Home Runs" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Batting Average Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {playerPerformanceData.map(player => (
                        <div key={player.player} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{player.player}</span>
                            <span>{player.average}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-baseball-navy rounded-full" 
                              style={{ width: `${player.average * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>RBI Leaders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {playerPerformanceData
                        .sort((a, b) => b.rbi - a.rbi)
                        .map(player => (
                        <div key={player.player} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{player.player}</span>
                            <span>{player.rbi} RBIs</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-baseball-red rounded-full" 
                              style={{ width: `${(player.rbi / 100) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pitching">
            {loading ? (
              <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Pitching ERA by Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pitchingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[2.5, 4.5]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="era" name="Team ERA" stroke="#2563eb" strokeWidth={2} />
                          <Line type="monotone" dataKey="league" name="League ERA" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pitching Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Team ERA</span>
                        <span className="text-lg font-bold">3.45</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">WHIP</span>
                        <span className="text-lg font-bold">1.18</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Strikeouts</span>
                        <span className="text-lg font-bold">876</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Saves</span>
                        <span className="text-lg font-bold">32/38</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Complete Games</span>
                        <span className="text-lg font-bold">4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Opponent Batting Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-center">.242</div>
                      <div className="text-sm text-center text-muted-foreground">League Avg: .258</div>
                      <div className="pt-4 space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>vs Right-Handed</span>
                            <span>.237</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '23.7%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>vs Left-Handed</span>
                            <span>.249</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-amber-500 rounded-full" style={{ width: '24.9%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Performance;
