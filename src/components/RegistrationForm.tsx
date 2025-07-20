import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ExternalLink, Users } from 'lucide-react';

export interface AttendeeData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  selfieUrl: string;
  registeredAt: Date;
}

interface RegistrationFormProps {
  onRegistration: (attendee: AttendeeData) => void;
  onViewAttendees: () => void;
}

export const RegistrationForm = ({ onRegistration, onViewAttendees }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  });
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelfieSelect = (file: File | null) => {
    setSelfieFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfiePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelfiePreview(null);
    }
  };

  const validateLinkedInUrl = (url: string) => {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url) || url.startsWith('linkedin.com/in/') || url.startsWith('www.linkedin.com/in/');
  };

  const formatLinkedInUrl = (url: string) => {
    if (url.startsWith('linkedin.com/in/')) {
      return `https://www.${url}`;
    }
    if (url.startsWith('www.linkedin.com/in/')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.linkedinUrl || !selfieFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload a selfie.",
        variant: "destructive"
      });
      return;
    }

    const formattedLinkedInUrl = formatLinkedInUrl(formData.linkedinUrl);
    if (!validateLinkedInUrl(formattedLinkedInUrl)) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const attendeeData: AttendeeData = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        linkedinUrl: formattedLinkedInUrl,
        selfieUrl: selfiePreview || '',
        registeredAt: new Date()
      };

      onRegistration(attendeeData);
      setIsRegistered(true);
      
      toast({
        title: "Registration Successful! 🎉",
        description: "Welcome to the event! You can now browse other attendees.",
      });

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-elegant border-0 bg-gradient-subtle">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Registration Complete!</h2>
                <p className="text-muted-foreground">
                  Welcome to the event, {formData.fullName}! You're all set to connect with other attendees.
                </p>
              </div>
              <Button 
                onClick={onViewAttendees}
                size="lg"
                className="bg-gradient-primary hover:bg-primary-hover shadow-elegant"
              >
                <Users className="mr-2 h-4 w-4" />
                View Attendees
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-elegant border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Join the Event
          </CardTitle>
          <CardDescription className="text-lg">
            Register to connect with fellow attendees and expand your network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-base font-medium">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 h-12"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@company.com"
                    className="mt-1 h-12"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1 h-12"
                  />
                </div>
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div>
              <Label htmlFor="linkedinUrl" className="text-base font-medium flex items-center gap-2">
                LinkedIn Profile *
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                placeholder="linkedin.com/in/yourprofile or full URL"
                className="mt-1 h-12"
                required
              />
            </div>

            {/* Selfie Upload */}
            <div>
              <Label className="text-base font-medium mb-3 block">Profile Photo *</Label>
              <FileUpload
                onFileSelect={handleSelfieSelect}
                preview={selfiePreview}
                placeholder="Upload your photo"
                accept="image/*"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg bg-gradient-primary hover:bg-primary-hover shadow-elegant"
            >
              {isSubmitting ? 'Registering...' : 'Register for Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};