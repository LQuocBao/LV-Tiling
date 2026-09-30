import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";
import { getSettings } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetEmail, customSettings } = body;

    const currentSettings = customSettings || (await getSettings());
    const emailToTest = targetEmail || currentSettings.adminNotificationEmail || currentSettings.email || "lvotiling@gmail.com";

    const result = await sendTestEmail(emailToTest, currentSettings);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Đã gửi email kiểm tra thành công tới ${emailToTest}! Vui lòng kiểm tra hộp thư đến.`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Không thể gửi email. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu ứng dụng (App Password).",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi xử lý gửi email kiểm tra" },
      { status: 500 }
    );
  }
}
