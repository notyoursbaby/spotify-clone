const express = require('express');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

const router = express.Router();

// Get user's expenses
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, groupId, category } = req.query;
    
    const query = {
      $or: [
        { paidBy: req.userId },
        { 'splits.user': req.userId }
      ],
      isDeleted: false
    };

    if (groupId) query.group = groupId;
    if (category) query.category = category;

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;