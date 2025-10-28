import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, QrCode } from "lucide-react";

const DonatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your donation!",
      description: `Your generous donation of ₹${amount} is greatly appreciated.`,
    });
    setAmount("");
    setName("");
  };

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

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Make a Donation
          </h1>
          <p className="text-muted-foreground">
            Support the temple with your generous contribution
          </p>
        </div>

        <Card className="p-6 mb-6">
          <form onSubmit={handleDonate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                <QrCode className="w-20 h-20 mx-auto mb-3 text-primary" />
                <p className="text-sm font-semibold mb-1">Scan QR Code</p>
                <p className="text-xs text-muted-foreground">Use any UPI app</p>
              </div>

              <div className="flex flex-col justify-center p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
                <p className="text-sm font-semibold mb-2">UPI ID:</p>
                <code className="block bg-background p-2 rounded text-sm mb-2">
                  temple@upi
                </code>
                <p className="text-xs text-muted-foreground">
                  Send payment to this UPI ID
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              Confirm Donation
            </Button>
          </form>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
          <h3 className="font-bold mb-2">Your contribution helps:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Maintain temple facilities and daily operations</li>
            <li>• Organize community events and festivals</li>
            <li>• Support charitable activities</li>
            <li>• Preserve our spiritual heritage</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DonatePage;
