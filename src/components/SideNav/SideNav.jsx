import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";

import { navOptions, rootSubmenuKeys, getInitiallyOpenKey } from "./navOptions";

const { Sider } = Layout;

const SideNav = ({ location: { pathname } }) => {
  const [{ initialKey, initialSubKey }, setInitialKeys] = React.useState(
    getInitiallyOpenKey(pathname)
  );
  useEffect(() => {
    setInitialKeys(getInitiallyOpenKey(pathname));
  }, [pathname]);
  const [openKeys, setOpenKeys] = React.useState([initialSubKey]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const user = useSelector((state) => state.session.user);

  return (
    <Sider>
      <Menu
        theme="dark"
        mode="inline"
        style={{
          height: "100%",
          width: "200px",
          position: "fixed",
        }}
        defaultSelectedKeys={[initialKey || "1"]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {navOptions
          .filter((el) => (user.role > 1 ? el.link !== `/users` : true))
          .map((item) =>
            item.subOptions ? renderWithSubOptions(item) : renderOption(item)
          )}
      </Menu>
    </Sider>
  );
};

function renderOption(option) {
  return (
    <Menu.Item {...option}>
      <Link to={option.link}>{option.title}</Link>
    </Menu.Item>
  );
}

function renderWithSubOptions(option) {
  return (
    <Menu.SubMenu {..._.omit(option, ["subOptions"])}>
      {option.subOptions.map((item) => renderOption(item))}
    </Menu.SubMenu>
  );
}

export default withRouter(SideNav);
