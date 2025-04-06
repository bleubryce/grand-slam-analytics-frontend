
import React, { ReactNode } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthCardProps {
  loginComponent: ReactNode;
  registerComponent: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  loginComponent, 
  registerComponent 
}) => {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center">
          <div className="rounded-full bg-baseball-navy p-2">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">Baseball Analytics</CardTitle>
        <CardDescription className="text-center">
          Sign in to access your dashboard
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          {loginComponent}
        </TabsContent>
        <TabsContent value="register">
          {registerComponent}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
