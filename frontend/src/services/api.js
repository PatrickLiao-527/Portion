const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5555/api';

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
export const fetchRestaurants = () => fetchData('/restaurants');

/**
 * Fetch a restaurant by its ID.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Object>} - The restaurant data.
 */
export const fetchRestaurantById = (restaurantId) => fetchData(`/restaurants/${restaurantId}`);

/**
 * Fetch menu items for a restaurant by its ID.
 * @param {string} restaurantId - The ID of the restaurant.
 * @returns {Promise<Object[]>} - A list of menu items.
 */
export const fetchMenuItems = (restaurantId) => fetchData(`/restaurants/${restaurantId}/menu-items`);

/**
 * Create a new order.
 * @param {Object} orderData - The order data.
 * @returns {Promise<Object>} - The created order.
 */
export const createOrder = (orderData) => fetchData('/orders', { method: 'POST', body: JSON.stringify(orderData) });

/**
 * Fetch all categories.
 * @returns {Promise<Object[]>} - A list of categories.
 */
export const fetchCategories = () => fetchData('/categories');

/**
 * Sign up a new user.
 * @param {Object} userData - The user data.
 * @returns {Promise<Object>} - The created user.
 */
export const signupUser = (userData) => fetchData('/signup', { method: 'POST', body: JSON.stringify(userData) });

/**
 * Log in a user.
 * @param {Object} userData - The user data.
 * @returns {Promise<Object>} - The logged-in user.
 */
export const loginUser = (userData) => fetchData('/auth/login', { method: 'POST', body: JSON.stringify(userData) });

/**
 * Send a contact message.
 * @param {Object} contactData - The contact message data.
 * @returns {Promise<Object>} - The response data.
 */
export const sendContactMessage = (contactData) => fetchData('/contact', { method: 'POST', body: JSON.stringify(contactData) });

/**
 * Fetch orders for a user by their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object[]>} - A list of orders.
 */
export const fetchUserOrders = (email) => fetchData(`/orders/customer/${encodeURIComponent(email)}`);

/**
 * Cancel an order by its ID.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<Object>} - The updated order.
 */
export const cancelOrder = (orderId) => fetchData(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Cancelled' }) });

/**
 * Add a new menu item.
 * @param {Object} menuItem - The menu item data.
 * @returns {Promise<Object>} - The created menu item.
 */
export const addMenuItem = (menuItem) => fetchData('/menu-items', { method: 'POST', body: JSON.stringify(menuItem) });

/**
 * Update a menu item by its ID.
 * @param {string} itemId - The ID of the menu item.
 * @param {Object} menuItem - The updated menu item data.
 * @returns {Promise<Object>} - The updated menu item.
 */
export const updateMenuItem = (itemId, menuItem) => fetchData(`/menu-items/${itemId}`, { method: 'PUT', body: JSON.stringify(menuItem) });

/**
 * Delete a menu item by its ID.
 * @param {string} itemId - The ID of the menu item.
 * @returns {Promise<Object>} - The response data.
 */
export const deleteMenuItem = (itemId) => fetchData(`/menu-items/${itemId}`, { method: 'DELETE' });

/**
 * Fetch all orders.
 * @returns {Promise<Object[]>} - A list of orders.
 */
export const fetchOrders = () => fetchData('/orders');

/**
 * Update the status of an order by its ID.
 * @param {string} orderId - The ID of the order.
 * @param {string} status - The new status of the order.
 * @returns {Promise<Object>} - The updated order.
 */
export const updateOrderStatus = (orderId, status) => fetchData(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

/**
 * Fetch the profile of the logged-in user.
 * @returns {Promise<Object>} - The profile data.
 */
export const fetchProfile = () => fetchData('/signup/profile');

/**
 * Update the profile of the logged-in user.
 * @param {Object} profileData - The updated profile data.
 * @returns {Promise<Object>} - The updated profile.
 */
export const updateProfile = (profileData) => fetchData('/signup/profile', { method: 'PUT', body: JSON.stringify(profileData) });

/**
 * Fetch a restaurant by its name.
 * @param {string} restaurantName - The name of the restaurant.
 * @returns {Promise<Object>} - The restaurant data.
 */
export const fetchRestaurantByName = (restaurantName) => fetchData(`/restaurants/name/${restaurantName}`);

/**
 * Create a new category.
 * @param {string} categoryName - The name of the category.
 * @returns {Promise<Object>} - The created category.
 */
export const createCategory = (categoryName) => fetchData('/categories', { method: 'POST', body: JSON.stringify({ name: categoryName }) });

/**
 * Create a new restaurant.
 * @param {string} restaurantName - The name of the restaurant.
 * @param {string} category - The category of the restaurant.
 * @param {string} ownerId - The ID of the owner.
 * @returns {Promise<Object>} - The created restaurant.
 */
export const createRestaurant = (restaurantName, category, ownerId) => fetchData('/restaurants', { method: 'POST', body: JSON.stringify({ name: restaurantName, category, ownerId }) });

/**
 * Log in a user with Google.
 * @param {string} token - The Google token.
 * @returns {Promise<Object>} - The logged-in user.
 */
export const googleLogin = (token) => fetchData('/auth/google-login', { method: 'POST', body: JSON.stringify({ token }) });

/**
 * Check if the user is authenticated.
 * @returns {Promise<Object>} - The authentication data.
 */
export const checkAuth = () => fetchData('/auth/check');

/**
 * Log out the current user.
 * @returns {Promise<Object>} - The response data.
 */
export const logoutUser = () => fetchData('/auth/logout', { method: 'POST' });