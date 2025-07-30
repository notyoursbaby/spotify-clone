const OpenAI = require('openai');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const emailService = require('./emailService');
const cron = require('node-cron');

class AIService {
  constructor() {
    this.openai = null;
    this.initialized = false;
  }

  initialize() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.initialized = true;
      console.log('✅ AI Service initialized with OpenAI');
      
      // Schedule monthly reports
      this.scheduleMonthlyReports();
    } else {
      console.log('⚠️ OpenAI API key not found. AI features will be limited.');
    }
  }

  async generateExpenseInsights(userId, timeframe = 'month') {
    try {
      if (!this.initialized) {
        return this.getFallbackInsights(userId, timeframe);
      }

      const expenses = await this.getUserExpenses(userId, timeframe);
      const spendingData = this.analyzeSpendingPatterns(expenses);

      const prompt = `
        Analyze the following expense data for a user and provide insights:
        
        Total Expenses: $${spendingData.total}
        Categories: ${JSON.stringify(spendingData.categories)}
        Monthly Trend: ${spendingData.trend}
        Average per transaction: $${spendingData.avgPerTransaction}
        
        Please provide:
        1. Top spending insights (2-3 key observations)
        2. Budget recommendations
        3. Spending trends analysis
        4. Money-saving suggestions
        
        Keep the response concise and actionable. Format as JSON with keys: insights, recommendations, trends, suggestions.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content);
      
      return {
        ...aiResponse,
        spendingData,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('AI Insights Error:', error);
      return this.getFallbackInsights(userId, timeframe);
    }
  }

  async generateMonthlyReport(userId) {
    try {
      const user = await User.findById(userId).populate('groups');
      if (!user || !user.emailNotifications.monthlyReport) {
        return null;
      }

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      
      const endDate = new Date();
      endDate.setDate(0);

      const expenses = await Expense.getExpensesByDateRange(startDate, endDate, {
        $or: [
          { paidBy: userId },
          { 'splits.user': userId }
        ]
      });

      const insights = await this.generateExpenseInsights(userId, 'month');
      const summary = this.generateExpenseSummary(expenses, userId);

      const reportData = {
        user: user.getPublicProfile(),
        period: {
          start: startDate,
          end: endDate,
          month: startDate.toLocaleString('default', { month: 'long', year: 'numeric' })
        },
        summary,
        insights,
        expenses: expenses.slice(0, 10) // Top 10 expenses
      };

      // Generate email content
      const emailContent = await this.generateEmailContent(reportData);
      
      // Send email
      await emailService.sendMonthlyReport(user.email, reportData, emailContent);
      
      return reportData;
    } catch (error) {
      console.error('Monthly Report Generation Error:', error);
      throw error;
    }
  }

  async categorizeExpense(title, description = '', amount = 0) {
    try {
      if (!this.initialized) {
        return this.getFallbackCategory(title, description);
      }

      const prompt = `
        Categorize this expense into one of these categories: food, transport, entertainment, utilities, shopping, travel, accommodation, other.
        
        Title: ${title}
        Description: ${description}
        Amount: $${amount}
        
        Respond with only the category name and confidence score (0-100) in JSON format: {"category": "food", "confidence": 85}
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.3,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response;
    } catch (error) {
      console.error('Expense Categorization Error:', error);
      return this.getFallbackCategory(title, description);
    }
  }

  async generateBudgetRecommendations(userId) {
    try {
      const expenses = await this.getUserExpenses(userId, 'month');
      const spendingData = this.analyzeSpendingPatterns(expenses);

      if (!this.initialized) {
        return this.getFallbackBudgetRecommendations(spendingData);
      }

      const prompt = `
        Based on this spending data, suggest a monthly budget breakdown:
        
        Current Spending: ${JSON.stringify(spendingData.categories)}
        Total Monthly: $${spendingData.total}
        
        Provide budget recommendations for each category and overall financial advice.
        Format as JSON with categories and recommended amounts.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.5,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Budget Recommendations Error:', error);
      return this.getFallbackBudgetRecommendations(spendingData);
    }
  }

  async generateEmailContent(reportData) {
    if (!this.initialized) {
      return this.getFallbackEmailContent(reportData);
    }

    try {
      const prompt = `
        Generate a friendly, personalized monthly expense report email for ${reportData.user.name}.
        
        Key data:
        - Total spent: $${reportData.summary.totalSpent}
        - Top category: ${reportData.summary.topCategory}
        - Number of expenses: ${reportData.summary.expenseCount}
        
        Include:
        1. Friendly greeting
        2. Summary of spending
        3. Key insights
        4. Actionable tips
        5. Encouraging closing
        
        Keep it conversational and helpful. Return HTML format.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Email Content Generation Error:', error);
      return this.getFallbackEmailContent(reportData);
    }
  }

  // Helper methods
  async getUserExpenses(userId, timeframe) {
    const startDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return await Expense.getExpensesByDateRange(startDate, new Date(), {
      $or: [
        { paidBy: userId },
        { 'splits.user': userId }
      ]
    });
  }

  analyzeSpendingPatterns(expenses) {
    const categories = {};
    let total = 0;

    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
      total += expense.amount;
    });

    return {
      total,
      categories,
      avgPerTransaction: expenses.length > 0 ? total / expenses.length : 0,
      expenseCount: expenses.length,
      topCategory: Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, 'other'
      )
    };
  }

  generateExpenseSummary(expenses, userId) {
    const summary = {
      totalSpent: 0,
      totalOwed: 0,
      expenseCount: expenses.length,
      categories: {},
      topCategory: 'other'
    };

    expenses.forEach(expense => {
      // Calculate user's share
      const userSplit = expense.splits.find(split => 
        split.user.toString() === userId.toString()
      );

      if (userSplit) {
        summary.totalSpent += userSplit.amount;
        if (!userSplit.settled && expense.paidBy.toString() !== userId.toString()) {
          summary.totalOwed += userSplit.amount;
        }
      }

      // Category breakdown
      if (!summary.categories[expense.category]) {
        summary.categories[expense.category] = 0;
      }
      summary.categories[expense.category] += userSplit ? userSplit.amount : 0;
    });

    // Find top category
    summary.topCategory = Object.keys(summary.categories).reduce((a, b) => 
      summary.categories[a] > summary.categories[b] ? a : b, 'other'
    );

    return summary;
  }

  scheduleMonthlyReports() {
    // Run on the 1st of every month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
      console.log('🤖 Generating monthly reports...');
      
      try {
        const users = await User.find({ 
          'emailNotifications.monthlyReport': true,
          isActive: true 
        });

        for (const user of users) {
          await this.generateMonthlyReport(user._id);
          // Add delay to avoid overwhelming the email service
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`✅ Monthly reports sent to ${users.length} users`);
      } catch (error) {
        console.error('❌ Monthly report generation failed:', error);
      }
    });
  }

  // Fallback methods for when AI is not available
  getFallbackInsights(userId, timeframe) {
    return {
      insights: [
        "Track your expenses regularly to maintain better financial awareness",
        "Consider setting category-wise budgets for better spending control"
      ],
      recommendations: [
        "Review your largest expense categories",
        "Look for opportunities to reduce recurring expenses"
      ],
      trends: "Unable to generate AI-powered trends without OpenAI integration",
      suggestions: [
        "Use the expense categorization feature",
        "Set up monthly budget alerts"
      ],
      generatedAt: new Date(),
      isAIGenerated: false
    };
  }

  getFallbackCategory(title, description) {
    const keywords = {
      food: ['restaurant', 'food', 'dinner', 'lunch', 'breakfast', 'cafe', 'pizza', 'burger'],
      transport: ['uber', 'taxi', 'gas', 'fuel', 'parking', 'bus', 'train', 'flight'],
      entertainment: ['movie', 'cinema', 'game', 'concert', 'show', 'theater'],
      utilities: ['electric', 'water', 'internet', 'phone', 'bill'],
      shopping: ['amazon', 'store', 'shop', 'clothing', 'clothes'],
      travel: ['hotel', 'airbnb', 'flight', 'vacation', 'trip']
    };

    const text = (title + ' ' + description).toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        return { category, confidence: 70 };
      }
    }
    
    return { category: 'other', confidence: 50 };
  }

  getFallbackBudgetRecommendations(spendingData) {
    const total = spendingData.total;
    return {
      food: Math.round(total * 0.3),
      transport: Math.round(total * 0.15),
      entertainment: Math.round(total * 0.10),
      utilities: Math.round(total * 0.20),
      shopping: Math.round(total * 0.15),
      other: Math.round(total * 0.10),
      advice: "These are general recommendations. Adjust based on your lifestyle and priorities."
    };
  }

  getFallbackEmailContent(reportData) {
    return `
      <h2>Your Monthly Expense Report</h2>
      <p>Hi ${reportData.user.name},</p>
      <p>Here's your expense summary for ${reportData.period.month}:</p>
      <ul>
        <li>Total Spent: $${reportData.summary.totalSpent}</li>
        <li>Number of Expenses: ${reportData.summary.expenseCount}</li>
        <li>Top Category: ${reportData.summary.topCategory}</li>
      </ul>
      <p>Keep tracking your expenses for better financial awareness!</p>
      <p>Best regards,<br>AI Splitwise Team</p>
    `;
  }
}

module.exports = new AIService();