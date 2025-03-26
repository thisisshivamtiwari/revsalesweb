import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
} from 'lucide-react';
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
    path: '/team',
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
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
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
  );
} 