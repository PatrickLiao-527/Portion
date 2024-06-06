import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/AddMenuItem.css';

const AddMenuItem = ({ showModal, handleCloseModal, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [carbsPrice, setCarbsPrice] = useState(0);
  const [proteinsPrice, setProteinsPrice] = useState(0);
  const [baseFat, setBaseFat] = useState(0);
  const [itemPicture, setItemPicture] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const newItem = {
        itemName,
        carbsPrice,
        proteinsPrice,
        baseFat,
        itemPicture
      };

      const response = await axios.post('http://localhost:5555/menus', newItem, { withCredentials: true });
      onItemAdded(response.data); // Call the callback function to update the parent component
      handleCloseModal(); // Close the modal after successful save
    } catch (error) {
      console.error('Failed to add new item:', error);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2>Create New Item</h2>
        <form onSubmit={handleSave}>
          <label>
            Item Name:
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </label>
          <label>
            $ per Carbs:
            <input
              type="number"
              value={carbsPrice}
              onChange={(e) => setCarbsPrice(e.target.value)}
              required
            />
          </label>
          <label>
            $ per Proteins:
            <input
              type="number"
              value={proteinsPrice}
              onChange={(e) => setProteinsPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Base Fat:
            <input
              type="number"
              value={baseFat}
              onChange={(e) => setBaseFat(e.target.value)}
              required
            />
          </label>
          <label>
            Item Picture URL:
            <input
              type="text"
              value={itemPicture}
              onChange={(e) => setItemPicture(e.target.value)}
              required
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
