import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/EditItem.css';

const EditItem = ({ item, setItems, onClose }) => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState({
    ...item,
    carbsPrice: item.carbsPrice ? parseFloat(item.carbsPrice.$numberDecimal) : '', // Transform Decimal128
    proteinsPrice: item.proteinsPrice ? parseFloat(item.proteinsPrice.$numberDecimal) : '',
    baseFat: item.baseFat ? parseFloat(item.baseFat.$numberDecimal) : '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentItem) {
      setLoading(false);
    }
  }, [currentItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    await updateItem(currentItem);
    onClose(); // Close modal after saving
    navigate('/menu-items');
  };

  const handleDeleteItem = async () => {
    await deleteItem(currentItem._id);
    onClose(); // Close modal after deleting
    navigate('/menu-items');
  };

  const handleGoBack = () => {
    onClose(); // Close modal when going back
    navigate('/menu-items');
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await axios.put(`http://localhost:5555/menus/${updatedItem._id}`, updatedItem);
      const transformedData = {
        ...response.data,
        carbsPrice: parseFloat(response.data.carbsPrice.$numberDecimal), // Transform Decimal128
        proteinsPrice: parseFloat(response.data.proteinsPrice.$numberDecimal),
        baseFat: parseFloat(response.data.baseFat.$numberDecimal),
      };
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === updatedItem._id ? transformedData : item))    
      );
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5555/menus/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return loading ? <p>Loading...</p> : (
    <div className="edit-item-page">
      <div className="edit-item-container">
        <h2 className="edit-item-title">Edit Item</h2>
        <form onSubmit={handleSaveItem}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemName"
              value={currentItem.itemName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Carbs</label>
            <input
              type="number"
              name="carbsPrice"
              value={currentItem.carbsPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Proteins</label>
            <input
              type="number"
              name="proteinsPrice"
              value={currentItem.proteinsPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Base Fat</label>
            <input
              type="number"
              name="baseFat"
              value={currentItem.baseFat}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Item Picture URL</label>
            <input
              type="text"
              name="itemPicture"
              value={currentItem.itemPicture}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="delete-button" onClick={handleDeleteItem}>Delete</button>
            <button type="button" className="go-back-button" onClick={handleGoBack}>Go Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
