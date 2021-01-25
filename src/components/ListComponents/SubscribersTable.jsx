import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { Table, Button, message, Tag } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

import defaultSearchComponent from "../defaultSearchComponent";
import {
  fetchSubscribers,
  clearSubscribers,
  deleteSubscribers,
  fetchSubscribersCSV,
} from "../../actions/subscriberActions";
import UpsertList from "./UpsertList";
import { parseTimeStamp, getDiffInMilliseconds } from "../../utils/moment";
import {
  feedbackStatusMapping,
  feedbackStatusColorMapping,
} from "../../utils/static_vars";
import Modal from "antd/lib/modal/Modal";

class SubscribersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      sortedInfo: {},
      selectedRowKeys: [],
      isModalVisible: false,
      onLoading: false,
      filters: {},
      pageSize: 5,
      pageNo: 1,
      columns: null,
    };
  }

  componentDidMount = () => {
    this.dispatchFetchSubscribers();
  };

  componentWillUnmount = () => this.props.clearSubscribers();

  componentDidUpdate = (prevProps, prevState) => {
    let { pageSize, pageNo, filters, searchText } = this.state;
    const { tableData } = this.props;

    if (!prevProps.tableData && tableData) {
      this.generateColumnConfig();
    }

    if (
      !_.isEqual(
        { pageSize, pageNo, ...filters, searchText },
        {
          pageSize: prevState.pageSize,
          pageNo: prevState.pageNo,
          searchText: prevState.searchText,
          ...prevState.filters,
        }
      )
    ) {
      this.generateColumnConfig();
      this.dispatchFetchSubscribers();
    }
  };

  generateColumnConfig = () => {
    let { filters, sortedInfo } = this.state;
    const { tableData } = this.props;
    if (!tableData || !tableData.length) return;
    let columnsConfig = [
      ...Object.keys(
        _.omit(tableData[0], ["key", "_id", "subscribed", "feedback"])
      ),
      "subscribed",
      "feedback",
    ].map((key) => {
      let obj = {
        title: _.startCase(key),
        key,
        dataIndex: key,
        width: "10vw",
      };
      switch (key) {
        case "name":
          return { ...obj, ...defaultSearchComponent(this, "name") };
        case "createdAt":
          return {
            ...obj,
            render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
            sorter: (a, b) => getDiffInMilliseconds(a.createdAt, b.createdAt),
            sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
            ellipsis: true,
          };
        case "updatedAt":
          return {
            ...obj,
            render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
            sorter: (a, b) => getDiffInMilliseconds(a.updatedAt, b.updatedAt),
            sortOrder: sortedInfo.columnKey === "updatedAt" && sortedInfo.order,
            ellipsis: true,
          };
        case "subscribed":
          return {
            ...obj,
            fixed: "right",
            filters: [
              { text: "Subscribed", value: true },
              { text: "Unsubscribed", value: false },
            ],
            filteredValue: filters[key] || null,
            filterMultiple: false,
            render: (val) =>
              val ? (
                <Tag color="success">Subscribed</Tag>
              ) : (
                <Tag color="error">Unsubscribed</Tag>
              ),
          };
        case "feedback":
          return {
            ...obj,
            fixed: "right",
            filteredValue: filters[key] || null,
            filters: feedbackStatusMapping.map((text, value) => ({
              text,
              value,
            })),
            render: (val) => (
              <Tag color={feedbackStatusColorMapping[val]}>
                {feedbackStatusMapping[val]}
              </Tag>
            ),
          };
        default:
          return obj;
      }
    });
    return columnsConfig;
  };

  dispatchFetchSubscribers = (pageDetails) => {
    const { pageSize, pageNo, searchText } = pageDetails
      ? pageDetails
      : this.state;
    let { filters } = this.state;

    const filterKeys = Object.keys(filters).filter(
      (key) => filters[key] && filters[key].length
    );
    filters = filterKeys.length
      ? filterKeys.reduce((obj, value) => {
          obj[value] = { $in: filters[value] };
          return obj;
        }, {})
      : {};
    filters = {
      ...filters,
      name: {
        $regex: searchText,
        $options: "$i",
      },
    };

    const pagination = { skip: (pageNo - 1) * pageSize, limit: pageSize };
    const listID = this.props.match.params.id;
    this.setState({ onLoading: true });

    const callback = () => {
      this.setState({ onLoading: false });
    };
    this.props.fetchSubscribers({ filters, pagination, listID, callback });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
      filters,
    });
  };

  // Functions for Search Component
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();
    if (selectedKeys[0]) {
      this.setState({
        searchText: selectedKeys[0],
      });
    }
  };

  handleSearchReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "", filters: {} });
  };

  onSelectedRowsDelete = async () => {
    const { selectedRowKeys, pageSize, pageNo, filters } = this.state;
    const { tableData, deleteSubscribers } = this.props;

    const listID = this.props.match.params.id;
    const subIDs = selectedRowKeys.map((index) => tableData[index - 1]["_id"]);

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
    deleteSubscribers({
      listID,
      subIDs,
      onSuccess,
      onError,
      pagination,
      filters,
    });
  };

  onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

  onPaginationChange = (pageNo, pageSize) => {
    this.setState({ pageSize, pageNo });
  };

  exportToCSV = async () => {
    const listID = this.props.match.params.id;
    const { tableData } = this.props;
    const { selectedRowKeys } = this.state;
    const subIDs = selectedRowKeys.map((key) => tableData[key - 1]._id);
    await fetchSubscribersCSV({
      listID,
      subIDs,
      onSuccess: ({ listname, csv }) => {
        let csvFile = new Blob([csv], { type: "text/csv" });
        let downloadLink = document.createElement("a");
        downloadLink.download = `${listname}.csv`;
        const url = window.URL.createObjectURL(csvFile);
        downloadLink.href = url;
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      },
      onError: (err) => message.error(err.message),
    });
    this.setState({ selectedRowKeys: [] });
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const {
      selectedRowKeys,
      onLoading,
      isModalVisible,
      pageNo,
      pageSize,
    } = this.state;
    const { tableData, total } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const columns = this.generateColumnConfig();

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
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              style={{ marginLeft: "8px" }}
              onClick={this.exportToCSV}
            >
              Export To CSV
            </Button>
            <Button
              icon={<UploadOutlined />}
              style={{
                color: "white",
                background: "#52c41a",
                marginLeft: "8px",
              }}
              onClick={this.showModal}
            >
              Import CSV
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
          dataSource={tableData}
          columns={columns}
          rowSelection={rowSelection}
          tableLayout="auto"
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
        <Modal
          title="Import CSV"
          visible={isModalVisible}
          width="70vw"
          onCancel={this.hideModal}
          footer={null}
        >
          <UpsertList
            hideModal={this.hideModal}
            pagination={{ skip: (pageNo - 1) * pageSize, limit: pageSize }}
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ subscribers }, ownProps) => {
  return {
    ...ownProps,
    tableData: subscribers.data,
    total: subscribers.total,
  };
};

export default connect(mapStateToProps, {
  fetchSubscribers,
  deleteSubscribers,
  clearSubscribers,
})(withRouter(SubscribersTable));
