import { create } from 'zustand';

const useFeedbackStore = create((set, get) => ({
    remarks: [],
    comments: [],
    feedback: [],

    actions: {
        setRemarks: (remarks) => set({ remarks }),
        setComments: (comments) => set({ comments }),
        setFeedback: (feedback) => set({ feedback }),

        clearRemarks: (remarks) => set({ comments: [] }),
        clearStartMonth: (comments) => set({ comments: [] }),
    }

}))

export default useFeedbackStore;

export const useFeedbackStoreActions = () =>
    useFeedbackStore((state) => state.actions)