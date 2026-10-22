import { NextResponse } from "next/server";
import { getUsers, addUser, updateUser, deleteUser, hashPassword } from "@/lib/storage";

// Helper to strip password hashes
const sanitizeUser = (u: any) => ({
  id: u.id,
  username: u.username,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
  createdAt: u.createdAt,
  lastLogin: u.lastLogin,
});

export async function GET() {
  const users = getUsers();
  const safeUsers = users.map(sanitizeUser);
  return NextResponse.json({ success: true, data: safeUsers, users: safeUsers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, email, role, status } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập, mật khẩu và họ tên là bắt buộc." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập phải có ít nhất 3 ký tự." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." },
        { status: 400 }
      );
    }

    const currentUsers = getUsers();
    const existing = currentUsers.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Tên đăng nhập đã tồn tại trong hệ thống." },
        { status: 400 }
      );
    }

    const newUser = addUser({
      username: cleanUsername,
      passwordHash: hashPassword(password),
      name: name.trim(),
      email: (email || "").trim(),
      role: role === "staff" ? "staff" : "admin",
      status: status === "inactive" ? "inactive" : "active",
    });

    return NextResponse.json({
      success: true,
      message: "Thêm tài khoản thành công!",
      data: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo tài khoản mới." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, role, status, newPassword } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID tài khoản là bắt buộc." }, { status: 400 });
    }

    const updates: any = {};
    if (typeof name === "string") updates.name = name.trim();
    if (typeof email === "string") updates.email = email.trim();
    if (role === "admin" || role === "staff") updates.role = role;
    if (status === "active" || status === "inactive") updates.status = status;
    if (typeof newPassword === "string" && newPassword.trim().length >= 6) {
      updates.passwordHash = hashPassword(newPassword.trim());
    }

    const updated = updateUser(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật tài khoản thành công!",
      data: sanitizeUser(updated),
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật tài khoản." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID tài khoản là bắt buộc." }, { status: 400 });
    }

    const success = deleteUser(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Không thể xóa tài khoản (tài khoản không tồn tại hoặc đây là tài khoản Quản trị viên duy nhất)." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa tài khoản thành công!",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa tài khoản." },
      { status: 500 }
    );
  }
}
