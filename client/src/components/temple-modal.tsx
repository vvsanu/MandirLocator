import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Navigation, Share2 } from "lucide-react";
import type { TempleWithDistance } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TempleModalProps {
  temple: TempleWithDistance | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TempleModal({ temple, isOpen, onClose }: TempleModalProps) {
  const { toast } = useToast();

  if (!temple) return null;

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

  const handleShare = async () => {
    const shareData = {
      title: `${temple.city} BAPS Temple`,
      text: `Check out this BAPS temple in ${temple.city}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${temple.address}`);
        toast({
          title: "Location copied to clipboard",
          description: "Temple information has been copied to your clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Unable to share",
        description: "Could not share temple information",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-deep-blue" style={{ fontFamily: 'serif' }}>
            Temple Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-2xl font-bold text-deep-blue mb-2" style={{ fontFamily: 'serif' }}>
              {temple.city} BAPS Temple
            </h4>
            <p className="text-gray-600 mb-4">{temple.address}</p>
            <div className="inline-block bg-saffron text-white px-3 py-1 rounded-full text-sm font-medium">
              {temple.distance} miles away
            </div>
          </div>
          
          {temple.imageUrl && (
            <div className="flex justify-center">
              <img 
                src={temple.imageUrl} 
                alt={`${temple.city} Mandir`}
                className="w-full max-w-md h-48 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-deep-blue mb-3">Contact Information</h5>
              <div className="space-y-3">
                {temple.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-saffron" />
                    <span>{temple.phone}</span>
                  </div>
                )}
                {temple.fax && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-saffron" />
                    <span>Fax: {temple.fax}</span>
                  </div>
                )}
                {temple.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-saffron" />
                    <span>{temple.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-deep-blue mb-3">Quick Actions</h5>
              <div className="space-y-2">
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-soft transition-all hover-lift"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
                {temple.phone && (
                  <Button
                    onClick={handleCall}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-soft transition-all hover-lift"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Temple
                  </Button>
                )}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-soft transition-all hover-lift"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Location
                </Button>
              </div>
            </div>
          </div>
          
          <div className="gradient-bg-temple rounded-lg p-6 shadow-soft">
            <h5 className="font-semibold text-deep-blue mb-3 text-lg">About This Temple</h5>
            <p className="text-gray-700 leading-relaxed">
              The {temple.city} BAPS Temple serves the spiritual needs of the local Hindu community and welcomes all visitors. 
              The temple offers daily prayers, cultural programs, and educational activities that promote Hindu values and traditions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
