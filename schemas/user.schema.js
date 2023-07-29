import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { genderEnum } from "../utils/enums.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePictrue: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [200, "Bio at most 200 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must have at least 8 characters"],
      select: false,
    },
    gender: {
      type: String,
      enum: genderEnum,
      default: "Unknown",
    },
    friendsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sentFriendRequestsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    receivedFriendRequestsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
    },
    blockedUsersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    publicKey: {
      type: String,
      required: true,
      select: false,
    },
    privateKey: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }

  if (this.isModified("publicKey") && this.isModified("privateKey")) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  next();
});

userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  },

  getUserToken: function () {
    return jwt.sign(
      {
        id: this._id,
        username: this.username,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiry,
      }
    );
  },

  isBlocked: function (userid) {
    return this.blockedUsers.includes(userid);
  },
};

export default mongoose.model("User", userSchema);
