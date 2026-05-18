import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  LogOut,
  Scissors,
  Package,
  FileText,
  Receipt,
  AlertCircle,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: UserCircle },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Contracts', path: '/contracts', icon: FileText },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'InvoiceGenerate', path: '/ProformaInvoiceGenerate', icon: Settings },
  { name: 'Proforma Invoice', path: '/proformainvoice', icon: Receipt },
  { name: 'Payment Terms', path: '/payment-terms', icon: AlertCircle },

];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'Admin';





  return (
    <aside className="w-64 bg-[#003366] text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-white/10">
        <div
          style={{
            width: 70,
            height: 44,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
           
          }}
        >
          <img
            src="/logo1.png"
            alt="DCS Hair Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '100%',

            }}
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight">DCS Hair</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-white/10 space-y-1">

        {/* USER INFO */}
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">

          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              {user?.userName}
            </p>
            <p className="text-xs text-white/60">
              {isAdmin ? 'Admin' : 'User'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold shadow-md">
            {user?.userName?.charAt(0).toUpperCase() || 'A'}
          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl 
               bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200
               transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>

      </div>
    </aside>
  );
}

