import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableWidget from './TableWidget';
import '../assets/styles/MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders', { withCredentials: true })
      .then((response) => {
        const dateConvertedData = response.data.data.map(order => ({
          ...order,
          // since date and time are calculated from js Date object which is unix time * 1000
          date: new Date(order.time).toLocaleDateString(), // Extracting date part from data.time
          time: new Date(order.time).toLocaleTimeString() // Extracting time part from data.time
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
          itemsPerPage={15}
          maxItemsPerPage={30}
        />            
      )}
    </div>
  );
};

export default MyOrders;
