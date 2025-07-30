const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'travel', 'accommodation', 'other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Paid by user is required']
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group is required']
  },
  splitType: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    default: 'equal'
  },
  splits: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    settled: {
      type: Boolean,
      default: false
    },
    settledAt: {
      type: Date
    }
  }],
  receipt: {
    url: String,
    fileName: String,
    uploadedAt: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  aiInsights: {
    suggestedCategory: String,
    confidence: Number,
    unusualSpending: Boolean,
    budgetImpact: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
expenseSchema.index({ group: 1 });
expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ 'splits.user': 1 });

// Virtual for total split amount
expenseSchema.virtual('totalSplitAmount').get(function() {
  return this.splits.reduce((total, split) => total + split.amount, 0);
});

// Virtual for unsettled amount
expenseSchema.virtual('unsettledAmount').get(function() {
  return this.splits
    .filter(split => !split.settled)
    .reduce((total, split) => total + split.amount, 0);
});

// Virtual for settlement status
expenseSchema.virtual('isFullySettled').get(function() {
  return this.splits.every(split => split.settled);
});

// Pre-save middleware to validate splits
expenseSchema.pre('save', function(next) {
  if (this.splitType === 'equal') {
    // For equal splits, calculate equal amounts
    const splitAmount = this.amount / this.splits.length;
    this.splits.forEach(split => {
      split.amount = Math.round(splitAmount * 100) / 100; // Round to 2 decimal places
    });
  } else if (this.splitType === 'percentage') {
    // For percentage splits, calculate amounts based on percentages
    this.splits.forEach(split => {
      split.amount = Math.round((this.amount * split.percentage / 100) * 100) / 100;
    });
  }
  
  // Validate that splits add up to total amount (with small tolerance for rounding)
  const totalSplits = this.splits.reduce((sum, split) => sum + split.amount, 0);
  const tolerance = 0.02; // 2 cents tolerance
  
  if (Math.abs(totalSplits - this.amount) > tolerance) {
    return next(new Error('Split amounts do not add up to total expense amount'));
  }
  
  next();
});

// Method to add split
expenseSchema.methods.addSplit = function(userId, amount, percentage = null) {
  const existingSplit = this.splits.find(split => 
    split.user.toString() === userId.toString()
  );
  
  if (existingSplit) {
    existingSplit.amount = amount;
    if (percentage !== null) {
      existingSplit.percentage = percentage;
    }
  } else {
    this.splits.push({
      user: userId,
      amount: amount,
      percentage: percentage
    });
  }
};

// Method to settle split
expenseSchema.methods.settleSplit = function(userId) {
  const split = this.splits.find(split => 
    split.user.toString() === userId.toString()
  );
  
  if (split && !split.settled) {
    split.settled = true;
    split.settledAt = new Date();
    return true;
  }
  return false;
};

// Method to get user's split amount
expenseSchema.methods.getUserSplitAmount = function(userId) {
  const split = this.splits.find(split => 
    split.user.toString() === userId.toString()
  );
  return split ? split.amount : 0;
};

// Method to check if user owes money for this expense
expenseSchema.methods.userOwesAmount = function(userId) {
  if (this.paidBy.toString() === userId.toString()) {
    return 0; // User paid, so they don't owe anything
  }
  
  const split = this.splits.find(split => 
    split.user.toString() === userId.toString()
  );
  
  return split && !split.settled ? split.amount : 0;
};

// Static method to get expenses by date range
expenseSchema.statics.getExpensesByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    isDeleted: false,
    ...filters
  };
  
  return this.find(query)
    .populate('paidBy', 'name email avatar')
    .populate('splits.user', 'name email avatar')
    .populate('group', 'name')
    .sort({ date: -1 });
};

// Static method to get user's expense summary
expenseSchema.statics.getUserExpenseSummary = async function(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        $or: [
          { paidBy: mongoose.Types.ObjectId(userId) },
          { 'splits.user': mongoose.Types.ObjectId(userId) }
        ],
        date: { $gte: startDate, $lte: endDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Expense', expenseSchema);