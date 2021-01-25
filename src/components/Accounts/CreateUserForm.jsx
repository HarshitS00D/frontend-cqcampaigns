import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Checkbox, Button, message, Spin } from "antd";
import _ from "lodash";

import { hashCrypt } from "../../utils/bcrypt";
import { regularExpressions } from "../../utils/static_vars";
import { createUser } from "../../actions/AccountActions";

const buttonLayout = {
  wrapperCol: {
    xs: { offset: 8 },
    sm: { offset: 8 },
    md: { offset: 10 },
    lg: { offset: 10 },
  },
};

const CreateUserForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const onFormSubmit = async (values) => {
    const hashedPassword = await hashCrypt(values.password);

    const data = {
      ..._.omit(values, "confirmPassword"),
      password: hashedPassword,
      role: values.role ? 1 : 2, // 1:admin, 2:normal user
    };

    const onSuccess = (data) => {
      setIsFormLoading(false);
      message.success(data);
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

    dispatch(createUser({ data, onSuccess, onError }));
  };

  return (
    <div style={{ width: "60%" }}>
      <Spin spinning={isFormLoading}>
        <Form
          style={{ background: "white", padding: "2.2rem" }}
          form={form}
          onFinish={onFormSubmit}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            label="First Name"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter First Name",
              },
            ]}
          >
            <Input placeholder="Enter First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter Last Name",
              },
            ]}
          >
            <Input placeholder="Please enter Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please Enter Email",
              },
              {
                pattern: regularExpressions.emailValidator,
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
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
            <Input type="password" placeholder="Enter password" />
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
            <Input type="password" placeholder="Enter password again" />
          </Form.Item>

          <Form.Item name="role" valuePropName="checked">
            <Checkbox>Has Admin Rights</Checkbox>
          </Form.Item>

          <Form.Item {...buttonLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateUserForm;
