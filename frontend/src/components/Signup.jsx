import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import '../assets/styles/Signup.css';
import googleLogo from '../assets/icons/Google-logo.png';
import showHideIcon from '../assets/icons/showHide_icon.png';

const BASE_URL = 'http://localhost:5555';

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const fetchRestaurants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurants`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

const fetchRestaurantByName = async (restaurantName) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurants/name/${restaurantName}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant by name:', error);
    throw error;
  }
};

const createCategory = async (categoryName) => {
  try {
    const response = await axios.post(`${BASE_URL}/categories`, { name: categoryName }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

const createRestaurant = async (restaurantName, category, ownerId) => {
  try {
    const response = await axios.post(`${BASE_URL}/restaurants`, { name: restaurantName, category, ownerId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

const Signup = () => {
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [restaurantCategory, setRestaurantCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const { setUser } = useContext(AuthContext);
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

    const fetchRestaurantsData = async () => {
      try {
        const restaurantsData = await fetchRestaurants();
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchCategoriesData();
    fetchRestaurantsData();
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

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long and include letters, numbers, and symbols.');
      return;
    }

    try {
      let finalCategory = restaurantCategory;
      let finalRestaurantName = restaurantName;

      if (restaurantName === 'Other') {
        if (restaurantCategory === 'Other') {
          const newCategoryData = await createCategory(newCategory);
          finalCategory = newCategoryData.name;
        }

        const signupResponse = await axios.post(`${BASE_URL}/signup`, {
          name: profileName,
          email,
          password,
          role: 'owner',
          restaurantName: newRestaurantName,
          restaurantCategory: finalCategory
        });

        const userId = signupResponse.data.user._id;
        const newRestaurant = await createRestaurant(newRestaurantName, finalCategory, userId);
        finalRestaurantName = newRestaurant.name;
      } else {
        const existingRestaurant = await fetchRestaurantByName(restaurantName);
        finalRestaurantName = existingRestaurant.name;
        finalCategory = existingRestaurant.category;

        await axios.post(`${BASE_URL}/signup`, {
          name: profileName,
          email,
          password,
          role: 'owner',
          restaurantName: finalRestaurantName,
          restaurantCategory: finalCategory
        });
      }

      console.log('User registered successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);

      if (error.response?.data?.message.includes('Email already in use')) {
        setEmailError('Email already in use');
      } else if (error.response?.data?.message.includes('Restaurant name already exists')) {
        setErrorMessage('Restaurant name already exists');
      } else if (error.response?.data?.message.includes('Category name already exists')) {
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
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
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
            <select
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            >
              <option value="" disabled>Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant.name}>
                  {restaurant.name}
                </option>
              ))}
              <option value="Other">Other (Please specify)</option>
            </select>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {restaurantName === 'Other' && (
              <input
                type="text"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
                placeholder="Enter your restaurant name"
                required
              />
            )}
          </div>
          {restaurantName === 'Other' && (
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
          )}
          <button type="submit" className="signup-button">Create an account</button>
        </form>
        <div className="terms">
          By creating an account, you agree to the <Link to="/terms">Terms of use</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </div>
        <div className="signup-divider">OR Continue with</div>
        <button className="google-signup-button">
          <img src={googleLogo} alt="Google" className="google-logo" /> Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
