import React from 'react';
import '../assets/styles/OrderDetails.css';

const OrderDetails = ({ data }) => {
  //console.log('OrderDetails component - Received data:', data);
  if (!data || data.length === 0) {
    return <div>No order details found.</div>;
  }

  const order = data[0];

  // Log raw data and type for date and time fields
  // console.log('Raw date data:', order.date);
  // console.log('Type of date data:', typeof order.date);
  // console.log('Raw time data:', order.time);
  // console.log('Type of time data:', typeof order.time);

  // Function to parse the details string
  const parseDetails = (details) => {
    const notesMatch = details.match(/Additional notes from customer: (.*), Desired pickup time:/);
    const pickupTimeMatch = details.match(/Desired pickup time: (.*)/);

    const notes = notesMatch ? notesMatch[1] : '';
    const pickupTime = pickupTimeMatch ? pickupTimeMatch[1] : '';

    return { notes, pickupTime };
  };

  const { notes, pickupTime } = parseDetails(order.details || '');

  // Combine date and time strings to create a proper Date object
  const combinedDateTime = new Date(`${order.date} ${order.time}`);
  const date = combinedDateTime.toLocaleDateString();
  const time = combinedDateTime.toLocaleTimeString();

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <div className="order-info">
        <div className="info-item">
          <strong>Customer Name:</strong> {order.customerName}
        </div>
        <div className="info-item">
          <strong>Date:</strong> {date}
        </div>
        <div className="info-item">
          <strong>Time:</strong> {time}
        </div>
        <div className="info-item">
          <strong>Amount:</strong> ${parseFloat(order.amount).toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Payment Type:</strong> {order.paymentType}
        </div>
        <div className="info-item">
          <strong>Status:</strong> {order.status}
        </div>
        <div className="info-item">
          <strong>Pickup Time:</strong> {pickupTime}
        </div>
        <div className="info-item">
          <strong>Additional Notes:</strong> {notes}
        </div>
      </div>
      <div className="meal-info">
        {order.mealImage && (
          <img src={order.mealImage} alt="Meal Item" className="meal-image" />
        )}
        <div className="meal-details">
          <div className="meal-name">
            <strong>Meal Name:</strong> {order.mealName}
          </div>
          <div className="nutrition-info">
            <div>
              <strong>Carbs:</strong> {order.carbs}g
            </div>
            <div>
              <strong>Proteins:</strong> {order.proteins}g
            </div>
            <div>
              <strong>Fats:</strong> {order.fats}g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
