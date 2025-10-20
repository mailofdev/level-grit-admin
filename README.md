# Level Grit Admin Dashboard

A comprehensive fitness and health management platform built with React, Redux Toolkit, and modern web technologies.

## 🚀 Features

- **User Authentication & Authorization**: Secure login/logout with role-based access control
- **Dashboard Management**: Admin, Trainer, and Client dashboards
- **User Management**: Complete CRUD operations for users and clients
- **Meal Plan Management**: Create and manage meal plans for clients
- **Progress Tracking**: Monitor client progress and achievements
- **Messaging System**: Real-time communication between trainers and clients
- **Subscription Management**: Handle client subscriptions and payments
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Dark/Light Theme**: User preference-based theme switching
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance Optimized**: Lazy loading, memoization, and code splitting

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - CSS framework
- **PrimeReact** - UI component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Crypto-JS** - Encryption utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd level-grit-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_API_BASE_URL=https://your-api-url.com
REACT_APP_CRYPTO_SECRET=your-super-secret-crypto-key
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
# ... other environment variables
```

5. Start the development server:
```bash
npm start
```

## 🏗️ Project Structure

```
src/
├── api/                    # API service layer
│   ├── authAPI.js         # Authentication API calls
│   ├── axiosInstance.js   # Axios configuration
│   └── ajustPlanAPI.js    # Plan adjustment API
├── components/            # Reusable UI components
│   ├── common/           # Common components
│   ├── display/          # Display components (Loader, etc.)
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── navigation/       # Navigation components
├── config/               # Configuration files
│   ├── environment.js    # Environment configuration
│   └── layout.js         # Layout configuration
├── contexts/             # React contexts
│   ├── AuthContext.js    # Authentication context
│   └── ThemeContext.js   # Theme context
├── features/             # Feature-based modules
│   ├── auth/            # Authentication features
│   ├── dashboard/       # Dashboard features
│   ├── users/           # User management
│   └── ...              # Other features
├── layouts/              # Layout components
├── redux/                # Redux store configuration
├── styles/               # Global styles and themes
├── utils/                # Utility functions
└── App.js               # Main application component
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:ci` - Run tests in CI mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## 🔐 Security Features

- **Token Encryption**: All authentication tokens are encrypted using AES-256-CBC
- **Input Sanitization**: XSS protection through input sanitization
- **Password Validation**: Strong password requirements
- **Session Management**: Automatic session expiry and refresh
- **Role-Based Access**: Granular permission system
- **CSRF Protection**: Built-in CSRF protection
- **Secure Headers**: Security headers configuration

## 🎨 Theming

The application supports both light and dark themes with:
- CSS custom properties for consistent theming
- User preference persistence
- Smooth theme transitions
- Bootstrap 5 integration

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap 5 grid system
- Flexible layouts for all screen sizes
- Touch-friendly interface

## 🧪 Testing

The project includes comprehensive testing setup:
- Unit tests with Jest
- Component tests with React Testing Library
- Coverage reporting
- CI/CD integration

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Ensure the following environment variables are set:
- `REACT_APP_API_BASE_URL` - Production API URL
- `REACT_APP_CRYPTO_SECRET` - Strong encryption key
- `REACT_APP_FIREBASE_API_KEY` - Firebase configuration
- `REACT_APP_GOOGLE_ANALYTICS_ID` - Analytics tracking ID

### Deployment Options
- **Netlify**: Connect your GitHub repository
- **Vercel**: Deploy with zero configuration
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Containerized deployment

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of routes and components
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: Strategic caching of API responses

## 🔄 State Management

The application uses Redux Toolkit for state management with:
- **Slices**: Feature-based state organization
- **Thunks**: Async action handling
- **Selectors**: Computed state access
- **DevTools**: Development debugging tools

## 🌐 API Integration

- **Axios**: HTTP client with interceptors
- **Error Handling**: Comprehensive error management
- **Request/Response Logging**: Development debugging
- **Authentication**: Automatic token handling
- **Retry Logic**: Automatic retry for failed requests

## 📝 Code Quality

- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **TypeScript Ready**: Prepared for TypeScript migration
- **Documentation**: Comprehensive JSDoc comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] TypeScript migration
- [ ] PWA capabilities
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Mobile app integration

---

**Built with ❤️ by the Level Grit Team**