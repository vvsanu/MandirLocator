import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const temples = pgTable("temples", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  fax: text("fax"),
  email: text("email"),
  operatingHours: text("operating_hours"),
  operatingDays: text("operating_days"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  imageUrl: text("image_url"),
});

export const insertTempleSchema = createInsertSchema(temples).omit({
  id: true,
});

export type InsertTemple = z.infer<typeof insertTempleSchema>;
export type Temple = typeof temples.$inferSelect;

export const searchSchema = z.object({
  zipcode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().default(50), // miles
});

export type SearchRequest = z.infer<typeof searchSchema>;

export interface TempleWithDistance extends Temple {
  distance: number;
}
