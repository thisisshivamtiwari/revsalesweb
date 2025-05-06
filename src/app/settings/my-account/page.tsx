"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Descriptions, Spin, Alert } from "antd";
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserDetails } from '@/services/api';
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { IconChevronLeft, IconUser } from "@tabler/icons-react";

export default function MyAccountPage() {
  const { isAuthenticated, isLoading: authLoading, user: authUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the category from URL on client-side
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('activeCategory');
    setCategory(categoryParam);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    setLoading(true);
    setError(null);
    getUserDetails()
      .then((data) => {
        if (data.status && data.code === 200) {
          setUser(data.data.user);
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch user details');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-row w-full bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <SidebarDemo />
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        {/* Dashboard Navbar */}
        <DashboardNavbar className="mb-4">
          <DashboardNavContent>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
                My Account
              </a>
            </div>
            <div className="flex-grow"></div>
            <NavbarUserMenu 
              username={authUser?.fullName || 'User'} 
              onLogout={logout} 
            />
          </DashboardNavContent>
        </DashboardNavbar>
        <main className="flex-grow py-6 px-4 md:px-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => {
                if (category) {
                  router.push(`/settings?activeCategory=${category}`);
                } else {
                  router.back();
                }
              }}
              className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm \
              border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
              <IconChevronLeft className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              My Account
            </h1>
          </div>
          <div className="bg-white/20 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 dark:border-neutral-700/30 p-6 md:p-8 max-w-xl mx-auto">
            <div className="flex flex-col items-center mb-6">
              <Avatar size={96} src={user.profileImg} />
              <h2 className="mt-4 text-xl font-bold text-neutral-800 dark:text-white">{user.fullName}</h2>
            </div>
            <Descriptions 
              column={1} 
              bordered 
              size="small"
              className="custom-descriptions text-neutral-800 dark:text-neutral-200"
              styles={{ label: { color: 'inherit', fontWeight: 500 }, content: { color: 'inherit' } }}
            >
              <Descriptions.Item label={<span className="text-neutral-700 dark:text-neutral-300">Email</span>}>
                <span className="text-neutral-800 dark:text-neutral-100">{user.email}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="text-neutral-700 dark:text-neutral-300">Phone</span>}>
                <span className="text-neutral-800 dark:text-neutral-100">{user.phoneNumber}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="text-neutral-700 dark:text-neutral-300">Department</span>}>
                <span className="text-neutral-800 dark:text-neutral-100">{user.departmentName}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="text-neutral-700 dark:text-neutral-300">Designation</span>}>
                <span className="text-neutral-800 dark:text-neutral-100">{user.designationName}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </main>
      </div>
    </div>
  );
} 