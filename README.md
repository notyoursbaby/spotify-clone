# 🤖 AI-Powered Splitwise Clone

A modern, intelligent expense splitting application built with the MERN stack and enhanced with AI capabilities for smart financial insights and automated monthly reports.

![AI Splitwise](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop)

## ✨ Features

### 💰 Core Expense Management
- **Smart Expense Splitting** - Equal, exact, and percentage-based splits
- **Group Management** - Create and manage expense groups for trips, apartments, etc.
- **Multi-Currency Support** - Handle expenses in different currencies
- **Receipt Upload** - Attach receipts to expenses for better tracking
- **Real-time Balances** - Track who owes what in real-time

### 🤖 AI-Powered Features
- **Intelligent Categorization** - AI automatically categorizes expenses
- **Monthly Reports** - Automated email reports with spending insights
- **Budget Recommendations** - AI-generated budget suggestions
- **Spending Analysis** - Smart insights into spending patterns
- **Financial Health Score** - AI-calculated financial wellness metrics
- **Smart Split Suggestions** - AI recommends optimal expense splits

### 🎨 Modern UI/UX
- **Beautiful Design** - Modern, responsive interface with Tailwind CSS
- **Interactive Dashboard** - Visual charts and spending analytics
- **Dark/Light Theme** - Customizable theme preferences
- **Mobile Responsive** - Works perfectly on all devices
- **Smooth Animations** - Framer Motion powered transitions

### 🔧 Technical Features
- **MERN Stack** - MongoDB, Express.js, React, Node.js
- **JWT Authentication** - Secure user authentication
- **Real-time Updates** - Live expense and balance updates
- **Email Notifications** - Automated expense and payment reminders
- **Cloud Storage** - Secure receipt and image storage
- **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key (for AI features)
- Email service credentials (for notifications)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-splitwise-clone
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configurations
```

4. **Start the development servers**
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## 📋 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ai-splitwise
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### AI Features Setup
1. **OpenAI Integration**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Email Service**: Configure Gmail or other SMTP service
3. **MongoDB**: Set up local MongoDB or use MongoDB Atlas

## 📱 Usage

### Getting Started
1. **Register/Login** - Create your account or sign in
2. **Create Groups** - Set up groups for different expense categories
3. **Add Friends** - Connect with friends to split expenses
4. **Track Expenses** - Add expenses and let AI categorize them
5. **View Insights** - Check your AI-powered spending insights

### AI Features
- **Monthly Reports**: Automatically receive detailed expense reports
- **Smart Categorization**: AI suggests categories for new expenses
- **Budget Insights**: Get personalized budget recommendations
- **Spending Analysis**: Understand your spending patterns

## 🛠 Technologies Used

### Frontend
- **React 18** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful data visualization
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js & Express** - Server and API framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **OpenAI API** - AI-powered features
- **Nodemailer** - Email service integration
- **Node-cron** - Scheduled tasks for reports

### AI & Analytics
- **OpenAI GPT-3.5** - Natural language processing
- **Smart Categorization** - Machine learning expense classification
- **Predictive Analytics** - Spending pattern analysis
- **Automated Insights** - AI-generated financial recommendations

## 📊 Features in Detail

### Expense Management
- Create and split expenses among group members
- Support for different split types (equal, exact amounts, percentages)
- Attach receipts and add detailed descriptions
- Track payment status and settlements

### AI Intelligence
- **Expense Categorization**: Automatically categorize expenses using AI
- **Monthly Reports**: Receive personalized spending summaries via email
- **Budget Recommendations**: Get AI-powered budget suggestions
- **Spending Insights**: Understand your financial patterns with AI analysis

### User Experience
- Intuitive dashboard with spending overview
- Real-time balance calculations
- Mobile-responsive design
- Beautiful charts and visualizations

## 🔒 Security & Privacy

- **Secure Authentication** - JWT-based authentication system
- **Data Encryption** - Sensitive data encrypted in transit and at rest
- **Privacy First** - User data is never shared with third parties
- **GDPR Compliant** - Built with privacy regulations in mind

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Set up development environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ using MERN Stack + AI**
