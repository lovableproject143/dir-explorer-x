import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">No Profile Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created your profile yet.
            </p>
            <Button onClick={() => navigate("/create-profile")} className="bg-gradient-to-r from-primary to-secondary">
              Create Profile
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => navigate("/create-profile")}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Your Profile
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{profile.full_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{profile.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-semibold">
                {new Date(profile.date_of_birth).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-semibold">{profile.address}</p>
              <p className="text-sm">
                {profile.city}, {profile.state} - {profile.pincode}
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-3">Emergency Contact</p>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{profile.emergency_contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{profile.emergency_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
