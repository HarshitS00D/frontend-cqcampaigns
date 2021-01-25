import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, Button, message, Typography } from "antd";
import _ from "lodash";

import {
  deleteUsers,
  clearUsers,
  getUsers,
} from "../../actions/AccountActions";
import { roles } from "../../utils/static_vars";
import { getDiffInMilliseconds, parseTimeStamp } from "../../utils/moment";
import ChangePasswordModal from "./ChangePasswordModal";

import "./table.css";

class UserTable extends React.Component {
  state = {
    searchText: "",
    sortedInfo: {},
    selectedRowKeys: [],
    onLoading: false,
    filters: {},
    pageSize: 5,
    pageNo: 1,
    ChangePasswordModalVisible: false,
    userID: null,
  };

  componentDidMount = () => {
    this.dispatchFetchUsers();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { pageSize, pageNo, searchText } = this.state;
    if (
      !_.isEqual(
        { pageSize, pageNo, searchText },
        {
          pageSize: prevState.pageSize,
          pageNo: prevState.pageNo,
          searchText: prevState.searchText,
        }
      )
    ) {
      this.dispatchFetchUsers();
    }
  };

  componentWillUnmount = () => this.props.clearUsers();

  dispatchFetchUsers = (pageDetails) => {
    const { pageSize, pageNo } = pageDetails ? pageDetails : this.state;
    let { filters, searchText } = this.state;
    if (searchText && searchText.length)
      filters.name = {
        $regex: searchText,
        $options: "$i",
      };

    const pagination = { skip: (pageNo - 1) * pageSize, limit: pageSize };
    this.setState({ onLoading: true });

    const callback = () => {
      this.setState({ onLoading: false });
    };
    this.props.getUsers({ filters, pagination, callback });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();

    if (selectedKeys[0]) {
      this.setState({
        searchText: selectedKeys[0],
      });
    }
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  };

  handleSearchReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "", filters: {} });
  };
  onSelectedRowsDelete = () => {
    const { selectedRowKeys, pageSize, pageNo, filters } = this.state;
    const { tableData, deleteUsers } = this.props;

    const emails =
      selectedRowKeys.map((index) => tableData[index - 1].email) || [];

    this.setState({ onLoading: true });

    const onSuccess = (data) => {
      const state = { onLoading: false, selectedRowKeys: [] };
      if (selectedRowKeys.length === tableData.length)
        state.pageNo = pageNo > 1 ? pageNo - 1 : 1;

      this.setState(state);
      message.success(data);
    };

    const onError = (err) => {
      this.setState({ onLoading: false });
      message.error(err.response.data.error);
      console.log({ err });
    };

    const skip =
      ((selectedRowKeys.length === tableData.length
        ? pageNo > 1
          ? pageNo - 1
          : 1
        : pageNo) -
        1) *
      pageSize;

    const pagination = { skip, limit: pageSize };
    deleteUsers({ data: { emails }, onSuccess, onError, filters, pagination });
  };

  onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

  onPaginationChange = (pageNo, pageSize) => {
    this.setState({ pageSize, pageNo });
  };

  onChangePasswordClick = (userID) => {
    this.setState({
      ChangePasswordModalVisible: true,
      userID,
    });
  };

  render() {
    const { selectedRowKeys, onLoading, pageNo, sortedInfo } = this.state;
    const { tableData, total } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    let columns = [
      {
        title: "First Name",
        key: "firstName",
        dataIndex: "firstName",
      },
      {
        title: "Last Name",
        key: "lastName",
        dataIndex: "lastName",
      },
      {
        title: "Email",
        key: "email",
        dataIndex: "email",
      },
      {
        title: "Role",
        key: "role",
        dataIndex: "role",
        render: (val) => roles[val].label,
      },
      {
        title: "Created At",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.createdAt, b.createdAt),
        sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
        ellipsis: true,
        width: "20%",
      },
      {
        title: "Updated At",
        key: "updatedAt",
        dataIndex: "updatedAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.updatedAt, b.updatedAt),
        sortOrder: sortedInfo.columnKey === "updatedAt" && sortedInfo.order,
        ellipsis: true,
        width: "20%",
      },
    ];
    if (tableData && tableData.length) {
      columns.push({
        title: "Actions",
        key: "actions",
        dataIndex: "actions",
        fixed: "right",
        render: (val, record) => (
          <Typography.Link
            onClick={() => this.onChangePasswordClick(record._id)}
          >
            Change Password
          </Typography.Link>
        ),
      });
    }
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <Button
              type="primary"
              onClick={this.onSelectedRowsDelete}
              disabled={!hasSelected}
              danger
            >
              Delete
            </Button>

            <span style={{ marginLeft: "8px" }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div>
          <div>
            <Button onClick={() => this.setState({ sortedInfo: {} })}>
              Clear Sorters
            </Button>
          </div>
        </div>
        <ChangePasswordModal
          ChangePasswordModalVisible={this.state.ChangePasswordModalVisible}
          changeParentState={(state) => this.setState(state)}
          userID={this.state.userID}
        />
        <Table
          scroll={{ x: true, y: 600 }}
          columns={columns}
          rowSelection={rowSelection}
          tableLayout="auto"
          dataSource={tableData}
          pagination={{
            showSizeChanger: true,
            onChange: this.onPaginationChange,
            total,
            pageSizeOptions: [5, 10, 20, 50],
            defaultPageSize: 5,
            current: pageNo,
          }}
          onChange={this.handleChange}
          loading={onLoading}
        />
      </>
    );
  }
}

const mapStateToProps = ({ users }, ownProps) => {
  return {
    ...ownProps,
    tableData: users.data,
    total: users.total,
  };
};

export default connect(mapStateToProps, {
  clearUsers,
  deleteUsers,
  getUsers,
})(withRouter(UserTable));
