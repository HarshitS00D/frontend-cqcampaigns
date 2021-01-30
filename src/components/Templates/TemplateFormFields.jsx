import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Form, Row, Col, Input, Radio, Checkbox } from "antd";
import _ from "lodash";

import Quill from "../quill";
import { fetchTemplates, clearTemplates } from "../../actions/templateActions";

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

const TemplateFormFields = (props) => {
  const templateID = props.templateID || props.match.params.id;
  const { form } = props;
  const dispatch = useDispatch();
  const [bodyType, setBodyType] = useState(
    (props.initialFormValues && props.initialFormValues.bodyType) ||
      initialValues.bodyType
  );
  const templateValues = useSelector(
    (state) =>
      templateID &&
      state.templates.data &&
      state.templates.data.filter((el) => el._id === templateID)[0]
  );
  const [removedAnalytics, setRemovedAnalytics] = useState([]);
  useEffect(() => {
    //console.log(templateID);
    if (templateID) {
      dispatch(fetchTemplates({ filters: { _id: templateID } }));
    } //else form.setFieldsValue(initialValues);
  }, [templateID, dispatch, form]);

  useEffect(() => {
    const templateFormValues = generateTemplateFormValues(templateValues);
    //console.log(templateFormValues);
    if (templateFormValues) {
      if (props.setInitialFormValues) {
        props.setInitialFormValues(templateFormValues);
      }
      setBodyType(templateFormValues.bodyType);
      form.setFieldsValue(templateFormValues);
    }
  }, [templateValues, form]);

  useEffect(() => () => dispatch(clearTemplates()), [dispatch]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue(props.initialFormValues || initialValues);
      if (props.initialFormValues)
        setBodyType(props.initialFormValues.bodyType);
    }
  }, [props.initialFormValues, form]);

  const onBodyTypeChange = (e) => {
    setBodyType(e.target.value);
    if (form) {
      let analytics = form.getFieldValue("analytics");
      switch (e.target.value) {
        case 0:
          if (analytics.includes(0)) removedAnalytics.push(0);
          if (analytics.includes(1)) removedAnalytics.push(1);
          setRemovedAnalytics(removedAnalytics);
          analytics = analytics.filter((el) => el !== 0 && el !== 1);
          break;
        case 1:
          analytics = [...analytics, ...removedAnalytics];
          setRemovedAnalytics([]);
          break;
        default:
          break;
      }
      form.setFieldsValue({ analytics });
    }
  };

  const onEditorChange = (content, delta, source, editor) => {
    const htmltext = editor.getHTML(),
      text = editor.getText();
    if (text.length) {
      form.setFieldsValue({ htmlBody: htmltext });
    }
  };
  return (
    <>
      <Row>
        <Col flex={"50%"} style={{ padding: "0.5rem 1rem 0 0" }}>
          <h2>Template Details</h2>
          <Form.Item
            name="templateName"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter template name",
              },
            ]}
          >
            <Input placeholder="Enter Template Name"></Input>
          </Form.Item>
        </Col>
        <Col flex={"50%"} style={{ padding: "0.5rem 0 0 1rem" }}>
          <h2>Analytics</h2>
          <Form.Item name="analytics">
            <Checkbox.Group>
              <Checkbox value={0} disabled={bodyType !== 1}>
                Insert tracking pixel. Available for HTML emails only.
              </Checkbox>
              <br />
              <Checkbox value={1} disabled={bodyType !== 1}>
                {`Track link clickthroughs, syntax: {linklabel/http://mylinktotrack.com}. Available for HTML emails only`}
              </Checkbox>
              <br />
              <Checkbox value={2}>Add unsubscribe link</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
      <h2>E-mail Details</h2>
      <Row>
        <Col flex={1}>
          <Form.Item
            name="fromEmail"
            label="From E-mail"
            rules={[
              {
                required: true,
                message: "Please enter From E-mail",
              },
            ]}
          >
            <Input type="email" placeholder="Enter From E-mail"></Input>
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item
            style={{ marginLeft: "1rem" }}
            name="fromName"
            label="From Name"
            rules={[
              {
                required: true,
                message: "Please enter From Name",
              },
            ]}
          >
            <Input placeholder="Enter From Name"></Input>
          </Form.Item>
        </Col>
      </Row>
      <h2>Create email</h2>
      <Row>
        <Col>
          <Form.Item
            name="bodyType"
            label="Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group buttonStyle="solid" onChange={onBodyTypeChange}>
              <Radio.Button value={0}>Plain Text</Radio.Button>
              <Radio.Button value={1}>HTML</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col flex="auto">
          <Form.Item
            style={{ marginLeft: "1.5rem" }}
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
                message: "Please enter a Subject",
              },
            ]}
          >
            <Input placeholder="Enter Subject"></Input>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={bodyType === 1 ? "htmlBody" : "body"}
        rules={[
          {
            required: true,
            message: "E-mail Body is required",
          },
        ]}
      >
        {bodyType === 1 ? (
          <Quill
            theme="snow"
            value={(props.initialFormValues || initialValues).htmlBody}
            placeholder="E-mail Body"
            onChange={onEditorChange}
            style={{ background: "white" }}
          />
        ) : (
          <Input.TextArea
            style={{
              minHeight: "30vh",
            }}
            placeholder="E-mail Body"
          />
        )}
      </Form.Item>
    </>
  );
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

export default withRouter(TemplateFormFields);
