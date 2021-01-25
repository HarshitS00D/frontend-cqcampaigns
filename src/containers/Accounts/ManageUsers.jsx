import React from "react";
import { useSelector } from "react-redux";
import { PageHeader, Divider } from "antd";
import DeleteUserForm from "../../components/Accounts/DeleteUserForm";
import UserTable from "../../components/Accounts/UserTable";

const ManageUsers = () => {
  const user = useSelector((state) => state.session && state.session.user);
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Delete User"
        subTitle="Delete users here"
      />
      <Divider />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DeleteUserForm />
      </div>

      {user && user.role === 0 && (
        <>
          <Divider />
          <UserTable />
        </>
      )}
    </>
  );
};

export default ManageUsers;
