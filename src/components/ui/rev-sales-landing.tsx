import React from "react";
import { Phone, Mail, Menu, X, ChevronRight, Home, Users, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSection } from "./hero-section";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#", icon: <Home className="h-4 w-4" /> },
  { label: "Contacts", href: "#", icon: <Users className="h-4 w-4" /> },
  { label: "Analytics", href: "#", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", href: "#", icon: <Settings className="h-4 w-4" /> },
];

export function RevSalesLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-lg border-b border-border/40" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary p-1.5">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">RevSales</span>
                </a>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="hidden md:flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </a>
                <button
                  type="button"
                  className="md:hidden rounded-md p-2 text-foreground"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background/60 backdrop-blur-xl border-l border-border/40 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <a href="/" className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary p-1.5">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">RevSales</span>
                </a>
                <button
                  type="button"
                  className="rounded-md p-2 text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </a>
                  ))}
                  <div className="pt-4 border-t border-border/40">
                    <a
                      href="#"
                      className="flex items-center py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </a>
                    <a
                      href="#"
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <HeroSection
        title="Mobile CRM Solution"
        subtitle={{
          regular: "Your CRM, ",
          gradient: "Anywhere You Go",
        }}
        description="Manage your sales pipeline, track customer interactions, and close deals faster with our powerful mobile CRM solution."
        ctaText="Get Started"
        ctaHref="#"
        bottomImage={{
          light: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop",
          dark: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=2070&auto=format&fit=crop",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "#4a4a4a",
          darkLineColor: "#2a2a2a",
        }}
      />

      {/* Features Section */}
      <section className="py-16 px-4 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your sales on the go
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              RevSales mobile app brings all the power of your CRM to your fingertips, no matter where you are.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Contact Management",
                description: "Keep all your customer information organized and accessible anytime, anywhere.",
                icon: <Users className="h-6 w-6" />,
              },
              {
                title: "Sales Analytics",
                description: "Get real-time insights into your sales performance with powerful analytics tools.",
                icon: <BarChart3 className="h-6 w-6" />,
              },
              {
                title: "Task Management",
                description: "Never miss a follow-up with integrated task management and reminders.",
                icon: <Settings className="h-6 w-6" />,
              },
            ].map((feature, index) => (
              <div key={index} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glassmorphism Footer */}
      <footer className="mt-auto w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-lg border-t border-border/40" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <a href="/" className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary p-1.5">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">RevSales</span>
                </a>
                <p className="text-sm text-muted-foreground">
                  Your complete mobile CRM solution for sales professionals on the go.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  {["Features", "Pricing", "Integrations", "FAQ"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  {["About", "Blog", "Careers", "Press"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      contact@revsales.com
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      +1 (555) 123-4567
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} RevSales. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {["Terms", "Privacy", "Cookies"].map((item) => (
                  <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 