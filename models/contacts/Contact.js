import { Schema, model } from "mongoose";
import { version } from "os";
import { handleSaveError } from "./hooks.js";

export const phoneType = /^\(\d{3}\) \d{3}-\d{4}/;
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: phoneType,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);
export default Contact;
