
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

const RegisterForm = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-username">Username</Label>
          <Input
            id="new-username"
            placeholder="Choose a username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Choose a password"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-baseball-navy hover:bg-baseball-navy/90"
          disabled
        >
          Create account (Coming soon)
        </Button>
      </CardFooter>
    </>
  );
};

export default RegisterForm;
