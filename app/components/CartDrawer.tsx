'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CheckoutModal from './CheckoutModal';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

    const handleCheckout = () => {
        if (!session) {
            setIsCartOpen(false);
            router.push('/login');
        } else {
            setIsCheckoutOpen(true);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div key="cart-portal">
                    {/* Backdrop */}
                    <motion.div
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        key="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md glass border-l border-white/10 z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-accent-blue" />
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">Your Cart ({totalItems})</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <ShoppingBag className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 text-accent-blue font-bold uppercase tracking-widest text-sm"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div
                                            className="w-20 h-20 rounded-2xl glass flex items-center justify-center relative group overflow-hidden"
                                        >
                                            <div
                                                className="absolute inset-0 opacity-20"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-xs font-black italic z-10">{item.name}</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-bold uppercase italic">{item.name}</h3>
                                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{item.flavor}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center glass rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1 hover:text-accent-blue transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1 hover:text-accent-blue transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between text-xl font-bold uppercase italic">
                                    <span>Total</span>
                                    <span className="text-accent-blue">${totalPrice.toFixed(2)}</span>
                                </div>
                                {!session && (
                                    <p className="text-xs text-center text-white/40 uppercase tracking-widest">Login required for checkout</p>
                                )}
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-accent-blue hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {!session && <LogIn className="w-4 h-4" />}
                                    {session ? 'Checkout Now' : 'Sign In to Checkout'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            <CheckoutModal
                key="checkout-modal"
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </AnimatePresence>
    );
};

export default CartDrawer;
