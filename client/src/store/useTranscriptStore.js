import { create } from 'zustand';

const useTranscriptStore = create((set) => ({
  file: null,
  setFile: (file) => set({ file }),
}));

export default useTranscriptStore;