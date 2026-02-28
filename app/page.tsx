'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Flame, Snowflake, ArrowRight, Droplets } from 'lucide-react';
import Navbar from './components/Navbar';
import SodaProduct from './components/SodaProduct';
import FeatureCard from './components/FeatureCard';
import CartDrawer from './components/CartDrawer';

export default function Home() {
  const products = [
    {
      id: "neon-01",
      name: "NEON",
      flavor: "Electric Lime",
      color: "#32ff7e",
      price: 4.99,
      icon: <Zap className="w-32 h-32 text-accent-lime" />
    },
    {
      id: "aura-01",
      name: "AURA",
      flavor: "Midnight Berry",
      color: "#bc13ff",
      price: 5.49,
      icon: <Sparkles className="w-32 h-32 text-accent-purple" />
    },
    {
      id: "void-01",
      name: "VOID",
      flavor: "Black Cherry",
      color: "#00f2ff",
      price: 4.99,
      icon: <Flame className="w-32 h-32 text-accent-blue" />
    },
    {
      id: "zero-01",
      name: "ZERO",
      flavor: "Icy Mint",
      color: "#ffffff",
      price: 3.99,
      icon: <Snowflake className="w-32 h-32 text-white" />
    }
  ];

  return (
    <div className="min-h-screen relative selection:bg-accent-purple selection:text-white">
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="bg-gradient-premium absolute inset-0 -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="px-4 py-1.5 rounded-full border border-white/10 glass text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              The Future of Fizz
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-tight mb-8"
          >
            REFRESH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-blue to-accent-lime animate-gradient">THE SOUL.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl text-xl text-white/50 leading-relaxed mb-12"
          >
            Crafted with cosmic botanicals and electrified vitamins. NOS isn't just a soda—it's high-octane hydration for the modern pioneer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a
              href="#flavors"
              className="px-10 py-5 bg-white text-black rounded-full font-black uppercase text-sm tracking-widest hover:bg-accent-purple hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center"
            >
              Explore Flavors
            </a>
            <button className="px-10 py-5 glass border-white/10 text-white rounded-full font-black uppercase text-sm tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all transform hover:scale-105">
              Our Vision <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] -z-10 animate-pulse duration-5000" />
      </section>

      {/* Product Showcase */}
      <section id="flavors" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">The Lineup</h2>
              <p className="text-white/50 text-xl">Scientific hydration meets bold flavor.</p>
            </div>
            <button className="mt-8 md:mt-0 text-accent-blue font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
              View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SodaProduct {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-8 tracking-tighter">BORN IN THE <span className="text-accent-blue">METAVERSE.</span></h2>
            <p className="text-white/60 text-xl leading-relaxed mb-8">
              NOS started as a digital-first experiment in high-performance hydration. We didn't just build a beverage company; we built a culture around the intersection of technology, energy, and human potential.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-black italic text-accent-purple mb-1">2M+</p>
                <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Cans Shipped</p>
              </div>
              <div>
                <p className="text-4xl font-black italic text-accent-lime mb-1">98%</p>
                <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Satisfaction</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="aspect-square glass rounded-[60px] relative flex items-center justify-center p-12 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Droplets className="w-48 h-48 text-white/5 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-black uppercase italic tracking-tighter opacity-10 select-none">NOS CULTURE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why NOS Section */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-6">Engineered for <span className="text-accent-lime">Performance</span></h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">We've spent 24 months in the lab perfecting the molecular balance of hydration and hype.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Electrified vitamins"
              description="Proprietary blend of B12 and electrolytes for instant cognitive clarity without the crash."
              icon={<Zap className="w-8 h-8" />}
            />
            <FeatureCard
              title="Zero sugar surge"
              description="Sweetened with rare fruit extracts for a clean, crisp finish that leaves no aftertaste."
              icon={<Sparkles className="w-8 h-8" />}
            />
            <FeatureCard
              title="Icy carbonation"
              description="Nanoparticle bubbles that stay fizzy 3x longer than traditional soft drinks."
              icon={<Snowflake className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[60px] p-12 md:p-24 overflow-hidden relative border-accent-purple/20">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-accent-purple/5 to-transparent pointer-events-none" />
            <div className="relative z-10 text-center flex flex-col items-center">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-8">Ready to <br className="md:hidden" /> <span className="text-accent-blue">FUEL UP?</span></h2>
              <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">Join the NOS Collective and be the first to taste our upcoming seasonal limited drops.</p>
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 focus:outline-none focus:border-accent-purple transition-colors"
                />
                <button className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-accent-blue hover:text-white transition-all transform hover:scale-105">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter uppercase italic">NOS</span>
            <span className="text-white/30 text-xs">© 2026 NOS DRINKS INC.</span>
          </div>
          <div className="flex gap-10">
            {['Instagram', 'Twitter', 'TikTok'].map(social => (
              <a key={social} href="#" className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
