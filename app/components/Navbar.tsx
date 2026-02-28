'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const { totalItems, setIsCartOpen } = useCart();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-8 py-4">
                <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        <Image src="/logo1.png" alt="logo" width={50} height={50} />
                    </motion.div>
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Good-Bubbles</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    {(session ? ['Flavors', 'About', 'Orders', 'Profile'] : ['Flavors', 'About', 'Contact']).map((item) => (
                        <Link
                            key={item}
                            href={item === 'Orders' ? '/orders' : item === 'Profile' ? '/profile' : `/#${item.toLowerCase()}`}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">Authenticated</span>
                                <span className="text-sm font-bold uppercase italic">{session.user?.name}</span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-white/40 hover:text-red-500 transition-colors p-2"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-white/70 hover:text-white transition-colors p-2"
                            title="Sign In"
                        >
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-white/70 hover:text-white transition-colors p-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.5, 1] }}
                                    exit={{ scale: 0 }}
                                    className="absolute top-0 right-0 w-4 h-4 bg-accent-purple rounded-full text-[10px] flex items-center justify-center text-white font-bold"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    <button className="hidden sm:block bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-accent-blue hover:text-white transition-all transform hover:scale-105 active:scale-95">
                        Store
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
