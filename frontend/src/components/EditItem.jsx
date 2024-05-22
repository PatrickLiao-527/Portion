import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/EditItem.css';

const EditItem = ({ items, updateItem, deleteItem }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const currentItem = items.find((item) => item._id === itemId);
    if (currentItem) {
      setItem(currentItem);
    }
  }, [itemId, items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({
      ...item,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateItem(item);
    navigate('/menu-items');
  };

  const handleDelete = () => {
    deleteItem(itemId);
    navigate('/menu-items');
  };

  const handleGoBack = () => {
    navigate('/menu-items');
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-item-page">
      <div className="edit-item-container">
        <h2 className="edit-item-title">Edit Item</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Carbs</label>
            <input
              type="number"
              name="carbsPrice"
              value={item.carbsPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>$ per Proteins</label>
            <input
              type="number"
              name="proteinsPrice"
              value={item.proteinsPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Base Fat</label>
            <input
              type="number"
              name="baseFat"
              value={item.baseFat}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Item Picture URL</label>
            <input
              type="text"
              name="itemPicture"
              value={item.itemPicture}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
            <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
