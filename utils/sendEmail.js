import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({ email, subject, message }) => {
  console.log("DEBUG → sendEmail CALLED");

  console.log("DEBUG → BRAVO_KEY:", process.env.BRAVO_KEY);

  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    client.authentications["api-key"].apiKey =
      process.env.BRAVO_KEY;

    console.log(
      "DEBUG → key set:",
      client.authentications["api-key"].apiKey?.slice(0, 10)
    );

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const res = await apiInstance.sendTransacEmail({
      sender: {
        email: "justashailav02@gmail.com",
        name: "Auth App",
      },
      to: [{ email }],
      subject,
      htmlContent: message,
    });

    console.log("✅ Email sent:", res.messageId);
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    console.error("❌ ERROR BODY:", err?.response?.body);
  }
};

export default sendEmail;
