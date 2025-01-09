import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key"; // Replace with your secret

export function generateJWT(User_Id: number) {
  return jwt.sign({ User_Id }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
