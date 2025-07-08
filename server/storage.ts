import { temples, type Temple, type InsertTemple, type TempleWithDistance } from "@shared/schema";
import { getTempleImageUrl } from "./imageMapping";

export interface IStorage {
  getTemple(id: number): Promise<Temple | undefined>;
  getAllTemples(): Promise<Temple[]>;
  createTemple(temple: InsertTemple): Promise<Temple>;
  searchTemplesByLocation(latitude: number, longitude: number, radiusMiles: number): Promise<TempleWithDistance[]>;
}

export class MemStorage implements IStorage {
  private temples: Map<number, Temple>;
  private currentId: number;

  constructor() {
    this.temples = new Map();
    this.currentId = 1;
    this.initializeTemples();
  }

  private initializeTemples() {
    // Parse CSV data and populate temples
    const csvData = `City,Address,Phone,Fax,Email,Operating Hours,Operating Days
Agawam,"605 Silver Street, Agawam, MA 01001 USA","(413) 786-4878","(413) 786-4877",,,
Albany, GA,"1203 Cordele Rd, Albany, GA 31705 USA","229-291-3555",,,,
Albany, NY,"16 Computer Drive East, Albany, NY 12205 USA","(518) 489 1870",,,,
Allentown,"4166 Lower Saucon Road, Hellertown, PA 18055-3322 USA","(610) 748-7007",,,,
Atlanta,"460 Rockbridge Road NW, Lilburn, GA 30047 USA","(678) 906-2277","(678) 906-2984","info.atlanta@usa.baps.org",,
Atlantic City,"713 S Second Avenue, Galloway, Atlantic City, NJ 08205 USA","(609) 257 6520",,,,
Augusta,"837 Furys Ferry Rd, Evans, GA 30809 USA","(706) 228 3426","(706) 228 3135",,,
Austin,"12246 Running Bird Lane, Austin, TX 78758-2634 USA","(512) 835 2277","(512) 835 2278",,,
Beaumont,"1345 South Major Drive, Beaumont, TX 77707 USA","409-444-3374",,,,
Benchmark,"1 BAPS Drive, Cincinnati, OH 45246 USA","(513) 326 2364",,,,
Birmingham,"500 Biscayne Dr, Birmingham, AL 35206 USA","(205) 833 3287",,,,
Bloomington,"1414 Leslie Dr., Bloomington, IL 61704 USA","309-386-1860",,,,
Boston,"50 Stedman Street, Lowell, MA 01851 USA","(978) 458 4444","(978) 458 4474",,,
Brandon,"327 8th St, Brandon, MB R7A 3X5 Canada",,,"info@ca.baps.org",,
Calgary,"292200 Wagon Wheel Blvd., Calgary, AB T4A 0T5 Canada","403-953-2277",,,,
Calhoun,"215 West Line Street, Calhoun, GA 30701-4747 USA","706-581-5220",,,,
Cambridge,"333 Speedsville Road, Cambridge, ON N3H4R6 Canada","(519) 219-4820",,,,
Charlotte,"4100 Margaret Wallace Road, Matthews, NC 28105 USA","(704) 573 0805","(704) 573 0820",,,
Chattanooga,"377 Direct Connection Dr, Rossville, GA 30741 USA","(423) 237-7986",,,,
Chefry Hill,"1 Carnegie Plaza, Cherry Hill, NJ 08003 USA","(856) 751 7600","(856) 751 8070",,,
Chicago,"1851 S IL Route 59, Pramukh Swami Rd, Bartlett, IL 60103-3008 USA","(630) 213 2277","(630) 213 2088","info.chicago@usa.baps.org",,
Cincinnati,"1 BAPS Drive, Cincinnati, OH 45246 USA","(513) 326 2364",,,,
Clear Lake,"401 Landing Blvd, League City, TX 77573 USA","281-685-1457",,,,
Cleveland,"2915 Laurel Road, Brunswick, OH 44212 USA","(330) 220 4020","(330) 220 6672",,,
Clifton,"854 Bloomfield Avenue, Clifton, NJ 07012 USA","(973) 779 0700",,,,
Columbia, SC,"721 Arrowwood Rd, Columbia, SC 29210 USA","803-227-7129",,,,
Columbia, TN,"1024 East Valley Dr, Columbia, TN 38401 USA","(931) 626 0546",,,,
Columbus,"5419 E Broad Street, Columbus, OH 43213 USA","(614) 873 7300","(614) 873 7301",,,
Corpus Christi,"1001 Lantana St, Corpus Christi, TX 78407-1107 USA","361-239-8703",,,,
Crystal Lake,"1300 Cunat Ct, Lake In the Hills, Crystal Lake, IL 60156 USA","224-678-7227",,,,
Dallas,"4601 N State Highway 161, Irving, TX 75038 USA","(972) 243 8669","(972) 406 8481",,,
Dayton,"5282 Bellefontaine Rd, Huber Heights, OH 45424 USA","(937) 233 3220","(937) 233 3377",,,
Delaware,"1 Pramukh Swami Way, New Castle, DE 19720 USA","(302) 322 8505","(302) 322 8504",,,
Denver,"8200 Southpark Circle, Unit 500, Littleton, CO 80120 USA","720-583-5835",,,,
Detroit,"3175 S. Canton Center Road, Canton, MI 48188 USA","(734) 397 2233",,,,
Dothan,"3113 Oxmoor Ind Blvd, Dothan, AL 36303 USA","334-984-2277",,,,
Downingtown,"1155 Horseshoe Pike, Downingtown, PA 19335 USA","484-293-1401",,,,
Edison,"2500 Woodbridge Avenue, Edison, NJ 08817 USA","(732) 572 1234",,"info.edison@usa.baps.org",,
Edmonton,"3223 Parsons Rd NW, Edmonton, AB T6N 1B4 Canada","587-206-2277",,,,
Evansville,"8122 Robin Hill Rd, Newburgh, IN 47630 USA","812-490-0446",,,,
Fall River,"4 Commercial Street, Sharon, MA 02067 USA","(781) 784-8800",,,,
Florence,"120 Sebrell St, Florence, SC 29505 USA",,,,,
Fort McMurray,"Fort McMurray, AB Canada",,,,,
Fresno,"8105 N. Maple Avenue, Fresno, CA 93720 USA","(559) 264 1001","(559) 264 1001",,,
Gainesville,"13020 SW Archer Road, Archer, FL 32618 USA","352-641-2277",,,,
Greenville,"5 Webb Road, Greenville, SC 29607 USA","864-283-0857",,,,
Greensboro,"922 Gallimore Dairy Road, High Point, NC 27265 USA","(336) 355-9798",,,,
Hamilton,"412 Rennie Street, Hamilton, ON L8H 3P5 Canada",,,"info@ca.baps.org",,
Harrisburg,"245/265 Reynders St, Harrisburg, PA 17113 USA","(717) 546-0755",,,,
Hartford,"647 North Mountain Road, Newington, CT 06111 USA","(860) 953 2272","(860) 953 0102",,,
Houston,"1150 Brand Lane, Stafford, TX 77477 USA","281-765-2277","281-765-2278","info.houston@usa.baps.org",,
Huntsville,"12544 Henderson Lane, Madison, AL 35756 USA",,,,,
Indianapolis,"512 S Madison Ave, Greenwood, IN 46142 USA","(317) 271-1577",,,,
Jackson,"2390 Greenway Drive, Jackson, MS 39204 USA","769-777-7700","769-777-7701",,,
Jacksonville,"7500 Merrill Road, Jacksonville, FL 32277 USA","(904) 744 5352",,,,
Jersey City,"2000 Tonnelle Avenue, North Bergen, NJ 07047 USA","(201) 865 6555","(201) 865 1247",,,
Kansas City,"15220 W 65th Street, Shawnee, KS 66217 USA","(913) 962-2424",,,,
Kennesaw,"3380 Chastain Meadows Parkway, Kennesaw, GA 30144 USA",,,,,
Knoxville,"602 Brakebill Rd., Knoxville, TN 37924 USA","(865) 312 5110",,,,
Lansdale,"2021 E. Township Line Road, Souderton, PA 18964 USA","(215) 799 2277",,,,
Little Rock,"5601 Pritchard Dr., North Little Rock, AR 72117 USA","(501) 945 3388",,,,
Long Island,"2 Deshon Drive, Melville, NY 11747 USA","(631) 996-9237","(631) 996-9236",,,
Los Angeles,"15100 Fairfield Ranch Rd., Chino Hills, CA 91709 USA","(909) 614 5000","(909) 614 5050","info.la@usa.baps.org",,
Louisville,"1620 KY-1793, Goshen, KY 40026 USA","(502) 414-3141",,,,
Lubbock,"5206, 11 TH ST, Lubbock, TX 79416 USA","(806) 500 2008",,,,
Memphis,"4790 American Way, Memphis, TN 38118 USA","(901) 794 0343","(901) 7940365",,,
Melbourne,"801 Masterson Street, Melbourne, FL 32935 USA","(321) 610-8951",,,,
Milwaukee,"N35 W23986 Capitol Drive, Pewaukee, WI 53072 USA","262-737-6019",,,,
Minneapolis,"2300, Freeway Boulevard, Brooklyn Center, MN 55430-1730 USA","(763) 278-2288","(763) 278-2244",,,
Montgomery,"8285 Ryan Road, Montgomery, AL 36117 USA",,,,,
Morgantown,"116 Dent Avenue, Morgantown, WV 26501 USA","3044496772",,,,
Munster,"400 West 44th Pl, Griffith, IN 46319 USA","219-267-1120",,,,
Myrtle Beach,"920 Shine Avenue, Myrtle Beach, SC 29577 USA","843-808-2277",,,,
Nashville,"4137 Andrew Jackson Parkway, Hermitage, TN 37076 USA","(615) 871-9622",,,,
New Haven,"25 Research Drive, Milford, CT 06460 USA","203-701-9749",,,,
New Orleans,"10328 River Rd, St Rose, New Orleans, LA 70087 USA",,,,,
New York,"43-38 Bowne Street, Flushing, NY 11355 USA","(718) 539 5373","(718) 539 5374",,,
Northern Virginia,"4160 Pleasant Valley Road, Chantilly, VA 20151 USA","571-299-4788",,,,
Oklahoma,"3500 N Meridian Ave, Oklahoma, OK 73112 USA",,,,,
Orangeburg,"3721 Magnolia Street, Orangeburg, SC 29118 USA","(803) 937-6616",,,,
Orlando,"1325 West Oakridge Road, Orlando, FL 32809 USA","(407) 857 0091","(407) 856 9288",,,
Parsippany,"3 Entin Road, Parsippany, NJ 07054 USA","(973) 515 7300","(973) 585 6026",,,
Perry,"736, Mason Terrace, Perry, GA 31069 USA","(478) 218 9392",,,,
Philadelphia,"1561 Woodbourne Road, Levittown, PA 19057 USA","(215) 269 7680","(215) 269 7690",,,
Phoenix,"3620 N Black Canyon Highway, Phoenix, AZ 85017 USA","(480) 357 9922","(480) 357 9941",,,
Piscataway,"81 Suttons Lane, Piscataway, NJ 08854 USA","(732) 777 1414","(732) 777 1616",,,
Pittsburgh,"90 Grant Street, Corappolis, PA 15108 USA","(412) 294-9992",,,,
Portland,"11365 SW Tigard St., Tigard, OR 97223 USA","(503) 597-3030",,,,
Raleigh,"1020 Aviation Parkway, Morrisville, NC 27560 USA","(919) 469 6605",,,,
Richmond,"7041 Route 1 North, Chesterfield, VA 23237 USA","(804) 275 3726","(804) 275 3113",,,
Robbinsville,"112 N Main Street, Robbinsville, NJ 08561 USA","(609) 918 1212",,"info.akshardham@usa.baps.org",,
Roanoke,"115 Sheraton Drive, Salem, VA 24153 USA","540-384-2491",,,,
Sacramento,"10548 Armstrong Ave, Mather, CA 95655 USA","916 822 4290",,,,
San Antonio,"5044 N. Loop, 1604 W, San Antonio, TX 78249 USA","(210) 492 4008","(210) 479 6051",,,
San Francisco,"333 Tunnel Ave, San Francisco, CA 94134 USA","415-859-9316",,,,
San Jose,"1430 California Circle, Milpitas, CA 95035 USA","(408) 263 2277","(408) 262 1022",,,
Savannah,"355 Canebrake Rd, Savannah, GA 31419 USA","(912) 920 2121","(912) 920 2220",,,
Scarborough,"1840 Birchmount Road, Scarborough, ON M1P 2H7 Canada","416-321-2277",,,,
Scranton,"301 Oak St, Scranton, PA 18508 USA","(570) 961 1006","(570) 824 2002",,,
Seattle,"15440 NE 95th Street, Redmond, WA 98052 USA","(425) 780-7140",,,,
South Boston,"4 Commercial St, Sharon, MA 02067 USA","(781) 784 8800",,,,
Springfield,"605 Silver Street, Agawam, MA 01001 USA","(413) 786-4878","(413) 786-4877",,,
St. Louis,"12305 Natural Bridge Road, Bridgeton, MO 63044 USA","(314) 395 5742",,,,
Staunton,"870 Parkersburg Turnpike, Staunton, VA 24401 USA","540-712-7106",,,,
Sterling Heights,"43601 Van Dyke Ave, Sterling Heights, MI 48314 USA","586-745-0505",,,,
Syracuse,"310 Gateway Park Dr., Syracuse, NY 13212 USA","(315) 445 3034","(315) 635 3108",,,
Tampa,"9556 E. Fowler Avenue, Thonotosassa, FL 33592 USA","(813) 986 5473",,,,
Toronto,"61 Claireville Drive, Toronto, ON M9W 5Z7 Canada","(416) 798-2277","(416) 798-4498","info@ca.baps.org",,
Tucson,"1550 North Oracle Road, Tucson, AZ 85705 USA","(520) 251 1800","(520) 882 8418",,,
Vancouver,"Unit 201, 9385 120th Street, Delta, BC V4C 0B5 Canada","672 515 2277",,,,
Virginia Beach,"6014 Jefferson Ave, Newport News, VA 23605 USA","(757) 246 4070","(757) 246 4071",,,
Warrington,"998 Easton Road, Warrington, PA 18976 USA","215-491-BAPS (2277)",,,,
Washington DC,"4320 Ammendale Rd, Beltsville, MD 20705 USA","(301) 931 3135","(301) 931 3136",,,
Westborough,"275 Turnpike Road, Westborough, MA 01581 USA","(508) 366 2277",,,,
Westchester,"556, Yonkers Avenue, Yonkers, NY 10704 USA","(914) 375-4334","(914) 375-4335",,,
Windsor,"1767 Northway Avenue, Windsor, ON N9B 3M1 Canada","226-221-9494",,,,
Winnipeg,"1488 Red River Dr, Howden, MB R5A 1K2 Canada","204-504-2277",,,,`;

    const lines = csvData.trim().split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      const parts = this.parseCSVLine(line);
      if (parts.length >= 2) {
        const cityName = parts[0]?.trim() || '';
        const temple: Temple = {
          id: this.currentId++,
          city: cityName,
          address: parts[1]?.trim() || '',
          phone: (parts[2]?.trim() && parts[2].trim() !== '') ? parts[2].trim() : null,
          fax: (parts[3]?.trim() && parts[3].trim() !== '') ? parts[3].trim() : null,
          email: (parts[4]?.trim() && parts[4].trim() !== '') ? parts[4].trim() : null,
          operatingHours: (parts[5]?.trim() && parts[5].trim() !== '') ? parts[5].trim() : null,
          operatingDays: (parts[6]?.trim() && parts[6].trim() !== '') ? parts[6].trim() : null,
          latitude: null,
          longitude: null,
          imageUrl: getTempleImageUrl(cityName),
        };
        this.temples.set(temple.id, temple);
      }
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  async getTemple(id: number): Promise<Temple | undefined> {
    return this.temples.get(id);
  }

  async getAllTemples(): Promise<Temple[]> {
    return Array.from(this.temples.values());
  }

  async createTemple(insertTemple: InsertTemple): Promise<Temple> {
    const id = this.currentId++;
    const temple: Temple = { 
      id,
      city: insertTemple.city,
      address: insertTemple.address,
      phone: insertTemple.phone ?? null,
      fax: insertTemple.fax ?? null,
      email: insertTemple.email ?? null,
      operatingHours: insertTemple.operatingHours ?? null,
      operatingDays: insertTemple.operatingDays ?? null,
      latitude: insertTemple.latitude ?? null,
      longitude: insertTemple.longitude ?? null,
      imageUrl: getTempleImageUrl(insertTemple.city)
    };
    this.temples.set(id, temple);
    return temple;
  }

  async searchTemplesByLocation(latitude: number, longitude: number, radiusMiles: number): Promise<TempleWithDistance[]> {
    const temples = Array.from(this.temples.values());
    const results: TempleWithDistance[] = [];

    for (const temple of temples) {
      // For now, use approximate coordinates based on city/address
      const templeCoords = this.getApproximateCoordinates(temple.city, temple.address);
      
      if (templeCoords) {
        const distance = this.calculateDistance(latitude, longitude, templeCoords.lat, templeCoords.lng);
        
        if (distance <= radiusMiles) {
          results.push({
            ...temple,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
          });
        }
      }
    }

    return results.sort((a, b) => a.distance - b.distance);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  private getApproximateCoordinates(city: string, address: string): { lat: number, lng: number } | null {
    // Simplified coordinate mapping for major cities near BAPS temples
    const coordinates: { [key: string]: { lat: number, lng: number } } = {
      "Agawam": { lat: 42.0695, lng: -72.6148 },
      "Albany": { lat: 31.5804, lng: -84.1557 },
      "Allentown": { lat: 40.6023, lng: -75.4714 },
      "Atlanta": { lat: 33.7490, lng: -84.3880 },
      "Austin": { lat: 30.2672, lng: -97.7431 },
      "Beaumont": { lat: 30.0804, lng: -94.1266 },
      "Birmingham": { lat: 33.5207, lng: -86.8025 },
      "Boston": { lat: 42.3601, lng: -71.0589 },
      "Calgary": { lat: 51.0447, lng: -114.0719 },
      "Charlotte": { lat: 35.2271, lng: -80.8431 },
      "Chicago": { lat: 41.8781, lng: -87.6298 },
      "Cincinnati": { lat: 39.1612, lng: -84.4569 },
      "Cleveland": { lat: 41.4993, lng: -81.6944 },
      "Columbus": { lat: 39.9612, lng: -82.9988 },
      "Dallas": { lat: 32.7767, lng: -96.7970 },
      "Denver": { lat: 39.7392, lng: -104.9903 },
      "Detroit": { lat: 42.3314, lng: -83.0458 },
      "Edison": { lat: 40.5187, lng: -74.4121 },
      "Fresno": { lat: 36.7378, lng: -119.7871 },
      "Houston": { lat: 29.7604, lng: -95.3698 },
      "Indianapolis": { lat: 39.7684, lng: -86.1581 },
      "Jacksonville": { lat: 30.3322, lng: -81.6557 },
      "Kansas City": { lat: 39.0997, lng: -94.5786 },
      "Las Vegas": { lat: 36.1699, lng: -115.1398 },
      "Los Angeles": { lat: 34.0522, lng: -118.2437 },
      "Memphis": { lat: 35.1495, lng: -90.0490 },
      "Miami": { lat: 25.7617, lng: -80.1918 },
      "Minneapolis": { lat: 44.9778, lng: -93.2650 },
      "Nashville": { lat: 36.1627, lng: -86.7816 },
      "New York": { lat: 40.7128, lng: -74.0060 },
      "Orlando": { lat: 28.5383, lng: -81.3792 },
      "Philadelphia": { lat: 39.9526, lng: -75.1652 },
      "Phoenix": { lat: 33.4484, lng: -112.0740 },
      "Pittsburgh": { lat: 40.4406, lng: -79.9959 },
      "Portland": { lat: 45.5152, lng: -122.6784 },
      "Raleigh": { lat: 35.7796, lng: -78.6382 },
      "Sacramento": { lat: 38.5816, lng: -121.4944 },
      "San Antonio": { lat: 29.4241, lng: -98.4936 },
      "San Francisco": { lat: 37.7749, lng: -122.4194 },
      "San Jose": { lat: 37.3382, lng: -121.8863 },
      "Seattle": { lat: 47.6062, lng: -122.3321 },
      "Tampa": { lat: 27.9506, lng: -82.4572 },
      "Toronto": { lat: 43.6532, lng: -79.3832 },
      "Tucson": { lat: 32.2226, lng: -110.9747 },
      "Washington": { lat: 38.9072, lng: -77.0369 },
    };
    
    // Try to match the city name first
    const cityKey = Object.keys(coordinates).find(key => 
      city.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(city.toLowerCase())
    );
    
    if (cityKey) {
      return coordinates[cityKey];
    }
    
    // Fallback to a default location if no match found
    return { lat: 39.8283, lng: -98.5795 }; // Geographic center of US
  }
}

export const storage = new MemStorage();