import React, { useEffect, useState } from "react";
import Header from "./Header,Footer/Header";
import Footer from "./Header,Footer/Footer";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OrderList: React.FC = () => {
    const location = useLocation();
    const userId = location.state?.userId || sessionStorage.getItem("userId");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const header = {
        headers: {
            email: localStorage.getItem('email'),
            authToken: localStorage.getItem('authTokenUser')
        }
    }

    useEffect(() => {
        if (!userId) return;
        (async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_REACT_API_URL}getOrder`, { userId },header);
                if(res.data.message && res.data.message == "Unauthorized"){
                    alert("Login Required")
                }else{
                    setOrders(res.data.orders || []);
                }
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    return (
        <>
            <Header />
            <div className="w-full bg-[#FCFAF7] shadow-md border-b border-gray-200 p-8" style={{maxWidth: "900px", margin: "0 auto", marginTop: "72px"}}>
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair-display, sans-serif" }}>
                    My Orders
                </h2>
            </div>
            <div className="flex flex-col items-center min-h-[60vh] bg-white py-8">
                {loading ? (
                    <div className="text-lg text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-lg text-gray-500 mt-12">No orders found.</div>
                ) : (
                    orders.map((order, idx) => (
                        <div key={order._id || idx} className="w-full max-w-2xl bg-[#FCFAF7] rounded-lg shadow-md mb-8 p-6 border border-[#C8A165]">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="font-bold text-lg" style={{ fontFamily: "Playfair-display" }}>Order ID:</span>
                                    <span className="ml-2 text-base" style={{ fontFamily: "Lato" }}>{order.orderId}</span>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${order.status === "Delivered" ? "bg-green-200 text-green-800" : order.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-800"}`}>
                                    {order.status || "Pending"}
                                </span>
                            </div>
                            <div className="mb-2 text-sm text-gray-600" style={{ fontFamily: "Lato" }}>
                                <span>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</span>
                                <span className="ml-4">Total: ₹{order.totalAmount}</span>
                            </div>
                            <div className="mb-2 text-sm text-gray-600" style={{ fontFamily: "Lato" }}>
                                <span>Shipping Address: {order.shippingAddress?.name}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.postalCode}</span>
                            </div>
                            <div className="mb-2 text-sm text-gray-600" style={{ fontFamily: "Lato" }}>
                                <span>Track Id: {order.deliveryId}</span>
                            </div>
                            <div className="mt-4">
                                {order.products && order.products.length > 0 ? order.products.map((prod: any, pidx: number) => (
                                    <div key={prod.productId || pidx} className="flex mb-6 flex-col sm:flex-row items-center sm:items-start border-b pb-4 last:border-b-0 last:pb-0">
                                        <img
                                            src={prod.image || prod.images ? (typeof prod.images === "object" ? Object.values(prod.images)[0] : prod.images) : ""}
                                            alt={prod.name}
                                            className="object-cover"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                minWidth: "80px",
                                                minHeight: "80px",
                                                maxWidth: "140px",
                                                maxHeight: "180px",
                                                aspectRatio: "3/5",
                                                marginBottom: "1rem"
                                            }}
                                        />
                                        <div className="sm:ml-6 flex flex-col justify-between w-full">
                                            <div>
                                                <h2 className="text-lg font-bold text-[#000] mb-1" style={{ fontFamily: "Playfair-display" }}>
                                                    {prod.name}
                                                </h2>
                                                <div className="text-base text-gray-700 mb-2" style={{fontFamily : "Lato"}}>{prod.description}</div>
                                                <div className="text-base font-semibold mt-2" style={{fontFamily : "Lato"}}>₹{prod.price}</div>
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <div className="flex items-center">
                                                        <span className="text-sm mr-2" style={{ fontFamily: "Lato" }}>Color:</span>
                                                        <div
                                                            className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 ${
                                                                prod.colorSelected === "Green"
                                                                    ? "bg-green-500"
                                                                    : prod.colorSelected === "Red"
                                                                    ? "bg-red-500"
                                                                    : prod.colorSelected === "Pink"
                                                                    ? "bg-pink-500"
                                                                    : prod.colorSelected === "Blue"
                                                                    ? "bg-blue-500"
                                                                    : prod.colorSelected === "White"
                                                                    ? "bg-gray-100"
                                                                    : prod.colorSelected === "Yellow"
                                                                    ? "bg-yellow-500"
                                                                    : prod.colorSelected === "Orange"
                                                                    ? "bg-orange-500"
                                                                    : prod.colorSelected === "Purple"
                                                                    ? "bg-purple-500"
                                                                    : prod.colorSelected === "Brown"
                                                                    ? "bg-amber-700"
                                                                    : prod.colorSelected === "Grey"
                                                                    ? "bg-gray-500"
                                                                    : prod.colorSelected === "Navy"
                                                                    ? "bg-blue-900"
                                                                    : prod.colorSelected === "Teal"
                                                                    ? "bg-teal-500"
                                                                    : prod.colorSelected === "Maroon"
                                                                    ? "bg-red-900"
                                                                    : "bg-black"
                                                            }`}
                                                            style={{ outline: prod.colorSelected ? "2px solid #C8A165" : "none" }}
                                                        ></div>
                                                        <span className="ml-2 text-sm" style={{ fontFamily: "Lato" }}>
                                                            {prod.colorSelected}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm mr-2" style={{ fontFamily: "Lato" }}>Size:</span>
                                                        <div
                                                            className={`w-9 h-9 border rounded-lg flex items-center justify-center text-slate-700 cursor-pointer
                                                                ${prod.sizeSelected ? "font-semibold bg-slate-900 text-white" : ""}
                                                            `}
                                                            style={{
                                                                pointerEvents: "none"
                                                            }}
                                                        >
                                                            {(prod.sizeSelected || "-").toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm mr-2" style={{ fontFamily: "Lato" }}>Qty:</span>
                                                        <span className="text-base font-normal" style={{ fontFamily: "Playfair-display" }}>
                                                            {prod.quantity || 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-500 text-sm">No products in this order.</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderList;
