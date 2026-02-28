import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items, totalAmount, address, city, zipCode } = await req.json();

        if (!items || items.length === 0 || !address || !city || !zipCode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount,
                address,
                city,
                zipCode,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Order error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
