import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Form, Row, Col, Input, Typography, Button, Tag, message } from "antd";
import _ from "lodash";
import {
  getUserSettings,
  changeUserSettings,
} from "../../actions/settingsActions";

const { Text } = Typography;

const SettingsForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserSettings());
  }, [dispatch]);

  const settings = useSelector((state) =>
    _.omit(state.settings, ["userID", "_id", "__v"])
  );
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings, form]);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (values) => {
    if (_.isEqual(values, settings)) return message.info("No changes made");
    setIsLoading(true);
    const onSuccess = (data) => setIsLoading(false);
    const onError = (err) => {
      console.log(err);
      setIsLoading(false);
    };
    dispatch(changeUserSettings({ payload: values, onSuccess, onError }));
  };

  return (
    <Row>
      <Col flex="55%">
        <Form
          layout="vertical"
          form={form}
          style={{ background: "white", padding: "2.2rem" }}
          onFinish={onSubmit}
        >
          <h2>Mailjet Configuration</h2>
          <Form.Item
            name={"MailjetUsername"}
            label={
              <span>
                <h3>
                  Mailjet Username -{" "}
                  {!settings.MailjetUsername && (
                    <Tag color="#f50">Not Saved</Tag>
                  )}
                </h3>
                <Text type="secondary">Your Mailjet public key</Text>
              </span>
            }
          >
            <Input placeholder={`Example: zVqHiOr8ClmcbVi3hHn2MZVb6fcW8HXS`} />
          </Form.Item>
          <Form.Item
            name={"MailjetPassword"}
            label={
              <span>
                <h3>
                  Mailjet Password -{" "}
                  {!settings.MailjetPassword && (
                    <Tag color="#f50">Not Saved</Tag>
                  )}
                </h3>
                <Text type="secondary">Your Mailjet private key</Text>
              </span>
            }
          >
            <Input placeholder={`Example: zVqHiOr8ClmcbVi3hHn2MZVb6fcW8HXS`} />
          </Form.Item>
          <Form.Item>
            <Button
              type="success"
              htmlType="submit"
              loading={isLoading}
              style={{
                color: "white",
                background: "#52c41a",
              }}
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SettingsForm;
