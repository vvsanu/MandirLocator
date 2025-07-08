// BAPS Temple Image Mapping Service
// Maps temple cities to their corresponding images from the BAPS website

export interface TempleImageMapping {
  city: string;
  imageUrl: string;
}

export const templeImageMappings: TempleImageMapping[] = [
  {
    city: "Albany, GA",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/863BAPS_ALBANY,_GA.jpg"
  },
  {
    city: "Albany, NY",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/12albanymandirf.jpg"
  },
  {
    city: "Allentown",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1264Allentown.JPG"
  },
  {
    city: "Atlanta",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1301_Homepage%20Photo-f.jpg"
  },
  {
    city: "Atlantic City",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/14atlantic-city.jpg"
  },
  {
    city: "Augusta",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/16augusta1f.jpg"
  },
  {
    city: "Austin",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/15austinmandirf.jpg"
  },
  {
    city: "Beaumont",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/960BAPS%20MAndir%20Beaumont.jpg"
  },
  {
    city: "Birmingham",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/17birmingham01f.jpg"
  },
  {
    city: "Bloomington",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1203BAPS%20Bloomington%20Mandir%20-f.jpg"
  },
  {
    city: "Boston",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/18boston.jpg"
  },
  {
    city: "Brandon",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1474Brandon%20Mandir-f.jpg"
  },
  {
    city: "Calgary",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/901Calgary.jpg"
  },
  {
    city: "Calhoun",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1210BAPS%20Calhoun%20mandir.jpg"
  },
  {
    city: "Cambridge",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/1393BAPS%20Cambridge.jpg"
  },
  {
    city: "Charlotte",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/19charlotte4f.jpg"
  },
  {
    city: "Chattanooga",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/932BAPS%20Shri%20Swaminarayan%20Mandir%20Chattanooga.jpg"
  },
  {
    city: "Cherry Hill",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/20cherry-hill.jpg"
  },
  {
    city: "Chicago",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/21mandirss.jpg"
  },
  {
    city: "Cincinnati",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/900cincinnati.jpg"
  },
  {
    city: "Clear Lake",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/961Clearlake-f.jpg"
  },
  {
    city: "Cleveland",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/22YJ0A2054.JPG"
  },
  {
    city: "Clifton",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/25Clifton.jpg"
  },
  {
    city: "Columbia, SC",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/-1Mandirf.jpg"
  },
  {
    city: "Columbia, TN",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/99701Mandirf.jpg"
  },
  {
    city: "Columbus",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/26Columbus_OH3__1_.JPG"
  },
  {
    city: "Corpus Christi",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/FullSizeImages/27IMG_1186.JPG"
  },
  {
    city: "Crystal Lake",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/1389crystallake.jpg"
  },
  {
    city: "Dallas",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/28dallasf.jpg"
  },
  {
    city: "Dayton",
    imageUrl: "https://www.baps.org/Data/Sites/1/Media/LocationImages/29daytonmandirf.jpg"
  }
];

/**
 * Get temple image URL by city name
 * @param cityName - The city name to search for
 * @returns The image URL if found, null otherwise
 */
export function getTempleImageUrl(cityName: string): string | null {
  // Try exact match first
  const exactMatch = templeImageMappings.find(
    mapping => mapping.city.toLowerCase() === cityName.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch.imageUrl;
  }
  
  // Try partial match (city name contains the search term or vice versa)
  const partialMatch = templeImageMappings.find(
    mapping => 
      mapping.city.toLowerCase().includes(cityName.toLowerCase()) ||
      cityName.toLowerCase().includes(mapping.city.toLowerCase())
  );
  
  return partialMatch ? partialMatch.imageUrl : null;
}

/**
 * Get all available temple cities with images
 * @returns Array of city names that have images
 */
export function getAvailableTempleCities(): string[] {
  return templeImageMappings.map(mapping => mapping.city);
}