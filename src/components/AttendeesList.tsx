import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Users, Calendar } from 'lucide-react';
import { AttendeeData } from './RegistrationForm';

interface AttendeesListProps {
  attendees: AttendeeData[];
  currentUser?: AttendeeData | null;
}

export const AttendeesList = ({ attendees, currentUser }: AttendeesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendees = attendees.filter(attendee =>
    attendee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkedInClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (attendees.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Users className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Attendees Yet</h2>
          <p className="text-muted-foreground">
            Be the first to register for this event!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Event Attendees</h1>
        <p className="text-muted-foreground">
          Connect with {attendees.length} fellow attendee{attendees.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{filteredAttendees.length} of {attendees.length} attendees</span>
        </div>
      </div>

      {/* Attendees Grid */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No attendees found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttendees.map((attendee) => (
            <Card 
              key={attendee.id} 
              className={`shadow-card hover:shadow-elegant transition-all duration-300 ${
                currentUser?.id === attendee.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Profile Photo */}
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted">
                      {attendee.selfieUrl ? (
                        <img
                          src={attendee.selfieUrl}
                          alt={`${attendee.fullName}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Users className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    {currentUser?.id === attendee.id && (
                      <Badge className="absolute -top-2 -right-2 bg-primary">You</Badge>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-foreground">
                      {attendee.fullName}
                    </h3>
                  </div>

                  {/* Registration Time */}
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Joined {attendee.registeredAt.toLocaleDateString()}
                    </span>
                  </div>

                  {/* LinkedIn Button */}
                  <Button
                    onClick={() => handleLinkedInClick(attendee.linkedinUrl)}
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};