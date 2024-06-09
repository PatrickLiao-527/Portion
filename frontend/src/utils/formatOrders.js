export const formatOrders = (orders) => {
    return orders.map(order => ({
      ...order,
      orderId: `#${order._id}`,
      customerName: order.customerName,
      date: new Date(order.time).toLocaleDateString(), // Correctly format the date
      time: new Date(order.time).toLocaleTimeString(), // Correctly format the time
      amount: parseFloat(order.amount).toFixed(2), // Ensure amount is correctly formatted with dollar sign
      paymentType: order.paymentType,
      status: order.status,
      details: order.details, // Include details for better clarity
      mealName: order.mealName,
      carbs: order.carbs,
      proteins: order.proteins,
      fats: order.fats 
    }));
  };
  