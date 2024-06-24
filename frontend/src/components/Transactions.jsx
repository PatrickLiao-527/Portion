import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableWidget from './TableWidget';
import '../assets/styles/Transactions.css';

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://portion.food/api/transactions', { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data)) {
          const transformedData = response.data.map(item => ({
            ...item,
            // since date and time are calculated from js Date object which is unix time * 1000
            date: new Date(item.time).toLocaleDateString(), // Extracting date part from data.time
            time: new Date(item.time).toLocaleTimeString() // Extracting time part from data.time
          }));
          setTransactions(transformedData);
        } else {
          console.error('Unexpected response structure:', response.data);
          setError('Unexpected response structure');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError('Failed to load transactions');
        setLoading(false);
      });
  }, []);

  const columns = [
    { header: 'Transaction ID', accessor: '_id' },
    { header: 'Customer Name', accessor: 'customerName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Payment Type', accessor: 'paymentType' },
    { header: 'Details', accessor: 'details' }
  ];

  return (
    <div className="transactions-page">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableWidget
          title="Transactions"
          data={transactions}
          columns={columns}
          itemsPerPage={15}
          maxItemsPerPage={30}
        />
      )}
    </div>
  );
};

export default Transactions;
