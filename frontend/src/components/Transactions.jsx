import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableWidget from './TableWidget';
import '../assets/styles/Transactions.css';

const Transactions = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [transcations, setTranscations] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/transcations')
      .then((response) => {
        const transformedData = response.data.data.map(item => ({
          ...item,
          // since date and time are calculated from js Date object which is unix time * 1000
          date: new Date(item.time).toLocaleDateString(), // Extracting date part from data.time
          time: new Date(item.time).toLocaleTimeString() // Extracting time part from data.time
        }));
        setTranscations(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
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
      <TableWidget
        title="Transactions"
        data={transcations}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
    </div>
  );
};

export default Transactions;
