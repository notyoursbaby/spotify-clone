# 🚀 AI-Powered Splitwise Clone - Setup Guide

This guide will help you set up and run the AI-powered expense splitting application built with the MERN stack.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **OpenAI API Key** (for AI features) - [Get one here](https://platform.openai.com/api-keys)
- **Email Service Credentials** (Gmail recommended for notifications)

## 🛠 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai-splitwise-clone
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### 3. Environment Configuration

#### Backend Environment (.env)

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configurations:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-splitwise
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-splitwise

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use App Password, not regular password
EMAIL_FROM=AI Splitwise <your-email@gmail.com>

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend Environment

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in your `.env` file
4. Whitelist your IP address in the Network Access settings

### 5. Email Service Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in your `.env` file

### 6. OpenAI API Setup

1. Create an account at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Add the key to your `.env` file

**Note**: OpenAI API usage incurs costs. Monitor your usage in the OpenAI dashboard.

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend** (in a new terminal):
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Or run both simultaneously**:
   ```bash
   npm run dev
   ```

### Production Mode

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the backend in production**:
   ```bash
   cd backend
   npm start
   ```

## 🔧 Configuration Details

### JWT Secret Generation

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Email Configuration Options

#### Gmail Setup
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

### MongoDB Connection Strings

#### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/ai-splitwise
```

#### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-splitwise?retryWrites=true&w=majority
```

## 🧪 Testing the Setup

### 1. Backend Health Check

Visit `http://localhost:5000/api/health` - you should see:
```json
{
  "status": "OK",
  "message": "AI Splitwise API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Frontend Access

Visit `http://localhost:3000` - you should see the login page.

### 3. Create Test Account

1. Click "Sign up" on the login page
2. Fill in the registration form
3. If successful, you'll be redirected to the dashboard

### 4. Test AI Features

1. Navigate to "AI Insights" in the sidebar
2. The page should load (even with placeholder content)
3. Check browser console for any API errors

## 🎨 Features Overview

### ✅ Currently Implemented

- **Authentication System**: JWT-based login/register
- **Modern UI**: Responsive design with dark/light themes
- **Dashboard**: Overview with mock data
- **Navigation**: Sidebar and navbar with routing
- **AI Service**: Backend infrastructure for AI features
- **Email Service**: Automated email system setup
- **Database Models**: Complete MongoDB schemas

### 🚧 Coming Soon

- **Expense Management**: Add, edit, delete expenses
- **Group Management**: Create and manage expense groups
- **Friend System**: Add friends and split expenses
- **AI Insights**: Real-time spending analysis
- **Settlement System**: Track and settle debts
- **Receipt Upload**: Image handling and storage
- **Mobile App**: React Native version

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution**: 
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, verify IP whitelist

#### 2. JWT Token Error
```
Error: JsonWebTokenError: invalid signature
```
**Solution**: 
- Check `JWT_SECRET` in backend `.env`
- Clear browser localStorage
- Restart backend server

#### 3. Email Service Error
```
Error: Invalid login
```
**Solution**: 
- Use App Password for Gmail (not regular password)
- Enable 2FA on Gmail account
- Check email credentials in `.env`

#### 4. OpenAI API Error
```
Error: Invalid API key
```
**Solution**: 
- Verify API key in `.env`
- Check OpenAI account balance
- Ensure API key has correct permissions

#### 5. CORS Error
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: 
- Check `CLIENT_URL` in backend `.env`
- Restart backend server
- Clear browser cache

### Port Conflicts

If ports 3000 or 5000 are in use:

**Frontend**:
```bash
PORT=3001 npm start
```

**Backend**:
```env
PORT=5001
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### AI Endpoints

- `GET /api/ai/insights` - Get expense insights
- `POST /api/ai/categorize` - Categorize expense
- `GET /api/ai/budget-recommendations` - Get budget suggestions
- `POST /api/ai/monthly-report` - Generate monthly report

### Other Endpoints

- `GET /api/users/search` - Search users
- `GET /api/groups` - Get user groups
- `GET /api/expenses` - Get user expenses

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set OPENAI_API_KEY=your-openai-key
   heroku config:set EMAIL_USER=your-email
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

### Vercel Deployment (Frontend)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

## 📞 Support

If you encounter any issues:

1. **Check the logs**:
   - Backend: Check terminal output
   - Frontend: Check browser console
   - MongoDB: Check MongoDB logs

2. **Common solutions**:
   - Restart all services
   - Clear browser cache
   - Check environment variables
   - Verify API keys and credentials

3. **Get help**:
   - Create an issue in the repository
   - Check existing issues for solutions
   - Review the troubleshooting section

## 🎉 Next Steps

Once you have the application running:

1. **Explore the Dashboard** - Check out the AI-powered insights
2. **Test Authentication** - Create accounts and test login/logout
3. **Review the Code** - Understand the MERN stack implementation
4. **Contribute** - Add features and improvements
5. **Deploy** - Share your version with others

---

**Happy coding! 🚀**