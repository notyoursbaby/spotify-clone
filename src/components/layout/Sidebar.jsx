import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Receipt,
  Users,
  UserPlus,
  Brain,
  CreditCard,
  BarChart3,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      name: 'Expenses',
      path: '/expenses',
      icon: Receipt,
      color: 'text-green-600'
    },
    {
      name: 'Groups',
      path: '/groups',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      name: 'Friends',
      path: '/friends',
      icon: UserPlus,
      color: 'text-orange-600'
    },
    {
      name: 'AI Insights',
      path: '/ai-insights',
      icon: Brain,
      color: 'text-pink-600',
      badge: 'AI'
    },
    {
      name: 'Settlements',
      path: '/settlements',
      icon: CreditCard,
      color: 'text-indigo-600'
    }
  ];

  const quickActions = [
    {
      name: 'Add Expense',
      action: 'add-expense',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Create Group',
      action: 'create-group',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h2>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : item.color
                        }`}
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <motion.button
                    key={action.action}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors ${action.color}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{action.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* AI Features Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                AI Powered
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Get smart insights about your spending patterns and automated monthly reports.
            </p>
            <NavLink
              to="/ai-insights"
              className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View Insights
              <BarChart3 className="w-3 h-3 ml-1" />
            </NavLink>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Monthly Budget
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                75%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              $750 of $1000 used
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;