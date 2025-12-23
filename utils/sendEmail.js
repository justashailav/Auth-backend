import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const res = await apiInstance.sendTransacEmail({
      sender: {
        email: "justashailav02@gmail.com", // ✅ VERIFIED
        name: "Auth App",
      },
      to: [{ email }],
      subject,
      htmlContent: message,
    });

    console.log("✅ Email sent:", res.messageId);
  } catch (err) {
    console.error(
      "❌ Brevo error:",
      err?.response?.body || err.message
    );
  }
};

export default sendEmail;
