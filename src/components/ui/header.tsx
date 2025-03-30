import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
} from "lucide-react"
import { Button } from "./button"
import { useNavigate } from "react-router-dom"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

const GlassContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "relative backdrop-blur-md bg-[#0A0F20]/30 border-y border-[#2F304D]/20 shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#242744]/10 to-[#2F304D]/10" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <GlassContainer className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#242744] to-[#2F304D] flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">RevSales</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 text-gray-300 hover:text-white transition-colors",
                  location.pathname === item.href
                    ? "text-white"
                    : "text-gray-300"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-[#242744]/50"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button 
              className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </GlassContainer>
  )
} 