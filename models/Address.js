import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Changed from Number to String (better for leading 0s, formatting)
    pincode: { type: String, required: true },     
    city: { type: String, required: true },
    area: { type: String, required: true },
    state: { type: String, required: true },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt
  }
);

// ✅ Prevents model overwrite during hot reloads
const Address = mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;
