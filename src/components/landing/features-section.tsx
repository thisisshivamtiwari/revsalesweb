"use client";
import { motion } from "motion/react";
import { Highlight } from "@/components/ui/hero-highlight";

export function FeaturesSection() {
  const features = [
    {
      title: "Contact Management",
      description: "Keep track of all your customer interactions and data in one centralized hub.",
      icon: "📋",
    },
    {
      title: "Pipeline Visibility",
      description: "Get a clear view of your sales pipeline and track deals through every stage.",
      icon: "📊",
    },
    {
      title: "Sales Automation",
      description: "Automate repetitive tasks and keep your team focused on what matters most.",
      icon: "⚙️",
    },
    {
      title: "Performance Analytics",
      description: "Gain insights into your team's performance with powerful reporting tools.",
      icon: "📈",
    },
    {
      title: "Mobile Access",
      description: "Stay connected and productive from anywhere with our mobile app.",
      icon: "📱",
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools and apps for a unified workflow.",
      icon: "🔄",
    },
  ];

  return (
    <section className="py-24 px-4 bg-neutral-950">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            All the tools you need to <Highlight>succeed</Highlight>
          </h2>
          <p className="text-neutral-300 max-w-2xl mx-auto text-lg">
            RevSales CRM brings everything you need to manage your sales pipeline, customer relationships, and team performance in one place.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.3)" 
              }}
              className="p-6 border border-neutral-800 rounded-xl hover:border-blue-500/30 transition-colors bg-neutral-900"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button 
            className="px-8 py-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 