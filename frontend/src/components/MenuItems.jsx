import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import TableWidget from './TableWidget';
import editIcon from '../assets/icons/edit_icon.svg';
import EditItem from './EditItem';
import AddMenuItem from './AddMenuItem';
import '../assets/styles/MenuItems.css';

const MenuItems = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
          editItem: <button onClick={() => handleEditClick(item)} className="edit-link"><img src={editIcon} alt="Edit" /></button>,
          itemPicture: `data:image/jpeg;base64,${item.itemPicture.toString('base64')}`
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
    { header: 'Item Picture', accessor: 'itemPicture', Cell: ({ value }) => <img src={value} alt="Item" width="100" height="100" /> },
    { header: 'Edit Item', accessor: 'editItem' }
  ];

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleItemAdded = (newItem) => {
    const transformedNewItem = {
      ...newItem,
      carbsPrice: parseFloat(newItem.carbsPrice.$numberDecimal),
      proteinsPrice: parseFloat(newItem.proteinsPrice.$numberDecimal),
      baseFat: parseFloat(newItem.baseFat.$numberDecimal),
      editItem: <button onClick={() => handleEditClick(newItem)} className="edit-link"><img src={editIcon} alt="Edit" /></button>
    };
    setMenus((prevMenus) => [...prevMenus, transformedNewItem]);
  };

  const updateItem = (updatedItem) => {
    setMenus((prevMenus) =>
      prevMenus.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
  };

  return (
    <div className="menu-items-page">
      <div className="menu-items-header">
        <button className="create-new-item-button" onClick={handleShowModal}>
          Create New Item
        </button>
      </div>
      { loading ? <p>Loading...</p> : 
      <TableWidget
        title="Menu Items"
        data={menus}
        columns={columns}
        itemsPerPage={15}
        maxItemsPerPage={30}
        setItems={updateItem}
      /> 
      }
      {showModal && (
        <AddMenuItem 
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          onItemAdded={handleItemAdded}
        />
      )}
      {showEditModal && selectedItem && (
        <EditItem 
          item={selectedItem}
          setItems={setMenus}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default MenuItems;
