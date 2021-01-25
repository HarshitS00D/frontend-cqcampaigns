import { Upload, message } from "antd";
import React, { Component } from "react";
import { InboxOutlined } from "@ant-design/icons";

const Dragger = Upload.Dragger;

export default class FileUploader extends Component {
  uploaderProps = {
    name: "file",
    action: "//jsonplaceholder.typicode.com/posts/",
    multiple: false,
    onChange(info) {
      console.log(info);

      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  render() {
    return (
      <Dragger {...this.uploaderProps} {...this.props}>
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
      </Dragger>
    );
  }
}
