import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import CreateList from "./List/CreateList";
import ManageList from "./List/ManageList";
import Subscribers from "./List/Subscribers";
import CreateTemplate from "./Templates/CreateTemplate";
import ManageTemplates from "./Templates/ManageTemplates";
import CreateCampaign from "./Campaigns/CreateCampaign";
import ManageCampaign from "./Campaigns/ManageCampaign";
import CampaignDetail from "./Campaigns/CampaignDetail";
import CreateUser from "./Accounts/CreateUser";
import ManageUsers from "./Accounts/ManageUsers";
import Settings from "./Settings";
import Dashboard from "./Dashboard/Dashboard";

const Content = () => {
  const user = useSelector((state) => state.session.user);
  return (
    <Layout.Content
      className="site-layout-background"
      style={{
        padding: "1rem",
        margin: 0,
        minHeight: 280,
      }}
    >
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/lists/create" component={CreateList} />
        <Route exact path="/lists" component={ManageList} />
        <Route exact path="/lists/:id" component={Subscribers} />
        <Route exact path="/templates/create" component={CreateTemplate} />
        <Route exact path="/templates/" component={ManageTemplates} />
        <Route exact path="/templates/:id" component={CreateTemplate} />
        <Route exact path="/campaigns/create" component={CreateCampaign} />
        <Route exact path="/campaigns/" component={ManageCampaign} />
        <Route exact path="/campaigns/:id" component={CampaignDetail} />
        <Route
          exact
          path="/users/create"
          component={
            user.role < 2 ? CreateUser : () => <h1>{`401: Not Authorized`}</h1>
          }
        />
        <Route
          exact
          path="/users/"
          component={
            user.role < 2 ? ManageUsers : () => <h1>{`401: Not Authorized`}</h1>
          }
        />
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </Layout.Content>
  );
};

export default Content;
