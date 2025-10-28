import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, UserPlus, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    setHasProfile(!!profile);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {!hasProfile && (
            <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Complete Your Profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your profile to start your membership application
                  </p>
                  <Button onClick={() => navigate("/create-profile")} className="bg-gradient-to-r from-primary to-secondary">
                    Create Profile
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {hasProfile && (
            <Card className="p-6 bg-gradient-to-r from-secondary/10 via-accent/10 to-primary/10 border-secondary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Apply for Membership</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose your membership plan and complete the application
                  </p>
                  <Button onClick={() => navigate("/membership")} className="bg-gradient-to-r from-secondary to-accent">
                    Start Application
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid gap-4 mt-6">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/events")}>
              <h3 className="font-bold mb-1">Temple Events</h3>
              <p className="text-sm text-muted-foreground">View upcoming temple events and activities</p>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/donate")}>
              <h3 className="font-bold mb-1">Make a Donation</h3>
              <p className="text-sm text-muted-foreground">Support the temple with your generous donations</p>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/status")}>
              <h3 className="font-bold mb-1">Application Status</h3>
              <p className="text-sm text-muted-foreground">Track your membership application</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
