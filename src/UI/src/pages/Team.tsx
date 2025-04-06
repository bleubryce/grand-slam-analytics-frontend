
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Team = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading team data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Team Management</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eagles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Record: 32-18</p>
                <p className="text-sm text-muted-foreground">Players: 25</p>
                <p className="text-sm text-muted-foreground">Last Game: Win</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Record: 28-22</p>
                <p className="text-sm text-muted-foreground">Players: 24</p>
                <p className="text-sm text-muted-foreground">Last Game: Loss</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bears</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Record: 26-24</p>
                <p className="text-sm text-muted-foreground">Players: 23</p>
                <p className="text-sm text-muted-foreground">Last Game: Win</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
