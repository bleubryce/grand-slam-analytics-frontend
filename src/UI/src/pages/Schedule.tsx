
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const Schedule = () => {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Dummy game dates for the calendar
  const gameDates = [
    new Date(2025, 3, 8),
    new Date(2025, 3, 10),
    new Date(2025, 3, 12),
    new Date(2025, 3, 15),
    new Date(2025, 3, 18),
    new Date(2025, 3, 21),
  ];

  // Upcoming games based on the current date
  const upcomingGames = [
    { id: 1, opponent: "Royals", location: "Home", date: "Apr 8, 2025", time: "7:05 PM" },
    { id: 2, opponent: "Yankees", location: "Away", date: "Apr 10, 2025", time: "1:10 PM" },
    { id: 3, opponent: "Red Sox", location: "Away", date: "Apr 12, 2025", time: "4:05 PM" },
    { id: 4, opponent: "Blue Jays", location: "Home", date: "Apr 15, 2025", time: "7:05 PM" },
    { id: 5, opponent: "Orioles", location: "Home", date: "Apr 18, 2025", time: "7:15 PM" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Schedule</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Games</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">vs. {game.opponent}</div>
                        <div className="text-sm text-muted-foreground">{game.date} • {game.time} • {game.location}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-white text-xs ${game.location === 'Home' ? 'bg-baseball-navy' : 'bg-baseball-red'}`}>
                        {game.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-[350px] bg-gray-200 rounded"></div>
              ) : (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    gameDay: gameDates,
                  }}
                  modifiersStyles={{
                    gameDay: {
                      fontWeight: 'bold',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
