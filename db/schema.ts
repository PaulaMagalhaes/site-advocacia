import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const courseAccessGrants = sqliteTable("course_access_grants", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  courseSlug: text("course_slug").notNull(),
  invoiceUrl: text("invoice_url"),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const courseCheckoutSettings = sqliteTable("course_checkout_settings", {
  courseSlug: text("course_slug").primaryKey(),
  provider: text("provider").notNull().default("hotmart"),
  checkoutUrl: text("checkout_url").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at").notNull(),
});
