import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtectedRoute = ["/profile", "/orders", "/checkout"].some((path) =>
                nextUrl.pathname.startsWith(path)
            );

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/", nextUrl));
            }

            return true;
        },
    },
    providers: [], // Add empty providers to satisfy NextAuthConfig, will be overriden in auth.ts
} satisfies NextAuthConfig;
