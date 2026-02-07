import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  TrendingDown,
  Leaf,
  Settings,
  Check,
  Trash2,
  MailOpen
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'High Impact Alert',
    message: 'Carbon emissions at Iron Ore Mine A have exceeded the threshold by 15%. Immediate action recommended.',
    timestamp: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'AI Recommendation Implemented',
    message: 'The "Optimize Blast Furnace Operations" recommendation has been successfully implemented, reducing coke consumption by 10%.',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Weekly Report Available',
    message: 'Your weekly sustainability report for January Week 4 is now available for download.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: '4',
    type: 'warning',
    title: 'Circularity Score Declining',
    message: 'The Material Circularity Index for Project "Steel Manufacturing LCA" has declined by 3% this month.',
    timestamp: '5 hours ago',
    read: true
  },
  {
    id: '5',
    type: 'success',
    title: 'Project Completed',
    message: 'LCA Assessment "Copper Extraction Analysis" has been completed. View the full report now.',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: '6',
    type: 'info',
    title: 'New AI Insights Available',
    message: '4 new AI-powered recommendations have been generated for your active projects.',
    timestamp: '2 days ago',
    read: true
  }
];

const typeConfig = {
  success: { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  alert: { icon: TrendingDown, color: 'text-destructive', bgColor: 'bg-destructive/10' }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated with alerts, reports, and AI recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <MailOpen className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground/70">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const config = typeConfig[notification.type];
                    const Icon = config.icon;
                    
                    return (
                      <div 
                        key={notification.id}
                        className={cn(
                          "p-4 rounded-lg border transition-colors",
                          notification.read 
                            ? "bg-background border-border/50" 
                            : "bg-accent/50 border-primary/20"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("p-2 rounded-full shrink-0", config.bgColor)}>
                            <Icon className={cn("h-5 w-5", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className={cn(
                                  "font-medium",
                                  !notification.read && "text-foreground"
                                )}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-2">
                                  {notification.timestamp}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Manage your notification preferences
                </span>
              </div>
              <Button variant="link" className="text-sm" asChild>
                <a href="/settings">Go to Settings</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
