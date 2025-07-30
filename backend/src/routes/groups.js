const express = require('express');
const auth = require('../middleware/auth');
const Group = require('../models/Group');

const router = express.Router();

// Get user's groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.userId,
      'members.isActive': true,
      isActive: true
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create group
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category = 'other', members = [] } = req.body;

    const group = new Group({
      name,
      description,
      category,
      createdBy: req.userId,
      members: [
        { user: req.userId, role: 'admin' },
        ...members.map(memberId => ({ user: memberId, role: 'member' }))
      ]
    });

    await group.save();
    await group.populate('members.user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;