import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, message, Button } from "antd";
import { MailTwoTone } from "@ant-design/icons";

import { deleteUsers, getUsers } from "../../actions/AccountActions";
import { regularExpressions } from "../../utils/static_vars";

const buttonLayout = {
  wrapperCol: {
    xs: { offset: 8 },
    sm: { offset: 8 },
    md: { offset: 10 },
    lg: { offset: 10 },
  },
};

const DeleteUserForm = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const onDelete = () => {
    const data = {
      emails: [email],
    };

    setIsLoading(true);

    const onSuccess = (data) => {
      setEmail("");
      setIsLoading(false);
      message.success(data);
      form.resetFields();

      if (user.role === 0) {
        dispatch(getUsers());
      }
    };

    const onError = (data) => {
      setIsLoading(false);
      message.error(data.error);
    };

    dispatch(deleteUsers({ data, onSuccess, onError }));
  };

  const onInputChange = (e) => {
    setEmail(e.target.value);
    form.setFields([
      {
        name: "email",
        errors: null,
      },
    ]);
  };

  return (
    <div style={{ width: "60%" }}>
      <Form
        requiredMark={false}
        style={{
          background: "white",
          padding: "2.2rem",
        }}
        form={form}
        onFinish={onDelete}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          validateTrigger="onSubmit"
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value && value.match(regularExpressions.emailValidator)) {
                  return Promise.resolve();
                }
                return Promise.reject("Please enter a valid email");
              },
            }),
          ]}
        >
          <Input
            prefix={<MailTwoTone />}
            onChange={(e) => {
              onInputChange(e);
            }}
            placeholder="Enter Email"
          />
        </Form.Item>
        <Form.Item {...buttonLayout}>
          <Button type="danger" loading={isLoading} htmlType="submit">
            Delete
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeleteUserForm;
