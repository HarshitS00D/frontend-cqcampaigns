import React from "react";
import { PageHeader, Divider } from "antd";

import TemplateTable from "../../components/Templates/TemplateTable";

const ManageTemplates = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Manage Templates"
        subTitle="Edit or Delete your templates here"
      />
      <Divider />
      <TemplateTable />
    </div>
  );
};

export default ManageTemplates;
