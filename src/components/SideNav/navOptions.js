import {
  DashboardOutlined,
  UnorderedListOutlined,
  FormOutlined,
  MailOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const getNavOptions = (role) => {
  const options = [
    {
      link: "/",
      title: "Dashboard",
      icon: <DashboardOutlined />,
      key: 1,
    },
    {
      title: "Lists",
      icon: <UnorderedListOutlined />,
      key: "sub1",
      link: "/lists",
      subOptions: [
        {
          link: "/lists/create",
          title: "Create List",
          key: 2,
        },
        {
          link: "/lists",
          title: "Manage Lists",
          key: 3,
        },
      ],
    },
    {
      title: "Templates",
      icon: <FormOutlined />,
      key: "sub2",
      link: "/templates",
      subOptions: [
        {
          link: "/templates/create",
          title: "Create Template",
          key: 4,
        },
        {
          link: "/templates",
          title: "Manage Templates",
          key: 5,
        },
      ],
    },
    {
      title: "Campaigns",
      icon: <MailOutlined />,
      key: "sub3",
      link: "/campaigns",
      subOptions: [
        {
          link: "/campaigns/create",
          title: "Create Campaign",
          key: 6,
        },
        {
          link: "/campaigns",
          title: "Manage Campaigns",
          key: 7,
        },
      ],
    },
    {
      title: "Accounts",
      icon: <TeamOutlined />,
      key: "sub4",
      link: "/users",
      subOptions: [
        {
          link: "/users/create",
          title: "Create new account ",
          key: 8,
        },
        {
          link: "/users",
          title: role < 1 ? "Users List" : "Delete account",
          key: 9,
        },
      ],
    },
    {
      link: "/settings",
      title: "Settings",
      icon: <SettingOutlined />,
      key: 10,
    },
  ];

  return options.filter((el) => (role > 1 ? el.link !== `/users` : true));
};

export const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4"];

const subMenuKeyMapping = {
  dashboard: { link: "1" },
  lists: { link: "sub1", create: "2", manage: "3" },
  templates: { link: "sub2", create: "4", manage: "5" },
  campaigns: { link: "sub3", create: "6", manage: "7" },
  users: { link: "sub4", create: "8", manage: "9" },
  settings: { link: "10" },
};

export const getInitiallyOpenKey = (pathname) => {
  if (pathname === "/") return {};
  const paths = pathname.split("/").filter((el) => el.length > 0);
  const keys = {};

  keys.initialSubKey =
    (subMenuKeyMapping[paths[0]] && subMenuKeyMapping[paths[0]].link) || 1;

  switch (paths[0]) {
    case "dashboard":
    case "settings":
      keys.initialKey = keys.initialSubKey;
      break;
    default:
      keys.initialKey = Object.keys(subMenuKeyMapping).includes(paths[0])
        ? paths[1] !== "create"
          ? subMenuKeyMapping[paths[0]].manage
          : subMenuKeyMapping[paths[0]].create
        : keys.initialSubKey;
  }

  return keys;
};
