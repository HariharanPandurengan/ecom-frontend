import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_API_URL}getAllOrders`);
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        console.error("No orders found in response");
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
  const newStatus = prompt("Update order status:", currentStatus);
  if (!newStatus || newStatus === currentStatus) return;

  try {
    await axios.post(`${import.meta.env.VITE_REACT_API_URL}updateOrderStatus`, {
      orderId,
      status: newStatus
    });

    alert("Status updated successfully!");

    // Only update quantities if transitioning from 'Pending' to 'Accepted'
    // if (currentStatus === "Pending" && newStatus === "Accepted") {
    //   const order = orders.find(o => o.orderId === orderId);
    //   if (order) {
    //     // Ensure order.products contains sizeSelected and colorSelected
    //     await axios.post(`${import.meta.env.VITE_REACT_API_URL}updateQuantityforProduct`, {
    //       products: order.products
    //     });
    //     alert("Product quantities updated successfully!");
    //   } else {
    //     console.error("Order not found for updating product quantities");
    //     alert("Order not found for updating product quantities.");
    //   }
    // }

    fetchOrders(); // Refresh the list
  } catch (error) {
    console.error("Failed to update order status:", error);
    alert("Failed to update status.");
  }
};


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Orders Dashboard</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Products</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Shipping Address</th>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Order Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.userId}</td>
                  <td className="px-4 py-2">
                    {order.products.map((p, i) => (
                      <div key={i} className="mb-1">
                        <strong>ID:</strong> {p.productId}, <strong>Qty:</strong> {p.quantity}, <strong>Color:</strong> {p.colorSelected}, <strong>Size:</strong> {p.sizeSelected}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</div>
                    <div>📞 {order.shippingAddress.phonenumber}</div>
                    <div>✉️ {order.shippingAddress.email}</div>
                  </td>
                  <td className="px-4 py-2">{order.paymentId || "N/A"}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatusUpdate(order.orderId, order.status)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersDashboard;
