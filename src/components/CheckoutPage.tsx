import React, { useState, useEffect } from "react";
import Header from "./Header,Footer/Header";
import Footer from "./Header,Footer/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";

const CheckoutPage = () => {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState<"cart" | "address" | "payment">("cart");
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [cartProducts, setCartProducts] = useState<any[]>([]);
	const [cartQuantities, setCartQuantities] = useState<{ [id: string]: number }>({});
	const [cartColor, setCartColor] = useState<{ [id: string]: string }>({});
	const [cartSize, setCartSize] = useState<{ [id: string]: string }>({});
	const [orderDetails, setOrderDetails] = useState({
		cartTotal: 0,
		cartDiscount: 0,
		platformFee: 29,
		shippingFee: 29,
	});
	const [shippingAddress, setShippingAddress] = useState({
		name: "",
		phonenumber: "",
		postalcode: "",
		house: "",
		area: "",
		city: "",
		state: "",
		email: "",
	});

	// Fetch cart data from backend
	useEffect(() => {
		const userId = sessionStorage.getItem("userId");
		if (!userId) {
			window.location.replace("/CustomerLogin");
			return;
		}
		// Use an async IIFE for async/await inside useEffect
		(async () => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_REACT_API_URL}getCart`, { userId });
				const cartArr = res.data.cart.products;
				console.log("Cart items:", cartArr);
				setCartItems(cartArr);

				// Fetch product details for each cart item using productId
				const productDetails: any[] = [];
				for (const item of cartArr) {
					try {
						const prodRes = await axios.post(
							`${import.meta.env.VITE_REACT_API_URL}getProduct`,
							{ product_id: item.productId }
						);
						if (
							prodRes.data.status === true &&
							Array.isArray(prodRes.data.product) &&
							prodRes.data.product.length > 0
						) {
							productDetails.push({
								...prodRes.data.product[0],
								cartQuantity: item.quantity || 1,
								cartColor: item.colorSelected || "",
								cartSize: item.sizeSelected || "",
								cartId: item._id,
							});
						}
					} catch {
						// skip on error
					}
				}
				console.log("Product details:", productDetails);
				setCartProducts(productDetails);

				const qtyObj: { [id: string]: number } = {};
				const colorObj: { [id: string]: string } = {};
				const sizeObj: { [id: string]: string } = {};
				let total = 0;
				productDetails.forEach((prod: any) => {
					qtyObj[prod.cartId] = prod.cartQuantity;
					colorObj[prod.cartId] = prod.cartColor || "";
					sizeObj[prod.cartId] = prod.cartSize || "";
					total += (Number(prod.price) || 0) * (prod.cartQuantity || 1);
				});
				setCartQuantities(qtyObj);
				setCartColor(colorObj);
				setCartSize(sizeObj);
				console.log("Cart quantities:", qtyObj);
				console.log("Cart coloe:", colorObj);
				console.log("Cart size:", sizeObj);
				setOrderDetails(od => ({
					...od,
					cartTotal: total,
					cartDiscount: res.data.cartDiscount || 0,
				}));
			} catch {
				setCartItems([]);
				setCartProducts([]);
			}
		})();
	}, []);

	const handleQuantityChange = (cartId: string, delta: number) => {
		setCartQuantities(qty => {
			const newQty = Math.max(1, (qty[cartId] || 1) + delta);
			const updated = { ...qty, [cartId]: newQty };
			// Optionally update backend here
			return updated;
		});
	};

	// Update shipping address state from form
	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setShippingAddress(addr => ({
			...addr,
			[name]: value,
		}));
	};

	// Razorpay handler
	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	};

	const handleRazorpayPayment = async () => {
		const res = await loadRazorpayScript();
		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}
		const userId = sessionStorage.getItem("userId");
		const totalAmount =
			orderDetails.cartTotal +
			orderDetails.cartDiscount +
			orderDetails.platformFee +
			orderDetails.shippingFee;
		const products = cartProducts.map((prod: any) => ({
			productId: prod._id,
			quantity: prod.cartQuantity,
			colorSelected: prod.cartColor,
			sizeSelected: prod.cartSize,
		}));
		const orderDate = new Date().toISOString();

		const shippingAddr = {
			name: shippingAddress.name,
			phonenumber: shippingAddress.phonenumber,
			email: shippingAddress.email,
			street: [shippingAddress.house, shippingAddress.area].filter(Boolean).join(", "),
			city: shippingAddress.city,
			state: shippingAddress.state,
			postalCode: shippingAddress.postalcode
		};

		const options = {
			key: "rzp_test_6heE5AuL2imr7z", // Replace with your Razorpay key
			amount: totalAmount * 100, // in paise
			currency: "INR",
			name: "H CLOTHING",
			description: "Order Payment",
			handler: async function (response: any) {
				if (response.razorpay_payment_id) {
					try {
						await axios.post(`${import.meta.env.VITE_REACT_API_URL}createOrder`, {
							userId,
							products,
							totalAmount,
							orderDate,
							shippingAddress: shippingAddr,
							paymentId: response.razorpay_payment_id,
						});
						alert("Order placed successfully!");
						navigate("/Home");
					} catch {
						alert("Order creation failed.");
					}
				}
			},
			prefill: {
				name: shippingAddress.name,
				email: shippingAddress.email,
				contact: shippingAddress.phonenumber,
			},
			theme: {
				color: "#7B3F14",
			},
		};
		// @ts-ignore
		const rzp = new window.Razorpay(options);
		rzp.open();
	};

	const sendingProdData = (productID : any) => {
        localStorage.setItem('current_product', productID);
        navigate('/ProductCard');
    }

    const handleStepChange = (step: "cart" | "address" | "payment") => {
        if (step === "cart") {
            setActiveStep("cart");
        } else if (step === "address") {   
            if (cartItems.length === 0) {
                alert("Please add items to the cart before proceeding to address.");
                return;
            }
            setActiveStep("address");
        }
        else if (step === "payment") {
            if (activeStep !== "address") {
                alert("Please complete the address step before proceeding to payment.");
                return;
            }
            setActiveStep("payment");
        }
    }
    if (!cartProducts) {
        // While loading, don't redirect
        return null;
    }
	// Remove product from cart by cartId
	const handleRemoveFromCart = async (cartId: string) => {
		const userId = sessionStorage.getItem("userId");
		if (!userId) return; 	
		try {
			await axios.post(`${import.meta.env.VITE_REACT_API_URL}removeFromCart`, {
				userId,
				cartId,
			});
			setCartProducts(products => products.filter((p: any) => p.cartId !== cartId));
			setCartItems(items => items.filter((item: any) => item._id !== cartId));
			setCartQuantities(qty => {
				const updated = { ...qty };
				delete updated[cartId];
				return updated;
			});
			setCartColor(color => {
				const updated = { ...color };
				delete updated[cartId];
				return updated;
			});
			setCartSize(size => {
				const updated = { ...size };
				delete updated[cartId];
				return updated;
			});
		} catch {
			alert("Failed to remove product from cart.");
		}
	};

	const handleClearCart = async () => {
		const userId = sessionStorage.getItem("userId");
		if (!userId || !cartItems.length) return;
		const cartId = cartItems[0]?.cartId || cartItems[0]?._id || cartItems[0]?.cart_id || cartItems[0]?.cartid || cartItems[0]?.id;
		try {
			await axios.post(`${import.meta.env.VITE_REACT_API_URL}deleteCart`, { cartId });
			setCartProducts([]);
			setCartItems([]);
			setCartQuantities({});
			setCartColor({});
			setCartSize({});
			alert("Cart deleted");
		} catch {
			alert("Failed to delete cart.");
		}
	};

    // Only redirect if cartProducts is an array and is empty after data is loaded
    // if (Array.isArray(cartProducts) && cartProducts.length === 0) {
    //     return <Navigate to="/Home" />;
    // }

	return (
		<>
			<style>
				{`
				.checkout-stepper {
					display: flex;
					justify-content: center;
					gap: 1.5rem;
					background: #fff;
					z-index: 20;
					padding: 1.5rem 0 1rem 0;
					margin-top: 72px;
				}
				.checkout-stepper span {
					font-family: Montserrat, sans-serif;
					font-size: 1.25rem;
					font-weight: bold;
					letter-spacing: 0.03em;
					cursor: pointer;
				}
				.checkout-stepper .active {
					color: #7B3F14;
					border-bottom: 2px solid #7B3F14;
					padding-bottom: 0.25rem;
				}
				.checkout-main {
					display: flex;
					flex-direction: row;
					min-height: 100vh;
					background: #fff;
					padding-bottom: 300px;
				}
				.checkout-left {
					flex: 1;
					display: flex;
					justify-content: center;
					padding-top: 7rem;
					padding-bottom: 2rem;
				}
				.checkout-content {
					width: 100%;
					max-width: 32rem;
					padding: 1rem;
					margin: 0 auto;
				}
				.checkout-right {
					position: absolute;
					right: 0;
					top: 0;
					height: 100%;
					width: 420px;
					background: #FCFAF7;
					box-shadow: 0 0 8px rgba(0,0,0,0.07);
					border-left: 1px solid #e5e7eb;
					padding: 2rem;
					z-index: 10;
					top: 72px;
					height: calc(100vh - 72px - 250px);
				}
				@media (max-width: 1024px) {
					.checkout-right {
						width: 320px !important;
						padding: 1.5rem !important;
					}
				}
				@media (max-width: 900px) {
					.checkout-main {
						flex-direction: column;
					}
					.checkout-right {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 1rem !important;
					}
					.checkout-left {
						padding-top: 2rem !important;
					}
				}
				@media (max-width: 768px) {
					.checkout-main {
						flex-direction: column;
					}
					.checkout-right {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 1rem !important;
					}
					.checkout-left {
						padding-top: 1rem !important;
					}
					.checkout-content {
						max-width: 100vw !important;
					}
				}
				@media (max-width: 600px) {
					.checkout-right {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 0.5rem !important;
					}
					.checkout-left {
						padding-top: 0.5rem !important;
					}
					.checkout-content {
						max-width: 100vw !important;
					}
				}
				@media (max-width: 400px) {
					.checkout-right {
						width: 100vw !important;
						padding: 0.1rem !important;
					}
					.checkout-content {
						padding: 0.25rem !important;
					}
				}
				`}
			</style>
			<Header />
			<div className="checkout-stepper">
                <span
                    className={activeStep === "cart" ? "active" : ""}
                    onClick={() => setActiveStep("cart")}
                >
                    CART
                </span>
                <span
                    className={activeStep === "address" ? "active" : ""}
                    onClick={() => setActiveStep("address")}
                >
                    ADDRESS
                </span>
                <span
                    className={activeStep === "payment" ? "active" : ""}
                    onClick={() => setActiveStep("payment")}
                >
                    PAYMENT
                </span>
            </div>
            {/* Order Details section below navigation */}
            <div className="w-full bg-[#FCFAF7] shadow-md border-b border-gray-200 p-8" style={{maxWidth: "900px", margin: "0 auto"}}>
                <h2
                    className="text-3xl font-bold mb-6"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    Order Details
                </h2>
                <div className="text-lg mb-4 flex justify-between" style={{ fontFamily: "Montserrat-Thin" }}>
                    <span>Cart total</span>
                    <span>{orderDetails.cartTotal}</span>
                </div>
                <div className="text-lg mb-4 flex justify-between" style={{ fontFamily: "Montserrat-Thin" }}>
                    <span>Cart discount</span>
                    <span>{orderDetails.cartDiscount}</span>
                </div>
                <div className="mb-4" style={{ fontFamily: "Montserrat-Thin" }}>
                    <div className="text-lg" style={{ fontFamily: "Montserrat" }}>Convenience Fees</div>
                    <div className="flex justify-between text-base ml-4 mt-1">
                        <span>Platform Fee</span>
                        <span>{orderDetails.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-base ml-4">
                        <span>Shipping Fee</span>
                        <span>{orderDetails.shippingFee}</span>
                    </div>
                </div>
                <hr className="my-4 border-[#C8A165]" />
                <div className="flex justify-between items-center text-2xl font-bold mb-6">
                    <span style={{fontFamily:"Montserrat"}}>Order Total</span>
                    <span>
                        {orderDetails.cartTotal +
                            orderDetails.cartDiscount +
                            orderDetails.platformFee +
                            orderDetails.shippingFee}
                    </span>
                </div>
            </div>
            <div className="checkout-main">
                {/* Left: Cart Items or Product Details */}
                <div className="checkout-left">
                    <div className="checkout-content">
                        {activeStep === "cart" && (
                            <>
							{(!cartProducts || cartProducts.length === 0) ? (
								<div className="flex flex-col items-center justify-center min-h-[300px]">
									<button
										className="w-16 h-16 flex items-center justify-center bg-[#C8A165] text-white text-4xl font-bold shadow hover:bg-[#000] transition-colors rounded-full"
										title="Add new product"
										onClick={() => navigate("/Home")}
									>
										+
									</button>
									<span className="mt-4 text-xl text-gray-500 font-semibold" style={{ fontFamily: "Montserrat-Thin" }}>
										CART IS EMPTY
									</span>
								</div>
							) : (
								<>
								<div className="flex justify-end mb-4">
									<button
										className="w-12 h-12 flex items-center justify-center bg-[#C8A165] text-white text-2xl font-bold shadow hover:bg-[#000] transition-colors"
										title="Add new product"
										onClick={() => navigate("/Home")}
									>
										+
									</button>
								</div>
								{cartProducts.map((prod: any, idx: number) => (
									<div
										key={prod.cartId}
										className="flex mb-8 flex-col sm:flex-row items-center sm:items-start relative cursor-pointer"
										onClick={() => sendingProdData(prod._id)}
										style={{ transition: "box-shadow 0.2s" }}
									>
										<img
											src={prod.images ? Object.values(prod.images)[0] : ""}
											alt={prod.name}
											className="object-cover"
											style={{
												width: "300px",
												height: "260px",
												minWidth: "120px",
												minHeight: "180px",
												maxWidth: "180px",
												maxHeight: "320px",
												aspectRatio: "3/5",
												marginBottom: "1rem"
											}}
										/>
										<div className="sm:ml-6 flex flex-col justify-between w-full">
											<div>
												<h2 className="text-xl font-bold text-[#000] mb-1" style={{ fontFamily: "Montserrat" }}>
													{prod.name}
												</h2>
												<p className="text-base text-gray-700 mb-2" style={{fontFamily : "Montserrat-thin"}}>{prod.description}</p>
												<div className="text-lg font-semibold mt-2" style={{fontFamily : "Montserrat-thin"}}>₹{prod.price}</div>
												{/* Color, Size, Quantity and Remove X button on consecutive lines */}
												<div className="flex flex-col gap-2 mt-2">
													<div className="flex items-center">
														<div
															className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-2 ${
																cartItems[idx]?.selectedColor ? "border-[#fff]" : "border-transparent"
															} ${
																cartItems[idx]?.selectedColor === "Green"
																	? "bg-green-500"
																	: cartItems[idx]?.selectedColor === "Red"
																	? "bg-red-500"
																	: cartItems[idx]?.selectedColor === "Pink"
																	? "bg-pink-500"
																	: cartItems[idx]?.selectedColor === "Blue"
																	? "bg-blue-500"
																	: cartItems[idx]?.selectedColor === "White"
																	? "bg-gray-100"
																	: cartItems[idx]?.selectedColor === "Yellow"
																	? "bg-yellow-500"
																	: cartItems[idx]?.selectedColor === "Orange"
																	? "bg-orange-500"
																	: cartItems[idx]?.selectedColor === "Purple"
																	? "bg-purple-500"
																	: cartItems[idx]?.selectedColor === "Brown"
																	? "bg-amber-700"
																	: cartItems[idx]?.selectedColor === "Grey"
																	? "bg-gray-500"
																	: cartItems[idx]?.selectedColor === "Navy"
																	? "bg-blue-900"
																	: cartItems[idx]?.selectedColor === "Teal"
																	? "bg-teal-500"
																	: cartItems[idx]?.selectedColor === "Maroon"
																	? "bg-red-900"
																	: "bg-black"
															}`}
															style={{ outline: prod.color ? "2px solid #C8A165" : "none" }}
														></div>
														<span className="ml-2 text-sm" style={{ fontFamily: "Montserrat-Thin" }}>
															{cartItems[idx]?.selectedColor || prod.color}
														</span>
													</div>
													<div className="flex items-center">
														<span className="text-sm mr-2" style={{ fontFamily: "Montserrat-Thin" }}>Size:</span>
														<div
															className={`w-9 h-9 border rounded-lg flex items-center justify-center text-slate-700 cursor-pointer
																${cartSize[prod.cartId] ? "font-semibold bg-slate-900 text-white" : ""}
															`}
															style={{
																pointerEvents: "none"
															}}
														>
															{(cartSize[prod.cartId] || prod.size || "-").toUpperCase()}
														</div>
													</div>
													<div className="flex items-center">
														<span className="text-sm mr-2" style={{ fontFamily: "Montserrat-Thin" }}>Qty:</span>
														<div className="flex items-center">
															<button
																type="button"
																className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#C8A165] text-white font-bold text-base"
																style={{ fontFamily: "Montserrat" }}
																onClick={() => handleQuantityChange(prod.cartId, -1)}
															>-</button>
															<span className="mx-2 text-base font-normal" style={{ fontFamily: "Montserrat" }}>
																{cartQuantities[prod.cartId] || 1}
															</span>
															<button
																type="button"
																className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#C8A165] text-white font-bold text-base"
																style={{ fontFamily: "Montserrat" }}
																onClick={() => handleQuantityChange(prod.cartId, 1)}
															>+</button>
														</div>
													</div>
												</div>
											</div>
											{/* X mark at right bottom corner */}
											<button
												className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center group bg-[#F5E9DD] rounded-full border-2 border-[#C8A165] hover:bg-[#C8A165] transition-colors"
												onClick={e => {
													e.stopPropagation();
													handleRemoveFromCart(prod.cartId);
												}}
											>
												<span className="block w-4 h-4 relative">
													<span className="absolute left-1/2 top-1/2 w-4 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors"></span>
													<span className="absolute left-1/2 top-1/2 w-4 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-colors"></span>
												</span>
											</button>
										</div>
									</div>
								))}
								</>
							)}
							<button
								className="w-full bg-[#7B3F14] text-white text-base font-semibold py-3 rounded mt-2 hover:bg-black"
								onClick={() => handleStepChange("address")} style={{ fontFamily: "Montserrat" }}
							>
								PROCEED TO SHIPPING
							</button>
                            </>
                        )}
                        {activeStep === "address" && (
                            <form className="bg-[#FCFAF7] p-6 rounded shadow" style={{ border: "1px solid #C8A165" }}>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Name"
                                        value={shippingAddress.name}
                                        onChange={handleAddressChange}
                                    />
                                    <div className="flex">
                                        <span className="flex items-center px-4 border border-[#C8A165] border-r-0 bg-[#FCFAF7] font-semibold" style={{ fontFamily: "Montserrat" }}>
                                            +91
                                        </span>
                                        <input
                                            type="text"
                                            name="phonenumber"
                                            className="w-full p-3 border border-[#C8A165] rounded-none border-l-0 focus:outline-none"
                                            style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                            placeholder="Phone Number"
                                            value={shippingAddress.phonenumber}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="postalcode"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Pin Code"
                                        value={shippingAddress.postalcode}
                                        onChange={handleAddressChange}
                                    />
                                    <input
                                        type="text"
                                        name="house"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="House / Flat No. / Office No."
                                        value={shippingAddress.house}
                                        onChange={handleAddressChange}
                                    />
                                    <input
                                        type="text"
                                        name="area"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Area / Locality / Town"
                                        value={shippingAddress.area}
                                        onChange={handleAddressChange}
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleAddressChange}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Email"
                                        value={shippingAddress.email}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <button
                                    className="w-full bg-[#7B3F14] text-white text-base font-semibold py-3 rounded mt-6 hover:bg-black"
                                    type="button"
                                    onClick={() => handleStepChange("payment")}
									style={{ fontFamily: "Montserrat" }}
                                >
                                    PROCEED TO PAYMENT
                                </button>
                            </form>
                        )}
                        {activeStep === "payment" && (
                            <div className="flex flex-col items-center justify-center h-full text-2xl text-gray-400" style={{ minHeight: "300px" }}>
                                <div className="mb-6 text-black text-xl font-semibold" style={{fontFamily : "Avenir"}}>Pay securely with Razorpay</div>
                                <button
                                    type="button"
                                    className="bg-[#7B3F14] text-white px-8 py-3 rounded font-bold text-lg hover:bg-black transition-colors"
                                    onClick={handleRazorpayPayment}
									style={{ fontFamily: "Montserrat" }}
                                >
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Remove the checkout-right section from here */}
            </div>
			<Footer />
		</>
	);
};

export default CheckoutPage;