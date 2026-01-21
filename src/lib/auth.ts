import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER!,
    pass: process.env.APP_PASS!,
  },
});



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  trustedOrigins: [process.env.APP_URL!],


  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {


        console.log({ user, url, token });
        const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismaBlog@gmail.com>',
          to: user.email!,
          subject: "Please verify your email address",
          html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <title>Email Verification</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:6px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1f2937; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px;">
                Prisma Blog
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#111827;">
              <h2 style="margin-top:0; font-size:20px;">
                Verify your email address
              </h2>

              <p style="font-size:15px; line-height:1.6; color:#374151;">
         hello ${user.name}       Thanks for signing up for Prisma Blog. To complete your registration,
                please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="  ${verificationURL}"
                   style="background:#2563eb; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:4px; font-size:15px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#4b5563;">
                If the button does not work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px; color:#2563eb;">
                ${verificationURL}
              </p>

              <p style="font-size:14px; color:#6b7280; margin-top:30px;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
              © 2026 Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`
        });

        console.log("Message sent:", info.messageId);


      }
      catch (err) {
        console.log("Error sending email: ", err);
      }
    },
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }
});