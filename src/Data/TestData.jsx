export const ITEM_IMAGE = {
  src: "https://www.keelerusa.com/media/catalog/product/cache/163ffabcb209a57f4bc3a08f6d9368f2/a/5/a523a3844004fe160f4390509896308a.jpg",
};

export const MANAGE_AOP_APPROVAL = [
  {
    id: 1,
    function_description: "Core",
    objective:
      "This is a sample objective for the Core function. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    success_indicator: "This is a sample success indicator ",
    activity_count: 3,
    activities: [
      {
        id: 1,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        with_comment: true,
        is_reviewed: true,
      },
      {
        id: 2,
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        with_comment: false,
        is_reviewed: true,
      },
      {
        id: 3,
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        with_comment: true,
        is_reviewed: false,
      },
    ],
  },

  {
    id: 2,
    function_description: "Support",
    objective:
      "This is a sample objective for the Support function. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    success_indicator: "This is another sample success indicator",
    activity_count: 2,
    activities: [
      {
        id: 5,
        description:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        with_comment: false,
        is_reviewed: true,
      },
      {
        id: 6,
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        with_comment: true,
        is_reviewed: false,
      },
    ],
  },
  {
    id: 3,
    function_description: "Strategic",
    objective: "This is a sample objective for the Operations function",
    success_indicator: "This is yet another sample success indicator",
    activity_count: 4,
    activities: [
      {
        id: 7,
        description:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        with_comment: true,
        is_reviewed: false,
      },
      {
        id: 8,
        description:
          "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        with_comment: false,
        is_reviewed: true,
      },
      {
        id: 9,
        description:
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
        with_comment: true,
        is_reviewed: false,
      },
      {
        id: 10,
        description:
          "Et harum quidem rerum facilis est et expedita distinctio.",
        with_comment: false,
        is_reviewed: true,
      },
    ],
  },
];

export const ACTIVITY_COMMENTS = {
  activity_id: 1,
  comments: [
    {
      id: 1,
      area: "Medical Center Chief",
      user: "John Doe",
      comment: "This is a great activity. Keep it up!",
      date: "2023-03-01T10:00:00Z",
    },
    {
      id: 2,
      area: "Planning",
      user: "John Doe",
      comment: "I think we can improve this part.",
      date: "2023-03-02T14:30:00Z",
    },
    {
      id: 3,
      area: "Procurement",
      user: "John Doe",
      comment: "Well done! This looks promising.",
      date: "2023-03-03T09:15:00Z",
    },
  ],
};

export const APPROVAL_TIMELINE = [
  {
    id: 1,
    name: "Krizelle Mae Falcasantos",
    position: "Department Head",
    area_code: "IISU",
    area: "Innovations",
    status: "submitted",
    approved_at: null,
    remarks: null,
    activities_with_comments: null, // e.g 4 comments in 2 activities
    number_of_comments: null, // e.g 4 comments in 2 activities
  },
  {
    id: 2,
    name: "John Doe",
    position: "Planning Officer",
    area_code: "IISU",
    area: "Planning",
    status: "approved",
    approved_at: "",
    remarks: "This is a sample remark written by the Division Chief.",
    activities_with_comments: 2, // e.g 4 comments in 2 activities
    number_of_comments: 5, // e.g 4 comments in 2 activities
  },
];

export const NOTIFICATIONS = [
  {
    id: 1,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Zx8Reb9PlKADhesmtIQw2cBNStfadsBZ8g&s",
    title: "New AOP request (#2023-0031) waiting to be processed",
    description: null,
    module_path: "/aop-approval/objectives/1",
    seen: 0,
    created_at: "2025-05-07 06:25:04",
  },
  {
    id: 2,
    profile_url:
      "https://img.freepik.com/free-photo/smart-looking-teacher_53876-23045.jpg",
    title: "AOP (#2023-0031) has been approved by the Division Chief",
    description: "(3) new comments were added *",
    module_path: "/aop-approval/objectives/1",
    seen: 1,
    created_at: "2025-05-07 06:25:04",
  },
  {
    id: 3,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphOILfuKHyTdMirb7TWHIfW_bB9-TKYLqEw&s",
    title: "AOP (#2023-0032) has been submitted by the Department Head",
    description: "Awaiting review by the Planning Unit",
    module_path: "/aop-approval/objectives/2",
    seen: 0,
    created_at: "2025-04-30 08:15:00",
  },
  {
    id: 4,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Zx8Reb9PlKADhesmtIQw2cBNStfadsBZ8g&s",
    title: "AOP (#2023-0033) has been approved by the Planning Unit",
    description: null,
    module_path: "/aop-approval/objectives/3",
    seen: 1,
    created_at: "2025-05-01 10:45:30",
  },
  {
    id: 5,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphOILfuKHyTdMirb7TWHIfW_bB9-TKYLqEw&s",
    title: "AOP (#2023-0034) has been returned by the Division Chief",
    description: "Please address the comments and resubmit",
    module_path: "/aop-approval/objectives/4",
    seen: 0,
    created_at: "2025-05-02 14:20:15",
  },
  {
    id: 6,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Zx8Reb9PlKADhesmtIQw2cBNStfadsBZ8g&s",
    title: "AOP (#2023-0035) has been finalized and approved",
    description: "No further action is required",
    module_path: "/aop-approval/objectives/5",
    seen: 1,
    created_at: "2025-05-03 09:00:00",
  },
  {
    id: 7,
    profile_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphOILfuKHyTdMirb7TWHIfW_bB9-TKYLqEw&s",
    title: "AOP (#2023-0036) has been submitted for review",
    description: "Awaiting feedback from the Planning Unit",
    module_path: "/aop-approval/objectives/6",
    seen: 0,
    created_at: "2025-05-04 11:30:45",
  },
];
