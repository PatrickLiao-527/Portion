import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableWidget from './TableWidget';
import '../assets/styles/MyOrders.css';

const MyOrders = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders')
      .then((response) => {
        const dateConvertedData = response.data.data.map(order => ({
          ...order,
          date: new Date(order.time).toLocaleDateString(), // Extracting date part
          time: new Date(order.time).toLocaleTimeString() // Extracting time part
        }));
        setOrders(dateConvertedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
  }, [])

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Customer Name', accessor: 'customerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Payment Type', accessor: 'paymentType' },
    { header: 'Status', accessor: 'status' },
    { header: 'Details', accessor: 'details' }
  ];

  return (
    <div className="my-orders-page">
      {loading ? (<p>loading...</p>) : (
        <TableWidget
          title="New Orders"
          data={orders}
          columns={columns}
          itemsPerPage={itemsPerPage}
          maxItemsPerPage={30}
        />            
      )}
    </div>
  );
};

export default MyOrders;
