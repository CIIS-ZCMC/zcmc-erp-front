import { create } from "zustand";


const useItemRequestStore = create((set) => ({
    requests: [],
    categories: [],
}))