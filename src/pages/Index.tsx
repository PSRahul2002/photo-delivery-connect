import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { RegistrationForm, AttendeeData } from '@/components/RegistrationForm';
import { AttendeesList } from '@/components/AttendeesList';
import { AdminDashboard } from '@/components/AdminDashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'register' | 'attendees' | 'admin'>('register');
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [currentUser, setCurrentUser] = useState<AttendeeData | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAttendees = localStorage.getItem('eventconnect-attendees');
    const savedCurrentUser = localStorage.getItem('eventconnect-current-user');
    
    if (savedAttendees) {
      const parsedAttendees = JSON.parse(savedAttendees).map((attendee: any) => ({
        ...attendee,
        registeredAt: new Date(attendee.registeredAt)
      }));
      setAttendees(parsedAttendees);
    }
    
    if (savedCurrentUser) {
      const parsedUser = JSON.parse(savedCurrentUser);
      setCurrentUser({
        ...parsedUser,
        registeredAt: new Date(parsedUser.registeredAt)
      });
    }
  }, []);

  // Save data to localStorage whenever attendees change
  useEffect(() => {
    localStorage.setItem('eventconnect-attendees', JSON.stringify(attendees));
  }, [attendees]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eventconnect-current-user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleRegistration = (newAttendee: AttendeeData) => {
    setAttendees(prev => {
      // Check if user already exists (by email) and update, otherwise add
      const existingIndex = prev.findIndex(attendee => attendee.email === newAttendee.email);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAttendee;
        return updated;
      }
      return [...prev, newAttendee];
    });
    setCurrentUser(newAttendee);
  };

  const handleViewAttendees = () => {
    setCurrentView('attendees');
  };

  const handleClearData = () => {
    setAttendees([]);
    setCurrentUser(null);
    localStorage.removeItem('eventconnect-attendees');
    localStorage.removeItem('eventconnect-current-user');
    setCurrentView('register');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <main className="pt-4">
        {currentView === 'register' && (
          <RegistrationForm 
            onRegistration={handleRegistration}
            onViewAttendees={handleViewAttendees}
          />
        )}
        
        {currentView === 'attendees' && (
          <AttendeesList 
            attendees={attendees}
            currentUser={currentUser}
          />
        )}
        
        {currentView === 'admin' && (
          <AdminDashboard 
            attendees={attendees}
            onClearData={handleClearData}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
