import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    name: v.string(),
    uploaded: v.array(
      v.object({
        storageId: v.string(),
        type: v.string(),
      })
    ),
  }),
});
