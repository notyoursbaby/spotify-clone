const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      this.initialized = true;
      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
    }
  }

  async sendMonthlyReport(userEmail, reportData, htmlContent) {
    if (!this.initialized) {
      console.log('⚠️ Email service not initialized. Skipping email send.');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: userEmail,
        subject: `Your Monthly Expense Report - ${reportData.period.month}`,
        html: this.generateMonthlyReportHTML(reportData, htmlContent),
        attachments: []
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Monthly report sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send monthly report to ${userEmail}:`, error);
      throw error;
    }
  }

  async sendExpenseNotification(userEmail, expense, type = 'new') {
    if (!this.initialized) {
      console.log('⚠️ Email service not initialized. Skipping email send.');
      return;
    }

    try {
      const subject = this.getNotificationSubject(type, expense);
      const htmlContent = this.generateExpenseNotificationHTML(expense, type);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: userEmail,
        subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Expense notification sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send expense notification to ${userEmail}:`, error);
      throw error;
    }
  }

  async sendPaymentReminder(userEmail, owedAmount, friendName) {
    if (!this.initialized) {
      console.log('⚠️ Email service not initialized. Skipping email send.');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Payment Reminder - AI Splitwise',
        html: this.generatePaymentReminderHTML(owedAmount, friendName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Payment reminder sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send payment reminder to ${userEmail}:`, error);
      throw error;
    }
  }

  generateMonthlyReportHTML(reportData, aiContent) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monthly Expense Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
          .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; }
          .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
          .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
          .category-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
          .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 Your Monthly Expense Report</h1>
          <p>${reportData.period.month}</p>
        </div>
        
        <div class="content">
          ${aiContent}
          
          <div class="summary-card">
            <h3>📊 Quick Summary</h3>
            <div class="metric">
              <div class="metric-value">$${reportData.summary.totalSpent.toFixed(2)}</div>
              <div class="metric-label">Total Spent</div>
            </div>
            <div class="metric">
              <div class="metric-value">${reportData.summary.expenseCount}</div>
              <div class="metric-label">Expenses</div>
            </div>
            <div class="metric">
              <div class="metric-value">$${reportData.summary.totalOwed.toFixed(2)}</div>
              <div class="metric-label">Amount Owed</div>
            </div>
          </div>

          <h3>🏷️ Spending by Category</h3>
          ${Object.entries(reportData.summary.categories)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => `
              <div class="category-item">
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span>$${amount.toFixed(2)}</span>
              </div>
            `).join('')}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="btn">
              View Full Dashboard
            </a>
          </div>
        </div>

        <div class="footer">
          <p>This report was generated automatically by AI Splitwise</p>
          <p>To unsubscribe from monthly reports, visit your account settings</p>
        </div>
      </body>
      </html>
    `;
  }

  generateExpenseNotificationHTML(expense, type) {
    const typeMessages = {
      new: `New expense "${expense.title}" has been added`,
      updated: `Expense "${expense.title}" has been updated`,
      settled: `Expense "${expense.title}" has been settled`
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expense Notification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; }
          .card { background: white; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .expense-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .btn { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>💳 Expense Update</h2>
          </div>
          
          <div class="content">
            <p>${typeMessages[type]}</p>
            
            <div class="expense-details">
              <h4>${expense.title}</h4>
              <p><strong>Amount:</strong> $${expense.amount}</p>
              <p><strong>Category:</strong> ${expense.category}</p>
              <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>
              ${expense.description ? `<p><strong>Description:</strong> ${expense.description}</p>` : ''}
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/expenses/${expense._id}" class="btn">
                View Expense
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePaymentReminderHTML(amount, friendName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; }
          .card { background: white; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .amount { font-size: 32px; font-weight: bold; color: #ff6b6b; text-align: center; margin: 20px 0; }
          .btn { background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>💰 Payment Reminder</h2>
          </div>
          
          <div class="content">
            <p>Hi there!</p>
            <p>This is a friendly reminder that you owe <strong>${friendName}</strong>:</p>
            
            <div class="amount">$${amount.toFixed(2)}</div>
            
            <p>You can settle this amount through the AI Splitwise app.</p>

            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/settle" class="btn">
                Settle Payment
              </a>
            </div>

            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated reminder. Please contact ${friendName} if you have any questions.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getNotificationSubject(type, expense) {
    const subjects = {
      new: `New Expense: ${expense.title} - $${expense.amount}`,
      updated: `Updated Expense: ${expense.title}`,
      settled: `Settled: ${expense.title}`
    };
    return subjects[type] || 'Expense Notification';
  }
}

// Initialize the service
const emailService = new EmailService();
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailService.initialize();
}

module.exports = emailService;