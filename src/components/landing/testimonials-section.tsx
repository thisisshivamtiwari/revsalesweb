"use client";
import { motion } from "motion/react";
import { Highlight } from "@/components/ui/hero-highlight";
import Image from "next/image";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "RevSales CRM has completely transformed how our sales team operates. The insights and automation have helped us close 30% more deals in just three months.",
      author: "Sarah Johnson",
      position: "Sales Director, TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "The interface is so intuitive that our entire team was up and running in days, not weeks. Our sales process is now more efficient than ever.",
      author: "Michael Chen",
      position: "VP of Sales, GrowthWave",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      quote: "Customer support is exceptional. Any time we've had questions, the team has been incredibly responsive and helpful.",
      author: "Jessica Williams",
      position: "Operations Manager, Elevate Inc",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    },
  ];

  return (
    <section className="py-24 px-4 bg-neutral-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-neutral-950 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Trusted by <Highlight>sales teams</Highlight> everywhere
          </h2>
          <p className="text-neutral-300 max-w-2xl mx-auto text-lg">
            See what our customers are saying about how RevSales CRM has transformed their sales process.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-neutral-800 rounded-xl shadow-md border border-blue-500/10 flex flex-col h-full"
            >
              <div className="flex-1">
                <svg className="w-10 h-10 text-blue-500/70 mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8c-2.8 0-5 2.2-5 5v1h1c2.2 0 4 1.8 4 4v2c0 1.7-1.3 3-3 3H5c-1.7 0-3-1.3-3-3v-2c0-1.3 0.3-2.6 0.8-3.8C3.5 12.5 5.5 10.7 8 10V8zM24 8c-2.8 0-5 2.2-5 5v1h1c2.2 0 4 1.8 4 4v2c0 1.7-1.3 3-3 3h-2c-1.7 0-3-1.3-3-3v-2c0-1.3 0.3-2.6 0.8-3.8 0.7-1.7 2.7-3.5 5.2-4.2V8z" />
                </svg>
                <p className="text-lg italic mb-6 text-neutral-200">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  <p className="text-sm text-neutral-400">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-8 py-6 flex items-center gap-4 max-w-2xl">
            <div className="h-16 w-16 min-w-16 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-white">Want to learn more about how RevSales can help your team?</p>
              <motion.button 
                className="mt-2 text-blue-400 font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
                whileHover={{ x: 5 }}
              >
                Read our case studies
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 