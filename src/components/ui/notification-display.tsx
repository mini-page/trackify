
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: string;
}

interface NotificationDisplayProps {
  notifications: Notification[];
  onClose: () => void;
  isMobile?: boolean;
}

export const NotificationDisplay: React.FC<NotificationDisplayProps> & {
  handleNotificationClick: (id: number) => void;
} = ({ notifications, onClose, isMobile = false }) => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 z-50"
      onClick={onClose}
    >
      <div 
        className={cn(
          "absolute bg-white border border-border rounded-lg shadow-lg z-51",
          isMobile 
            ? "left-4 top-[60px] w-[calc(100vw-32px)]" 
            : "right-4 top-[60px] w-[320px] max-w-[calc(100vw-40px)]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 p-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button 
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto p-4 pt-0">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors",
                  notification.unread 
                    ? "bg-secondary/70" 
                    : "bg-secondary/30 hover:bg-secondary/40"
                )}
                onClick={() => NotificationDisplay.handleNotificationClick(notification.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="mt-4 pt-2 border-t p-4">
            <button 
              className="w-full text-sm text-center text-primary hover:underline"
              onClick={() => {
                toast.success('All notifications marked as read');
                onClose();
              }}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Static method to handle notification clicks
NotificationDisplay.handleNotificationClick = (id: number) => {
  toast.success(`Notification ${id} marked as read`);
  // In a real app, would mark notification as read in state/database
};
