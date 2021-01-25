import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { destroySession } from "../../actions/sessionActions";

import "./header.css";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const onLogout = () => dispatch(destroySession());
  return (
    <div className="header-content">
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={onLogout}>
              <Button type="primary">
                <Link to="/">Logout</Link>
              </Button>
            </Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
        arrow
      >
        <span>
          {user.firstName}
          <UserOutlined />
        </span>
      </Dropdown>{" "}
    </div>
  );
};

export default Header;
