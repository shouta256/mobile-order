'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, X, Award, Home, Menu, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  
  // Close menu when user navigates to a new page
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);
  
  return (
    <div 
      className={`fixed inset-0 z-50 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute right-0 h-full w-3/4 max-w-sm bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-orange-500">FoodDelivery</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                href="/"
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg ${
                  pathname === '/' 
                    ? 'bg-orange-100 text-orange-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg ${
                  pathname.startsWith('/menu') 
                    ? 'bg-orange-100 text-orange-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Menu size={20} />
                <span>Menu</span>
              </Link>
            </li>
            <li>
              <Link
                href="/challenges"
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg ${
                  pathname.startsWith('/challenges') 
                    ? 'bg-orange-100 text-orange-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Award size={20} />
                <span>Challenges</span>
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg ${
                  pathname.startsWith('/orders') 
                    ? 'bg-orange-100 text-orange-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBag size={20} />
                <span>My Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg ${
                  pathname.startsWith('/profile') 
                    ? 'bg-orange-100 text-orange-500' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit" 
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}