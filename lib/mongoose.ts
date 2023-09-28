import { connect, set } from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.error(
      "%cMONGODB_URI not found",
      "color: black; background: red;" +
        " border-radius: 1000px; padding: 5px; font-weight: 800; font-size: 1.5rem;",
    );
  if (isConnected)
    return console.info(
      "%cAlready connected to MongoDB database",
      "color: blue; background: blue; border-radius: 1000px; padding: 5px; font-weight: 800; font-size: 1.5rem;",
    );

  try {
    await connect(process.env.MONGODB_URI);
    isConnected = true;
    console.info(
      "%cSuccessfully connected to MongoDB",
      "color: black; background: green; border-radius: 1000px; padding: 5px; font-weight: 800; font-size: 1.5rem;",
    );
  } catch (err) {
    console.error(err);
  }
};
