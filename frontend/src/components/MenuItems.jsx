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
        const transformedData = response.data.data.map(item => ({
          ...item,
          carbsPrice: `$${item.carbsPrice}`,
          proteinsPrice: `$${item.proteinsPrice}`,
          baseFat: `${item.baseFat} gram(s)`,
          editItem: <Link to={`/menu-items/edit/${item._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>,
          itemPicture: item.image ? `data:image/${item.imageExtension};base64,${item.image}` : null
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
    { header: 'Item Name', accessor: 'itemName' },
    { header: '$/carbs', accessor: 'carbsPrice' },
    { header: 'Protein type', accessor: 'proteinType' },
    { header: '$/proteins', accessor: 'proteinsPrice' },
    { header: 'Base Fat', accessor: 'baseFat' },
    { header: 'Item Picture', accessor: 'itemPicture', Cell: ({ value }) => value ? <img src={value} alt="Item" width="100" height="100" /> : 'No Image' },
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
      carbsPrice: `$${newItem.carbsPrice}`,
      proteinsPrice: `$${newItem.proteinsPrice}`,
      baseFat: `${newItem.baseFat} gram(s)`,
      editItem: <Link to={`/menu-items/edit/${newItem._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>,
      itemPicture: newItem.itemPicture ? `/uploads/${newItem.itemPicture}` : null
    };
    setMenus((prevMenus) => [...prevMenus, transformedNewItem]);
  };

  const updateItem = (updatedItem) => {
    const transformedUpdatedItem = {
      ...updatedItem,
      carbsPrice: `$${updatedItem.carbsPrice}`,
      proteinsPrice: `$${updatedItem.proteinsPrice}`,
      baseFat: `${updatedItem.baseFat} gram(s)`,
      editItem: <Link to={`/menu-items/edit/${updatedItem._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>,
      itemPicture: updatedItem.itemPicture ? `/uploads/${updatedItem.itemPicture}` : null
    };
    setMenus((prevMenus) =>
      prevMenus.map((item) => (item._id === updatedItem._id ? transformedUpdatedItem : item))
    );
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
    </div>
  );
};

export default MenuItems;
