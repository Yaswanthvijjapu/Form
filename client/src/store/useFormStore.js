import create from "zustand";

const useFormStore = create((set) => ({
    fields: [],
    setFields: (newFields) => set({ fields: newFields }),
}));

export default useFormStore;
