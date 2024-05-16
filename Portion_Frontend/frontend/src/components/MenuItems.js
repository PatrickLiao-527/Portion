import React, { useState } from 'react';
import TableWidget from './TableWidget';
import '../assets/styles/MenuItems.css';

const MenuItems = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const data = Array.from({ length: 30 }, (_, index) => ({
    itemId: `#${index + 1}`,
    itemName: 'Chicken Breast',
    carbsPrice: '$2.29',
    proteinsPrice: '$3.49',
    baseFat: '5g',
    itemPicture: require('../assets/icons/chickenBreast.png'),
    editItem: '...' 
  }));

  const columns = [
    { header: 'Item ID', accessor: 'itemId' },
    { header: 'Item Name', accessor: 'itemName' },
    { header: '$/carbs', accessor: 'carbsPrice' },
    { header: '$/proteins', accessor: 'proteinsPrice' },
    { header: 'Base Fat', accessor: 'baseFat' },
    { header: 'Item Picture', accessor: 'itemPicture' },
    { header: 'Edit Item', accessor: 'editItem' }
  ];

  return (
    <div className="menu-items-page">
      <TableWidget
        title="Menu Items"
        data={data}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
    </div>
  );
};

export default MenuItems;
