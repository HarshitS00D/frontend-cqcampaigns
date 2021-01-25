import React from "react";
import { Layout } from "antd";

import Header from "../../components/AppHeader";
import SideNav from "../../components/SideNav/SideNav";
import Content from "../Content";

const Home = (props) => {
  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <Header />
      <Layout style={{ margin: "80px 0px 0px 0px" }}>
        <SideNav />

        <Content />
      </Layout>
    </Layout>
  );
};

export default Home;
