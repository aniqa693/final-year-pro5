// lib/db/schema.ts

import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  json,
  pgEnum,
  decimal,
  primaryKey,
  serial,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

//
// 1. ENUM Types
//
export const roleEnum = pgEnum("roleEnum", [
  "admin",
  "manager",
  "creator",
  "analyst",
  "client",
]);

export const platformEnum = pgEnum("platformEnum", [
  "facebook",
  "instagram",
  "youtube",
]);

export const contentStatusEnum = pgEnum("contentStatusEnum", [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "scheduled",
  "published",
  "failed",
]);

export const aiToolEnum = pgEnum("aiToolEnum", [
  "caption_generator",
  "hashtag_generator",
  "video_title_generator",
  "script_generator",
  "post_idea_generator",
  "keyword_generator",
  "visual_studio",
  "post_generator",
  "thumbnail_generator",
  "post_enhancer",
  "trend_finder",
  "engagement_calculator",
  "growth_tips",
]);

export const subscriptionPlanEnum = pgEnum("subscriptionPlanEnum", [
  "free",
  "pro",
  "enterprise",
]);

export const notificationTypeEnum = pgEnum("notificationTypeEnum", [
  "content_approval",
  "content_rejection",
  "posting_success",
  "posting_failed",
  "credit_warning",
  "credit_expired",
  "performance_alert",
  "trend_alert",
  "system_alert",
]);

//
// 2. Users table (existing - enhanced)
//
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),

  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),

  role: roleEnum("role").notNull().default("creator"),
  availableRoles: json("availableRoles")
    .$type<string[]>()
    .default(sql`'["creator"]'::json`),

  bio: text("bio"),
  company: text("company"),
  location: text("location"),
  website: text("website"),

  // Subscription & Credits
  subscriptionPlan: subscriptionPlanEnum("subscriptionPlan").default("free"),
  credits: integer("credits").default(0),
  creditLimit: integer("creditLimit").default(100),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),

  // Status
  isActive: boolean("isActive").default(true),
  isSuspended: boolean("isSuspended").default(false),

  // Analytics
  lastLogin: timestamp("lastLogin"),
  loginCount: integer("loginCount").default(0),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
// In your schema file (lib/db/schema.ts)
export const captions = pgTable("captions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar(),
  content: json(),
  plateform: varchar(),
  tone: varchar(),
  userEmail: varchar(), // REMOVED: .references(() => users.email)
  createdOn: varchar(),
});
export const titles = pgTable("titles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar(),
  content: json(),
  contentType: varchar(),
  tone: varchar(),
  userEmail: varchar(),
  createdOn: varchar(),
});
export const videoScripts = pgTable("videoScripts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userInput: varchar(),
  content: json(),
  videoType: varchar(),
  tone: varchar(),
  duration: integer(),
  userEmail: varchar(),
  createdOn: varchar(),
});

//
// 3. Accounts table (existing)
//
export const accounts = pgTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),

  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

//
// 4. Sessions table (existing)
//
export const sessions = pgTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
});

//
// 5. Verification tokens (existing)
//
export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

//
// 6. NEW: Social Media Accounts
//
 

// Only the thumbnails table that's actually used in your code
export const thumbnailsTable = pgTable('thumbnails', {
  id: serial('id').primaryKey(),
  userInput: text('user_input').notNull(),
  thumbnailURL: text('thumbnail_url').notNull(),
  includeImage: text('include_image'),
  userEmail: text('user_email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
// That's it - only this one table is needed for your code

// That's it - only this one table is needed for your code

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Captions= typeof captions.$inferSelect;

