import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const file = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("name"), name))
      .order("desc")
      .first();
    if (file === null) {
      return null;
    }
    const files = await Promise.all(
      file.uploaded.map(async ({ storageId, type }) => ({
        url: await ctx.storage.getUrl(storageId),
        type,
      }))
    );
    return { files };
  },
});

export const generateUploadUrl = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    if (name !== name.toLowerCase()) {
      throw new Error("Unauthenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachUploaded = mutation({
  args: {
    name: v.string(),
    uploaded: v.array(
      v.object({
        storageId: v.string(),
        type: v.string(),
      })
    ),
  },
  handler: async (ctx, { name, uploaded }) => {
    await ctx.db.insert("files", { name, uploaded });
  },
});
