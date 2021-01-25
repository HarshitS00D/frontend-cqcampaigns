import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import React, { Component } from "react";

const defaultModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [{ header: [1, 2, 3, 4, false] }],
    [{ direction: "rtl" }, { align: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};

const defaultFormats = [
  "header",
  "size",
  "script",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
  "font",
  "align",
  "direction",
];

export default class Quill extends Component {
  render() {
    return (
      <ReactQuill
        value={this.props.value || ""}
        className={this.props.className || ""}
        placeholder={this.props.placeholder || ""}
        readOnly={this.props.read}
        theme={this.props.theme}
        onChange={this.props.onChange} // onChange(content, delta, source, editor)
        style={this.props.style || undefined}
        modules={this.props.modules || defaultModules}
        formats={this.props.formats || defaultFormats}
      />
    );
  }
}
