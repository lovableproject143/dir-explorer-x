import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck, Calendar } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjZiMzUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Temple Membership Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our spiritual community through our digital platform. Register as a temple member with ease and stay connected with all temple activities.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/admin/login')}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Join Our Temple Community?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience seamless membership management with our modern platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 hover:shadow-xl transition-shadow bg-card border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Easy Registration</h3>
            <p className="text-muted-foreground">
              Simple and intuitive membership registration process with step-by-step guidance.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow bg-card border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Secure Platform</h3>
            <p className="text-muted-foreground">
              Your information is kept safe and secure with our robust system.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow bg-card border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Community Access</h3>
            <p className="text-muted-foreground">
              Connect with fellow devotees and stay updated on temple activities.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-12 text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Start your spiritual journey with us today. Register now and become part of our temple family.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
          >
            Begin Your Journey
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
