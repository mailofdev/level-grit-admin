import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from './authThunks';
import { selectAuthLoading, selectAuthError, clearError } from './authSlice';
import logo from '../../assets/images/logo3.jpeg';
import Loader from '../../components/display/Loader';
import { Eye, EyeClosed } from 'lucide-react';
import { sanitizeInput, isValidEmail } from '../../utils/crypto';

/**
 * LoginForm component for user authentication
 * Handles form validation, submission, and error display
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  // Local state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Get redirect location from navigation state
  const from = location.state?.from || '/dashboard';

  /**
   * Clear errors when component mounts
   */
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear local error when auth error changes
   */
  useEffect(() => {
    if (authError) {
      setLocalError('');
    }
  }, [authError]);

  /**
   * Handle input changes with sanitization
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear local error when user starts typing
    if (localError) {
      setLocalError('');
    }
  }, [localError]);

  /**
   * Handle input blur for validation
   */
  const handleInputBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  /**
   * Validate form data
   */
  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }, [formData]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLocalError('');
    dispatch(clearError());

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setLocalError(errors[0]);
      return;
    }

    try {
      await dispatch(loginThunk({
        email: formData.email.trim(),
        password: formData.password,
      })).unwrap();
      
      // Navigate to intended destination or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by Redux state
      console.error('Login failed:', error);
    }
  }, [formData, validateForm, dispatch, navigate, from]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Get current error message
  const currentError = authError || localError;

  return (
    <div className="page-container d-flex justify-content-center align-items-center position-relative auth-page-enter">
      {isLoading && <Loader fullScreen text="Logging in..." color="var(--color-primary)" />}

      {/* Enhanced Login Card */}
      <div className="card content-wrapper card-health p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img
              src={logo}
              alt="Level Grit Logo"
              className="rounded-circle border border-3 shadow-sm hover-scale"
              style={{
                height: '100px',
                width: '100px',
                borderColor: 'var(--color-primary)',
                objectFit: 'cover',
              }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-2 border-success opacity-25 animate-pulse"></div>
          </div>
        </div>

        {currentError && (
          <div className="alert alert-danger text-center py-3 mb-4 smooth-transition">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {currentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              <i className="fas fa-envelope text-primary me-2"></i>Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control smooth-transition ${
                touched.email && !formData.email.trim() ? 'is-invalid' : ''
              }`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              autoComplete="email"
              disabled={isLoading}
            />
            {touched.email && !formData.email.trim() && (
              <div className="invalid-feedback">Email is required</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">
              <i className="fas fa-lock text-primary me-2"></i>Password
            </label>
            <div className="position-relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control pe-5 smooth-transition ${
                  touched.password && !formData.password ? 'is-invalid' : ''
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 p-0 text-muted"
                style={{ border: 'none', background: 'none' }}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.password && !formData.password && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 smooth-transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-4">
          <p className="text-muted mb-2">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-decoration-none fw-bold smooth-transition"
              style={{ color: 'var(--color-primary)' }}
            >
              Create Account
            </Link>
          </p>
          <p className="mb-0">
            <Link
              to="/reset-password"
              className="text-decoration-none fw-semibold smooth-transition"
              style={{ color: 'var(--color-link)' }}
            >
              <i className="fas fa-key me-1"></i>
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
