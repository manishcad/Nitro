import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, image } = await req.json();

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { name, image },
        });

        return NextResponse.json({ user: { name: user.name, image: user.image } });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
