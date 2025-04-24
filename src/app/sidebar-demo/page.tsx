import SidebarDemo from "@/components/ui/sidebar-demo";

export default function SidebarDemoPage() {
  return (
    <div className="min-h-screen flex flex-row">
      <SidebarDemo />
      <div className="flex-1 p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sidebar Demo</h1>
          <p className="text-gray-700 mb-4">
            This page demonstrates the functionality of our new responsive sidebar component.
          </p>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-3">Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Responsive design that works on all screen sizes</li>
              <li>Expandable on hover for better navigation</li>
              <li>Supports multiple sections for organized navigation</li>
              <li>Customizable with different icon sets</li>
              <li>Smooth transitions and animations</li>
              <li>Active state indicators for current page</li>
            </ul>
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-3">Usage Instructions</h2>
            <p className="text-gray-700 mb-4">
              Hover over the sidebar to see it expand. Click on any navigation item to see how the active state works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 