import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number. Must be a valid Indian mobile number (10 digits starting with 6-9)"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200, "Address must be less than 200 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100, "City too long"),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(100, "State too long"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  emergencyContact: z.string().trim().min(2, "Contact name must be at least 2 characters").max(100, "Contact name too long"),
  emergencyPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid emergency phone number"),
});

const ProfileFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyPhone: "",
    aadharNumber: "",
    aadharCardUrl: "",
  });
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    setFormData(prev => ({ ...prev, email: session.user.email || "" }));

    // Check if profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile) {
      setFormData({
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.date_of_birth,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        emergencyContact: profile.emergency_contact,
        emergencyPhone: profile.emergency_phone,
        aadharNumber: profile.aadhar_number,
        aadharCardUrl: profile.aadhar_card_url || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validationResult = profileSchema.safeParse(formData);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      let aadharCardUrl = formData.aadharCardUrl;

      // Upload Aadhar card if a new file is selected
      if (aadharFile) {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(aadharFile.type)) {
          toast({
            title: "Invalid file type",
            description: "Please upload only JPG, PNG, or PDF files",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        if (aadharFile.size > maxSize) {
          toast({
            title: "File too large",
            description: "File size must be less than 5MB",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        setUploading(true);
        const fileExt = aadharFile.name.split('.').pop();
        const fileName = `${user.id}/aadhar-card.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('aadhar-cards')
          .upload(fileName, aadharFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('aadhar-cards')
          .getPublicUrl(fileName);

        aadharCardUrl = publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        aadhar_number: formData.aadharNumber,
        aadhar_card_url: aadharCardUrl,
      });

      if (error) throw error;

      toast({
        title: "Profile saved!",
        description: "Your profile has been updated successfully.",
      });
      
      navigate("/home");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
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

        <Card className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number *</Label>
              <Input
                id="aadharNumber"
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                placeholder="Enter 12-digit Aadhar number"
                maxLength={12}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharCard">Upload Aadhar Card *</Label>
              <Input
                id="aadharCard"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setAadharFile(e.target.files?.[0] || null)}
                required={!formData.aadharCardUrl}
              />
              {formData.aadharCardUrl && (
                <p className="text-xs text-muted-foreground">
                  Already uploaded. Select a new file to replace.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={loading || uploading}
            >
              {uploading ? "Uploading..." : loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileFormPage;
