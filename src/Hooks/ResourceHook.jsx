import { create } from "zustand";

const useResourceHook = create((set, get) => ({
  resources: [],

  selectedResponsibleValue: {
    users: [],
    designations: [],
    areas: [],
    isAssigned: false,
  },

  setAssignmentStatus: (activityId, status) => {
    set((state) => {
      const updated = state.responsible_people.map((item) => {
        if (item.activityId === activityId) {
          return {
            ...item,
            isAssigned: status,
          };
        }
        return item;
      });

      return {
        responsible_people: updated,
      };
    });
  },

  getByActivityId: (activityId) => {
    const { responsible_people } = get();
    return responsible_people.find((item) => item.activityId === activityId);
  },

  handleValue: (activityId, key, value) => {
    set((state) => {
      const currentList = [...state.responsible_people];
      const existingIndex = currentList.findIndex(
        (item) => item.activityId === activityId
      );

      // If entry doesn't exist, insert new
      if (existingIndex === -1) {
        const newItem = {
          activityId,
          users: key === "users" ? [value] : [],
          areas: key === "areas" ? [value] : [],
          designations: key === "designations" ? [value] : [],
          isAssigned: false,
        };

        return {
          responsible_people: [...currentList, newItem],
        };
      }

      // Otherwise, update existing
      const alreadyExists = currentList[existingIndex][key].some(
        (el) => el.id === value.id
      );
      if (alreadyExists) return { responsible_people: currentList };

      const updatedItem = {
        ...currentList[existingIndex],
        [key]: [...currentList[existingIndex][key], value],
      };

      currentList[existingIndex] = updatedItem;

      return {
        responsible_people: currentList,
      };
    });
  },

  removeData: (id, key, activityId) =>
    set((state) => {
      const updatedResponsiblePeople = state.responsible_people.map(
        (activity) => {
          if (activity.activityId !== activityId) return activity;

          const existingList = Array.isArray(activity[key])
            ? activity[key]
            : [];

          return {
            ...activity,
            [key]: existingList.filter((item) => item.id !== id),
          };
        }
      );

      return {
        responsible_people: updatedResponsiblePeople,
      };
    }),

  // reset value of responsible person selected values
  resetValues: (activityIndex) => {
    const { isAssigned, responsible_people } = get();

    if (isAssigned) return;

    const updated = responsible_people.map((activity) => {
      if (activity.activity_index === activityIndex) {
        return {
          ...activity,
          users: [],
          designations: [],
          areas: [],
        };
      }
      return activity;
    });

    set({ responsible_people: updated });
  },

  findResourcesByActivityID: (actID) => {
    return get().resources.filter((item) => item.parentId == actID);
  },
}));

export default useResourceHook;
