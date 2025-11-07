import { create } from 'zustand';

const useUsersStore = create((set) => ({
    users: [],

    actions: {
        setUsers: (users) => set({ users }),
        clearUsers: () => set({ users: [] })
    }
}))

export default useUsersStore;

export const useUsersActions = () =>
    useUsersStore((state) => state.actions);