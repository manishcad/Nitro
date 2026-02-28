import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function CheckoutPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <h1 className="text-white text-2xl font-black uppercase italic tracking-tighter">
                Checkout Page - Use the Cart Drawer to Checkout
            </h1>
        </div>
    );
}
