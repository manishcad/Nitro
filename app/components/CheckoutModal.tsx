'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Home, MapPin, Truck, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });
    const [detecting, setDetecting] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            fetchSavedAddresses();
        }
    }, [isOpen]);

    const fetchSavedAddresses = async () => {
        try {
            const res = await fetch('/api/user/addresses');
            const data = await res.json();
            if (data.addresses) {
                setSavedAddresses(data.addresses);
                const defaultAddr = data.addresses.find((a: any) => a.isDefault);
                if (defaultAddr) {
                    setFormData(prev => ({
                        ...prev,
                        address: defaultAddr.street,
                        city: defaultAddr.city,
                        zipCode: defaultAddr.zipCode,
                    }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDetectAddress = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    if (data.address) {
                        const { road, house_number, city, town, village, postcode } = data.address;
                        setFormData(prev => ({
                            ...prev,
                            address: `${house_number ? house_number + ' ' : ''}${road || ''}` || prev.address,
                            city: city || town || village || prev.city,
                            zipCode: postcode || prev.zipCode,
                        }));
                    }
                } catch (err) {
                    console.error("Error fetching address:", err);
                    alert("Could not detect address. Please enter it manually.");
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Location access denied or unavailable.");
                setDetecting(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: totalPrice,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    clearCart();
                    onClose();
                    setSuccess(false);
                }, 3000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-4xl glass rounded-[40px] border-white/5 overflow-hidden relative z-10 flex flex-col md:flex-row"
                    >
                        {success ? (
                            <div className="w-full p-20 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-accent-lime rounded-full flex items-center justify-center mb-8"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-black" />
                                </motion.div>
                                <h2 className="text-4xl font-black uppercase italic italic mb-4">Order Confirmed</h2>
                                <p className="text-white/50 text-xl max-w-sm">Your high-octane refreshment is being prepared. Check your email for details.</p>
                            </div>
                        ) : (
                            <>
                                {/* Left Side: Order Summary */}
                                <div className="w-full md:w-[40%] bg-white/5 p-8 md:p-12">
                                    <h2 className="text-2xl font-black uppercase italic italic mb-8 flex items-center gap-3">
                                        <Truck className="w-6 h-6 text-accent-blue" /> Summary
                                    </h2>
                                    <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto pr-4">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold uppercase italic italic">{item.name}</p>
                                                    <p className="text-xs text-white/40 uppercase tracking-widest leading-none mt-1">x{item.quantity}</p>
                                                </div>
                                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex justify-between items-center text-2xl font-black uppercase italic italic text-accent-blue">
                                            <span>Total</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="flex-1 p-8 md:p-12 relative">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                                                    <Home className="w-4 h-4" /> Shipping Details
                                                </h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleDetectAddress}
                                                        disabled={detecting}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-accent-blue hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
                                                    >
                                                        {detecting ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Navigation className="w-3 h-3" />
                                                        )}
                                                        {detecting ? 'Detecting...' : 'Autofill Location'}
                                                    </button>
                                                </div>
                                            </div>

                                            {savedAddresses.length > 0 && (
                                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                                    {savedAddresses.map((addr) => (
                                                        <button
                                                            key={addr.id}
                                                            type="button"
                                                            onClick={() => setFormData({
                                                                ...formData,
                                                                address: addr.street,
                                                                city: addr.city,
                                                                zipCode: addr.zipCode,
                                                            })}
                                                            className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.address === addr.street
                                                                    ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                                                                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                                                                }`}
                                                        >
                                                            {addr.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Street Address"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="City"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Zip Code"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                        value={formData.zipCode}
                                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Payment Info
                                            </h3>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Card Number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                    value={formData.cardNumber}
                                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="MM/YY"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                        value={formData.expiry}
                                                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                    />
                                                    <input
                                                        type="password"
                                                        required
                                                        placeholder="CVV"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                        value={formData.cvv}
                                                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-white text-black py-5 rounded-[20px] font-black uppercase tracking-widest text-sm hover:bg-accent-lime hover:text-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                `Pay $${totalPrice.toFixed(2)}`
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
