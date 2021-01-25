import React from "react";
import { PageHeader, Divider } from "antd";

import ManageListTable from "../../components/ListComponents/ManageListTable";

class ManageList extends React.Component {
  render() {
    return (
      <>
        <PageHeader
          className="site-page-header"
          title="Manage Lists"
          subTitle="Edit or Delete your Lists here"
        />
        <Divider />
        <ManageListTable />
      </>
    );
  }
}

export default ManageList;
