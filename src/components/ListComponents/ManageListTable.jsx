import React, { useContext, useState, useEffect, useRef } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Input, Button, Form, message, Tooltip } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

import { parseTimeStamp, getDiffInMilliseconds } from "../../utils/moment";
import defaultSearchComponent from "../defaultSearchComponent";

import "./table.css";

import {
  fetchUserLists,
  deleteUserLists,
  editUserList,
  clearUserLists,
} from "../../actions/listActions";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="table-list-name-col">
        <div className="editable-cell-value-wrap" onClick={toggleEdit}>
          {children}
        </div>
        <Link to={`/lists/${record._id}`} className="link">
          <Tooltip placement="left" title="view" color="blue">
            <UnorderedListOutlined
              title="view list"
              style={{ fontSize: "1.3rem", marginLeft: "10px" }}
            />
          </Tooltip>
        </Link>
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
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
    this.dispatchFetchUserLists();
  };

  componentWillUnmount = () => this.props.clearUserLists();

  componentDidUpdate = (prevProps, prevState) => {
    const { pageSize, pageNo, filters } = this.state;
    if (
      !_.isEqual(
        { pageSize, pageNo, ...filters },
        {
          pageSize: prevState.pageSize,
          pageNo: prevState.pageNo,
          ...prevState.filters,
        }
      )
    ) {
      this.dispatchFetchUserLists();
    }
  };

  dispatchFetchUserLists = (pageDetails) => {
    const { pageSize, pageNo } = pageDetails || this.state;
    const { filters } = this.state;
    const pagination = { skip: (pageNo - 1) * pageSize, limit: pageSize };
    const select = ["name", "createdAt", "updatedAt", "total"];
    this.setState({ onLoading: true });
    const callback = () => {
      this.setState({ onLoading: false });
    };
    this.props.fetchUserLists({ select, filters, pagination, callback });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  };

  // Functions for Search Component
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();

    if (selectedKeys[0])
      this.setState({
        filters: {
          name: {
            $regex: selectedKeys[0],
            $options: "$i",
          },
        },
      });

    this.setState({
      searchText: selectedKeys[0],
    });
  };

  handleSearchReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "", filters: {} });
  };

  //selectedRowKeys functions
  onSelectedRowsDelete = async () => {
    const { selectedRowKeys, pageSize, pageNo } = this.state;
    const { tableData, deleteUserLists } = this.props;

    const listIDs = selectedRowKeys.map((index) => tableData[index - 1]["_id"]);

    this.setState({ onLoading: true });

    const select = ["name", "createdAt", "updatedAt", "total"];

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
    deleteUserLists({ select, listIDs, onSuccess, onError, pagination });
  };

  onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

  handleSave = (row) => {
    const { editUserList, tableData } = this.props;

    if (_.findIndex(tableData, { _id: row._id, name: row.name }) !== -1) return;

    this.setState({ onLoading: true });

    const select = ["name", "createdAt", "updatedAt", "total"];
    const onSuccess = (data) => {
      this.setState({ onLoading: false });
      message.success(data);
    };
    const onError = (err) => {
      this.setState({ onLoading: false });
      message.error(err.response.data.error);
      console.log({ err });
    };
    const update = {
      _id: row._id,
      update: {
        $set: { name: row.name },
      },
    };
    const { pageSize, pageNo } = this.state;
    const pagination = { skip: (pageNo - 1) * pageSize, limit: pageSize };
    editUserList({ update, select, pagination, onSuccess, onError });
  };

  onPaginationChange = (pageNo, pageSize) => {
    this.setState({ pageSize, pageNo });
  };

  render() {
    const { sortedInfo, selectedRowKeys, onLoading, pageNo } = this.state;
    const { tableData, total } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columnConfig = [
      {
        title: "List Name",
        key: "name",
        dataIndex: "name",
        editable: true,
        ...defaultSearchComponent(this, "name"),
      },
      {
        title: "Total",
        key: "total",
        dataIndex: "total",
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === "total" && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: "Created At",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.createdAt, b.createdAt),

        sortOrder: sortedInfo.columnKey === "createdAt" && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: "Updated At",
        key: "updatedAt",
        dataIndex: "updatedAt",
        render: (val) => parseTimeStamp(val, "MMMM Do YYYY, h:mm:ss a"),
        sorter: (a, b) => getDiffInMilliseconds(a.updatedAt, b.updatedAt),
        sortOrder: sortedInfo.columnKey === "updatedAt" && sortedInfo.order,
        ellipsis: true,
      },
    ];

    const columns = columnConfig.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
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
            <span style={{ marginLeft: 8 }}>
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
          rowClassName={() => "editable-row"}
          components={components}
          rowSelection={rowSelection}
          dataSource={tableData}
          columns={columns}
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
        ></Table>
      </div>
    );
  }
}
const mapStateToProps = ({ userLists }, ownProps) => ({
  ...ownProps,
  tableData: userLists.data,
  total: userLists.total,
});

export default connect(mapStateToProps, {
  fetchUserLists,
  clearUserLists,
  deleteUserLists,
  editUserList,
})(EditableTable);
