import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to login page
        if (pathname === "/shopee") {
          return true
        }
        
        // Require authentication for protected routes
        if (pathname.startsWith("/admin") || pathname.startsWith("/chat")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*", "/shopee"]
}

