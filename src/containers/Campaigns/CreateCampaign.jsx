import React from "react";
import { PageHeader, Divider } from "antd";

import CampaignForm from "../../components/Campaigns/CampaignForm";

const CreateCampaign = (props) => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title={`${props.match.params.id ? "Update" : "Create"} Campaign`}
        subTitle="create or edit your campaigns here"
        onBack={() => props.history.goBack()}
      />
      <Divider />
      <CampaignForm />
    </>
  );
};

export default CreateCampaign;
