import React from "react";
import { PageHeader, Divider } from "antd";
import ListsTable from "../../components/ListComponents/ManageListTable";
import CampaignTable from "../../components/Campaigns/CampaignTable";
import Analytics from "../../components/Campaigns/Analytics";

const Dashboard = () => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Dashboard"
        subTitle="View your Lists, Campaigns & Analytics"
      />
      <Divider />
      <Analytics />
      <h2>Your Campaigns</h2>
      <Divider />
      <CampaignTable />
      <h2>Your Lists</h2>
      <Divider />
      <ListsTable />
    </>
  );
};

export default Dashboard;
