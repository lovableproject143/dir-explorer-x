import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";

const StatusPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("membership_applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Application Status
        </h1>

        {applications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't submitted any membership applications yet.
            </p>
            <Button onClick={() => navigate("/membership")} className="bg-gradient-to-r from-primary to-secondary">
              Apply Now
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(app.status)}
                    <div>
                      <h3 className="font-bold capitalize">{app.membership_type} Membership</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">₹{app.amount}</span>
                  </div>
                  {app.payment_reference && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-xs">{app.payment_reference}</span>
                    </div>
                  )}
                  {app.admin_notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Admin Notes:</p>
                      <p className="text-sm">{app.admin_notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
