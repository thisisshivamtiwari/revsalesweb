"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Spin, Alert, message, Collapse } from "antd";
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLeadFormFields, addNewLead } from '@/services/api';
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";

const { Option } = Select;

export default function AddLeadsPage() {
  const { isAuthenticated, isLoading: authLoading, user: authUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

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
    getLeadFormFields()
      .then((data) => {
        if (data.status && data.code === 200) {
          setFields(data.data);
        } else {
          setError(data.message || 'Failed to fetch form fields');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch form fields');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  const handleFieldSelect = (value: string[]) => {
    const currentValues = form.getFieldsValue();
    const toClear = Object.keys(currentValues).filter(
      (key) => !value.includes(key) && key !== 'fields'
    );
    // Build an object with only the removed fields set to undefined
    const clearObj = toClear.reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
    form.setFieldsValue(clearObj);
    setSelectedFields(value);
  };

  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    setError(null);
    const payload: Record<string, any> = {};
    selectedFields.forEach((key) => {
      payload[key] = values[key];
    });
    const res = await addNewLead(payload);
    setFormLoading(false);
    if (res.status && (res.code === 200 || res.code === 201)) {
      message.success('Lead added successfully!');
      form.resetFields();
      setSelectedFields([]);
    } else {
      setError(res.message || 'Failed to add lead');
    }
  };

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
                Add Reference Leads
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
              Add Reference Leads
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-neutral-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-neutral-700/50 p-8 max-w-2xl mx-auto"
          >
            <div className="mb-6 text-neutral-700 dark:text-neutral-300 text-center">
              <p className="text-base">Select the fields you want to include in your lead form. You can add multiple fields at once.</p>
              {selectedFields.length > 0 && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                  {selectedFields.length} field{selectedFields.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <Form.Item
                label={<span className="font-medium text-neutral-800 dark:text-neutral-100">Select Fields to Add</span>}
                name="fields"
                rules={[{ required: true, message: 'Please select at least one field!' }]}
                extra={<span className="text-xs text-neutral-500 dark:text-neutral-400">Choose one or more fields. The form will update below.</span>}
              >
                <Select
                  mode="multiple"
                  placeholder="Select fields for the lead form"
                  onChange={handleFieldSelect}
                  value={selectedFields}
                  allowClear
                  className="rounded-lg shadow-sm"
                  showSearch
                  optionFilterProp="children"
                  size="large"
                >
                  {fields.map((field: any) => (
                    <Option key={field.key} value={field.key}>{field.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              {selectedFields.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Lead Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedFields.map((key) => {
                      const field = fields.find((f) => f.key === key);
                      if (!field) return null;
                      return (
                        <Form.Item
                          key={key}
                          label={<span className="font-medium text-neutral-800 dark:text-neutral-100">{field.name}</span>}
                          name={key}
                          rules={[{ required: true, message: `Please enter ${field.name}` }]}
                        >
                          <Input 
                            placeholder={`Enter ${field.name}`}
                            className="rounded-lg shadow-sm"
                            size="large"
                          />
                        </Form.Item>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedFields.length > 0 && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={formLoading}
                    icon={<IconPlus size={18} />}
                    className="w-full h-11 text-base font-semibold rounded-lg shadow-md"
                  >
                    Add Lead
                  </Button>
                </Form.Item>
              )}
            </Form>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 