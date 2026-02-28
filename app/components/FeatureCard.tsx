'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-10 rounded-[40px] glass border border-white/5 flex flex-col items-start gap-4"
        >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent-blue mb-4">
                {icon}
            </div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">{title}</h4>
            <p className="text-white/40 leading-relaxed font-medium">{description}</p>
        </motion.div>
    );
};

export default FeatureCard;
