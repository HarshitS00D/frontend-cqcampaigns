import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, message, Modal, Input, Form } from "antd";
import { LockTwoTone } from "@ant-design/icons";

import { hashCrypt } from "../../utils/bcrypt";
import { regularExpressions } from "../../utils/static_vars";
import { editUser } from "../../actions/AccountActions";

const ChangePasswordModal = (props) => {
  const { ChangePasswordModalVisible, changeParentState, userID } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const onFormSubmit = async (values) => {
    const hashedPassword = await hashCrypt(values.password);

    const data = {
      password: hashedPassword,
    };

    const onSuccess = (data) => {
      setIsFormLoading(false);
      message.success(data);
      changeParentState({
        userID: null,
        ChangePasswordModalVisible: false,
      });
      form.resetFields();
    };

    const onError = (data) => {
      message.error(data.error);
      setIsFormLoading(false);

      form.setFields([
        {
          name: data.field,
          errors: [data.error],
        },
      ]);
    };

    dispatch(editUser({ userID, payload: data, onSuccess, onError }));
  };

  const handleCancel = () => {
    form.resetFields();
    changeParentState({
      userID: null,
      ChangePasswordModalVisible: false,
    });
  };

  return (
    <Modal
      title="Change Password"
      visible={ChangePasswordModalVisible}
      footer={false}
      destroyOnClose
      closable={false}
    >
      <Form
        style={{ background: "white" }}
        form={form}
        onFinish={onFormSubmit}
        layout="vertical"
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please Enter password",
            },
            {
              pattern: regularExpressions.passwordValidator,
              message: "Password must be atleast of 4 characters",
            },
          ]}
          hasFeedback
        >
          <Input
            type={"password"}
            prefix={<LockTwoTone />}
            placeholder="Enter password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input
            type={"password"}
            prefix={<LockTwoTone />}
            placeholder="Enter password again"
          />
        </Form.Item>

        <Form.Item>
          <Button loading={isFormLoading} type="primary" htmlType="submit">
            Submit
          </Button>
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
