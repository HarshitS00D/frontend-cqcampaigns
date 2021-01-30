import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Table, Button, message } from "antd";
import _ from "lodash";

import {
  fetchCampaigns,
  deleteCampaigns,
  clearCampaigns,
} from "../../actions/campaignActions";
import { getDiffInMilliseconds, parseTimeStamp } from "../../utils/moment";
import defaultSearchComponent from "../defaultSearchComponent";

import "./table.css";

class CampaignsTable extends React.Component {
  state = {
    searchText: "",
    sortedInfo: {},
    selectedRowKeys: [],
    onLoading: false,
    filters: {},
    pageSize: 5,
    pageNo: 1,
  };

  componentDidMount = () => {
    this.dispatchFetchCampaigns();
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
      this.dispatchFetchCampaigns();
    }
  };

  componentWillUnmount = () => this.props.clearCampaigns();

  dispatchFetchCampaigns = (pageDetails) => {
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
    this.props.fetchCampaigns({ filters, pagination, callback });
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
    const { tableData, deleteCampaigns } = this.props;

    const campaignIDs = selectedRowKeys.map(
      (index) => tableData[index - 1]["_id"]
    );

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
    deleteCampaigns({ campaignIDs, onSuccess, onError, filters, pagination });
  };

  onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

  onPaginationChange = (pageNo, pageSize) => {
    this.setState({ pageSize, pageNo });
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
        title: "Campaign Name",
        key: "name",
        dataIndex: "name",
        ...defaultSearchComponent(this, "name"),
        width: "20%",
      },
      {
        title: "Created At",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.createdAt, b.createdAt),
        sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
        ellipsis: true,
        width: "15%",
      },
    ];

    if (tableData && tableData.length) {
      columns.splice(
        1,
        0,
        {
          title: "Sent",
          key: "sent",
          dataIndex: "sent",
          render: (val, record) => record.analytics.sent,
          align: "center",
          //  width: "5%",
        },
        {
          title: "Delivered",
          key: "delivered",
          render: (val, record) => record.analytics.delivered,
          dataIndex: "delivered",
          align: "center",
          //  width: "8%",
        },
        {
          title: "Bounced",
          key: "bounced",
          dataIndex: "bounced",
          render: (val, record) => record.analytics.bounced,
          align: "center",
          // width: "8%",
        },
        {
          title: "Opened",
          key: "open",
          dataIndex: "open",
          render: (val, record) => record.analytics.open,
          align: "center",
          //  width: "8%",
        }
      );
      columns.push({
        title: "Actions",
        key: "actions",
        dataIndex: "actions",
        width: "10%",
        fixed: "right",
        align: "center",
        render: (val, record) => (
          <Link to={`/campaigns/${record._id}`}>Manage</Link>
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
            <Button
              onClick={() => this.handleSearchReset(this.clearSearchFilters)}
            >
              Clear Filters
            </Button>
            <Button onClick={() => this.setState({ sortedInfo: {} })}>
              Clear Sorters
            </Button>
          </div>
        </div>
        <Table
          scroll={{ x: true, y: 600 }}
          columns={columns}
          rowSelection={rowSelection}
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

const mapStateToProps = ({ campaigns }, ownProps) => {
  return {
    ...ownProps,
    tableData: campaigns.data,
    total: campaigns.total,
  };
};

export default connect(mapStateToProps, {
  fetchCampaigns,
  deleteCampaigns,
  clearCampaigns,
})(withRouter(CampaignsTable));
