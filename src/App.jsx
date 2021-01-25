import React from "react";
import { connect } from "react-redux";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import Login from "./containers/Login";
import Home from "./containers/Home";
import { createSession } from "./actions/sessionActions";

import "antd/dist/antd.css";
import "./app.css";

const App = ({ user, createSession }) => {
  const [isLoading, changeLoadingState] = React.useState(false);

  React.useEffect(() => {
    const onError = (response) => {
      if (response && typeof response.data === "string")
        message.error(response.data);
    };
    if (!user) createSession({ changeLoadingState, onError });
  }, [user, createSession]);

  return (
    <div className="container">
      <Spin
        className="spinner"
        spinning={isLoading}
        indicator={
          <LoadingOutlined style={{ color: "white", fontSize: "4rem" }} />
        }
      />

      {!isLoading && (user ? <Home /> : <Login />)}
    </div>
  );
};

const mapStateToProps = ({ session: { user } }, ownProps) => ({
  user,
  ...ownProps,
});

export default connect(mapStateToProps, { createSession })(App);
