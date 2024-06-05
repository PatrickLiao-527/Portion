import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TableWidget from './TableWidget';
import AddMenuItem from './AddMenuItem';
import editIcon from '../assets/icons/edit_icon.svg';
import '../assets/styles/MenuItems.css';

const MenuItems = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/menus', { withCredentials: true })
      .then((response) => {
        // some attributes stored in db as Decimal128 which cannot be displayed directly
        // transforming Decimal128 to String
        const transformedData = response.data.data.map(item => ({
          ...item,
          carbsPrice: parseFloat(item.carbsPrice.$numberDecimal),
          proteinsPrice: parseFloat(item.proteinsPrice.$numberDecimal),
          baseFat: parseFloat(item.baseFat.$numberDecimal),
          editItem: <Link to={`/menu-items/edit/${item._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link> // Add edit link
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

  const handleItemAdded = (newItem) => {
    const transformedNewItem = {
      ...newItem,
      carbsPrice: parseFloat(newItem.carbsPrice.$numberDecimal),
      proteinsPrice: parseFloat(newItem.proteinsPrice.$numberDecimal),
      baseFat: parseFloat(newItem.baseFat.$numberDecimal),
      editItem: <Link to={`/menu-items/edit/${newItem._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>
    };
    setMenus((prevMenus) => [...prevMenus, transformedNewItem]);
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
      <AddMenuItem
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
};

export default MenuItems;
