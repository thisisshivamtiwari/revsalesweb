"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NavbarDemo from "@/components/ui/resizable-navbar-demo";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Toast, { ToastType } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
  });

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const { role } = JSON.parse(userData);
        if (role === 'ADMIN') {
          // router.push('/adminDashboard');
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, router]);

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return input.trim();
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Email validation
    const sanitizedEmail = sanitizeInput(email);
    if (!sanitizedEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Sanitize inputs before sending to API
      const sanitizedEmail = sanitizeInput(email);
      
      const result = await login({
        email: sanitizedEmail,
        password,
      });
      
      if (result.success) {
        setToast({
          visible: true,
          type: 'success',
          message: 'Login successful! Redirecting to your dashboard...',
        });
        
        // Note: No need to manually redirect as the auth context will handle it
      } else {
        setToast({
          visible: true,
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setToast({
        visible: true,
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Close toast handler
  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* NavBar Integration */}
      <NavbarDemo />
      
      {/* Toast notification */}
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}
      
      {/* Main content with proper spacing for fixed navbar */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-16 pt-24 md:pt-28 bg-neutral-100 dark:bg-neutral-900">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side - Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-2xl shadow-xl"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Welcome back</h1>
              <p className="text-neutral-600 dark:text-neutral-400">Sign in to your RevSales account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-600 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                  Remember me
                </label>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>
            
         
            
            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up for free
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
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1000"
                alt="Dashboard preview"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/80 to-indigo-600/60 mix-blend-multiply"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Take your sales to the next level</h2>
                <p className="text-lg mb-6">
                  RevSales helps you manage leads, track opportunities, and close more deals 
                  with our powerful yet intuitive CRM platform.
                </p>
                <div className="flex space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                          alt="User avatar" 
                          width={40} 
                          height={40}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="ml-2">
                    <p className="font-medium">Join 2,000+ sales professionals</p>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm">4.9/5</span>
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