"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import Toast, { ToastType } from "@/components/ui/toast";
import { 
  IconChevronLeft, 
  IconBuilding, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBuildingStore,
  IconInfoCircle,
  IconUsers,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandYoutube,
  IconWorld,
  IconPalette,
  IconFileDescription,
  IconPhotoPlus,
  IconEdit
} from "@tabler/icons-react";
import { getCompanyDetails, CompanyDetails } from "@/services/company";

export default function OrganizationSettings() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  
  // Get the category from URL query parameters
  const [category, setCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the category from URL on client-side
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    setCategory(categoryParam);
  }, []);

  // State for company data
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");
  
  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
  });

  // Show toast message
  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({
      visible: true,
      type,
      message,
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Fetch company details on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCompanyDetails();
    }
  }, [isAuthenticated]);

  // Function to fetch company details
  const fetchCompanyDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCompanyDetails();
      
      if (response.status && response.code === 200 && response.data) {
        setCompanyDetails(response.data.companyDetails);
      } else {
        setError(response.message || 'Failed to fetch company details');
        showToast(response.message || 'Failed to fetch company details', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Array of sections for navigation
  const sections = [
    { id: "basic", label: "Basic Information", icon: <IconBuilding size={20} className="text-blue-500" /> },
    { id: "contact", label: "Contact & Address", icon: <IconMapPin size={20} className="text-green-500" /> },
    { id: "about", label: "About Company", icon: <IconInfoCircle size={20} className="text-purple-500" /> },
    { id: "social", label: "Social Media", icon: <IconBrandFacebook size={20} className="text-indigo-500" /> },
    { id: "branding", label: "Branding", icon: <IconPalette size={20} className="text-amber-500" /> },
  ];

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Return null as the navigation will be handled by useEffect in AuthContext
  }

  return (
    <div className="min-h-screen flex flex-row w-full bg-neutral-100 dark:bg-neutral-900">
      {/* Toast notification */}
      {toast.visible && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
      )}

      {/* Sidebar */}
      <SidebarDemo />
      
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        {/* Dashboard Navbar */}
        <DashboardNavbar className="mb-4">
          <DashboardNavContent>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
                Organization Settings
              </a>
            </div>
            <div className="flex-grow"></div>
            <NavbarUserMenu 
              username={user?.fullName || 'User'} 
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
              className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm 
              border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
              <IconChevronLeft className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Organization Settings
            </h1>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
              <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading company details...</p>
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
              rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
              <p>{error}</p>
              <button 
                onClick={fetchCompanyDetails}
                className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content when data is loaded */}
          {!isLoading && !error && companyDetails && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Navigation Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
                  border border-white/10 dark:border-neutral-700/30 p-4 mb-6">
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button 
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                          activeSection === section.id 
                            ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-medium' 
                            : 'hover:bg-white/10 dark:hover:bg-neutral-700/30 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className={`${activeSection === section.id ? 'text-blue-500 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                          {section.icon}
                        </div>
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-grow">
                <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
                  border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">

                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200/20 dark:border-neutral-700/30">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
                          <IconBuilding className="mr-2 text-blue-500" size={24} />
                          Basic Information
                        </h2>
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                          <IconEdit size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company Profile Image */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg mb-4">
                            <Image
                              src={companyDetails.profilePic}
                              alt="Company Profile"
                              fill
                              objectFit="cover"
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-center text-neutral-800 dark:text-white mb-1">
                            {companyDetails.companyName}
                          </h3>
                          <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 italic mb-4">
                            "{companyDetails.slogan}"
                          </p>
                        </div>

                        {/* Company Details */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Company Name</label>
                            <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                              {companyDetails.companyName}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Category</label>
                            <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                              {companyDetails.category}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">GST Number</label>
                            <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                              {companyDetails.gstNumber}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">Team Size</label>
                            <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                              {companyDetails.teamSize}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact & Address Section */}
                  {activeSection === "contact" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200/20 dark:border-neutral-700/30">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
                          <IconMapPin className="mr-2 text-green-500" size={24} />
                          Contact & Address
                        </h2>
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                          <IconEdit size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Contact Information</h3>
                          
                          <div className="flex items-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <IconMail className="text-blue-500 mr-3" size={20} />
                            <div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">Email</div>
                              <div>{companyDetails.email}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <IconPhone className="text-green-500 mr-3" size={20} />
                            <div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">Phone</div>
                              <div>{companyDetails.phoneNumber}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <IconBuildingStore className="text-purple-500 mr-3" size={20} />
                            <div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">Managed Hotels</div>
                              <div>{companyDetails.managedHotel}</div>
                            </div>
                          </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Address</h3>
                          
                          <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-start mb-3">
                              <IconMapPin className="text-red-500 mr-3 mt-1 flex-shrink-0" size={20} />
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Full Address</div>
                                <div>{companyDetails.address.fullAddress}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">City</div>
                                <div>{companyDetails.address.city}</div>
                              </div>
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">PIN Code</div>
                                <div>{companyDetails.address.pinCode}</div>
                              </div>
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">State</div>
                                <div>{companyDetails.address.state}</div>
                              </div>
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">Country</div>
                                <div>{companyDetails.address.country}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About Company Section */}
                  {activeSection === "about" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200/20 dark:border-neutral-700/30">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
                          <IconInfoCircle className="mr-2 text-purple-500" size={24} />
                          About Company
                        </h2>
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                          <IconEdit size={20} />
                        </button>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3 flex items-center">
                            <IconFileDescription className="mr-2 text-blue-500" size={20} />
                            About
                          </h3>
                          <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            {companyDetails.about}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3 flex items-center">
                            <IconUsers className="mr-2 text-green-500" size={20} />
                            About Team
                          </h3>
                          <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            {companyDetails.aboutTeam}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3 flex items-center">
                            <IconPhotoPlus className="mr-2 text-amber-500" size={20} />
                            Featured Images
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {companyDetails.featuredImage.map((image, index) => (
                              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                {image.includes("example.com") ? (
                                  <div className="w-full h-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-700">
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Sample Image {index + 1}</p>
                                  </div>
                                ) : (
                                  <Image
                                    src={image}
                                    alt={`Featured image ${index + 1}`}
                                    fill
                                    objectFit="cover"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Media Section */}
                  {activeSection === "social" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200/20 dark:border-neutral-700/30">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
                          <IconBrandFacebook className="mr-2 text-indigo-500" size={24} />
                          Social Media Links
                        </h2>
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                          <IconEdit size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconBrandFacebook className="text-[#1877F2] mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Facebook</div>
                            <div className="truncate">{companyDetails.socialMedia.facebook}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>

                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconBrandTwitter className="text-[#1DA1F2] mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Twitter</div>
                            <div className="truncate">{companyDetails.socialMedia.twitter}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>

                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconBrandLinkedin className="text-[#0A66C2] mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">LinkedIn</div>
                            <div className="truncate">{companyDetails.socialMedia.linkedIn}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>

                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconBrandInstagram className="text-[#E4405F] mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Instagram</div>
                            <div className="truncate">{companyDetails.socialMedia.instagram}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>

                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconBrandYoutube className="text-[#FF0000] mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">YouTube</div>
                            <div className="truncate">{companyDetails.socialMedia.youtube}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.youtube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>

                        <div className="flex items-center p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <IconWorld className="text-neutral-700 dark:text-neutral-300 mr-3" size={24} />
                          <div className="flex-grow">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Website</div>
                            <div className="truncate">{companyDetails.socialMedia.website}</div>
                          </div>
                          <a 
                            href={companyDetails.socialMedia.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            <IconWorld size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Branding Section */}
                  {activeSection === "branding" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200/20 dark:border-neutral-700/30">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
                          <IconPalette className="mr-2 text-amber-500" size={24} />
                          Branding
                        </h2>
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                          <IconEdit size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Company Logo</h3>
                          <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg mb-4">
                              <Image
                                src={companyDetails.profilePic}
                                alt="Company Logo"
                                fill
                                objectFit="cover"
                              />
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50 transition-colors">
                              Change Logo
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Brand Color</h3>
                            <div className="flex items-center">
                              <div 
                                className="w-12 h-12 rounded-lg mr-4 border border-neutral-200 dark:border-neutral-700 shadow-sm" 
                                style={{ backgroundColor: companyDetails.brandColor }}
                              ></div>
                              <div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">Hex Code</div>
                                <div className="font-mono">{companyDetails.brandColor}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Company Slogan</h3>
                            <div className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                              {companyDetails.slogan}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 