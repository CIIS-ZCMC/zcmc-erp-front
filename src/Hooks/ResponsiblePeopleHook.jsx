import { create } from "zustand";

// const sample = {
//     parentId: //indicate from parent page,
//     responsiblePeople: [
//         {
//             uuid: ///,
//             ...otherFields
//         }
//     ]
// }

const useResponsiblePeopleHook = create((set, get) => ({
  responsible_people: [],

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

  findResponsiblePeopleByActivityID: (actID) => {
    return get()
      .responsible_people.filter((item) => item.activityId === actID)
      .map((item) => {
        return {
          activityId: actID,
          ...(item.users || []).map((user) => ({
            userId: user.id,
            designationId: null,
            divisionId: null,
            departmentId: null,
            sectionId: null,
            unitId: null,
          })),
          ...(item.designations || []).map((designation) => ({
            userId: null,
            designationId: designation.id,
            divisionId: null,
            departmentId: null,
            sectionId: null,
            unitId: null,
          })),
          ...(item.areas || []).map((area) => ({
            userId: null,
            designationId: null,
            divisionId: area.type === "division" ? area.id : null,
            departmentId: area.type === "department" ? area.id : null,
            sectionId: area.type === "section" ? area.id : null,
            unitId: area.type === "unit" ? area.id : null,
          })),
        };
      });
  },
}));

export default useResponsiblePeopleHook;
