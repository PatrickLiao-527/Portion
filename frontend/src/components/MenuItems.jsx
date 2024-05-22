import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TableWidget from './TableWidget';
import mealImage from '../assets/icons/chickenBreast.png';
import editIcon from '../assets/icons/edit_icon.svg'; 
import '../assets/styles/MenuItems.css';

const MenuItems = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/menus')
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

  return (
    <div className="menu-items-page">
      {loading ? <p>Loading...</p> : 
      <TableWidget
        title="Menu Items"
        data={menus}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
      }
    </div>
  );
};

export default MenuItems;
