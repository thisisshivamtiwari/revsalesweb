"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NavbarDemo from "@/components/ui/resizable-navbar-demo";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: any = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);

    // If no errors, proceed with registration
    if (Object.keys(newErrors).length === 0) {
      // Here you would handle the actual registration logic
      console.log("Registration submitted", formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* NavBar Integration */}
      <NavbarDemo />
      
      {/* Main content with proper spacing for fixed navbar */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-16 pt-24 md:pt-28 bg-neutral-100 dark:bg-neutral-900">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side - Registration Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-2xl shadow-xl"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Create your account</h1>
              <p className="text-neutral-600 dark:text-neutral-400">Join thousands of sales professionals using RevSales</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Create a strong password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-600 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-neutral-600 dark:text-neutral-400">
                    I agree to the <Link href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                  </label>
                </div>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Create account
              </motion.button>
            </form>
            
            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </motion.div>
          
          {/* Right side - Image and Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative h-[750px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000"
                alt="Team collaboration"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/80 to-indigo-600/60 mix-blend-multiply"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Start improving your sales today</h2>
                <p className="text-lg mb-6">
                  Join thousands of businesses that use RevSales to streamline their sales processes, 
                  track customer interactions, and close more deals.
                </p>
                
                <div className="space-y-4 mb-6">
                  {[
                    "Free 14-day trial, no credit card required",
                    "Intuitive interface, minimal learning curve",
                    "Seamless integrations with your existing tools",
                    "World-class support team at your service"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                  <blockquote className="italic">
                    "RevSales has transformed how we manage our sales pipeline. Our team is more productive and our revenue has increased by 42% in just 6 months."
                  </blockquote>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src="https://randomuser.me/api/portraits/women/22.jpg" 
                        alt="Testimonial author" 
                        width={40} 
                        height={40}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm opacity-80">Sales Director, TechCorp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 