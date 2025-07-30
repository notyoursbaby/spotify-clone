import React from 'react';
import { Brain } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-8 h-8 text-pink-600 dark:text-pink-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Insights
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        AI-powered financial insights and recommendations coming soon...
      </p>
    </div>
  );
};

export default AIInsights;