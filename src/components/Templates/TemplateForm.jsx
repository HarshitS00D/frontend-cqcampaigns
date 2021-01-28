import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { Form, Button, message } from "antd";

import TemplateFormFields from "./TemplateFormFields";
import { createTemplate, editTemplate } from "../../actions/templateActions";

const initialValues = {
  bodyType: 0,
  analytics: [],
  templateName: null,
  body: null,
  htmlBody: null,
  subject: null,
  fromEmail: null,
  fromName: null,
};

const TemplateForm = (props) => {
  const templateID = props.match.params.id;
  const [form] = Form.useForm();
  const [initialFormValues, setinitialFormValues] = useState(
    props.initialFormValues || props.location.state || initialValues
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.location.pathname.split("/").includes("create")) {
      form.setFieldsValue(initialValues);
    }
  }, [form, props.location.pathname]);

  const onSubmit = (data) => {
    if (_.isEqual(initialFormValues, data)) {
      message.warning("No changes made", 1);
      return props.history.push("/templates/");
    }

    const body = data.htmlBody;
    delete data.htmlBody;
    if (body) data.body = body;
    const templateName = data.templateName;
    delete data.templateName;
    data.name = templateName;

    const onSuccess = (res) => {
      message.success(res, 1);
      form.resetFields();
      setinitialFormValues({
        bodyType: 0,
        analytics: [],
      });
      return props.history.goBack();
    };
    const onError = (err) => message.error("Some Error Occured", 1);
    dispatch(
      (templateID ? editTemplate : createTemplate)({
        data,
        templateID,
        onSuccess,
        onError,
      })
    );
  };

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={initialFormValues}
      layout="vertical"
    >
      <TemplateFormFields
        form={form}
        initialFormValues={props.location.state}
      />
      <Button type="primary" htmlType="Submit" style={{ marginTop: "2rem" }}>
        {props.match.params.id ? `Update ` : `Create `} Template
      </Button>
    </Form>
  );
};

export default withRouter(TemplateForm);
