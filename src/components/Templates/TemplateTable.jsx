import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Table, Button, message, Tooltip } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import _ from "lodash";

import {
  fetchTemplates,
  deleteTemplates,
  clearTemplates,
} from "../../actions/templateActions";
import { getDiffInMilliseconds, parseTimeStamp } from "../../utils/moment";
import defaultSearchComponent from "../../components/defaultSearchComponent";

import "./table.css";

class TemplateTable extends React.Component {
  state = {
    searchText: "",
    sortedInfo: {},
    selectedRowKeys: [],
    onLoading: false,
    filters: { campaignID: { $eq: null } },
    pageSize: 10,
    pageNo: 1,
  };

  componentDidMount = () => {
    this.dispatchFetchTemplates();
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
      this.dispatchFetchTemplates();
    }
  };

  componentWillUnmount = () => this.props.clearTemplates();

  dispatchFetchTemplates = (pageDetails) => {
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
    this.props.fetchTemplates({ filters, pagination, callback });
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
    this.setState({ searchText: "", filters: { campaignID: { $eq: null } } });
  };

  onSelectedRowsDelete = () => {
    const { selectedRowKeys, pageSize, pageNo, filters } = this.state;
    const { tableData, deleteTemplates } = this.props;

    const templateIDs = selectedRowKeys.map(
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
    deleteTemplates({ templateIDs, onSuccess, onError, filters, pagination });
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

    const columns = [
      {
        title: "Template Name",
        key: "name",
        dataIndex: "name",
        render: (text, record) => (
          <span className="template-name">
            {record.name}
            <Link to={`/templates/${record._id}`} className="link">
              <Tooltip placement="left" title="Edit" color="blue">
                <EditTwoTone
                  title="Edit template"
                  style={{ fontSize: "large" }}
                />
              </Tooltip>
            </Link>
          </span>
        ),
        width: "26%",
        ...defaultSearchComponent(this, "name"),
      },
      {
        title: "Created At",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.createdAt, b.createdAt),
        sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
        ellipsis: true,
        width: "26%",
      },
      {
        title: "Updated At",
        key: "updatedAt",
        dataIndex: "updatedAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.updatedAt, b.updatedAt),
        sortOrder: sortedInfo.columnKey === "updatedAt" && sortedInfo.order,
        ellipsis: true,
        width: "26%",
      },
    ];

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
            defaultPageSize: 10,
            current: pageNo,
          }}
          onChange={this.handleChange}
          loading={onLoading}
        />
      </>
    );
  }
}

const mapStateToProps = ({ templates }, ownProps) => {
  return {
    ...ownProps,
    tableData: templates.data,
    total: templates.total,
  };
};

export default connect(mapStateToProps, {
  fetchTemplates,
  deleteTemplates,
  clearTemplates,
})(withRouter(TemplateTable));
