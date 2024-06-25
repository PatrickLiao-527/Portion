import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories, fetchRestaurantByName, createCategory, createRestaurant, signupUser } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import '../assets/styles/Signup.css';
import showHideIcon from '../assets/icons/showHide_icon.png';

const Signup = () => {
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCategory, setRestaurantCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [restaurantError, setRestaurantError] = useState('');
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategoriesData();
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');
    setCategoryError('');
    setRestaurantError('');

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long and include letters, numbers, and symbols.');
      return;
    }

    try {
      console.log(`Checking if restaurant exists: ${restaurantName}`);
      const existingRestaurant = await fetchRestaurantByName(restaurantName);
      if (existingRestaurant.exists) {
        setRestaurantError('Restaurant name already exists');
        return;
      }

      let finalCategory = restaurantCategory;

      if (restaurantCategory === 'Other') {
        console.log(`Creating new category: ${newCategory}`);
        const newCategoryData = await createCategory(newCategory);
        finalCategory = newCategoryData.name;
      }

      console.log('Signing up new user...');
      const signupResponse = await signupUser({
        name: profileName,
        email,
        password,
        role: 'owner',
        restaurantName,
        restaurantCategory: finalCategory
      });

      console.log('Signup response:', signupResponse);

      const userId = signupResponse.user._id;
      console.log(`Creating restaurant for user: ${userId}`);
      await createRestaurant(restaurantName, finalCategory, userId);

      console.log('User registered successfully');
      setUser(signupResponse.user);
      setToken(signupResponse.token);
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);

      const errorMessage = error.response?.data?.error || '';
      
      if (errorMessage.includes('Email already in use')) {
        setEmailError('Email already in use');
      } else if (errorMessage.includes('Restaurant name already exists')) {
        setRestaurantError('Restaurant name already exists');
      } else if (errorMessage.includes('Category name already exists')) {
        setCategoryError('Category name already exists');
      } else {
        setErrorMessage('Failed to register');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create an account</h2>
        <p className="signup-subtitle">
          Already have an account? <Link to="/owner/login" className="login-link">Log in</Link>
        </p>
        <form onSubmit={handleSignup}>
          <div className="form-group-signup">
            <label>What should we call you?</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your profile name"
              required
            />
          </div>
          <div className="form-group-signup">
            <label>What's your email?</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group-signup">
            <label>
              Create a password
              <img
                src={showHideIcon}
                alt="Show/Hide"
                onClick={() => setShowPassword(!showPassword)}
                className="show-hide-icon"
              />
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <p className="password-hint">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>
          <div className="form-group-signup">
            <label>Restaurant Name</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter your restaurant name"
              required
            />
            {restaurantError && <p className="error-message">{restaurantError}</p>}
          </div>
          <div className="form-group-signup">
            <label>Restaurant Category</label>
            <select
              value={restaurantCategory}
              onChange={(e) => setRestaurantCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="Other">Other (Please specify)</option>
            </select>
            {categoryError && <p className="error-message">{categoryError}</p>}
            {restaurantCategory === 'Other' && (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter your restaurant category"
                required
              />
            )}
          </div>
          <button type="submit" className="signup-button">Create an account</button>
        </form>
        <div className="terms">
          By creating an account, you agree to the <Link to="/owner/terms">Terms of use</Link> and <Link to="/owner/privacy">Privacy Policy</Link>.
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Signup;