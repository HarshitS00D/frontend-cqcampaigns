import React from "react";
import { withRouter } from "react-router-dom";
import { PageHeader, Divider } from "antd";

import SubscribersTable from "../../components/ListComponents/SubscribersTable";

const Subscribers = (props) => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Subscribers Table"
        subTitle="Manage your subscribers here"
        onBack={() => props.history.goBack()}
      />
      <Divider />
      <SubscribersTable />
    </>
  );
};

export default withRouter(Subscribers);
