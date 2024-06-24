import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/ItemForm.css'; // Updated to use shared CSS

const proteinTypes = [
  "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
  "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
  "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
  "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
];

const EditItem = ({ item, setItems, onClose }) => {
  const [currentItem, setCurrentItem] = useState({
    ...item,
    carbsPrice: item.carbsPrice ? parseFloat(item.carbsPrice.replace('$', '')) : '',
    proteinsPrice: item.proteinsPrice ? parseFloat(item.proteinsPrice.replace('$', '')) : '',
    baseFat: item.baseFat ? parseFloat(item.baseFat.replace(' gram(s)', '')) : '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
  
    if (currentItem.carbsPrice <= 0 || currentItem.proteinsPrice <= 0 || currentItem.baseFat <= 0) {
      setErrorMessage('$/carbs, $/proteins, and base fat cannot be zero or less.');
      return;
    }
  
    const formData = new FormData();
    for (const key in currentItem) {
      if (currentItem.hasOwnProperty(key)) {
        formData.append(key, currentItem[key]);
      }
    }
  
    if (selectedFile) {
      formData.append('itemPicture', selectedFile);
    }
  
    try {
      const response = await axios.put(
        `http://portion.food/api/menus/${currentItem._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      
      const updatedItem = response.data;
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === currentItem._id ? {
          ...updatedItem,
          carbsPrice: `$${updatedItem.carbsPrice}`,
          proteinsPrice: `$${updatedItem.proteinsPrice}`,
          baseFat: `${updatedItem.baseFat} gram(s)`,
          itemPicture: updatedItem.image ? `data:image/${updatedItem.imageExtension};base64,${updatedItem.image}` : null
        } : item))
      );
      
      onClose(); // Automatically close the modal
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  const handleDeleteItem = async () => {
    try {
      await axios.delete(`http://portion.food/api/menus/${currentItem._id}`, { withCredentials: true });
      setItems((prevItems) => prevItems.filter((item) => item._id !== currentItem._id));
      onClose(); // Automatically close the modal
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return loading ? <p>Loading...</p> : (
    <div className="item-form-page">
        <h2 className="item-form-title">Edit Item</h2>
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
            <label>Item Picture</label>
            <input
              type="file"
              name="itemPicture"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
            />
          </div>
          <div className="form-group">
            <label>Protein Type</label>
            <select
              name="proteinType"
              value={currentItem.proteinType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Protein Type</option>
              {proteinTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {errorMessage && <div className="error-message-forms">{errorMessage}</div>}
          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="delete-button" onClick={handleDeleteItem}>Delete</button>
          </div>
        </form>
    </div>
  );
};

export default EditItem;
