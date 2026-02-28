'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, Plus, Trash2, Check, Loader2, Home, Building, ShieldCheck, X, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || '');
    const [addresses, setAddresses] = useState<any[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        zipCode: '',
        isDefault: false,
    });
    const [detecting, setDetecting] = useState(false);

    const handleDetectLocation = () => {
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
                        setNewAddress(prev => ({
                            ...prev,
                            street: `${house_number ? house_number + ' ' : ''}${road || ''}`,
                            city: city || town || village || '',
                            zipCode: postcode || '',
                        }));
                    }
                } catch (err) {
                    console.error("Error fetching location:", err);
                    alert("Could not detect location. Please enter it manually.");
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

    useEffect(() => {
        if (session?.user?.name) setName(session.user.name);
        fetchAddresses();
    }, [session]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('/api/user/addresses');
            const data = await res.json();
            if (data.addresses) setAddresses(data.addresses);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                await update({ name });
                alert('Profile updated successfully!');
            }
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddressLoading(true);
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress),
            });
            if (res.ok) {
                setShowAddressForm(false);
                setNewAddress({ name: '', street: '', city: '', zipCode: '', isDefault: false });
                fetchAddresses();
            }
        } catch (err) {
            alert('Failed to add address');
        } finally {
            setAddressLoading(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this node?')) return;

        try {
            const res = await fetch(`/api/user/addresses?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchAddresses();
            }
        } catch (err) {
            alert('Failed to delete address');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent-purple selection:text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-40 pb-20 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                        Security <span className="text-accent-lime">Protocol.</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-sm">User Profile & Node Management</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Profile Section */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-lime/5 blur-3xl rounded-full" />
                            <h2 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
                                <User className="w-6 h-6 text-accent-lime" /> Identity
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Full Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-lime transition-colors font-bold"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                                    <div className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 px-6 text-white/40 font-bold flex items-center gap-3">
                                        <Mail className="w-5 h-5" /> {session?.user?.email}
                                    </div>
                                </div>
                                <button
                                    disabled={loading}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-lime hover:text-black transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Protocol'}
                                </button>
                            </form>
                        </div>

                        <div className="glass p-8 rounded-[40px] border-white/5">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Account Status
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-accent-lime/20 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-accent-lime" />
                                </div>
                                <div>
                                    <p className="font-bold uppercase italic underline decoration-accent-lime">Verified Node</p>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">Level 01 Operator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addresses Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                                Delivery <span className="text-accent-blue">Coords.</span>
                            </h2>
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="flex items-center gap-2 px-6 py-3 glass rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent-blue transition-all"
                            >
                                {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {showAddressForm ? 'Cancel' : 'Add Node'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showAddressForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="glass p-8 rounded-[40px] border-accent-blue/20"
                                >
                                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Node Manifest</h3>
                                            <button
                                                type="button"
                                                onClick={handleDetectLocation}
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
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Node Name (e.g. Home, HQ)</label>
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                value={newAddress.name}
                                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Street Address</label>
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">City</label>
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Post/Zip Code</label>
                                            <input
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-blue transition-colors"
                                                value={newAddress.zipCode}
                                                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={newAddress.isDefault}
                                                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                />
                                                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${newAddress.isDefault ? 'bg-accent-blue border-accent-blue' : 'border-white/10'}`}>
                                                    {newAddress.isDefault && <Check className="w-4 h-4 text-black" />}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-accent-blue transition-colors">Set as Default Node</span>
                                            </label>
                                        </div>
                                        <button
                                            disabled={addressLoading}
                                            className="md:col-span-2 w-full bg-accent-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                                        >
                                            {addressLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register New Coords'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((address) => (
                                <div key={address.id} className="glass p-8 rounded-[40px] border-white/5 flex flex-col justify-between group hover:border-accent-blue/30 transition-all">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {address.name.toLowerCase() === 'home' ? <Home className="w-5 h-5 text-accent-blue" /> : <Building className="w-5 h-5 text-accent-blue" />}
                                                <h3 className="font-black uppercase italic tracking-tighter text-xl">{address.name}</h3>
                                            </div>
                                            {address.isDefault && (
                                                <span className="bg-accent-blue/20 text-accent-blue px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Default</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-white/50 uppercase italic font-bold leading-relaxed">
                                            {address.street}<br />
                                            {address.city}, {address.zipCode}
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Decommission
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {addresses.length === 0 && !showAddressForm && (
                            <div className="glass p-16 rounded-[40px] border-dashed border-white/10 text-center flex flex-col items-center opacity-40">
                                <MapPin className="w-12 h-12 mb-4" />
                                <p className="font-bold uppercase tracking-widest text-sm">No delivery nodes mapped</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
