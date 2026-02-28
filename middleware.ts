import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/profile", "/profile/:path*", "/orders", "/orders/:path*", "/checkout", "/checkout/:path*", "/login", "/register"],
};