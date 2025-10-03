import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (to: string, content: string) => {
  await transporter.sendMail({
    from: `Support ${process.env.GOOGLE_APP_EMAIL}`,
    to: to,
    subject: "Password recovery",
    text: `Your code is ${content}`,
  });
};
