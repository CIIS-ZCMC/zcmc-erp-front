import { create } from "zustand";
import { persist } from "zustand/middleware";

const useResourceCart = create(
    persist(
        (set, get) => ({
            cart: [],

        })
    )
)

export default useResourceCart;