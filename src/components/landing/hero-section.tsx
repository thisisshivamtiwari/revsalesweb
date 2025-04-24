"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "motion/react";
import Image from "next/image";

export function HeroSection() {
  return (
    <HeroHighlight 
      containerClassName="h-auto min-h-[600px] py-20 md:py-24 bg-transparent dark:bg-transparent" 
      className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16"
    >
      <div className="flex-1 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
            Supercharge Your Sales with <Highlight>RevSales</Highlight> CRM
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300">
            A powerful, intuitive CRM platform designed specifically for modern sales teams.
            Boost productivity, close more deals, and grow your business.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button 
              className="px-8 py-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            
            <motion.button 
              className="px-8 py-3 rounded-md border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Demo
            </motion.button>
          </div>
          
          <div className="mt-10 flex items-center gap-4 justify-center md:justify-start">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-black overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium">
                  <Image 
                    src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                    alt="User" 
                    width={40} 
                    height={40}
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                +2K
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Join over <span className="font-medium text-black dark:text-white">2,000+</span> sales professionals 
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="flex-1 relative w-full md:w-auto aspect-square md:aspect-auto md:h-[500px] max-w-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500/20 to-transparent p-1 h-full"
        >
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1000"
              alt="CRM Dashboard Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              style={{ objectFit: "cover" }}
              quality={100}
              className="rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    </HeroHighlight>
  );
} 