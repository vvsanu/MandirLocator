import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all temples
  app.get("/api/temples", async (req, res) => {
    try {
      const temples = await storage.getAllTemples();
      res.json(temples);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch temples" });
    }
  });

  // Get a specific temple by ID
  app.get("/api/temples/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid temple ID" });
      }
      
      const temple = await storage.getTemple(id);
      if (!temple) {
        return res.status(404).json({ error: "Temple not found" });
      }
      
      res.json(temple);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch temple" });
    }
  });

  // Search temples by location
  app.post("/api/temples/search", async (req, res) => {
    try {
      const searchData = searchSchema.parse(req.body);
      
      let latitude: number;
      let longitude: number;
      
      if (searchData.zipcode) {
        // Convert zip code to coordinates using a geocoding service
        const geocodeResult = await geocodeZipcode(searchData.zipcode);
        if (!geocodeResult) {
          return res.status(400).json({ error: "Invalid zip code or geocoding failed" });
        }
        latitude = geocodeResult.lat;
        longitude = geocodeResult.lng;
      } else if (searchData.latitude && searchData.longitude) {
        latitude = searchData.latitude;
        longitude = searchData.longitude;
      } else {
        return res.status(400).json({ error: "Either zipcode or latitude/longitude must be provided" });
      }
      
      const temples = await storage.searchTemplesByLocation(latitude, longitude, searchData.radius);
      res.json(temples);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid search parameters", details: error.errors });
      }
      res.status(500).json({ error: "Failed to search temples" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple geocoding function using a public API
async function geocodeZipcode(zipcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Use a free geocoding service - in production, use a proper API key
    const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.places && data.places.length > 0) {
      return {
        lat: parseFloat(data.places[0].latitude),
        lng: parseFloat(data.places[0].longitude)
      };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
