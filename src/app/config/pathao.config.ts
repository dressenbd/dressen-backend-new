export const pathaoConfig = {
  baseURL: process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com/aladdin/api/v1",
  clientId: process.env.PATHAO_CLIENT_ID as string,
  clientSecret: process.env.PATHAO_CLIENT_SECRET as string,
  username: process.env.PATHAO_USERNAME as string,
  password: process.env.PATHAO_PASSWORD as string,
};
