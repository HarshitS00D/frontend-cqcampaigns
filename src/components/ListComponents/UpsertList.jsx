import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { Form, Input, Button, Upload, message, Table, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import { createUserList, editUserList } from "../../actions/listActions";
import { apiUrl } from "../../utils/static_vars";

import "./Lists.css";

const UpsertList = (props) => {
  const [fileList, setFileList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableColumn, setTableColumn] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const token = useSelector((state) => state.session.token);
  const dispatch = useDispatch();

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    const onSuccess = (data) => {
      if (props.hideModal) {
        props.hideModal();
      }
      setIsLoading(false);
      message.success(data.success);
      if (data.faultyRecords.length !== 0) {
        message.error(`${data.faultyRecords.length} Faulty record(s)`);
      }
      form.resetFields();
      onFileRemove();
    };
    const onError = (error) => {
      setIsLoading(false);
      console.log("onError", error);
      message.error(error.response.data.error);
    };

    if (props.match.params.id) {
      const update = {
        _id: props.match.params.id,
        update: { $push: { subscribers: tableData } },
      };
      dispatch(
        editUserList({
          update,
          onSuccess,
          onError,
          pagination: props.pagination,
        })
      );
    } else {
      createUserList({
        listName: values.listName,
        tableData,
        onSuccess,
        onError,
      });
    }
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);
    setFileList(fileList);

    const status = info.file.status;
    if (status !== "uploading") {
    }
    if (status === "done") {
      if (typeof info.file.response === "string")
        return message.error(info.file.response);

      message.success(`${info.file.name} file uploaded successfully.`);
      const columnConfig = Object.keys(
        _.omit(info.file.response[0], "key")
      ).map((key) => ({
        title: _.startCase(key),
        key,
        dataIndex: key,
      }));
      setTableColumn(columnConfig);
      setTableData(info.file.response);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onFileRemove = () => {
    setFileList([]);
    setTableColumn([]);
    setTableData([]);
  };

  return (
    <Spin spinning={isLoading} tip="Loading..." size="large">
      <Form
        form={form}
        className="create-list-form"
        size="large"
        onFinish={onFormSubmit}
      >
        {!props.match.params.id && (
          <Form.Item
            name="listName"
            rules={[
              {
                required: true,
                message: "Please enter list name",
              },
            ]}
          >
            <Input placeholder="Enter List Name"></Input>
          </Form.Item>
        )}
        <Form.Item
          name="dragger"
          rules={[
            {
              required: true,
              message: "Please Upload a file",
            },
          ]}
        >
          <Upload.Dragger
            name="file"
            headers={{ authorization: token }}
            action={`${apiUrl}/api/list/upload`}
            onChange={handleFileChange}
            fileList={fileList}
            onRemove={onFileRemove}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <h2>Import CSV</h2>
            <p className="ant-upload-text">
              Please ensure the first row of the CSV file contains column names.
              This row must contain an email header.
            </p>
            <p className="ant-upload-hint">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </Form.Item>
        {tableData.length ? (
          <>
            <Table
              scroll={{ x: true }}
              columns={tableColumn}
              dataSource={tableData}
              pagination={{ defaultPageSize: 5 }}
            />
            <Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </Spin>
  );
};

export default withRouter(UpsertList);
