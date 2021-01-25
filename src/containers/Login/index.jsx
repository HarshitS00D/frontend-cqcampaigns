import React from "react";
import { Form, Button, Input, Checkbox, Spin } from "antd";
import { connect } from "react-redux";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";

import { regularExpressions } from "../../utils/static_vars";
import { createSession } from "../../actions/sessionActions";

import "./index.css";

const Login = (props) => {
  const [form] = Form.useForm();
  const [isLoading, changeLoadingState] = React.useState(false);

  const onFormSubmit = async ({ email, password, remember }) => {
    const { createSession } = props;

    const onError = (error) => {
      if (error) {
        const { data } = error;

        form.setFields([
          {
            name: data.field,
            errors: [data.error],
          },
        ]);
      }
    };

    createSession({
      email,
      password,
      remember,
      changeLoadingState,
      onError,
    });
  };

  const onChange = (el) =>
    form.setFieldsValue({ [el.target.id]: el.target.value.trim() });

  return (
    <Form
      form={form}
      className="login-form"
      initialValues={{
        email: localStorage.getItem("email"),
        remember: false,
      }}
      onFinish={onFormSubmit}
    >
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined spin />}
        tip={`Please Wait...`}
        size={`large`}
      >
        <Form.Item
          name="email"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              pattern: regularExpressions.emailValidator,
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          {/* 
          <Button className="login-form-forgot" type="link">
            Forgot password
          </Button> */}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Spin>
    </Form>
  );
};

const mapStateToProps = ({ session }, ownprops) => {
  return { session, ...ownprops };
};

export default connect(mapStateToProps, { createSession })(Login);
