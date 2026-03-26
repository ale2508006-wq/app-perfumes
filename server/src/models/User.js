const mongoose = require("mongoose");
const { normalizeRole } = require("../utils/roles");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["usuario", "administrador", "user", "admin"],
      default: "usuario",
      set: (value) => normalizeRole(value),
    },
    photoURL: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function saveRole(next) {
  this.role = normalizeRole(this.role);
  next();
});

module.exports = mongoose.model("User", userSchema);