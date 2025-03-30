import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dock, DockIcon, DockItem, DockLabel } from './vertical-dock';

const navigationItems = [
  {
    title: 'Home',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    path: '/calendar',
  },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/analytics',
  },
  {
    title: 'Team',
    icon: Users,
    path: '/teams',
  },
  {
    title: 'Profile',
    icon: UserCircle,
    path: '/profile',
  },
];

export function VerticalNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation - Vertical */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <Dock className="items-center py-6">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item, idx) => (
              <DockItem
                key={idx}
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                className="aspect-square rounded-xl hover:bg-[#2F304D]/50"
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <item.icon className="h-full w-full text-white" />
                </DockIcon>
              </DockItem>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#2F304D]/20">
            <DockItem
              onClick={() => navigate('/settings')}
              isActive={location.pathname === '/settings'}
              className="aspect-square rounded-xl hover:bg-[#2F304D]/50"
            >
              <DockLabel>Settings</DockLabel>
              <DockIcon>
                <Settings className="h-full w-full text-white" />
              </DockIcon>
            </DockItem>
          </div>
        </Dock>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1D2E] border-t border-[#2F304D]/20 md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {navigationItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "text-[#FF5A81]"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          ))}
          <button
            onClick={() => navigate('/settings')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              location.pathname === '/settings'
                ? "text-[#FF5A81]"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
} 