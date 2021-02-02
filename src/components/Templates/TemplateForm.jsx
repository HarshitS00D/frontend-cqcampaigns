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
  const templateID = /* props.templateID ||*/ props.match.params.id;
  const [form] = Form.useForm();
  const [initialFormValues, setInitialFormValues] = useState(
    props.initialFormValues || initialValues
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!templateID) form.setFieldsValue(initialValues);
  }, [form, templateID]);

  const onSubmit = (data) => {
    // console.log({ initialFormValues, data });
    if (_.isEqual(initialFormValues, data)) {
      message.warning("No changes made", 1);
      if (templateID) return props.history.goBack();
      else return props.history.push("/templates");
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
      setInitialFormValues({
        bodyType: 0,
        analytics: [],
      });
      if (templateID) return props.history.goBack();
      else return props.history.push("/templates");
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
        templateID={templateID}
        setInitialTemplateValues={setInitialFormValues}
      />
      <Button type="primary" htmlType="Submit" style={{ marginTop: "2rem" }}>
        {props.match.params.id ? `Update ` : `Create `} Template
      </Button>
    </Form>
  );
};

export default withRouter(TemplateForm);
