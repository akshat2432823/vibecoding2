import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Building2, 
  Network, 
  MessageSquare, 
  Settings,
  Home,
  Menu,
  X,
  Award,
  Target,
  Grid3X3
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'GenCs', href: '/gencs', icon: Users },
  { name: 'Mentors', href: '/mentors', icon: UserCheck },
  { name: 'Accounts', href: '/accounts', icon: Building2 },
  { name: 'Service Lines', href: '/account-service-lines', icon: Network },
  { name: 'Feedbacks', href: '/feedbacks', icon: MessageSquare },
  { name: 'Skills', href: '/skills', icon: Award },
  { name: 'Skill Matrix', href: '/skill-matrix', icon: Grid3X3 },
  { name: 'Role Requirements', href: '/role-requirements', icon: Target },
  { name: 'Users', href: '/users', icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:flex ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="cognizant-sidebar flex flex-col h-full w-full">
          {/* Logo/Header Section */}
          <div className="px-6 py-6 border-b border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">GenC Tracking</h1>
                <p className="text-blue-100 text-sm">Cognizant System</p>
              </div>
              <button
                className="lg:hidden text-white hover:text-blue-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item group ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white border-opacity-20">
            <div className="text-xs text-blue-100">
              <p>© 2024 Cognizant Technology Solutions</p>
              <p className="mt-1">GenC Management Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top header */}
        <header className="cognizant-header flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="lg:hidden ml-4">
                  <h1 className="text-lg font-semibold text-gray-900">GenC Tracking</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Welcome to</span>
                    <span className="ml-1 text-blue-600 font-semibold">Cognizant GenC Portal</span>
                  </div>
                </div>
                
                {/* User profile placeholder */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="content-container py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 