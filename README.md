# BookBnB - Book Lending Platform

A modern book lending platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to lend and borrow books, similar to Airbnb's concept.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system with JWT tokens
- **Book Management**: Add, edit, and manage your book collection
- **Book Discovery**: Search and browse books by title, author, genre, location, and price
- **Lending System**: Request to borrow books and manage loan statuses
- **Rating System**: Rate and review other users after completed loans
- **User Profiles**: Comprehensive user profiles with ratings and book history

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Instant feedback for all user actions
- **Search & Filters**: Advanced search with multiple filter options
- **Pagination**: Efficient browsing with paginated results

### Security Features
- **Password Hashing**: Secure password storage with bcrypt
- **JWT Authentication**: Stateless authentication with secure tokens
- **Input Validation**: Comprehensive form validation and sanitization
- **Protected Routes**: Secure access to authenticated features

## 🛠️ Tech Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logger

### Frontend
- **React.js**: User interface library
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Toast notifications
- **React Icons**: Icon library
- **CSS Variables**: Modern CSS with custom properties

## 📁 Project Structure

```
bookBnB/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── books/     # Book-related components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── loans/     # Loan management components
│   │   │   ├── pages/     # Page components
│   │   │   ├── profile/   # User profile components
│   │   │   └── routing/   # Route protection
│   │   ├── contexts/      # React contexts
│   │   └── styles/        # CSS files
├── models/                 # MongoDB models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── server.js              # Express server
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookBnB
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookbnb
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   PORT=5000
   ```

5. **Start the development server**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Books
- `GET /api/books` - Get all books with filters
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `PUT /api/books/:id/availability` - Update book availability

### Loans
- `POST /api/loans` - Create loan request
- `GET /api/loans` - Get user's loans
- `GET /api/loans/:id` - Get loan by ID
- `PUT /api/loans/:id/status` - Update loan status
- `POST /api/loans/:id/rate` - Rate loan

### Users
- `GET /api/users` - Search users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/books` - Get user's books

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run server` - Start development server
- `npm run client` - Start React development server
- `npm run dev` - Start both server and client concurrently
- `npm run build` - Build React app for production
- `npm run install-client` - Install client dependencies

## 🌟 Key Features Explained

### Book Lending Workflow
1. **Book Owner**: Lists book with pricing and availability
2. **Borrower**: Searches and requests to borrow
3. **Owner**: Approves or rejects the request
4. **Loan Active**: Book is marked as unavailable
5. **Return**: Book is returned and marked available
6. **Rating**: Both parties can rate each other

### Search & Discovery
- **Text Search**: Search by title, author, or description
- **Genre Filtering**: Filter by book categories
- **Location-based**: Find books near you
- **Price Range**: Filter by daily rental rates
- **Condition Filter**: Filter by book condition

### User Trust System
- **Verification**: User verification system
- **Ratings**: Comprehensive rating system
- **Reviews**: Detailed feedback after loans
- **History**: Complete loan and book history

## 🎨 Customization

### Styling
The app uses CSS variables for easy customization. Modify the `:root` section in `client/src/index.css` to change:
- Color scheme
- Spacing
- Border radius
- Shadows
- Typography

### Adding New Features
- **New Models**: Add to `models/` directory
- **New Routes**: Add to `routes/` directory
- **New Components**: Add to `client/src/components/`
- **New Pages**: Add to `client/src/components/pages/`

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Build the application
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Run `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Airbnb's sharing economy concept
- Designed for book lovers and community building

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Reading and Sharing! 📚✨**


