import { create } from "zustand";
import { persist } from "zustand/middleware";

const useResponsiblePeopleHook = create(
  persist(
    (set, get) => ({
      responsible_people: [],

      // selectedResponsibleValue: {
      //   users: [],
      //   designations: [],
      //   areas: [],
      //   isAssigned: false,
      // },

      setResponsiblePeople: (data) => {
        set(() => ({
          responsible_people: data
        }))
      },

      setUpdatedResponsiblePeople: (data) => {
        set(() => ({
          responsible_people: data
        }))
      },

      clearResponsiblePeople: () => {
        set(() => ({
          responsible_people: []
        }))
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
              // areas: key === "areas" ? [value] : [],
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

      //remove single responsible personnel
      removeResponsiblePersonnel: (id, key, activityId) =>
        set((state) => {
          const updatedResponsiblePersonnel = state.responsible_people.map(
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
            responsible_people: updatedResponsiblePersonnel,
          };
        }),

      //remove batch/muiltiple responsible personnel
      removeMultipleResponsiblePersonnel: (activityIdsToRemove) => {
        const { responsible_people } = get();
        const filtered = responsible_people.filter(
          (entry) => !activityIdsToRemove.includes(entry.activityId)
        );
        set({ responsible_people: filtered });
      },

      // reset value of responsible person selected values
      resetValues: (activityIndex) => {
        const { isAssigned, responsible_people } = get();
        if (isAssigned) return;

        const updated = responsible_people.map((activity) => {
          // console.log(activity)
          if (activity.activityId === activityIndex) {
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

      findResponsiblePeopleByActivityID: (actID) => {
        return get()
          .responsible_people
          .filter((item) => item.activityId === actID)
          .map(item => [
            ...(item.users || []).map((user) => ({
              id: item.activityId,
              user_id: user.id,
              designation_id: null,
              division_id: null,
              department_id: null,
              section_id: null,
              unit_id: null,
            })),
            ...(item.designations || []).map((designation) => ({
              id: item.activityId,
              user_id: null,
              designation_id: designation.id,
              division_id: null,
              department_id: null,
              section_id: null,
              unit_id: null,
            })),
          ])
          .flat();
      },
    }),
    {
      name: "responsible-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useResponsiblePeopleHook;
