import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // The Link: References the Customer collection
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    deviceModel: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    inventory: {
      hasSimCard: { type: Boolean, default: false },
      hasMemoryCard: { type: Boolean, default: false },
      hasBackCover: { type: Boolean, default: true },
    },
    additionalDetails: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Success", "Settled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
