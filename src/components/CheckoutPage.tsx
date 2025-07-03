import React, { useState } from "react";
import Header from "./Header,Footer/Header";
import Footer from "./Header,Footer/Footer";
import { Navigate } from "react-router-dom";
import onepiecehodieimage from "../assets/Pictures/blueShirt.jpg";
import nomad from "../assets/Pictures/Green Shirt.jpg";

const cartItems = [
	{
		id: 1,
		name: "One Piece Hoodie",
		desc: "One piece text on the front and back with jolly roger",
		price: 0,
		image: onepiecehodieimage,
	},
	{
		id: 2,
		name: "Urban Nomad",
		desc: "Explore the streets in style with this sleek, minimalist design.",
		price: 1,
		image: nomad,
	},
];

const orderDetails = {
	cartTotal: 42,
	cartDiscount: -99,
	platformFee: 29,
	shippingFee: 29,
};

const CheckoutPage = () => {
	const [activeStep, setActiveStep] = useState<"cart" | "address" | "payment">("cart");
	const [cartQuantities, setCartQuantities] = useState<{ [id: number]: number }>(
		() => Object.fromEntries(cartItems.map(item => [item.id, 1]))
	);

	const handleQuantityChange = (id: number, delta: number) => {
		setCartQuantities(qty => ({
			...qty,
			[id]: Math.max(1, (qty[id] || 1) + delta)
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
		const options = {
			key: "rzp_test_6heE5AuL2imr7z", // Replace with your Razorpay key
			amount: (orderDetails.cartTotal +
				orderDetails.cartDiscount +
				orderDetails.platformFee +
				orderDetails.shippingFee) * 100, // in paise
			currency: "INR",
			name: "H CLOTHING",
			description: "Order Payment",
			handler: function (response: any) {
				alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
			},
			prefill: {
				name: "",
				email: "",
				contact: "",
			},
			theme: {
				color: "#7B3F14",
			},
		};
		// @ts-ignore
		const rzp = new window.Razorpay(options);
		rzp.open();
	};

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
    if (cartItems.length === 0) {
        return <Navigate to="/Home" />;
    }
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
							{/* Add Product + icon */}
                        <div className="flex justify-end mb-4">
                            <button
                                className="w-12 h-12 flex items-center justify-center bg-[#C8A165] text-white text-2xl font-bold shadow hover:bg-[#000] transition-colors"
                                title="Add new product"
                                // Add your add product logic here
                            >
                                +
                            </button>
                        </div>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex mb-8 flex-col sm:flex-row items-center sm:items-start">
                                        <img
                                            src={item.image}
                                            alt={item.name}
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
                                                    {item.name}
                                                </h2>
                                                <p className="text-base text-gray-700 mb-2" style={{fontFamily : "Montserrat-thin"}}>{item.desc}</p>
                                                <div className="text-lg font-semibold mt-2" style={{fontFamily : "Montserrat-thin"}}>₹{item.price}</div>
                                                {/* Quantity Counter and Remove X */}
                                                <div className="flex items-center gap-2 mt-4">
                                                    <button
                                                        type="button"
                                                        className="w-8 h-8 rounded bg-[#C8A165] text-white font-bold text-lg flex items-center justify-center"
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                    >-</button>
                                                    <span className="mx-2 text-lg font-normal" style={{ fontFamily: "Montserrat" }}>
                                                        {cartQuantities[item.id] || 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="w-8 h-8 rounded bg-[#C8A165] text-white font-bold text-lg flex items-center justify-center"
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                    >+</button>
                                                    {/* Remove button (X) */}
                                                    <button
                                                        className="ml-4 w-8 h-8 flex items-center justify-center group bg-[#F5E9DD] rounded-full border-2 border-[#C8A165] hover:bg-[#C8A165] transition-colors"
                                                        style={{ marginLeft: "1rem" }}
                                                        // Add your remove logic here
                                                    >
                                                        <span className="block w-4 h-4 relative">
                                                            <span className="absolute left-1/2 top-1/2 w-4 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors"></span>
                                                            <span className="absolute left-1/2 top-1/2 w-4 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-colors"></span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Name"
                                    />
                                    <div className="flex">
                                        <span className="flex items-center px-4 border border-[#C8A165] border-r-0 bg-[#FCFAF7] font-semibold" style={{ fontFamily: "Montserrat" }}>
                                            +91
                                        </span>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-[#C8A165] rounded-none border-l-0 focus:outline-none"
                                            style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Pin Code"
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="House / Flat No. / Office No."
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Area / Locality / Town"
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="State"
                                    />
                                    <input
                                        type="email"
                                        className="w-full p-3 border border-[#C8A165] rounded-none focus:outline-none"
                                        style={{ background: "#FCFAF7", fontFamily: "Montserrat" }}
                                        placeholder="Email"
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

