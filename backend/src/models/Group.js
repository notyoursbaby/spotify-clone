const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['apartment', 'house', 'trip', 'couple', 'other'],
    default: 'other'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }],
  totalExpenses: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowMembersToAddExpenses: {
      type: Boolean,
      default: true
    },
    allowMembersToEditExpenses: {
      type: Boolean,
      default: false
    },
    simplifyDebts: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  balances: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    balance: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
groupSchema.index({ createdBy: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ name: 1 });

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.filter(member => member.isActive).length;
});

// Virtual for expense count
groupSchema.virtual('expenseCount').get(function() {
  return this.expenses.length;
});

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && member.isActive
  );
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && 
    member.role === 'admin' && 
    member.isActive
  );
};

// Method to get member role
groupSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString() && member.isActive
  );
  return member ? member.role : null;
};

// Method to add member
groupSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      isActive: true
    });
  }
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(member => 
    member.user.toString() === userId.toString()
  );
  if (memberIndex > -1) {
    this.members[memberIndex].isActive = false;
  }
};

// Method to update total expenses
groupSchema.methods.updateTotalExpenses = async function() {
  const Expense = mongoose.model('Expense');
  const result = await Expense.aggregate([
    { $match: { group: this._id, isDeleted: false } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  this.totalExpenses = result.length > 0 ? result[0].total : 0;
  await this.save();
};

module.exports = mongoose.model('Group', groupSchema);