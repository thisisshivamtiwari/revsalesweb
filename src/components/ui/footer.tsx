import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 px-4 md:px-6 bg-neutral-900 mt-auto">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">RevSales</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Features</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Case Studies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Guides</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Webinars</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Terms</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Security</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-blue-300 transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500">
          <p>© {new Date().getFullYear()} RevSales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 