import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { AutoComplete, Form, Input, Button, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import _ from "lodash";

import {
  fetchCampaigns,
  clearCampaigns,
  editCampaign,
} from "../../actions/campaignActions";
import { fetchTemplates, clearTemplates } from "../../actions/templateActions";
import { fetchUserLists, clearUserLists } from "../../actions/listActions";
import { createCampaign } from "../../actions/campaignActions";
import TemplateFormFields from "../Templates/TemplateFormFields";

const CampaignForm = (props) => {
  const campaignID = props.match.params.id;
  const campaign = useSelector(
    (state) =>
      campaignID &&
      state.campaigns.data &&
      state.campaigns.data.filter((el) => el._id === campaignID)[0]
  );
  const templates = useSelector((state) =>
    state.templates.data ? state.templates.data : null
  );
  const lists = useSelector((state) => state.userLists.data);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [listOptions, setListOptions] = useState([]);
  const [initialTemplateValues, setInitialTemplateValues] = useState();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [selectedList, setSelectedList] = useState();

  useEffect(() => {
    if (campaignID) {
      dispatch(fetchCampaigns({ filters: { _id: campaignID } }));
    } else {
      dispatch(clearCampaigns());
      form.resetFields();
      setSelectedList();
    }

    dispatch(fetchTemplates());
    dispatch(fetchUserLists());

    return () => {
      dispatch(clearCampaigns());
      dispatch(clearTemplates());
      dispatch(clearUserLists());
    };
  }, [dispatch, campaignID, props.location.pathname, form]);

  useEffect(() => {
    if (Array.isArray(templates)) {
      const options = templates.reduce((filtered, template, index) => {
        if (!template.campaignID) {
          let newOption = {
            key: template._id,
            label: template.name,
            value: template.name,
            index,
          };
          filtered.push(newOption);
        }
        return filtered;
      }, []);

      setTemplateOptions(options);

      if (campaign) {
        const values = generateTemplateFormValues(
          templates.filter(
            (template) => template._id === campaign.templateID
          )[0]
        );

        setInitialTemplateValues(values);
      }
    }
  }, [templates && templates.length, campaign]);

  useEffect(() => {
    if (Array.isArray(lists)) {
      const options = lists.map((list, index) => ({
        key: list._id,
        label: list.name,
        value: list.name,
        index,
      }));

      setListOptions(options);

      if (campaign) {
        const option = options.filter(
          (option) => option.key === campaign.listID
        );

        const values = {
          name: campaign.name,
        };
        if (option.length) {
          values.selectedList = option[0].label;
          setSelectedList(option[0]);
        }
        form.setFieldsValue(values);
      }
    }
  }, [lists, campaign, form]);

  const onFormSubmit = (values) => {
    const data = {
      name: values.name,
      template: getTemplateValuesFromForm(values),
      listID: selectedList.key,
    };

    const onSuccess = (data) => {
      message.success(data);
      form.resetFields();
      if (campaignID) return props.history.goBack();
      else return props.history.push("/campaigns");
    };

    const onError = (error) => {
      message.error(error);
      console.log(error);
    };

    if (campaign) {
      const prevData = {
        name: campaign.name,
        template: getTemplateValuesFromForm(initialTemplateValues),
        listID: campaign.listID,
      };
      if (_.isEqual(prevData, data)) {
        message.warn("No Changes made");
        if (campaignID) return props.history.goBack();
        else return props.history.push("/campaigns");
      }

      data.template._id = campaign.templateID;
      dispatch(
        editCampaign({ campaignID: campaign._id, data, onSuccess, onError })
      );
    } else dispatch(createCampaign({ data, onSuccess, onError }));
  };

  const onFieldsBlur = () => {
    let resetFields = [];
    if (!selectedTemplate) resetFields.push("selectedTemplate");
    if (!selectedList) resetFields.push("selectedList");

    if (resetFields.length) form.resetFields(resetFields);
  };

  function generateTemplateFormValues(record) {
    return record
      ? {
          ..._.pick(record, [
            "analytics",
            "fromEmail",
            "fromName",
            "bodyType",
            "subject",
          ]),
          [record.bodyType === 1 ? "htmlBody" : "body"]: record.body,
          templateName: record.name,
        }
      : undefined;
  }

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
        templateID={
          (selectedTemplate && selectedTemplate.key) ||
          (campaign && campaign.templateID)
        }
      />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {campaign ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(CampaignForm);
