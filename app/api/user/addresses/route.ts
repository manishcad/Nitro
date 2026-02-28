import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, street, city, zipCode, isDefault } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // If setting as default, unset others
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.id },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: user.id,
                name,
                street,
                city,
                zipCode,
                isDefault,
            },
        });

        return NextResponse.json({ address });
    } catch (error) {
        console.error("Address creation error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { addresses: { orderBy: { createdAt: 'desc' } } },
        });

        return NextResponse.json({ addresses: user?.addresses || [] });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        await prisma.address.delete({
            where: { id, userId: user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Address deletion error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
