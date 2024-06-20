import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TableWidget from './TableWidget';
import AddMenuItem from './AddMenuItem';
import editIcon from '../assets/icons/edit_icon.svg';
import '../assets/styles/MenuItems.css';
import { WebSocketContext } from '../contexts/WebSocketContext'; 

const MenuItems = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { notifications } = useContext(WebSocketContext); // Access WebSocket notifications

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/menus', { withCredentials: true })
      .then((response) => {
        const transformedData = response.data.data.map(item => transformItem(item));
        setMenus(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      switch (latestNotification.type) {
        case 'ITEM_ADDED':
          setMenus((prevMenus) => {
            const exists = prevMenus.some(item => item._id === latestNotification.item._id);
            if (!exists) {
              return [...prevMenus, transformItem(latestNotification.item)];
            }
            return prevMenus;
          });
          break;
        case 'ITEM_UPDATED':
          setMenus((prevMenus) => prevMenus.map((item) =>
            item._id === latestNotification.item._id ? transformItem(latestNotification.item) : item
          ));
          break;
        case 'ITEM_DELETED':
          setMenus((prevMenus) => prevMenus.filter((item) => item._id !== latestNotification.itemId));
          break;
        default:
          break;
      }
    }
  }, [notifications]);

  const transformItem = (item) => ({
    ...item,
    carbsPrice: `$${item.carbsPrice}`,
    proteinsPrice: `$${item.proteinsPrice}`,
    baseFat: `${item.baseFat} gram(s)`,
    editItem: <Link to={`/menu-items/edit/${item._id}`} className="edit-link"><img src={editIcon} alt="Edit" /></Link>,
    itemPicture: item.image ? `data:image/${item.imageExtension};base64,${item.image}` : null
  });

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
    const transformedNewItem = transformItem(newItem);
    setMenus((prevMenus) => {
      const exists = prevMenus.some(item => item._id === newItem._id);
      if (!exists) {
        return [...prevMenus, transformedNewItem];
      }
      return prevMenus;
    });
  };

  const updateItem = (updatedItem) => {
    const transformedUpdatedItem = transformItem(updatedItem);
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
