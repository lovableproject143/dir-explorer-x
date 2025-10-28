import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

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

    const planData = sessionStorage.getItem("selectedMembership");
    if (!planData) {
      toast({
        title: "No Plan Selected",
        description: "Please select a membership plan first.",
        variant: "destructive",
      });
      navigate("/membership");
      return;
    }

    setSelectedPlan(JSON.parse(planData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("membership_applications").insert({
        user_id: user.id,
        membership_type: selectedPlan.type,
        amount: selectedPlan.amount,
        payment_reference: paymentReference,
        status: "pending",
      });

      if (error) throw error;

      sessionStorage.removeItem("selectedMembership");

      toast({
        title: "Application Submitted!",
        description: "Your membership application has been submitted for review.",
      });

      navigate("/status");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
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
          onClick={() => navigate("/membership")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Payment
          </h1>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Selected Plan</p>
                <p className="font-bold">{selectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₹{selectedPlan.amount}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <QrCode className="w-24 h-24 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Use any UPI app to scan and pay
              </p>
            </div>

            <div className="flex flex-col justify-center p-6 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
              <h3 className="font-bold mb-4">Or use UPI ID</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">UPI ID:</p>
                <code className="block bg-background p-2 rounded text-sm">
                  temple@upi
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Send payment to this UPI ID
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Payment Reference / Transaction ID *</Label>
              <Input
                id="reference"
                placeholder="Enter transaction ID from UPI app"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please enter the transaction ID received after making the payment
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
