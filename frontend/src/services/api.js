import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5555';

/**
 * Helper function to handle fetch requests.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {Object} [options={}] - Additional fetch options.
 * @returns {Promise<Object>} - The JSON response data.
 * @throws {Error} - If the request fails.
 */
const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Ensure credentials are included
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// API functions

/**
 * Fetch all restaurants.
 * @returns {Promise<Object[]>} - A list of restaurants.
 */
export const fetchRestaurants = async () => {
  try {
    return await fetchData('/restaurants');
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

/**
 * Fetch a restaurant by its ID.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Object>} - The restaurant data.
 */
export const fetchRestaurantById = async (restaurantId) => {
  try {
    return await fetchData(`/restaurants/${restaurantId}`);
  } catch (error) {
    console.error(`Error fetching restaurant by ID: ${restaurantId}`, error);
    throw error;
  }
};

/**
 * Fetch menu items for a restaurant by its ID.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Object[]>} - A list of menu items.
 */
export const fetchMenuItems = async (restaurantId) => {
  try {
    return await fetchData(`/restaurants/${restaurantId}/menu-items`);
  } catch (error) {
    console.error(`Error fetching menu items for restaurant ID: ${restaurantId}`, error);
    throw error;
  }
};

/**
 * Create a new order.
 * @param {Object} orderData - The order data.
 * @returns {Promise<Object>} - The created order.
 */
export const createOrder = async (orderData) => {
  try {
    return await fetchData('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Fetch all categories.
 * @returns {Promise<Object[]>} - A list of categories.
 */
export const fetchCategories = async () => {
  try {
    return await fetchData('/categories');
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Sign up a new user.
 * @param {Object} userData - The user data.
 * @returns {Promise<Object>} - The created user.
 */
export const signupUser = async (userData) => {
  try {
    return await fetchData('/signup', { method: 'POST', body: JSON.stringify(userData) });
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
};

/**
 * Log in a user.
 * @param {Object} userData - The user data.
 * @returns {Promise<Object>} - The logged-in user.
 */
export const loginUser = async (userData) => {
  try {
    return await fetchData('/auth/login', { method: 'POST', body: JSON.stringify(userData) });
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

/**
 * Send a contact message.
 * @param {Object} contactData - The contact message data.
 * @returns {Promise<Object>} - The response data.
 */
export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      console.log('Received non-JSON response:', text);
      return { message: text };
    }
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

/**
 * Fetch orders for a user by their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object[]>} - A list of orders.
 */
export const fetchUserOrders = async (email) => {
  try {
    return await fetchData(`/orders/customer/${encodeURIComponent(email)}`);
  } catch (error) {
    console.error(`Error fetching orders for email: ${email}`, error);
    throw error;
  }
};

/**
 * Cancel an order by its ID.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<Object>} - The updated order.
 */
export const cancelOrder = async (orderId) => {
  try {
    return await fetchData(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Cancelled' }) });
  } catch (error) {
    console.error(`Error canceling order ID: ${orderId}`, error);
    throw error;
  }
};

/**
 * Add a new menu item.
 * @param {FormData} menuItem - The menu item data.
 * @returns {Promise<Object>} - The created menu item.
 */
export const addMenuItem = async (menuItem) => {
  try {
    const response = await axios.post(`${BASE_URL}/menus`, menuItem, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Update a menu item by its ID.
 * @param {string} itemId - The ID of the menu item.
 * @param {Object} menuItem - The updated menu item data.
 * @returns {Promise<Object>} - The updated menu item.
 */
export const updateMenuItem = async (itemId, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/menus/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item ID: ${itemId}`, error);
    throw error;
  }
};

/**
 * Delete a menu item by its ID.
 * @param {string} itemId - The ID of the menu item.
 * @returns {Promise<Object>} - The response data.
 */
export const deleteMenuItem = async (itemId) => {
  try {
    return await fetchData(`/menus/${itemId}`, { method: 'DELETE' });
  } catch (error) {
    console.error(`Error deleting menu item ID: ${itemId}`, error);
    throw error;
  }
};

/**
 * Fetch all orders.
 * @returns {Promise<Object[]>} - A list of orders.
 */
export const fetchOrders = async () => {
  try {
    return await fetchData('/orders', { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Update the status of an order by its ID.
 * @param {string} orderId - The ID of the order.
 * @param {string} status - The new status of the order.
 * @returns {Promise<Object>} - The updated order.
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    return await fetchData(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  } catch (error) {
    console.error(`Error updating order status for order ID: ${orderId}`, error);
    throw error;
  }
};

/**
 * Fetch the profile of the logged-in user.
 * @returns {Promise<Object>} - The profile data.
 */
export const fetchProfile = async () => {
  try {
    return await fetchData('/signup/profile', { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update the profile of the logged-in user.
 * @param {FormData} profileData - The updated profile data.
 * @returns {Promise<Object>} - The updated profile.
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${BASE_URL}/signup/profile`, profileData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Fetch a restaurant by its name.
 * @param {string} restaurantName - The name of the restaurant.
 * @returns {Promise<Object>} - The restaurant data.
 */
export const fetchRestaurantByName = async (restaurantName) => {
  try {
    const response = await fetchData(`/restaurants/name/${encodeURIComponent(restaurantName)}`);
    if (!response.exists) {
      return { exists: false, message: response.message };
    }
    return { exists: true, restaurant: response.restaurant };
  } catch (error) {
    console.error(`Error fetching restaurant by name: ${restaurantName}`, error);
    throw error;
  }
};

/**
 * Create a new category.
 * @param {string} categoryName - The name of the category.
 * @returns {Promise<Object>} - The created category.
 */
export const createCategory = async (categoryName) => {
  try {
    return await fetchData('/categories', { method: 'POST', body: JSON.stringify({ name: categoryName }) });
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Create a new restaurant.
 * @param {string} restaurantName - The name of the restaurant.
 * @param {string} category - The category of the restaurant.
 * @param {string} ownerId - The ID of the owner.
 * @returns {Promise<Object>} - The created restaurant.
 */
export const createRestaurant = async (restaurantName, category, ownerId) => {
  try {
    return await fetchData('/restaurants', { method: 'POST', body: JSON.stringify({ name: restaurantName, category, ownerId }) });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

/**
 * Log in a user with Google.
 * @param {string} token - The Google token.
 * @returns {Promise<Object>} - The logged-in user.
 */
export const googleLogin = async (token) => {
  try {
    return await fetchData('/auth/google-login', { method: 'POST', body: JSON.stringify({ token }) });
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

/**
 * Check if the user is authenticated.
 * @returns {Promise<Object>} - The authentication data.
 */
export const checkAuth = async () => {
  try {
    return await fetchData('/auth/check');
  } catch (error) {
    console.error('Error checking authentication:', error);
    throw error;
  }
};

/**
 * Log out the current user.
 * @returns {Promise<Object>} - The response data.
 */
export const logoutUser = async () => {
  try {
    return await fetchData('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};
/**
 * Fetch menu items for the owner.
 * @returns {Promise<Object[]>} - A list of menu items.
 */
export const fetchOwnerMenuItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/menus`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching owner menu items:', error);
    throw error;
  }
};

export const fetchUserRole = async (email) => {
  try {
    const response = await fetchData(`/auth/role/${encodeURIComponent(email)}`);
    return response;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};