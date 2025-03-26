import { useState } from "react"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Card } from "./card"

const socialIcons = [
  { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
  { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
]

const features = [
  {
    title: "Customer Management",
    description: "Track and manage all your customer interactions in one place",
    icon: "📊",
  },
  {
    title: "Sales Pipeline",
    description: "Visualize and optimize your sales process from lead to close",
    icon: "💰",
  },
  {
    title: "Task Automation",
    description: "Automate repetitive tasks and focus on what matters most",
    icon: "⚙️",
  },
  {
    title: "Analytics Dashboard",
    description: "Get real-time insights into your business performance",
    icon: "📈",
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

export function CRMLandingPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#0A0F20] via-[#242744] to-[#2F304D]">
  
      {/* Hero Section */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your CRM,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5A81] to-[#FF5A81]/70">
                  Anywhere You Go
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Manage your sales pipeline, track customer interactions, and close deals faster with our powerful mobile CRM solution.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#242744]/50 border-[#2F304D]/50 text-white placeholder-gray-400 focus-visible:ring-[#FF5A81]/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 whitespace-nowrap"
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </div>
            <motion.div
              className="md:w-1/2 mt-10 md:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop"
                alt="CRM Mobile App"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5A81] to-[#FF5A81]/70">
              Modern Sales Teams
            </span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-[#242744]/50 border-[#2F304D]/50 backdrop-blur-sm hover:bg-[#242744]/70 transition-colors"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <GlassContainer className="p-10 md:p-16 text-center rounded-xl">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ready to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5A81] to-[#FF5A81]/70">
                Transform
              </span>{" "}
              Your Sales Process?
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of sales professionals who have increased their
              productivity by 35% with our mobile CRM solution.
            </motion.p>
            <Button
              size="lg"
              className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90"
            >
              Get Started Now
            </Button>
          </GlassContainer>
        </div>
      </section>

      {/* Glassmorphism Footer */}
      <GlassContainer className="mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">RevSales</h3>
              <p className="text-gray-300">
                The most powerful mobile CRM solution for sales teams on the go.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Integrations", "FAQ"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                {["Terms", "Privacy", "Cookies", "Licenses"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#2F304D]/20">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} RevSales. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-[#242744]/50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#242744]/70 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </GlassContainer>
    </div>
  )
} 