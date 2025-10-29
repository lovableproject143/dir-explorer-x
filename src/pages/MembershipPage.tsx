import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check } from "lucide-react";

const membershipPlan = {
  type: "basic",
  name: "Temple Membership",
  amount: 1000,
  features: ["Temple entry", "Event notifications", "Priority darshan", "Monthly newsletter", "Special event invites"],
};

const MembershipPage = () => {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please create your profile first.",
        variant: "destructive",
      });
      navigate("/create-profile");
      return;
    }

    setHasProfile(true);
    setLoading(false);
  };

  const handleSelectPlan = () => {
    sessionStorage.setItem("selectedMembership", JSON.stringify(membershipPlan));
    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Temple Membership
          </h1>
          <p className="text-muted-foreground">
            Join our temple community
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-primary/50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">{membershipPlan.name}</h3>
              <div className="text-3xl font-bold text-primary mb-1">
                ₹{membershipPlan.amount}
              </div>
              <p className="text-sm text-muted-foreground">per year</p>
            </div>

            <ul className="space-y-3 mb-6">
              {membershipPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleSelectPlan}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              Select Plan
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
