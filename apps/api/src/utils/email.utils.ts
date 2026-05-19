import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `WoodenGallery <${process.env.EMAIL_FROM || "no-reply@woodengallery.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export const generateOTPTemplate = (otp: string) => {
  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #F2EFE9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FAF9F6; border: 1px solid #DCD5CC; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #6D5543; text-transform: uppercase;">WoodenGallery</span>
          <div style="width: 40px; height: 1px; background-color: #6D5543; margin: 10px auto;"></div>
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #4A3B32; margin-top: 0; text-align: center;">Verify Identity</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500; text-align: center;">
          You requested a password reset for your WoodenGallery account. Use the code below to verify your identity:
        </p>
        <div style="background-color: #F2EFE9; border: 1px solid #DCD5CC; padding: 20px; text-align: center; border-radius: 16px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #6D5543;">${otp}</span>
        </div>
        <p style="font-size: 13px; line-height: 1.5; color: #7C7267; text-align: center;">
          This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email securely.
        </p>
        <hr style="border: 0; border-top: 1px solid #E5E0D8; margin: 30px 0;">
        <p style="font-size: 12px; color: #A8A29E; text-align: center; margin-bottom: 0;">
          © ${new Date().getFullYear()} WoodenGallery Sri Lanka. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

export const generateWelcomeTemplate = (userName: string) => {
  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #F2EFE9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FAF9F6; border: 1px solid #DCD5CC; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #6D5543; text-transform: uppercase;">WoodenGallery</span>
          <div style="width: 40px; height: 1px; background-color: #6D5543; margin: 10px auto;"></div>
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #4A3B32; margin-top: 0;">Welcome, ${userName}!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Thank you for establishing your connection with <strong>WoodenGallery</strong>. We are thrilled to welcome you to our curated sanctuary of premium, minimalist wooden masterpieces handcrafted in Sri Lanka.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Whether you are exploring customized gallery sculptures, custom tabletop carvings, or modern organic panels, each item is sustainably sourced and carefully hand-seasoned to perfection by our master artisans.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/shop" style="display: inline-block; background-color: #6D5543; color: #FAF9F6; font-size: 13px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(109, 85, 67, 0.2);">
            Explore the Collections
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #6D5543; font-weight: 500;">
          Explore and enjoy the timeless beauty of fine craftsmanship.
        </p>
        <hr style="border: 0; border-top: 1px solid #E5E0D8; margin: 30px 0;">
        <p style="font-size: 12px; color: #A8A29E; text-align: center; margin-bottom: 0;">
          © ${new Date().getFullYear()} WoodenGallery Sri Lanka. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

export const generateOrderPlacedTemplate = (
  userName: string,
  orderId: string,
  totalPrice: number,
  items: any[]
) => {
  const itemsList = items
    .map(
      (item) => `
      <div style="padding: 12px 0; border-bottom: 1px solid #E5E0D8; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #4A3B32;">${item.productTitle || "Wooden Sculpture Masterpiece"}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #7C7267;">Qty: ${item.quantity} × LKR ${item.price.toLocaleString()}</p>
        </div>
        <span style="font-size: 14px; font-weight: bold; color: #6D5543;">LKR ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `
    )
    .join("");

  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #F2EFE9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FAF9F6; border: 1px solid #DCD5CC; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #6D5543; text-transform: uppercase;">WoodenGallery</span>
          <div style="width: 40px; height: 1px; background-color: #6D5543; margin: 10px auto;"></div>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 800; color: #4A3B32; margin-top: 0;">Order Received!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Hello ${userName}, thank you for your order. We have successfully received order <strong>#${orderId}</strong> and notified our master artisans.
        </p>

        <div style="margin: 24px 0; background-color: #F2EFE9; border: 1px solid #DCD5CC; border-radius: 16px; padding: 20px;">
          <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #7C7267;">Order Details</h3>
          ${itemsList}
          <div style="padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; color: #4A3B32;">
            <span>Total Value</span>
            <span style="color: #6D5543;">LKR ${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          If you chose <strong>Bank Transfer</strong> as your payment option, please upload your receipt directly through the order tracker inside your profile dashboard. Once our artisan verifies the payment receipt, they will initiate preparation immediately.
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/profile/orders" style="display: inline-block; background-color: #6D5543; color: #FAF9F6; font-size: 13px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(109, 85, 67, 0.2);">
            Track My Order
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #E5E0D8; margin: 30px 0;">
        <p style="font-size: 12px; color: #A8A29E; text-align: center; margin-bottom: 0;">
          © ${new Date().getFullYear()} WoodenGallery Sri Lanka. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

export const generatePaymentVerifiedTemplate = (
  userName: string,
  orderId: string,
  totalPrice: number
) => {
  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #F2EFE9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FAF9F6; border: 1px solid #DCD5CC; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #6D5543; text-transform: uppercase;">WoodenGallery</span>
          <div style="width: 40px; height: 1px; background-color: #6D5543; margin: 10px auto;"></div>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 800; color: #4A3B32; margin-top: 0; text-align: center;">Payment Verified</h2>
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; padding: 16px; border-radius: 16px; margin: 20px 0; text-align: center;">
          <span style="font-size: 15px; font-weight: bold; color: #15803D;">✓ LKR ${totalPrice.toLocaleString()} Successfully Received</span>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Hello ${userName},
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Great news! Your payment for order <strong>#${orderId}</strong> has been successfully verified. 
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6D5543; font-weight: 500;">
          Our master artisan has initialized preparation and seasoning of your minimalist wooden art. We will keep you updated as your piece reaches the packaging and transit stages!
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/profile/orders" style="display: inline-block; background-color: #6D5543; color: #FAF9F6; font-size: 13px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(109, 85, 67, 0.2);">
            View Order Status
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #E5E0D8; margin: 30px 0;">
        <p style="font-size: 12px; color: #A8A29E; text-align: center; margin-bottom: 0;">
          © ${new Date().getFullYear()} WoodenGallery Sri Lanka. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
