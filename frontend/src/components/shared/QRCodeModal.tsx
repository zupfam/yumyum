import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useUIStore } from '../../store/use-ui.store';
import { Button } from '../ui/button';
import { Download, Share2 } from 'lucide-react';

export function QRCodeModal() {
  const { isQRCodeModalOpen, closeQRCodeModal } = useUIStore();

  const handleDownload = () => {
    // Logic to download QR code
    alert('Downloading QR Code...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'YumYum Menu',
        url: window.location.href,
      });
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  return (
    <Dialog open={isQRCodeModalOpen} onOpenChange={closeQRCodeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Menu QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-100">
            {/* Real QR would be generated here */}
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
              QR CODE
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Scan this code to view the menu on your phone.
          </p>
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
