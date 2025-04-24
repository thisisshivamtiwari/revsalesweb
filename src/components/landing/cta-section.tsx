"use client";
import { motion } from "motion/react";
import { Highlight } from "@/components/ui/hero-highlight";

export function CtaSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black to-neutral-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
      
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Cpath d='M50 50a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-20a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-20 0a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 20a5 5 0 1 1 0-10 5 5 0 0 1 0 10z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "80px 80px"
        }}
        animate={{
          backgroundPosition: ["0px 0px", "80px 80px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto bg-neutral-900/50 backdrop-blur-lg rounded-2xl border border-blue-500/10 p-10 md:p-16 shadow-2xl shadow-blue-500/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to <Highlight>revolutionize</Highlight> your sales process?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of sales professionals who have already transformed their business with RevSales CRM.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="px-8 py-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Free Trial
              </motion.button>
              <motion.button 
                className="px-8 py-4 rounded-md border border-blue-400/30 text-white font-medium hover:bg-blue-800/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
            
            <div className="mt-10 flex justify-center flex-wrap gap-4">
              <div className="bg-neutral-800/50 px-4 py-2 rounded-full flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-sm">No credit card required</span>
              </div>
              <div className="bg-neutral-800/50 px-4 py-2 rounded-full flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-sm">14-day free trial</span>
              </div>
              <div className="bg-neutral-800/50 px-4 py-2 rounded-full flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L9 16L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-sm">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 