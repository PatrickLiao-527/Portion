import React from 'react';
import '../assets/styles/OrderDetails.css';

const OrderDetails = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No order details found.</div>;
  }

  const order = data[0];

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <div className="order-info">
        <div className="info-item">
          <strong>Order ID:</strong> {order.orderId}
        </div>
        <div className="info-item">
          <strong>Customer Name:</strong> {order.customerName}
        </div>
        <div className="info-item">
          <strong>Date:</strong> {order.date}
        </div>
        <div className="info-item">
          <strong>Time:</strong> {order.time}
        </div>
        <div className="info-item">
          <strong>Amount:</strong> {order.amount}
        </div>
        <div className="info-item">
          <strong>Payment Type:</strong> {order.paymentType}
        </div>
        <div className="info-item">
          <strong>Status:</strong> {order.status}
        </div>
      </div>
      <div className="meal-info">
        <img src={order.mealImage} alt="Meal Item" className="meal-image" />
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
