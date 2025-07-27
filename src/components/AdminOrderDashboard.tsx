import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_API_URL}getAllOrders`);
      if(res.data.message && res.data.message == "Unauthorized"){
          localStorage.setItem('AdminLogin','false')
          localStorage.setItem('username',"")
          localStorage.setItem('authToken',"")
          navigate("/AdminLogin")
      }
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
        const resUsers = await axios.get(`${import.meta.env.VITE_REACT_API_URL}getAllUsers`);
        const resProducts = await axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
        if(resUsers.data.message && res.data.message == "Unauthorized")
        {
          localStorage.setItem('AdminLogin','false')
          localStorage.setItem('username',"")
          localStorage.setItem('authToken',"")
          navigate("/AdminLogin")
        }
        else{
          setUsers(resUsers.data.users);
          setProducts(resProducts.data.products)
        }
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

  const navigate = useNavigate()

  useEffect(() => {
    
    if(localStorage.getItem('AdminLogin') === 'true'){
        fetchOrders();
    }
    else{
        navigate('/AdminLogin')
    }
        
  }, []);



  const updateDeliveryId = async ({ orderId, deliveryId }) => {
    await axios.post(`${import.meta.env.VITE_REACT_API_URL}updateDeliveryId`, {
      orderId,
      deliveryId,
    })
    .then(res => {
      if(res.data.message && res.data.message == "Unauthorized"){
        alert("Login Required")
      }
      else{
        alert("Shipment ID updated successfully");
      }
      
    })
    .catch(err => {
        console.log(err)
    })
};


const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
  // const newStatus = prompt("Update order status:", currentStatus);
  // if (!newStatus || newStatus === currentStatus) return;

  try {
    await axios.post(`${import.meta.env.VITE_REACT_API_URL}updateOrderStatus`, {
      orderId,
      status: currentStatus
    })
    .then(res => {
      if(res.data.message && res.data.message == "Unauthorized"){
        alert("Login Required")
      }
      else{
        alert("Status updated successfully!");
        fetchOrders();
      }
      
    })
    .catch(err => {
        console.log(err)
    })

    

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
                    <tr
                      key={index}
                      className={
                        order.status === "Pending"
                          ? "bg-orange-100"
                          : order.status === "Delivered"
                          ? "bg-green-100"
                          : ["Accepted", "Shipped"].includes(order.status)
                          ? "bg-gray-100"
                          : ""
                      }
                    >
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2"><span>{users.find(user => user._id === order.userId)?.name || "Unknown User"} | </span><span>{users.find(user => user._id === order.userId)?.username || "Unknown User"}</span></td>
                  <td className="px-4 py-2">
                    {order.products.map((p, i) => (
                      <div key={i} className="mb-1">
                        <strong>Name:</strong> {products.find(prod => prod._id === p.productId)?.name } <br/>
                        <strong>Qty:</strong> {p.quantity} <br/>
                        <strong>Color:</strong> {p.colorSelected} <br/>
                        <strong>Size:</strong> {p.sizeSelected}
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
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={order.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;

                      if (newStatus === "Shipped") {
                        const deliveryId = prompt("Enter Shipment/Delivery ID:");
                        if (!deliveryId) return;

                        try {
                          await updateDeliveryId({
                            orderId: order.orderId,
                            deliveryId: deliveryId.trim(),
                          });
                          await handleStatusUpdate(order.orderId, newStatus); // Update status after successful deliveryId update
                        } catch (error) {
                          console.error("Failed to update delivery ID:", error);
                          alert("Failed to update delivery ID");
                        }
                      } else {
                        await handleStatusUpdate(order.orderId, newStatus);
                      }
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
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
