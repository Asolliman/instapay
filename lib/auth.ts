import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/user";

// Hash password for new users during registration
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Function to create a new user (for registration)
export async function createUser({
  userId,
  password,
  firstName,
  lastName,
  govId,
}: {
  userId: number;
  password: string;
  firstName: string;
  lastName: string;
  govId: string;
}) {
  const hashedPassword = await hashPassword(password);
  await User.create({
    User_Id: userId,
    Password: hashedPassword,
    First_Name: firstName,
    Last_Name: lastName,
    Gov_Id: govId,
  });
}

// Verify the user's credentials (for login)
// export async function verifyUserPassword(govId: string, enteredPassword: string) {
//   // Check if `govId` and `enteredPassword` are provided
//   if (!govId || !enteredPassword) {
//     throw new Error("Government ID and Password are required");
//   }

//   // Fetch the user by `govId`
//   const user = await User.findOne({ where: { govId: govId } });

//   if (!user) {
//     throw new Error("Invalid Government ID or Password");
//   }

//   // Validate stored password
//   if (!user.Password) {
//     throw new Error("Stored password is missing or invalid");
//   }

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await bcrypt.compare(enteredPassword, user.Password);

//   if (!isPasswordValid) {
//     throw new Error("Invalid Government ID or Password");
//   }

//   return user;
// }

export async function verifyUserPassword(
  govId: string,
  enteredPassword: string
) {
  // Ensure `govId` and `enteredPassword` are not empty
  if (!govId || !enteredPassword) {
    throw new Error("Government ID and Password are required");
  }

  // Retrieve the user based on `Gov_Id`
  const user = await User.findOne({ where: { govId: govId } });

  if (!user) {
    throw new Error("Invalid Government ID or Password"); // Fail if user is not found
  }

  // Debugging logs to verify stored password and user details
  // console.log("Retrieved User:", user);
  // console.log("Stored Password (hashed):", user.dataValues.Password);
  // console.log("Entered Password:", enteredPassword);

  // Compare the provided password with the hashed password
  const isPasswordValid = await bcrypt.compare(
    enteredPassword,
    user.dataValues.Password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid Government ID or Password"); // Fail if password is incorrect
  }

  // Return the user if everything checks out
  return user;
}

// JWT generation function
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

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

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
