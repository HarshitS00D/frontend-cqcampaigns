import React from "react";
import { PageHeader, Divider } from "antd";

import CampaignTable from "../../components/Campaigns/CampaignTable";
import Analytics from "../../components/Campaigns/Analytics";

const ManageCampaign = () => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Manage Campaigns"
        subTitle="Manage your campaigns here"
      />
      <Divider />
      <CampaignTable />
      <Analytics />
    </>
  );
};

export default ManageCampaign;
