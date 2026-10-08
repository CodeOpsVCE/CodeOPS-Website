import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    activeAgents: { type: Number, default: 0, min: 0 },
    communityMembers: { type: Number, default: 0, min: 0 },
    projectsCompleted: { type: Number, default: 0, min: 0 },
    workshopsConducted: { type: Number, default: 0, min: 0 },
    hackathonsOrganised: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Stats", statsSchema);
