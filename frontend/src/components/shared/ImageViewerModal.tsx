import { Dialog, DialogContent } from '../ui/dialog';
import { useUIStore } from '../../store/use-ui.store';
import { X } from 'lucide-react';

export function ImageViewerModal() {
  const { isImageViewerOpen, closeImageViewer, selectedImageUrl } = useUIStore();

  if (!selectedImageUrl) return null;

  return (
    <Dialog open={isImageViewerOpen} onOpenChange={closeImageViewer}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none overflow-hidden">
        <button
          onClick={closeImageViewer}
          className="absolute top-4 right-4 text-white hover:bg-black/20 p-2 rounded-full z-50"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative w-full h-[80vh]">
          <img
            src={selectedImageUrl}
            alt="Viewer"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
