import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/AddMenuItem.css';

const proteinTypes = [
  "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
  "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
  "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
  "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
];

const AddMenuItem = ({ showModal, handleCloseModal, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [carbsPrice, setCarbsPrice] = useState(0);
  const [proteinsPrice, setProteinsPrice] = useState(0);
  const [baseFat, setBaseFat] = useState(0);
  const [proteinType, setProteinType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      formData.append('carbsPrice', carbsPrice);
      formData.append('proteinsPrice', proteinsPrice);
      formData.append('baseFat', baseFat);
      formData.append('proteinType', proteinType);
      if (selectedFile) {
        formData.append('itemPicture', selectedFile);
      }

      const response = await axios.post('http://localhost:5555/menus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

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
            Protein Type:
            <select
              name="proteinType"
              value={proteinType}
              onChange={(e) => setProteinType(e.target.value)}
              required
            >
              <option value="" disabled>Select Protein Type</option>
              {proteinTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Item Picture:
            <input
              type="file"
              name="itemPicture"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
