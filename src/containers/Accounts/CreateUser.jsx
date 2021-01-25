import React from "react";
import { PageHeader, Divider } from "antd";

import CreateUserForm from "../../components/Accounts/CreateUserForm";

const CreateUser = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Create User"
        subTitle="create new users here"
      />
      <Divider />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CreateUserForm />
      </div>
    </div>
  );
};

export default CreateUser;
