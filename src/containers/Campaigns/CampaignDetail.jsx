import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Divider,
  Button,
  Tag,
  Card,
  Typography,
  PageHeader,
  message,
  Modal,
  Input,
  Spin,
} from "antd";
import { MailTwoTone } from "@ant-design/icons";
import _ from "lodash";

import { fetchTemplates, clearTemplates } from "../../actions/templateActions";
import { fetchUserLists, clearUserLists } from "../../actions/listActions";
import { sendEmails } from "../../actions/campaignActions";
import { regularExpressions } from "../../utils/static_vars";

import "./campaign.css";

const CampaignDetail = (props) => {
  const template = useSelector((state) =>
    state.templates.data ? state.templates.data[0] : null
  );
  const list = useSelector((state) =>
    state.userLists.data ? state.userLists.data[0] : null
  );

  const dispatch = useDispatch();
  const {
    templateID,
    listID,
    _id: campaignID,
    name: campaignName,
  } = props.location.state;
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSendEmailsLoading, setIsSendEmailsLoading] = useState(false);
  const [isSendTestEmailLoading, setIsSendTestEmailLoading] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState();

  const fetchTemplatesCallback = () => {
    setIsTemplateLoading(false);
  };

  const fetchUserListsCallback = () => {
    setIsListLoading(false);
  };

  useEffect(() => {
    setIsListLoading(true);
    setIsTemplateLoading(true);
    dispatch(
      fetchTemplates({
        filters: { _id: templateID },
        callback: fetchTemplatesCallback,
      })
    );
    dispatch(
      fetchUserLists({
        filters: { _id: listID },
        callback: fetchUserListsCallback,
      })
    );

    return () => {
      dispatch(clearTemplates());
      dispatch(clearUserLists());
    };
  }, [templateID, dispatch, listID]);

  const onSuccess = (data) => {
    setIsSendEmailsLoading(false);
    setIsSendTestEmailLoading(false);
    setTestModalVisible(false);
    message.success("Email(s) sent successfully");
  };
  const onError = (err) => {
    setIsSendEmailsLoading(false);
    setIsSendTestEmailLoading(false);
    if (err && err.response) message.error(err.response.data.error);
    else message.error("Some error occured");
  };

  const onSendEmails = () => {
    setIsSendEmailsLoading(true);
    dispatch(
      sendEmails({
        body: { listID, campaignID, templateID },
        onSuccess,
        onError,
      })
    );
  };

  const onSendTestEmail = () => {
    if (!regularExpressions.emailValidator.test(testEmail))
      return message.error("Invalid Email");
    setIsSendTestEmailLoading(true);

    dispatch(
      sendEmails({ body: { to: testEmail, templateID }, onSuccess, onError })
    );
  };

  const showModal = () => {
    setTestModalVisible(true);
  };

  const handleOk = () => {
    onSendTestEmail();
  };

  const handleCancel = () => {
    setTestModalVisible(false);
  };

  const renderCardTitle = () => {
    return (
      <>
        <Tag color="orange">Subject :</Tag> {template.subject}
      </>
    );
  };

  const renderListTitle = () => {
    return (
      <>
        <Tag color="#108ee9">List Attached :</Tag>{" "}
        <Link to={`/lists/${list._id}`}> {list.name} </Link>
        <Divider type="vertical" />
      </>
    );
  };

  const renderTemplateTitle = () => {
    const record = template;

    return (
      <>
        <Tag color="#108ee9">Template Attached :</Tag>
        <Link
          to={{
            pathname: `/templates/${record._id}`,
            state: {
              ..._.pick(record, [
                "analytics",
                "fromEmail",
                "fromName",
                "bodyType",
                "subject",
              ]),
              [record.bodyType === 1 ? "htmlBody" : "body"]: record.body,
              templateName: record.name,
            },
          }}
          // className="link"
        >
          {template.name}
        </Link>
        <Divider type="vertical" />
      </>
    );
  };

  const TestMailModal = (
    <Modal
      title="Send Test Email"
      visible={testModalVisible}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSendTestEmailLoading}
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
      destroyOnClose
      closable={false}
    >
      <Input
        prefix={<MailTwoTone />}
        onChange={(e) => setTestEmail(e.target.value)}
        placeholder=" E-mail"
        allowClear
      />
    </Modal>
  );

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Campaign Details"
        subTitle="view and send your campaign"
        onBack={() => props.history.goBack()}
      />
      <Divider />
      <Spin spinning={isTemplateLoading || isListLoading}>
        {template && (
          <div
            style={{ background: "white", padding: "20px", fontSize: "1rem" }}
          >
            <h2>{campaignName}</h2>

            <div>
              {list && renderListTitle()}
              {template && renderTemplateTitle()}
            </div>

            <p>
              <Tag color="#87d068">From :</Tag>
              {template.fromName}
              <Typography.Link> {`<${template.fromEmail}>`} </Typography.Link>
            </p>

            <Card title={renderCardTitle()}>
              <div
                contentEditable="false"
                dangerouslySetInnerHTML={{ __html: template.body }}
              />
            </Card>

            <div className="card-footer">
              <div>
                <Button
                  type="primary"
                  onClick={onSendEmails}
                  loading={isSendEmailsLoading}
                >
                  Send Emails
                </Button>

                {TestMailModal}
                <Button type="secondary" onClick={showModal}>
                  Send Test Email
                </Button>
              </div>
              <div>{/* for future add on buttons */}</div>
            </div>
          </div>
        )}
      </Spin>
    </>
  );
};

export default CampaignDetail;
