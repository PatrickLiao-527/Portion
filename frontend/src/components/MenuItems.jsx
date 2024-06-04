import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TableWidget from './TableWidget';
import editIcon from '../assets/icons/edit_icon.svg';
import '../assets/styles/MenuItems.css';

const proteinTypes = [
  "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
  "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
  "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
  "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
];

const MenuItems = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    carbsPrice: '',
    proteinsPrice: '',
    baseFat: '',
    itemPicture: '',
    proteinType: ''
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/menus', { withCredentials: true })
      .then((response) => {
        const transformedData = response.data.data.map(item => ({
          ...item,
          carbsPrice: parseFloat(item.carbsPrice.$numberDecimal),
          proteinsPrice: parseFloat(item.proteinsPrice.$numberDecimal),
          baseFat: parseFloat(item.baseFat.$numberDecimal),
          editItem: <Link to={`/menu-items/edit/${item._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>
        }));
        setMenus(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { header: 'Item ID', accessor: '_id' },
    { header: 'Item Name', accessor: 'itemName' },
    { header: '$/carbs', accessor: 'carbsPrice' },
    { header: 'Protein type', accessor: 'proteinType' },
    { header: '$/proteins', accessor: 'proteinsPrice' },
    { header: 'Base Fat', accessor: 'baseFat' },
    { header: 'Item Picture', accessor: 'itemPicture' },
    { header: 'Edit Item', accessor: 'editItem' }
  ];

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save new item to the server
    console.log(newItem);
    setShowModal(false);
  };

  return (
    <div className="menu-items-page">
      <div className="menu-items-header">
        <button className="create-new-item-button" onClick={handleShowModal}>
          Create New Item
        </button>
      </div>
      {loading ? <p>Loading...</p> : 
      <TableWidget
        title="Menu Items"
        data={menus}
        columns={columns}
        itemsPerPage={15}
        maxItemsPerPage={30}
      />
      }
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Create New Item</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Item Name:
                <input type="text" name="itemName" value={newItem.itemName} onChange={handleChange} />
              </label>
              <label>
                $ per Carbs:
                <input type="text" name="carbsPrice" value={newItem.carbsPrice} onChange={handleChange} />
              </label>
              <label>
                $ per Proteins:
                <input type="text" name="proteinsPrice" value={newItem.proteinsPrice} onChange={handleChange} />
              </label>
              <label>
                Base Fat:
                <input type="text" name="baseFat" value={newItem.baseFat} onChange={handleChange} />
              </label>
              <label>
                Item Picture URL:
                <input type="text" name="itemPicture" value={newItem.itemPicture} onChange={handleChange} />
              </label>
              <label>
                Protein Type:
                <select name="proteinType" value={newItem.proteinType} onChange={handleChange}>
                  <option value="" disabled>Select Protein Type</option>
                  {proteinTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
