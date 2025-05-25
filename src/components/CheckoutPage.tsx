import React, { useState } from "react";
import Header from "./Header,Footer/Header";
import Footer from "./Header,Footer/Footer";
import { Navigate } from "react-router-dom";

const cartItems = [
	{
		id: 1,
		name: "One Piece Hoodie",
		desc: "One piece text on the front and back with jolly roger",
		price: 499,
		image: "/assets/onepiece-hoodie.jpg",
	},
	{
		id: 2,
		name: "Urban Nomad",
		desc: "Explore the streets in style with this sleek, minimalist design.",
		price: 399,
		image: "/assets/urban-nomad.jpg",
	},
];

const orderDetails = {
	cartTotal: 1500,
	cartDiscount: -99,
	platformFee: 29,
	shippingFee: 29,
};

const CheckoutPage = () => {
	const [activeStep, setActiveStep] = useState<"cart" | "address" | "payment">("cart");

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
				button:hover, .hover\\:bg-black:hover {
					background-color: #000 !important;
					color: #fff !important;
				}
				@media (max-width: 1024px) {
					.fixed.right-0, .absolute.right-0 {
						width: 320px !important;
						padding: 1.5rem !important;
					}
					[class*="right-[420px]"] {
						right: 320px !important;
					}
				}
				@media (max-width: 900px) {
					.fixed.right-0, .absolute.right-0 {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 1rem !important;
					}
					[class*="right-[420px]"] {
						right: 0 !important;
					}
					.pt-44 {
						padding-top: 2rem !important;
					}
				}
				@media (max-width: 768px) {
					.fixed.right-0, .absolute.right-0 {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 1rem !important;
					}
					[class*="right-[420px]"] {
						right: 0 !important;
					}
					.pt-44 {
						padding-top: 1rem !important;
					}
					.max-w-xl {
						max-width: 100vw !important;
					}
				}
				@media (max-width: 600px) {
					.fixed.right-0, .absolute.right-0 {
						width: 100vw !important;
						position: static !important;
						height: auto !important;
						border-left: none !important;
						box-shadow: none !important;
						padding: 0.5rem !important;
					}
					[class*="right-[420px]"] {
						right: 0 !important;
					}
					.pt-44 {
						padding-top: 0.5rem !important;
					}
					.max-w-xl {
						max-width: 100vw !important;
					}
					.p-8 {
						padding: 1rem !important;
					}
					.text-3xl, .text-2xl, .text-xl {
						font-size: 1rem !important;
					}
					.text-lg, .text-base {
						font-size: 0.95rem !important;
					}
					.text-sm {
						font-size: 0.85rem !important;
					}
					.flex.flex-col.sm\\:flex-row {
						flex-direction: column !important;
					}
					.w-\\[300px\\], .h-\\[300px\\], .min-w-\\[300px\\], .min-h-\\[300px\\], .max-w-\\[300px\\], .max-h-\\[300px\\] {
						width: 100% !important;
						height: 180px !important;
						min-width: 0 !important;
						min-height: 0 !important;
						max-width: 100vw !important;
						max-height: 180px !important;
					}
					.px-4 {
						padding-left: 0.5rem !important;
						padding-right: 0.5rem !important;
					}
				}
				@media (max-width: 400px) {
					.fixed.right-0, .absolute.right-0 {
						width: 100vw !important;
						padding: 0.1rem !important;
					}
					.p-8 {
						padding: 0.25rem !important;
					}
					.text-3xl, .text-2xl, .text-xl {
						font-size: 0.95rem !important;
					}
					.text-lg, .text-base {
						font-size: 0.85rem !important;
					}
					.text-sm {
						font-size: 0.75rem !important;
					}
				}
				`}
			</style>
			<Header />
			<div
				className="flex bg-white min-h-screen pb-[300px]"
				style={{ fontFamily: "Montserrat, sans-serif" }}
			>
				{/* Stepper */}
				<div
					className="fixed left-0 right-[420px] top-0 bg-white z-20 pt-8 pb-4 pl-[300px]"
					style={{ marginTop: "72px" }}
				>
					<div className="flex justify-center gap-16">
						<span
							className={`text-xl font-bold tracking-wide cursor-pointer ${
								activeStep === "cart"
									? "text-[#7B3F14] border-b-2 border-[#7B3F14] pb-1"
									: "text-black"
							}`}
							style={{ fontFamily: "Montserrat" }}
							onClick={() => setActiveStep("cart")}
						>
							CART
						</span>
						<span
							className={`text-xl font-bold tracking-wide cursor-pointer ${
								activeStep === "address"
									? "text-[#7B3F14] border-b-2 border-[#7B3F14] pb-1"
									: "text-black"
							}`}
							style={{ fontFamily: "Montserrat" }}
							onClick={() => setActiveStep("address")}
						>
							ADDRESS
						</span>
						<span
							className={`text-xl font-bold tracking-wide cursor-pointer ${
								activeStep === "payment"
									? "text-[#7B3F14] border-b-2 border-[#7B3F14] pb-1"
									: "text-black"
							}`}
							style={{ fontFamily: "Montserrat" }}
							onClick={() => setActiveStep("payment")}
						>
							PAYMENT
						</span>
					</div>
				</div>

				{/* Left: Cart Items or Product Details */}
				<div className="flex-1 flex justify-center pt-44">
					<div className="w-full max-w-xl px-4 mx-auto flex justify-center">
						<div className="w-full">
							{activeStep === "cart" && (
								<>
									{cartItems.map((item) => (
										<div key={item.id} className="flex mb-12">
											<img
												src={item.image}
												alt={item.name}
												className="w-[300px] h-[300px] min-w-[300px] min-h-[300px] max-w-[300px] max-h-[300px] object-cover rounded-md shadow"
											/>
											<div className="ml-6 flex flex-col justify-between">
												<div>
													<h2 className="text-2xl font-bold text-[#9B5D43] mb-1" style={{ fontFamily: "Montserrat" }}>
														{item.name}
													</h2>
													<p className="text-lg text-gray-700 mb-2">{item.desc}</p>
													<div className="text-xl font-semibold mt-2">₹{item.price}</div>
												</div>
												{/* Remove button */}
												<button className="self-end mt-4 w-10 h-10 flex items-center justify-center group bg-[#F5E9DD] rounded-full border-2 border-[#C8A165] hover:bg-[#C8A165] transition-colors">
													<span className="block w-5 h-5 relative">
														<span className="absolute left-1/2 top-1/2 w-5 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors"></span>
														<span className="absolute left-1/2 top-1/2 w-5 h-0.5 bg-[#7B3F14] rounded transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-colors"></span>
													</span>
												</button>
											</div>
										</div>
									))}
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
								</form>
							)}
							{activeStep === "payment" && (
								<div className="flex flex-col items-center justify-center h-full text-2xl text-gray-400" style={{ minHeight: "300px" }}>
									<div className="mb-6 text-black text-xl font-semibold">Pay securely with Razorpay</div>
									<button
										type="button"
										className="bg-[#7B3F14] text-white px-8 py-3 rounded font-bold text-lg hover:bg-black transition-colors"
										onClick={handleRazorpayPayment}
									>
										Pay Now
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right: Order Details */}
				<div
					className="absolute right-0 top-0 h-full w-[420px] bg-[#FCFAF7] shadow-md border-l border-gray-200 p-8"
					style={{ zIndex: 10, top: "72px", height: "calc(100vh - 72px - 250px)" }}
				>
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
						<span>Order Total</span>
						<span>
							{orderDetails.cartTotal +
								orderDetails.cartDiscount +
								orderDetails.platformFee +
								orderDetails.shippingFee}
						</span>
					</div>
					<button className="w-full bg-[#7B3F14] text-white text-xl font-semibold py-4 rounded mt-2 hover:bg-black">
						PROCEED TO SHIPPING
					</button>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default CheckoutPage;
