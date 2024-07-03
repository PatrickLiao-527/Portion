import React, { useState } from 'react';
import { addMenuItem } from '../services/api';
import styles from '../assets/styles/ItemForm.css';

const proteinTypes = [
  "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
  "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
  "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
  "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
];

const carbTypes = [
  "Brown Rice", "Quinoa", "Sweet Potato", "Whole Wheat Pasta", "Oats", 
  "Barley", "Buckwheat", "Chickpeas", "Lentils", "Farro", "Millet", 
  "Spelt", "Wild Rice", "Black Beans", "Kidney Beans", "Green Peas",
  "Whole Grain Bread", "Bulgur", "Couscous", "White Rice", "Pasta", 
  "Potato", "Corn", "Bread"
];

const AddMenuItem = ({ showModal, handleCloseModal, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [carbsPrice, setCarbsPrice] = useState('');
  const [carbsPortion, setCarbsPortion] = useState('');
  const [carbsType, setCarbsType] = useState('White Rice');
  const [proteinsPrice, setProteinsPrice] = useState('');
  const [proteinsPortion, setProteinsPortion] = useState('');
  const [baseFat, setBaseFat] = useState('');
  const [proteinType, setProteinType] = useState('Chicken Breast');
  const [ingredientList, setIngredientList] = useState([]);
  const [allergicInfo, setAllergicInfo] = useState({});
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
      formData.append('carbsPortion', carbsPortion);
      formData.append('carbsType', carbsType);
      formData.append('proteinsPrice', proteinsPrice);
      formData.append('proteinsPortion', proteinsPortion);
      formData.append('baseFat', baseFat);
      formData.append('proteinType', proteinType);
      formData.append('allergicInfo', JSON.stringify(allergicInfo));
      formData.append('ingredientList', JSON.stringify(ingredientList));
      if (itemPicture) {
        formData.append('itemPicture', itemPicture);
      }

      const response = await addMenuItem(formData);
      onItemAdded(response); // Call the callback function to update the parent component
      handleCloseModal(); // Close the modal after successful save
    } catch (error) {
      console.error('Failed to add new item:', error);
      setErrorMessage('Failed to add new item. Please try again later.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) { // 50MB limit
      setErrorMessage('File size should be less than 50MB');
      return;
    }
    if (file && !file.type.startsWith('image/')) {
      setErrorMessage('Only image files are allowed');
      return;
    }
    setItemPicture(file);
  };

  const handleAddIngredient = () => {
    setIngredientList([...ingredientList, { ingredientName: '', caloriesPerGram: '', gramsUsed: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = ingredientList.map((ingredient, i) => (
      i === index ? { ...ingredient, [field]: value } : ingredient
    ));
    setIngredientList(updatedIngredients);
  };

  const handleRemoveIngredient = (index) => {
    setIngredientList(ingredientList.filter((_, i) => i !== index));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleCloseModal}>&times;</span>
        <h2 className={styles.itemFormTitle}>Create New Item</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Carbs Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>$ per Carbs:</label>
              <input
                type="number"
                value={carbsPrice}
                onChange={(e) => setCarbsPrice(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Carbs Portion:</label>
              <input
                type="text"
                value={carbsPortion}
                onChange={(e) => setCarbsPortion(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Carbs Type:</label>
              <select
                value={carbsType}
                onChange={(e) => setCarbsType(e.target.value)}
                required
                className={styles.select}
              >
                <option value="" disabled>Select Carbs Type</option>
                {carbTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Proteins Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>$ per Proteins:</label>
              <input
                type="number"
                value={proteinsPrice}
                onChange={(e) => setProteinsPrice(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Proteins Portion:</label>
              <input
                type="text"
                value={proteinsPortion}
                onChange={(e) => setProteinsPortion(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Protein Type:</label>
              <select
                value={proteinType}
                onChange={(e) => setProteinType(e.target.value)}
                required
                className={styles.select}
              >
                <option value="" disabled>Select Protein Type</option>
                {proteinTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Base Fat:</label>
            <input
              type="number"
              value={baseFat}
              onChange={(e) => setBaseFat(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Ingredient List */}
          <div className={styles.ingredientList}>
            <label>Ingredient List:</label>
            {ingredientList.map((ingredient, index) => (
              <div key={index} className={styles.ingredientItem}>
                <input
                  type="text"
                  placeholder="Ingredient Name"
                  value={ingredient.ingredientName}
                  onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                  required
                  className={styles.ingredientInput}
                />
                <input
                  type="number"
                  placeholder="Calories Per Gram"
                  value={ingredient.caloriesPerGram}
                  onChange={(e) => handleIngredientChange(index, 'caloriesPerGram', e.target.value)}
                  required
                  className={styles.ingredientInput}
                />
                <input
                  type="number"
                  placeholder="Grams Used"
                  value={ingredient.gramsUsed}
                  onChange={(e) => handleIngredientChange(index, 'gramsUsed', e.target.value)}
                  required
                  className={styles.ingredientInput}
                />
                <button type="button" onClick={() => handleRemoveIngredient(index)} className={styles.ingredientButton}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddIngredient} className={styles.ingredientButton}>Add Ingredient</button>
          </div>

          {/* Allergic Info */}
          <div className={`${styles.formGroup} ${styles.allergicInfo}`}>
            <label className={styles.label}>Allergic Info (JSON format):</label>
            <input
              type="text"
              value={JSON.stringify(allergicInfo)}
              onChange={(e) => setAllergicInfo(JSON.parse(e.target.value))}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Item Picture:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.input}
            />
          </div>

          {errorMessage && <div className={styles.errorMessageForms}>{errorMessage}</div>}
          <div className={styles.formButtons}>
            <button type="submit" className={styles.saveButton}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
