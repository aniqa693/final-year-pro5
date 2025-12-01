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
export const socialAccounts = pgTable("social_account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  platform: platformEnum("platform").notNull(),
  platformAccountId: text("platformAccountId").notNull(),
  platformUsername: text("platformUsername").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),

  // Profile info
  followersCount: integer("followersCount").default(0),
  followingCount: integer("followingCount").default(0),
  postsCount: integer("postsCount").default(0),

  isConnected: boolean("isConnected").default(false),
  lastSynced: timestamp("lastSynced"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

//
// 7. NEW: Content Posts
//
export const posts = pgTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  socialAccountId: text("socialAccountId")
    .notNull()
    .references(() => socialAccounts.id, { onDelete: "cascade" }),

  platform: platformEnum("platform").notNull(),
  platformPostId: text("platformPostId"),

  // Content
  title: text("title"),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls").$type<string[]>(),
  hashtags: json("hashtags").$type<string[]>(),
  mentions: json("mentions").$type<string[]>(),

  // Scheduling & Status
  status: contentStatusEnum("status").default("draft"),
  scheduledFor: timestamp("scheduledFor"),
  publishedAt: timestamp("publishedAt"),
  failedAt: timestamp("failedAt"),
  failureReason: text("failureReason"),

  // Approval workflow
  submittedForApprovalAt: timestamp("submittedForApprovalAt"),
  approvedAt: timestamp("approvedAt"),
  approvedBy: text("approvedBy").references(() => users.id),
  rejectedAt: timestamp("rejectedAt"),
  rejectedBy: text("rejectedBy").references(() => users.id),
  rejectionReason: text("rejectionReason"),

  // AI Generation info
  isAIGenerated: boolean("isAIGenerated").default(false),
  aiToolUsed: aiToolEnum("aiToolUsed"),
  aiPrompt: text("aiPrompt"),
  creditsUsed: integer("creditsUsed").default(0),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

//
// 8. NEW: Post Analytics
//
export const postAnalytics = pgTable("post_analytics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  // Engagement metrics
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  saves: integer("saves").default(0),
  views: integer("views").default(0),
  reach: integer("reach").default(0),
  impressions: integer("impressions").default(0),
  clickThroughs: integer("clickThroughs").default(0),

  // Audience metrics
  engagementRate: decimal("engagementRate", { precision: 5, scale: 2 }).default("0"),
  audienceDemographics: json("audienceDemographics").$type<{
    ageRanges?: { [key: string]: number };
    genders?: { [key: string]: number };
    locations?: { [key: string]: number };
  }>(),

  // Performance scores
  performanceScore: integer("performanceScore").default(0), // 0-100
  trendScore: integer("trendScore").default(0), // 0-100

  collectedAt: timestamp("collectedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 9. NEW: AI Tools Usage
//
export const aiToolUsage = pgTable("ai_tool_usage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  tool: aiToolEnum("tool").notNull(),
  inputData: json("inputData"),
  outputData: json("outputData"),
  creditsUsed: integer("creditsUsed").notNull().default(1),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 10. NEW: Credit Transactions
//
export const creditTransactions = pgTable("credit_transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  type: text("type").notNull(), // 'purchase', 'usage', 'refund', 'bonus'
  amount: integer("amount").notNull(),
  balanceAfter: integer("balanceAfter").notNull(),

  // For purchases
  stripePaymentIntentId: text("stripePaymentIntentId"),
  amountPaid: decimal("amountPaid", { precision: 10, scale: 2 }),

  // For usage
  relatedTool: aiToolEnum("relatedTool"),
  relatedPostId: text("relatedPostId").references(() => posts.id),

  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 11. NEW: Subscription Plans
//
export const subscriptionPlans = pgTable("subscription_plan", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  name: subscriptionPlanEnum("name").notNull(),
  description: text("description"),
  priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }).notNull(),
  priceYearly: decimal("priceYearly", { precision: 10, scale: 2 }),

  creditsIncluded: integer("creditsIncluded").notNull(),
  creditLimit: integer("creditLimit").notNull(),

  features: json("features").$type<string[]>().notNull(),
  isActive: boolean("isActive").default(true),

  stripePriceIdMonthly: text("stripePriceIdMonthly"),
  stripePriceIdYearly: text("stripePriceIdYearly"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

//
// 12. NEW: Notifications
//
export const notifications = pgTable("notification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: json("data"), // Additional context data

  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),

  // Related entities
  relatedPostId: text("relatedPostId").references(() => posts.id),
  relatedUserId: text("relatedUserId").references(() => users.id),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 13. NEW: Reports
//
export const reports = pgTable("report", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),

  // Report data
  metrics: json("metrics").$type<{
    totalPosts?: number;
    totalEngagement?: number;
    averageEngagementRate?: number;
    topPerformingPosts?: string[];
    audienceGrowth?: number;
  }>(),

  insights: json("insights").$type<string[]>(),
  recommendations: json("recommendations").$type<string[]>(),

  // Export info
  exportFormat: text("exportFormat"), // 'pdf', 'csv'
  exportedAt: timestamp("exportedAt"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 14. NEW: Platform Analytics (Global)
//
export const platformAnalytics = pgTable("platform_analytics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  date: timestamp("date").notNull().defaultNow(),

  // User metrics
  totalUsers: integer("totalUsers").notNull(),
  activeUsers: integer("activeUsers").notNull(),
  newUsers: integer("newUsers").notNull(),

  // Content metrics
  totalPosts: integer("totalPosts").notNull(),
  publishedPosts: integer("publishedPosts").notNull(),
  scheduledPosts: integer("scheduledPosts").notNull(),

  // Engagement metrics
  totalEngagement: integer("totalEngagement").notNull(),
  averageEngagementRate: decimal("averageEngagementRate", { precision: 5, scale: 2 }).notNull(),

  // AI usage
  aiToolsUsed: integer("aiToolsUsed").notNull(),
  creditsConsumed: integer("creditsConsumed").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 15. NEW: AI Tools Configuration
//
export const aiToolsConfig = pgTable("ai_tools_config", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  tool: aiToolEnum("tool").notNull().unique(),
  isEnabled: boolean("isEnabled").default(true),
  creditsRequired: integer("creditsRequired").notNull().default(1),
  config: json("config"), // Tool-specific configuration

  updatedBy: text("updatedBy")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

//
// 16. NEW: Content Approval Queue
//
export const approvalQueue = pgTable("approval_queue", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  submittedBy: text("submittedBy")
    .notNull()
    .references(() => users.id),

  submittedAt: timestamp("submittedAt").notNull().defaultNow(),
  assignedTo: text("assignedTo").references(() => users.id), // Admin/Analyst
  priority: integer("priority").default(1), // 1-5, 1 being highest

  status: text("status").default("pending"), // pending, in_review, completed
  completedAt: timestamp("completedAt"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

//
// 17. NEW: User Activity Logs
//
export const userActivityLogs = pgTable("user_activity_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  action: text("action").notNull(), // 'login', 'post_created', 'ai_tool_used', etc.
  resourceType: text("resourceType"), // 'post', 'ai_tool', 'credit', etc.
  resourceId: text("resourceId"),

  details: json("details"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type AIToolUsage = typeof aiToolUsage.$inferSelect;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type PlatformAnalytics = typeof platformAnalytics.$inferSelect;
export type AIToolsConfig = typeof aiToolsConfig.$inferSelect;
export type ApprovalQueue = typeof approvalQueue.$inferSelect;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;