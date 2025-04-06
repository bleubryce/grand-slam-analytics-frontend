
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (section: string) => {
    toast({
      title: "Settings updated",
      description: `Your ${section} settings have been saved.`,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-full max-w-md"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Alex Thompson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.thompson@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Team Analyst" disabled />
                  </div>
                  <Button onClick={() => handleSave('account')}>Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize how the application looks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="block">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the application.</p>
                    </div>
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-view" className="block">Compact View</Label>
                      <p className="text-sm text-muted-foreground">Use more condensed layouts.</p>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="large-text" className="block">Large Text</Label>
                      <p className="text-sm text-muted-foreground">Increase the text size.</p>
                    </div>
                    <Switch id="large-text" />
                  </div>
                  <Button onClick={() => handleSave('appearance')}>Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="block">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="game-reminders" className="block">Game Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming games.</p>
                    </div>
                    <Switch id="game-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="player-updates" className="block">Player Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about player status changes.</p>
                    </div>
                    <Switch id="player-updates" />
                  </div>
                  <Button onClick={() => handleSave('notifications')}>Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced application settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sync" className="block">Automatic Data Sync</Label>
                      <p className="text-sm text-muted-foreground">Automatically sync data with external sources.</p>
                    </div>
                    <Switch id="data-sync" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" defaultValue="••••••••••••••••••••••••" type="password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debug-mode" className="block">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable additional logging for troubleshooting.</p>
                    </div>
                    <Switch id="debug-mode" />
                  </div>
                  <Button onClick={() => handleSave('advanced')}>Save changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Settings;
