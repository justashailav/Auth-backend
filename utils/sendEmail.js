import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({ email, subject, message }) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  client.authentications["api-key"].apiKey =
    process.env.BRAVO_KEY

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: {
      email: "no-reply@brevo.com", // ✅ domain NOT required
      name: "Auth App",
    },
    to: [{ email }],
    subject,
    htmlContent: message,
  });
};

export default sendEmail;
