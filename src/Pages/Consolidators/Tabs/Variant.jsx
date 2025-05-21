import React, { Fragment } from "react";
import { objHeaders, variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useLibrariesHook from "../../../Hooks/Libraries/LibHooks";
export const Variant = () => {
  const { setType, setSelectedData } = useLibrariesHook();
  const { setOpenModal } = useModalHook();
  const setUpdateType = (data) => {
    setType("update");
    setOpenModal(true, false, true);
    setSelectedData(data);
  };
  const setDeleteType = (data) => {
    setType("delete");
    setOpenModal(true, false, true);
    setSelectedData(data);
  };
  const data = [
    {
      id: 1,
      clName: "sample del",
      created_at: "2024-05-01",
      updated_at: "2024-05-10",
    },
    {
      id: 2,
      clName: "History",
      created_at: "2024-05-02",
      updated_at: "2024-05-11",
    },
    {
      id: 3,
      clName: "Literature",
      created_at: "2024-05-03",
      updated_at: "2024-05-12",
    },
    {
      id: 4,
      clName: "Mathematics",
      created_at: "2024-05-04",
      updated_at: "2024-05-13",
    },
    {
      id: 5,
      clName: "Technology",
      created_at: "2024-05-05",
      updated_at: "2024-05-14",
    },
    {
      id: 6,
      clName: "Philosophy",
      created_at: "2024-05-06",
      updated_at: "2024-05-15",
    },
    {
      id: 7,
      clName: "Art",
      created_at: "2024-05-07",
      updated_at: "2024-05-16",
    },
    {
      id: 8,
      clName: "Music",
      created_at: "2024-05-08",
      updated_at: "2024-05-17",
    },
    {
      id: 9,
      clName: "Biology",
      created_at: "2024-05-09",
      updated_at: "2024-05-18",
    },
    {
      id: 10,
      clName: "Chemistry",
      created_at: "2024-05-10",
      updated_at: "2024-05-19",
    },
    {
      id: 11,
      clName: "Physics",
      created_at: "2024-05-11",
      updated_at: "2024-05-20",
    },
    {
      id: 12,
      clName: "Economics",
      created_at: "2024-05-12",
      updated_at: "2024-05-21",
    },
    {
      id: 13,
      clName: "Geography",
      created_at: "2024-05-13",
      updated_at: "2024-05-22",
    },
    {
      id: 14,
      clName: "Psychology",
      created_at: "2024-05-14",
      updated_at: "2024-05-23",
    },
    {
      id: 15,
      clName: "Sociology",
      created_at: "2024-05-15",
      updated_at: "2024-05-24",
    },
    {
      id: 16,
      clName: "Engineering",
      created_at: "2024-05-16",
      updated_at: "2024-05-25",
    },
    {
      id: 17,
      clName: "Architecture",
      created_at: "2024-05-17",
      updated_at: "2024-05-26",
    },
    {
      id: 18,
      clName: "Law",
      created_at: "2024-05-18",
      updated_at: "2024-05-27",
    },
    {
      id: 19,
      clName: "Medicine",
      created_at: "2024-05-19",
      updated_at: "2024-05-28",
    },
    {
      id: 20,
      clName: "Astronomy",
      created_at: "2024-05-20",
      updated_at: "2024-05-29",
    },
  ];

  return (
    <Fragment>
      <ScrollableTableComponent
        data={data}
        columns={variantCols(setUpdateType, setDeleteType)}
        pageSize={5}
        stripe="even"
        bordered
        hoverRow
        isLoading={false}
        stickLast
      />
    </Fragment>
  );
};
