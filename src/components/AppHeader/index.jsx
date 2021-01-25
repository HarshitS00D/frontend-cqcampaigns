import React from "react";
import { Layout } from "antd";

import HeaderContent from "./HeaderContent";

import "./header.css";

const Header = () => {
  return (
    <Layout.Header
      className="header"
      style={{
        position: "fixed",
        zIndex: 10,
        height: "80px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        backgroundImage: "linear-gradient(to-right,#DE6834,#FFE7D4,#565CB0)",
      }}
    >
      <div>
        <div className="logo">
          <span>CQ </span> Campaigns
        </div>
      </div>
      <HeaderContent />
    </Layout.Header>
  );
};

export default Header;
