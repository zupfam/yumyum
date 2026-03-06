import { create } from 'zustand';

interface UIState {
  isCartSummaryOpen: boolean;
  isStatusViewerOpen: boolean;
  isReelViewOpen: boolean;
  isFeedbackViewOpen: boolean;
  isQRCodeModalOpen: boolean;
  isImageViewerOpen: boolean;
  selectedImageUrl: string | null;
  activeIndex: number;
  openCartSummary: () => void;
  closeCartSummary: () => void;
  openStatusViewer: () => void;
  closeStatusViewer: () => void;
  openReelView: (index?: number) => void;
  closeReelView: () => void;
  openFeedbackView: () => void;
  closeFeedbackView: () => void;
  openQRCodeModal: () => void;
  closeQRCodeModal: () => void;
  openImageViewer: (url: string) => void;
  closeImageViewer: () => void;
  setActiveIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartSummaryOpen: false,
  isStatusViewerOpen: false,
  isReelViewOpen: false,
  isFeedbackViewOpen: false,
  isQRCodeModalOpen: false,
  isImageViewerOpen: false,
  selectedImageUrl: null,
  activeIndex: 0,
  openCartSummary: () => set({ isCartSummaryOpen: true }),
  closeCartSummary: () => set({ isCartSummaryOpen: false }),
  openStatusViewer: () => set({ isStatusViewerOpen: true }),
  closeStatusViewer: () => set({ isStatusViewerOpen: false }),
  openReelView: (index = 0) => set({ isReelViewOpen: true, activeIndex: index }),
  closeReelView: () => set({ isReelViewOpen: false }),
  openFeedbackView: () => set({ isFeedbackViewOpen: true }),
  closeFeedbackView: () => set({ isFeedbackViewOpen: false }),
  openQRCodeModal: () => set({ isQRCodeModalOpen: true }),
  closeQRCodeModal: () => set({ isQRCodeModalOpen: false }),
  openImageViewer: (url) => set({ isImageViewerOpen: true, selectedImageUrl: url }),
  closeImageViewer: () => set({ isImageViewerOpen: false, selectedImageUrl: null }),
  setActiveIndex: (index) => set({ activeIndex: index }),
}));
