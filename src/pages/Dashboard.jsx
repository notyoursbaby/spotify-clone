import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  Brain,
  PieChart,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Balance',
      value: '$2,450.00',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Expenses',
      value: '$1,234.56',
      change: '-8.2%',
      changeType: 'negative',
      icon: Receipt,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Groups',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'AI Insights',
      value: '12',
      change: 'New',
      changeType: 'neutral',
      icon: Brain,
      color: 'bg-pink-500'
    }
  ];

  const recentExpenses = [
    {
      id: 1,
      title: 'Dinner at Italian Restaurant',
      amount: 85.50,
      category: 'food',
      group: 'Friends Trip',
      date: '2024-01-15',
      paidBy: 'You',
      status: 'settled'
    },
    {
      id: 2,
      title: 'Uber to Airport',
      amount: 45.00,
      category: 'transport',
      group: 'Weekend Getaway',
      date: '2024-01-14',
      paidBy: 'John',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Grocery Shopping',
      amount: 120.75,
      category: 'food',
      group: 'Apartment',
      date: '2024-01-13',
      paidBy: 'Sarah',
      status: 'pending'
    }
  ];

  const aiInsights = [
    {
      type: 'spending',
      message: 'You spent 15% less on food this month compared to last month. Great job!',
      icon: TrendingDown,
      color: 'text-green-600'
    },
    {
      type: 'budget',
      message: 'You\'re on track to stay within your monthly budget of $1,500.',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      type: 'category',
      message: 'Most of your expenses this month were in the "Food" category (45%).',
      icon: PieChart,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  from last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Expenses
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Your latest spending activity
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {expense.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.group} • Paid by {expense.paidBy}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        expense.status === 'settled'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
                      }`}
                    >
                      {expense.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All Expenses
            </button>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Smart recommendations for you
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {aiInsights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors">
              View All Insights
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;