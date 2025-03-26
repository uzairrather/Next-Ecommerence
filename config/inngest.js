import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

// Create the Inngest client
export const inngest = new Inngest({ id: "ecommerence" });

// 🔹 CREATE user
export const syncUserCreation = inngest.createFunction(
  {
    id: "ecommerence-create-user-from-clerk", // ✅ unique
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// 🔹 UPDATE user
export const syncUserUpdation = inngest.createFunction(
  {
    id: "ecommerence-update-user-from-clerk", // ✅ unique
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// 🔹 DELETE user
export const syncUserDeletion = inngest.createFunction(
  {
    id: "ecommerence-delete-user-from-clerk", // ✅ this one matches the error you had
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
