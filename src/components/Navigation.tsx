import { Button } from "@/components/ui/button";
import { Users, UserPlus, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: 'register' | 'attendees' | 'admin';
  onViewChange: (view: 'register' | 'attendees' | 'admin') => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <header className="bg-background shadow-card border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-primary">Photo</span>
              <span className="text-foreground">Delivery</span>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              Event Connect
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            <Button
              variant={currentView === 'register' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('register')}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Register</span>
            </Button>
            <Button
              variant={currentView === 'attendees' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('attendees')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Attendees</span>
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('admin')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};