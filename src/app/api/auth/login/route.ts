import { NextResponse } from "next/server";
import { authenticateUserAsync } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." },
        { status: 400 }
      );
    }

    const user = await authenticateUserAsync(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác." },
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
      message: "Đăng nhập thành công!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi trong quá trình xác thực." },
      { status: 500 }
    );
  }
}
