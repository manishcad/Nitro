import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.otpCode || !user.otpExpires) {
            return NextResponse.json({ error: "No OTP requested" }, { status: 400 });
        }

        if (new Date() > user.otpExpires) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        if (user.otpCode !== otp) {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        // Mark as verified and clear OTP
        await prisma.user.update({
            where: { email },
            data: {
                emailVerified: new Date(),
                otpCode: null,
                otpExpires: null,
            },
        });

        return NextResponse.json({ success: true, message: "Account verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
