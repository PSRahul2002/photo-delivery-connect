import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Download, 
  Trash2, 
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AttendeeData } from './RegistrationForm';
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  attendees: AttendeeData[];
  onClearData: () => void;
}

export const AdminDashboard = ({ attendees, onClearData }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredAttendees = attendees.filter(attendee =>
    attendee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    if (attendees.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no attendees to export.",
        variant: "destructive"
      });
      return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'LinkedIn URL', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...attendees.map(attendee => [
        `"${attendee.fullName}"`,
        `"${attendee.email}"`,
        `"${attendee.phone}"`,
        `"${attendee.linkedinUrl}"`,
        `"${attendee.registeredAt.toISOString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event-attendees-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${attendees.length} attendees to CSV.`,
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all attendee data? This action cannot be undone.')) {
      onClearData();
      toast({
        title: "Data Cleared",
        description: "All attendee data has been removed.",
      });
    }
  };

  const totalAttendees = attendees.length;
  const todayRegistrations = attendees.filter(
    attendee => attendee.registeredAt.toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage event attendees and export data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalAttendees}</div>
            <p className="text-xs text-muted-foreground">
              registered for this event
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Registrations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{todayRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              new registrations today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalAttendees > 0 ? '100%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              profiles completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-gradient-primary hover:bg-primary-hover"
          disabled={attendees.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
        <Button 
          onClick={handleClearData}
          variant="destructive"
          className="flex items-center gap-2"
          disabled={attendees.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Label htmlFor="search" className="text-sm font-medium">Search Attendees</Label>
        <Input
          id="search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Attendees List */}
      {attendees.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Attendees Yet</h3>
              <p className="text-muted-foreground">
                Attendee data will appear here once registrations begin.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Attendees ({filteredAttendees.length} of {totalAttendees})
            </h3>
          </div>
          
          <div className="grid gap-4">
            {filteredAttendees.map((attendee) => (
              <Card key={attendee.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        {attendee.selfieUrl ? (
                          <img
                            src={attendee.selfieUrl}
                            alt={`${attendee.fullName}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Users className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-grow space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="text-lg font-semibold text-foreground">
                          {attendee.fullName}
                        </h4>
                        <Badge variant="outline">
                          {attendee.registeredAt.toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{attendee.email}</span>
                        </div>
                        
                        {attendee.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{attendee.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-muted-foreground lg:col-span-2">
                          <ExternalLink className="h-4 w-4" />
                          <a 
                            href={attendee.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {attendee.linkedinUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};