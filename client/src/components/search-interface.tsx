import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [isInputFocused, setIsInputFocused] = useState(false);
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
        description: "Please enter a valid 5-digit zip code",
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
      onSearch({ 
        latitude: location.latitude, 
        longitude: location.longitude 
      });
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please enable location access or use zip code search",
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleZipcodeSearch();
    }
  };

  return (
    <div className="card-floating shadow-divine interactive-lift animate-slide-up p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-primary font-bold text-gradient mb-4 leading-tight tracking-tight drop-shadow-lg animate-fade-in">
          Find Your Nearest BAPS Mandir
        </h2>
        <p className="text-amber-800 text-xl font-body max-w-4xl mx-auto leading-relaxed drop-shadow-sm animate-slide-up whitespace-nowrap">
          Enter your zip code or use your current location to discover sacred temples near you
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <div className="relative">
              <Search className="h-6 w-6 text-amber-700 relative z-10" />
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isInputFocused || zipcode 
                  ? 'bg-amber-300/30 blur-sm scale-125' 
                  : 'bg-transparent'
              }`} />
            </div>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter your zip code (e.g., 10001)"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className="pl-14 pr-6 py-6 text-lg font-body border-0 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-amber-200 focus:bg-white shadow-ethereal"
            disabled={isLoading}
            maxLength={5}
            autoComplete="postal-code"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            onClick={handleZipcodeSearch}
            disabled={isLoading}
            className="button-modern gradient-ocean text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-mystical hover:shadow-divine transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-3 h-5 w-5" />
                Search Temples
              </>
            )}
          </Button>
          
          <div className="text-gray-500 font-medium font-body">or</div>
          
          <Button
            onClick={handleLocationSearch}
            disabled={isLoading || locationLoading}
            className="button-modern gradient-mystical text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-mystical hover:shadow-divine transition-all"
          >
            {locationLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-3 h-5 w-5" />
                Use My Location
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}