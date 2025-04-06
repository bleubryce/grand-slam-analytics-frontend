
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardFooter } from "@/components/ui/card";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please provide both username and password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting login with:", { username, password: "*".repeat(password.length) });
      
      // Add verbose debugging to track the login flow
      console.log("Before login call");
      await login({ username, password });
      console.log("After login call - Login successful");
      
      toast({
        title: "Login successful",
        description: "You are now being redirected to the dashboard.",
      });
    } catch (err: any) {
      console.error("Login failed:", err);
      
      let errorMsg = 'Login failed. Please check your credentials and try again.';
      
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For development, auto-fill credentials for easy login
  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('password');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 pt-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p className="mb-1">Use these credentials:</p>
            <p className="text-sm">Username: <strong>admin</strong>, Password: <strong>password</strong></p>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a 
              href="#" 
              className="text-xs text-baseball-lightBlue hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="text-center">
          <button 
            type="button" 
            onClick={fillDemoCredentials}
            className="text-xs text-baseball-navy hover:underline"
          >
            Fill demo credentials
          </button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-baseball-navy hover:bg-baseball-navy/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
