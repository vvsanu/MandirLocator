import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, Menu, Info, Users, Map, List } from "lucide-react";
import SearchInterface from "@/components/search-interface";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import TempleCard from "@/components/temple-card";
import TempleModal from "@/components/temple-modal";
import TempleMap from "@/components/temple-map";
import { apiRequest } from "@/lib/queryClient";
import type { TempleWithDistance } from "@shared/schema";
import bapsLogo from "@assets/image_1751840390730.png";

type SortOption = "distance" | "name" | "state";

export default function Home() {
  const [searchParams, setSearchParams] = useState<{
    zipcode?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [selectedTemple, setSelectedTemple] = useState<TempleWithDistance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const {
    data: temples,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/temples/search", searchParams],
    queryFn: async () => {
      if (!searchParams) return [];
      
      const response = await apiRequest("POST", "/api/temples/search", searchParams);
      return response.json() as Promise<TempleWithDistance[]>;
    },
    enabled: !!searchParams,
  });

  const handleSearch = (params: { zipcode?: string; latitude?: number; longitude?: number }) => {
    setSearchParams(params);
  };

  const handleViewDetails = (temple: TempleWithDistance) => {
    setSelectedTemple(temple);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemple(null);
  };

  const handleRetry = () => {
    refetch();
  };

  const sortedTemples = temples ? [...temples].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.city.localeCompare(b.city);
      case "state":
        const stateA = a.address.split(",").slice(-2, -1)[0]?.trim() || "";
        const stateB = b.address.split(",").slice(-2, -1)[0]?.trim() || "";
        return stateA.localeCompare(stateB);
      case "distance":
      default:
        return a.distance - b.distance;
    }
  }) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <ErrorState 
            message="Please check your zip code or try using your current location."
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          {isLoading && <LoadingState />}
          
          {temples && temples.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={`grid grid-cols-1 gap-8 ${viewMode === "list" ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>
                {/* Results List */}
                <div className={viewMode === "list" ? "lg:col-span-2" : "lg:col-span-1"}>
                  <Card>
                    <CardHeader className="border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-deep-blue">
                          {temples.length} Temple{temples.length !== 1 ? 's' : ''} Found
                        </CardTitle>
                        <div className="flex items-center space-x-4">
                          {/* View Mode Toggle */}
                          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                          <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={viewMode === "list" ? "bg-white shadow-sm" : ""}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === "map" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("map")}
                            className={viewMode === "map" ? "bg-white shadow-sm" : ""}
                          >
                            <Map className="h-4 w-4" />
                          </Button>
                        </div>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distance">Sort by Distance</SelectItem>
                            <SelectItem value="name">Sort by Name</SelectItem>
                            <SelectItem value="state">Sort by State</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {viewMode === "list" ? (
                      <div className="divide-y divide-gray-200">
                        {sortedTemples.map((temple) => (
                          <div key={temple.id} className="p-6">
                            <TempleCard 
                              temple={temple} 
                              onViewDetails={handleViewDetails}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6">
                        {searchParams && (
                          <TempleMap
                            temples={sortedTemples}
                            center={{ 
                              lat: searchParams.latitude || 39.8283, 
                              lng: searchParams.longitude || -98.5795 
                            }}
                            onTempleSelect={handleViewDetails}
                            selectedTemple={selectedTemple}
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Map Container - Always visible */}
              {viewMode === "list" && (
                <div className="lg:col-span-1">
                  <Card className="sticky top-8">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-deep-blue">
                        Temple Locations
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      {searchParams ? (
                        <TempleMap
                          temples={sortedTemples}
                          center={{ 
                            lat: searchParams.latitude || 39.8283, 
                            lng: searchParams.longitude || -98.5795 
                          }}
                          onTempleSelect={handleViewDetails}
                          selectedTemple={selectedTemple}
                        />
                      ) : (
                        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-saffron mx-auto mb-2" />
                            <p className="text-deep-blue font-medium">Search for Temples</p>
                            <p className="text-gray-600 text-sm">Enter location to see map</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-3 h-3 bg-deep-blue rounded-full"></div>
                          <span className="text-gray-600">Your Location</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-3 h-3 bg-saffron rounded-full"></div>
                          <span className="text-gray-600">BAPS Temples</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
        
        {temples && temples.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No temples found</h3>
                  <p className="text-gray-600">Try expanding your search radius or check your location.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </main>
        
        <TempleModal 
          temple={selectedTemple}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
        
        <Footer />
      </div>
    );
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={bapsLogo} alt="BAPS Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-deep-blue" style={{ fontFamily: 'serif' }}>
                BAPS Mandir
              </h1>
              <p className="text-sm text-gray-600">Locator</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={bapsLogo} alt="BAPS Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-lg font-bold text-deep-blue" style={{ fontFamily: 'serif' }}>
                BAPS
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Connecting you to spiritual centers worldwide. Find your nearest BAPS temple and join our community.
            </p>
          </div>
          
          <div>
            <h6 className="font-semibold text-deep-blue mb-4">Quick Links</h6>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://baps.org" target="_blank" rel="noopener noreferrer" className="hover:text-saffron transition-colors">About BAPS</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold text-deep-blue mb-4">Need Help?</h6>
            <p className="text-gray-600 text-sm mb-4">
              Having trouble finding a temple or need assistance? Contact our support team.
            </p>
            <Link to="/support">
              <Button className="bg-saffron hover:bg-orange-600 text-white">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 BAPS. All rights reserved. | Built with respect for spiritual traditions.</p>
        </div>
      </div>
    </footer>
  );
}
