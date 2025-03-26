import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { cn } from "@/lib/utils"

const socialIcons = [
  { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
  { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
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

export function Footer() {
  return (
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
  )
} 