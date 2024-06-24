import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/ItemForm.css'; // Updated to use shared CSS

const proteinTypes = [
  "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
  "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
  "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
  "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
];

const AddMenuItem = ({ showModal, handleCloseModal, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [carbsPrice, setCarbsPrice] = useState('');
  const [proteinsPrice, setProteinsPrice] = useState('');
  const [baseFat, setBaseFat] = useState('');
  const [proteinType, setProteinType] = useState('Chicken Breast'); // Default protein type
  const [itemPicture, setItemPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();

    if (carbsPrice <= 0 || proteinsPrice <= 0 || baseFat <= 0) {
      setErrorMessage('$/carbs, $/proteins, and base fat cannot be zero or less.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      formData.append('carbsPrice', carbsPrice);
      formData.append('proteinsPrice', proteinsPrice);
      formData.append('baseFat', baseFat);
      formData.append('proteinType', proteinType);
      if (itemPicture) {
        formData.append('itemPicture', itemPicture);
      }

      const response = await axios.post('http://portion.food/api/menus', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onItemAdded(response.data); // Call the callback function to update the parent component
      handleCloseModal(); // Close the modal after successful save
    } catch (error) {
      console.error('Failed to add new item:', error);
    }
  };

  const handleFileChange = (event) => {
    setItemPicture(event.target.files[0]);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2 className="item-form-title">Create New Item</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Carbs:</label>
            <input
              type="number"
              value={carbsPrice}
              onChange={(e) => setCarbsPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Proteins:</label>
            <input
              type="number"
              value={proteinsPrice}
              onChange={(e) => setProteinsPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Base Fat:</label>
            <input
              type="number"
              value={baseFat}
              onChange={(e) => setBaseFat(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Protein Type:</label>
            <select
              value={proteinType}
              onChange={(e) => setProteinType(e.target.value)}
              required
            >
              <option value="" disabled>Select Protein Type</option>
              {proteinTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Item Picture:</label>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </div>
          {errorMessage && <div className="error-message-forms">{errorMessage}</div>}
          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
