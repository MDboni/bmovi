import { Inngest } from "inngest";
import UserModel from "../models/User.js";

export const inngest = new Inngest({ id: "Movie-ticket-booking" });

// User Created
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "no-email@unknown.com", // ✅ fallback added
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image: image_url,
    };

    await UserModel.create(userData);
  }
);

// User Deleted
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await UserModel.findByIdAndDelete(id);
  }
);

// User Updated
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
];
