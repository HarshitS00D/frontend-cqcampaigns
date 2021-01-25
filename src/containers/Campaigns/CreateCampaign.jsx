import React from "react";
import { PageHeader, Divider } from "antd";

import CampaignForm from "../../components/Campaigns/CampaignForm";

const CreateCampaign = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Create Campaigns"
        subTitle="create your campaigns here"
      />
      <Divider />
      <CampaignForm />
    </div>
  );
};

export default CreateCampaign;
