'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface SodaProductProps {
    id: string;
    name: string;
    flavor: string;
    color: string;
    price: number;
    icon: React.ReactNode;
}

const SodaProduct: React.FC<SodaProductProps> = ({ id, name, flavor, color, price, icon }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = React.useState(false);

    const handleAddToCart = () => {
        addToCart({ id, name, flavor, color, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="relative group p-8 rounded-[40px] glass overflow-hidden flex flex-col items-center"
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: color }}
            />

            <div className="w-full h-64 mb-6 flex items-center justify-center relative">
                <motion.div
                    className="absolute inset-0 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.2 }}
                />
                <div className="floating">
                    {icon}
                </div>
            </div>

            <div className="text-center z-10 w-full">
                <h3 className="text-3xl font-black uppercase italic mb-1 tracking-tighter">{name}</h3>
                <p className="text-white/50 font-medium mb-6 uppercase text-xs tracking-[0.2em]">{flavor}</p>

                <div className="flex items-center justify-between w-full mt-auto">
                    <span className="text-xl font-bold">${price.toFixed(2)}</span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${added ? 'bg-accent-lime text-black' : 'bg-white text-black group-hover:bg-accent-blue group-hover:text-white'
                            }`}
                    >
                        {added ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default SodaProduct;
