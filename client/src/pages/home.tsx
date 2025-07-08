import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, Headphones, Users, Map, List } from "lucide-react";
import SearchInterface from "@/components/search-interface";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import TempleCard from "@/components/temple-card";
import TempleModal from "@/components/temple-modal";
import TempleMap from "@/components/temple-map";
import { apiRequest } from "@/lib/queryClient";
import type { TempleWithDistance } from "@shared/schema";
import bapsLogo from "@assets/Baps_logo.svg_1751894801919.png";

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

  const handleRetry = () => {
    refetch();
  };

  const handleViewDetails = (temple: TempleWithDistance) => {
    setSelectedTemple(temple);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemple(null);
  };

  const sortedTemples = temples?.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.city.localeCompare(b.city);
      case "state":
        const stateA = a.address.split(', ').slice(-1)[0] || '';
        const stateB = b.address.split(', ').slice(-1)[0] || '';
        return stateA.localeCompare(stateB);
      default: // distance
        return a.distance - b.distance;
    }
  }) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-warm-gray flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
            </div>
            <ErrorState 
              message="Please check your zip code or try using your current location."
              onRetry={handleRetry}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-app-bg font-primary flex flex-col relative">
      {/* BAPS Temple Background */}
      <div className="baps-temple-bg"></div>
      
      {/* Traditional Background Patterns */}
      <div className="traditional-bg"></div>
      <div className="traditional-overlay"></div>
      <div className="spiritual-corners"></div>
      

      
      <Header />
      
      <main className="flex-1 animate-fade-in relative z-20">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          {isLoading && <LoadingState />}
          
          {temples && temples.length > 0 && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                              className={`px-3 py-1 rounded-md text-sm ${
                                viewMode === "list" 
                                  ? "bg-white text-deep-blue shadow-sm" 
                                  : "text-gray-600 hover:text-deep-blue"
                              }`}
                            >
                              <List className="h-4 w-4 mr-1" />
                              List
                            </Button>
                            <Button
                              variant={viewMode === "map" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setViewMode("map")}
                              className={`px-3 py-1 rounded-md text-sm ${
                                viewMode === "map" 
                                  ? "bg-white text-deep-blue shadow-sm" 
                                  : "text-gray-600 hover:text-deep-blue"
                              }`}
                            >
                              <Map className="h-4 w-4 mr-1" />
                              Map
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Sort by..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distance">Distance</SelectItem>
                            <SelectItem value="name">Temple Name</SelectItem>
                            <SelectItem value="state">State</SelectItem>
                          </SelectContent>
                        </Select>
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
                
                {/* Map Container - Always visible in list mode */}
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
    <header className="glass-nav shadow-2xl sticky top-0 z-50 animate-slide-down relative">
      {/* Spiritual Background Patterns */}
      <div className="spiritual-pattern"></div>
      <div className="lotus-accent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <div className="w-[72px] h-[72px] flex items-center justify-center bg-white rounded-lg p-1.5 shadow-lg">
              <img src={bapsLogo} alt="BAPS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-primary font-bold tracking-tight">
                <span className="text-white drop-shadow-2xl shadow-black/50">
                  BAPS Temple Finder
                </span>
              </h1>
              <p className="text-lg text-white/90 font-secondary font-light italic tracking-wide whitespace-nowrap drop-shadow-xl shadow-black/60">
                Discover Sacred Spaces Near You
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/support">
              <Button variant="ghost" size="sm" className="button-modern bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:shadow-mystical px-3 py-1.5 text-sm rounded-lg drop-shadow-md backdrop-blur-sm">
                <Headphones className="h-5 w-5 mr-1.5" />
                <span className="hidden sm:inline">Support</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent Border */}

    </header>
  );
}

function Footer() {
  return (
    <footer className="gradient-celestial border-t border-white/20 mt-auto shadow-2xl backdrop-blur-sm animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={bapsLogo} alt="BAPS Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
              </div>
              <span className="text-xl font-primary font-bold text-amber-900 tracking-tight drop-shadow-md">
                BAPS
              </span>
            </div>
            <p className="text-gray-800 font-body text-sm leading-relaxed drop-shadow-md">
              Connecting you to spiritual centers worldwide. Find your nearest BAPS temple and join our community.
            </p>
          </div>
          
          <div>
            <h6 className="font-primary font-semibold text-amber-900 mb-3 text-base tracking-tight drop-shadow-md">Quick Links</h6>
            <ul className="space-y-1 font-body text-gray-800 text-sm">
              <li><a href="https://baps.org" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-all hover:underline drop-shadow-md">About BAPS</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-primary font-semibold text-amber-900 mb-3 text-base tracking-tight drop-shadow-md">Need Help?</h6>
            <p className="text-gray-800 font-body mb-3 text-sm leading-relaxed drop-shadow-md">
              Having trouble finding a temple or need assistance? Contact our support team.
            </p>
            <Link to="/support">
              <Button className="button-modern gradient-ethereal text-white px-3 py-1 text-sm rounded-lg shadow-card hover:shadow-mystical transition-all font-semibold drop-shadow-md">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-4 pt-3 text-center">
          <p className="font-body text-gray-700 text-sm drop-shadow-md">&copy; 2025 BAPS. All rights reserved. | Built with respect for spiritual traditions.</p>
        </div>
      </div>
    </footer>
  );
}