import { Button } from "@/components/ui/button";
import { Phone, Mail, Navigation, Info } from "lucide-react";
import type { TempleWithDistance } from "@shared/schema";

interface TempleCardProps {
  temple: TempleWithDistance;
  onViewDetails: (temple: TempleWithDistance) => void;
}

export default function TempleCard({ temple, onViewDetails }: TempleCardProps) {
  const handleGetDirections = () => {
    const query = encodeURIComponent(temple.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (temple.phone) {
      window.location.href = `tel:${temple.phone}`;
    }
  };

  return (
    <div className="card-modern shadow-ethereal interactive-lift animate-fade-in cursor-pointer">
      <div className="p-8">
        <div className="flex items-start space-x-6">
          {temple.imageUrl && (
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
              <img 
                src={temple.imageUrl} 
                alt={`${temple.city} Mandir`}
                className="w-full h-full object-cover rounded-2xl shadow-card hover:shadow-mystical transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <h4 className="text-2xl font-display font-bold text-gradient">{temple.city}</h4>
              <div className="px-4 py-2 gradient-ethereal text-white rounded-full shadow-soft">
                <span className="font-semibold">{temple.distance} mi</span>
              </div>
            </div>
            <p className="text-gray-700 font-body text-lg mb-4 leading-relaxed">{temple.address}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {temple.phone && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <span className="font-body">{temple.phone}</span>
                </div>
              )}
              {temple.email && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <span className="font-body truncate">{temple.email}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGetDirections}
                className="button-modern gradient-ethereal text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-card hover:shadow-mystical transition-all"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(temple)}
                className="button-modern gradient-ocean text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-card hover:shadow-mystical transition-all"
              >
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}