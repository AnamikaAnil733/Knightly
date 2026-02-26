export function otpMailHtml(name: string, otp: string, message: string) {
  return `
    <div style="background-color: #0A0F2C; color: #FFFFFF; 
                font-family: 'Poppins', Arial, sans-serif; padding: 24px;">

      <!-- LOGO / HEADER -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color:rgb(102, 61, 199); margin-top: 10px;">Welcome to KNIGHTLY</h2>
      </div>

      <!-- MAIN CONTENT CARD -->
      <div style="background-color: #11193F; padding: 20px; border-radius: 12px;">
        <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #C9CAD9;">${message}</p>

        <!-- OTP BOX -->
        <div style="
          text-align: center;
          font-size: 38px;
          letter-spacing: 6px;
          margin: 30px auto;
          padding: 12px 22px;
          border-radius: 10px;
          border: 2px solidrgb(75, 32, 82);
          color:rgb(229, 193, 107);
          background: linear-gradient(135deg,rgb(93, 68, 154) 10%,rgb(132, 112, 186) 90%);
          width: fit-content;
          box-shadow: 0px 0px 12px rgba(107, 46, 255, 0.5);
        ">
          ${otp}
        </div>

        <p style="font-size: 14px; color: #C9CAD9;">
          This OTP will expire in <strong>5 minutes</strong>.
        </p>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; margin-top: 40px;">
        <p style="color: #C9CAD9; font-size: 12px;">
          This is an automated email — do not reply.
        </p>
        <p style="font-size: 13px; color: #FFD166;">
          © ${new Date().getFullYear()} Knightly. All rights reserved.
        </p>
      </div>

    </div>
  `;
}
