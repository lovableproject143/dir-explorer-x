import { Home, User, Calendar, Heart, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/donate", icon: Heart, label: "Donate" },
    { path: "/status", icon: FileText, label: "Status" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
