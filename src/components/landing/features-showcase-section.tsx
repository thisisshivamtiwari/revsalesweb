"use client";
import React from "react";
import { motion } from "motion/react";
import { Highlight } from "@/components/ui/hero-highlight";
import CompareDemo from "@/components/compare-demo";
import Image from "next/image";

export function FeaturesShowcaseSection() {
  const features = [
    {
      title: "Smart Lead Prioritization",
      description: "AI-powered scoring helps your team focus on leads most likely to convert.",
      icon: "🎯",
      color: "from-blue-500/20 to-blue-400/5",
    },
    {
      title: "Automated Follow-ups",
      description: "Set intelligent follow-up sequences that nurture leads without manual work.",
      icon: "⚡",
      color: "from-amber-500/20 to-amber-400/5",
    },
    {
      title: "Pipeline Visualization",
      description: "Get a clear overview of your entire sales pipeline with interactive dashboards.",
      icon: "📊",
      color: "from-green-500/20 to-green-400/5",
    },
  ];

  return (
    <section className="py-24 px-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
            Transform your sales with <Highlight>powerful tools</Highlight>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            RevSales provides cutting-edge features that help your team work smarter, 
            close more deals, and deliver exceptional customer experiences.
          </p>
        </motion.div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center lg:items-start"
            >
              <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${feature.color} border border-neutral-200 dark:border-neutral-700`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center lg:text-left">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Showcase */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-neutral-200/50 dark:bg-neutral-800 rounded-3xl p-10 mb-20 border border-neutral-300 dark:border-neutral-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center">
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium">
                Interactive Demo
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
                Modern vs Traditional CRMs
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Slide to compare the difference between traditional CRM dashboards and 
                RevSales' modern, collaborative interface designed for today's sales teams.
              </p>
              <ul className="space-y-3">
                {[
                  "Intuitive data visualization",
                  "Collaborative team environment",
                  "Mobile-friendly interface",
                  "Focus on key performance metrics"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <CompareDemo />
            </div>
          </div>
        </motion.div>
        
        {/* Data Insights Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-700"
          >
            <Image 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000" 
              alt="Data Analytics Dashboard" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent flex items-end p-8">
              <div className="bg-neutral-100/90 dark:bg-neutral-800/90 p-4 rounded-xl w-full max-w-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Revenue Growth</div>
                </div>
                <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">+32% this quarter</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium">
              Data-Driven Sales
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
              Make informed decisions with actionable analytics
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              RevSales provides comprehensive analytics that help you understand your sales performance, 
              identify trends, and make data-driven decisions to grow your business.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { label: "Forecasting Accuracy", value: "95%" },
                { label: "Pipeline Visibility", value: "100%" },
                { label: "Lead Conversion Rate", value: "+28%" },
                { label: "Time Saved Weekly", value: "12+ hours" }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-neutral-200/70 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                  <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{stat.value}</div>
                </div>
              ))}
            </div>
            <motion.button 
              className="self-start px-8 py-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Analytics Features
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 