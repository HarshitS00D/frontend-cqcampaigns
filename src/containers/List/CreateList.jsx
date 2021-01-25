import React from "react";
import { PageHeader, Divider } from "antd";

import UpsertList from "../../components/ListComponents/UpsertList";

const CreateList = (props) => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Create Lists"
        subTitle="Create your lists here"
      />
      <Divider />
      <UpsertList />
    </div>
  );
};

export default CreateList;
