import React, { useState } from 'react';
import TableWidget from './TableWidget';
import '../assets/styles/Transactions.css';

const Transactions = () => {
  const [itemsPerPage, setItemsPerPage] = useState(14);

  const data = Array.from({ length: 110 }, (_, index) => ({
    transactionId: `#${index + 1}`,
    customerName: 'James Smith',
    date: 'May 13th, 2024',
    time: '9:15 AM',
    amount: '$12.29',
    paymentType: 'Credited',
    details: '...'
  }));

  const columns = [
    { header: 'Transaction ID', accessor: 'transactionId' },
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
        data={data}
        columns={columns}
        itemsPerPage={itemsPerPage}
        maxItemsPerPage={30}
      />
    </div>
  );
};

export default Transactions;
