import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { AutoComplete, Form, Input, Button, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import _ from "lodash";

import { fetchTemplates } from "../../actions/templateActions";
import { fetchUserLists } from "../../actions/listActions";
import { createCampaign } from "../../actions/campaignActions";
import TemplateFormFields from "../Templates/TemplateFormFields";

const CampaignForm = (props) => {
  const templates = useSelector((state) => state.templates.data);
  const lists = useSelector((state) => state.userLists.data);
  const [templateOptions, setTemplateOptions] = useState(null);
  const [listOptions, setListOptions] = useState(null);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedList, setSelectedList] = useState();

  useEffect(() => {
    dispatch(fetchTemplates({ filters: { campaignID: { $eq: null } } }));
    dispatch(fetchUserLists());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(templates)) {
      const options = templates.map((template, index) => ({
        key: template._id,
        label: template.name,
        value: template.name,
        index,
      }));

      setTemplateOptions(options);
    }
  }, [templates]);

  useEffect(() => {
    if (Array.isArray(lists)) {
      const options = lists.map((list, index) => ({
        key: list._id,
        label: list.name,
        value: list.name,
        index,
      }));

      setListOptions(options);
    }
  }, [lists]);

  const getTemplateValuesFromForm = (values) => ({
    ..._.pick(values, [
      "analytics",
      "bodyType",
      "subject",
      "fromName",
      "fromEmail",
    ]),
    body: values.body || values.htmlBody,
    name: values.templateName,
  });

  const onFormSubmit = (values) => {
    const data = {
      name: values.name,
      template: getTemplateValuesFromForm(values),
      listID: selectedList.key,
    };

    const onSuccess = (data) => {
      message.success(data);
      form.resetFields();
      props.history.push("/campaigns");
    };

    const onError = (error) => {
      message.error(error);
      console.log(error);
    };

    dispatch(createCampaign({ data, onSuccess, onError }));
  };

  const onFieldsBlur = () => {
    let resetFields = [];
    if (!selectedTemplate) resetFields.push("selectedTemplate");
    if (!selectedList) resetFields.push("selectedList");

    if (resetFields.length) form.resetFields(resetFields);
  };

  const generateTemplateFormValues = () => {
    const record = templates[selectedTemplate.index];

    return {
      ..._.pick(record, [
        "analytics",
        "fromEmail",
        "fromName",
        "bodyType",
        "subject",
      ]),
      [record.bodyType === 1 ? "htmlBody" : "body"]: record.body,
      templateName: record.name,
    };
  };

  return (
    <Form form={form} onFinish={onFormSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Campaign Name"
        rules={[
          {
            required: true,
            message: "Please Enter Campaign Name",
          },
        ]}
      >
        <Input size="large" placeholder="Enter Campaign Name" />
      </Form.Item>

      <Form.Item
        name="selectedList"
        label="Select List"
        rules={[{ required: true, message: "Please Select a List" }]}
      >
        <AutoComplete
          onBlur={onFieldsBlur}
          onSelect={(value, option) => setSelectedList(option)}
          onChange={(value) => setSelectedList()}
          notFoundContent="No Match"
          filterOption={true}
          options={listOptions}
        >
          <Input
            suffix={<DownOutlined />}
            size="large"
            placeholder="Select List"
          />
        </AutoComplete>
      </Form.Item>

      <Form.Item name="selectedTemplate" label="Select Template">
        <AutoComplete
          onBlur={onFieldsBlur}
          onSelect={(value, option) => setSelectedTemplate(option)}
          onChange={(value) => setSelectedTemplate()}
          filterOption={true}
          options={templateOptions}
          notFoundContent="No Match"
        >
          <Input
            suffix={<DownOutlined />}
            size="large"
            placeholder="Select Template"
          />
        </AutoComplete>
      </Form.Item>

      <TemplateFormFields
        form={form}
        {...(selectedTemplate
          ? {
              initialFormValues: generateTemplateFormValues(),
            }
          : {})}
      />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(CampaignForm);
