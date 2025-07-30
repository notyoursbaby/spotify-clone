const express = require('express');
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get expense insights
router.get('/insights', auth, async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    
    if (!['week', 'month', 'year'].includes(timeframe)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid timeframe. Use week, month, or year.'
      });
    }

    const insights = await aiService.generateExpenseInsights(req.userId, timeframe);
    
    res.json({
      success: true,
      insights,
      timeframe
    });
  } catch (error) {
    console.error('AI Insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights'
    });
  }
});

// Categorize expense
router.post('/categorize', auth, [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .optional()
    .isString(),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description = '', amount = 0 } = req.body;
    
    const categorization = await aiService.categorizeExpense(title, description, amount);
    
    res.json({
      success: true,
      categorization
    });
  } catch (error) {
    console.error('AI Categorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to categorize expense'
    });
  }
});

// Get budget recommendations
router.get('/budget-recommendations', auth, async (req, res) => {
  try {
    const recommendations = await aiService.generateBudgetRecommendations(req.userId);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Budget recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate budget recommendations'
    });
  }
});

// Generate monthly report manually
router.post('/monthly-report', auth, async (req, res) => {
  try {
    const report = await aiService.generateMonthlyReport(req.userId);
    
    if (!report) {
      return res.status(400).json({
        success: false,
        message: 'Monthly reports are disabled for your account or no data available'
      });
    }
    
    res.json({
      success: true,
      message: 'Monthly report generated and sent',
      report
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly report'
    });
  }
});

// Get spending analysis
router.get('/spending-analysis', auth, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let start = new Date();
    let end = new Date();
    
    if (startDate) {
      start = new Date(startDate);
    } else {
      start.setMonth(start.getMonth() - 1);
    }
    
    if (endDate) {
      end = new Date(endDate);
    }
    
    // Get user's expenses for the period
    const expenses = await aiService.getUserExpenses(req.userId, 'custom', start, end);
    const analysis = aiService.analyzeSpendingPatterns(expenses);
    
    // Filter by category if specified
    if (category && analysis.categories[category]) {
      analysis.categoryFocus = {
        category,
        amount: analysis.categories[category],
        percentage: (analysis.categories[category] / analysis.total) * 100
      };
    }
    
    res.json({
      success: true,
      analysis,
      period: {
        start,
        end
      }
    });
  } catch (error) {
    console.error('Spending analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze spending'
    });
  }
});

// Get AI-powered expense suggestions
router.get('/expense-suggestions', auth, async (req, res) => {
  try {
    const { category, amount } = req.query;
    
    // This would use AI to suggest similar expenses or common expenses for the category
    const suggestions = await aiService.getExpenseSuggestions(req.userId, category, amount);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Expense suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expense suggestions'
    });
  }
});

// Smart split suggestions
router.post('/smart-split', auth, [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('members')
    .isArray()
    .withMessage('Members must be an array'),
  body('category')
    .optional()
    .isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, members, category = 'other' } = req.body;
    
    // AI-powered smart splitting based on historical data and patterns
    const smartSplit = await aiService.generateSmartSplit(req.userId, amount, members, category);
    
    res.json({
      success: true,
      smartSplit
    });
  } catch (error) {
    console.error('Smart split error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate smart split'
    });
  }
});

// Get financial health score
router.get('/financial-health', auth, async (req, res) => {
  try {
    const healthScore = await aiService.calculateFinancialHealth(req.userId);
    
    res.json({
      success: true,
      healthScore
    });
  } catch (error) {
    console.error('Financial health error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate financial health'
    });
  }
});

module.exports = router;