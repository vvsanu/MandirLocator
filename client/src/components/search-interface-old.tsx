import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Loader2 } from "lucide-react";
import { getCurrentLocation, validateZipcode } from "@/lib/geocoding";
import { useToast } from "@/hooks/use-toast";

interface SearchInterfaceProps {
  onSearch: (params: { zipcode?: string; latitude?: number; longitude?: number }) => void;
  isLoading: boolean;
}

export default function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const [zipcode, setZipcode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast } = useToast();

  const handleZipcodeSearch = () => {
    if (!zipcode.trim()) {
      toast({
        title: "Please enter a zip code",
        description: "Enter your zip code to find nearby temples",
        variant: "destructive",
      });
      return;
    }

    if (!validateZipcode(zipcode)) {
      toast({
        title: "Invalid zip code",
        description: "Please enter a valid 5-digit US zip code",
        variant: "destructive",
      });
      return;
    }

    onSearch({ zipcode: zipcode.trim() });
  };

  const handleLocationSearch = async () => {
    setLocationLoading(true);
    
    try {
      const location = await getCurrentLocation();
      onSearch({ latitude: location.latitude, longitude: location.longitude });
    } catch (error) {
      toast({
        title: "Location Error",
        description: error instanceof Error ? error.message : "Unable to get your location",
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleZipcodeSearch();
    }
  };

  return (
    <div className="card-floating border-0 shadow-divine interactive-lift animate-slide-up p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-display font-bold text-gradient mb-4 leading-tight">
            Find Your Nearest BAPS Mandir
          </h2>
          <p className="text-gray-600 text-xl font-body max-w-2xl mx-auto leading-relaxed">
            Enter your zip code or use your current location to discover sacred temples near you
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-purple-400" />
            </div>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your zip code (e.g., 10001)"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-14 pr-6 py-6 text-lg font-body border-0 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-purple-200 focus:bg-white shadow-ethereal"
              disabled={isLoading}
              maxLength={5}
              autoComplete="postal-code"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              onClick={handleZipcodeSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-8 py-4 font-semibold touch-manipulation shadow-elegant transition-all hover-lift"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Temples
                </>
              )}
            </Button>
            
            <div className="text-gray-500 font-medium">or</div>
            
            <Button
              onClick={handleLocationSearch}
              disabled={isLoading || locationLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 font-semibold touch-manipulation shadow-elegant transition-all hover-lift"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Use My Location
                </>
              )}
            </Button>
          </div>
        </div>
    </div>
  );
}
