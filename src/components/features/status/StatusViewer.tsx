'use client';

import { DataStoreType, Status } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';
import Image from 'next/image';
import React from 'react';

interface StatusViewerProps {
  status: Status;
  datastore_type: DataStoreType;
}

const DEFAULT_DURATION = 5 * 1000; // 5 seconds

export function StatusViewer({ status, datastore_type }: StatusViewerProps) {
  const { isStatusViewerOpen, closeStatusViewer } = useUIStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isStatusViewerOpen) return;

    const timer = setTimeout(() => {
      if (currentIndex < status.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        closeStatusViewer();
        setCurrentIndex(0);
      }
    }, DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, status, isStatusViewerOpen, closeStatusViewer]);

  if (!isStatusViewerOpen) return null;

  const currentStatus = status[currentIndex];
  if (!currentStatus) return null;

  const renderContent = () => {
    if (datastore_type === 'gsheets') {
      if (currentStatus.content.includes('ik.imagekit.io')) {
        return <Image src={currentStatus.content} alt="Status" fill className="object-contain" />;
      } else {
        return <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-gray-700 via-gray-900 to-black"><p className="text-white text-center text-xl">{currentStatus.content}</p></div>;
      }
    } else { // supabase
      switch (currentStatus.type) {
        case 'image':
          return <Image src={currentStatus.content} alt="Status" fill className="object-contain" />;
        case 'video':
          return <video src={currentStatus.content} autoPlay muted playsInline className="w-full h-full object-contain" />;
        case 'text':
          try {
            const url = new URL(currentStatus.content);
            return <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-gray-700 via-gray-900 to-black"><a href={url.href} target="_blank" rel="noopener noreferrer" className="text-white text-center text-xl underline">{currentStatus.content}</a></div>;
          } catch (_) {
            return <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-gray-700 via-gray-900 to-black"><p className="text-white text-center text-xl">{currentStatus.content}</p></div>;
          }
        default:
          return null;
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={closeStatusViewer}
    >
      <div className="relative w-full h-full max-w-md mx-auto">
        {renderContent()}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {status.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/30 overflow-hidden rounded">
              <div
                className={`h-full bg-white transition-all ease-linear ${
                  i === currentIndex ? 'w-full' : i < currentIndex ? 'w-full' : 'w-0'
                }`}
                style={{ transitionDuration: `${DEFAULT_DURATION}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
