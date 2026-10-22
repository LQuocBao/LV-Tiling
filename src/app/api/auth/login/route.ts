import { NextResponse } from "next/server";
import { authenticateUserAsync } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both username and password." },
        { status: 400 }
      );
    }

    const user = await authenticateUserAsync(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Strip passwordHash before responding
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
    };

    return NextResponse.json({
      success: true,
      message: "Sign in successful!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during authentication. Please try again." },
      { status: 500 }
    );
  }
}
