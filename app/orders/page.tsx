import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { Package, Calendar, MapPin, CreditCard, ChevronRight } from "lucide-react";

export default async function OrdersPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                include: {
                    items: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent-purple selection:text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-40 pb-20 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                        Your <span className="text-accent-blue">Stash.</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-sm">Order History & Tracking</p>
                </div>

                {user.orders.length === 0 ? (
                    <div className="glass p-20 rounded-[40px] text-center flex flex-col items-center">
                        <Package className="w-20 h-20 text-white/10 mb-6" />
                        <h2 className="text-2xl font-bold uppercase italic mb-4">No drops found</h2>
                        <p className="text-white/40 mb-8 max-w-sm">You haven't secured any NOS shipments yet. Head back to the lineup to grab your first pack.</p>
                        <a href="/#flavors" className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-blue hover:text-white transition-all transform hover:scale-105">
                            Explore Lineup
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {user.orders.map((order: any) => (
                            <div key={order.id} className="glass rounded-[40px] border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
                                {/* Order Header */}
                                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex flex-wrap gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Order ID</p>
                                            <p className="font-mono font-bold text-accent-blue">{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">Placed on</p>
                                            <div className="flex items-center gap-2 font-bold italic uppercase text-sm">
                                                <Calendar className="w-4 h-4 text-white/20" />
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</p>
                                            <p className="text-xl font-black italic">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-accent-lime/20 text-accent-lime border border-accent-lime/20' :
                                                'bg-accent-purple/20 text-accent-purple border border-accent-purple/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="px-6 py-3 glass rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                            Track Shipment
                                        </button>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-12">
                                    {/* Items List */}
                                    <div className="flex-1 space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 mb-6">Manifest Items</h3>
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl glass border border-white/5 flex items-center justify-center font-black italic text-accent-blue text-sm">
                                                        {item.quantity}x
                                                    </div>
                                                    <div>
                                                        <p className="font-bold uppercase italic">{item.name}</p>
                                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">High-Performance Soda</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-sm text-white/60">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Summary */}
                                    <div className="lg:w-1/3 space-y-8 lg:border-l lg:border-white/5 lg:pl-12">
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Ship to
                                            </h3>
                                            <div className="text-sm text-white/60 font-medium leading-relaxed uppercase italic">
                                                {order.address}<br />
                                                {order.city}, {order.zipCode}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Payment Status
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-accent-lime animate-pulse" />
                                                <span className="text-xs font-black uppercase tracking-widest">Verified (VISA)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
