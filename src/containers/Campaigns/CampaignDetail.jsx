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
  Tooltip,
} from "antd";
import { MailTwoTone, EditTwoTone } from "@ant-design/icons";
//import _ from "lodash";

import { fetchCampaigns, clearCampaigns } from "../../actions/campaignActions";
import { fetchTemplates, clearTemplates } from "../../actions/templateActions";
import { fetchUserLists, clearUserLists } from "../../actions/listActions";
import { sendEmails } from "../../actions/campaignActions";
import { regularExpressions } from "../../utils/static_vars";

import "./campaign.css";

const CampaignDetail = (props) => {
  const campaignID = props.match.params.id;
  const campaign = useSelector((state) =>
    state.campaigns.data ? state.campaigns.data[0] : null
  );
  const template = useSelector((state) =>
    state.templates.data ? state.templates.data[0] : null
  );
  const list = useSelector((state) =>
    state.userLists.data ? state.userLists.data[0] : null
  );
  const dispatch = useDispatch();

  const [isCampaignLoading, setIsCampaignLoading] = useState(false);
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

  const fetchCampaignsCallback = () => {
    setIsCampaignLoading(false);
  };

  useEffect(() => {
    setIsCampaignLoading(true);
    dispatch(
      fetchCampaigns({
        filters: { _id: campaignID },
        callback: fetchCampaignsCallback,
      })
    );

    return () => {
      dispatch(clearCampaigns());
      dispatch(clearTemplates());
      dispatch(clearUserLists());
    };
  }, [dispatch, campaignID]);

  useEffect(() => {
    if (!campaign) return;

    setIsListLoading(true);
    setIsTemplateLoading(true);
    dispatch(
      fetchTemplates({
        filters: { _id: campaign.templateID },
        callback: fetchTemplatesCallback,
      })
    );
    dispatch(
      fetchUserLists({
        filters: { _id: campaign.listID },
        callback: fetchUserListsCallback,
      })
    );
  }, [campaign, dispatch]);

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
    if (!list) return message.error("No List Attached");
    setIsSendEmailsLoading(true);
    dispatch(
      sendEmails({
        body: {
          listID: campaign.listID,
          campaignID: campaign._id,
          templateID: campaign.templateID,
        },
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
      sendEmails({
        body: { to: testEmail, templateID: campaign.templateID },
        onSuccess,
        onError,
      })
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
        <Link to={`/templates/${record._id}`}>{template.name}</Link>
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
      <Spin spinning={isCampaignLoading || isTemplateLoading || isListLoading}>
        {isCampaignLoading || isTemplateLoading || isListLoading
          ? null
          : template && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  fontSize: "1rem",
                }}
              >
                <h2>
                  {campaign && campaign.name}{" "}
                  <Link
                    to={`/campaigns/${campaignID}/edit`}
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "30px",
                    }}
                  >
                    <Tooltip placement="right" title="Edit" color="blue">
                      <EditTwoTone style={{ fontSize: "large" }} />
                    </Tooltip>
                  </Link>
                </h2>

                <div style={{ paddingBottom: "10px" }}>
                  <Tag color="#87d068">From :</Tag>
                  {template.fromName}
                  <Typography.Link>
                    {" "}
                    {`<${template.fromEmail}>`}{" "}
                  </Typography.Link>
                  <Divider type="vertical" />
                  {list && renderListTitle()}
                  {template && renderTemplateTitle()}
                </div>

                <Card title={renderCardTitle()}>
                  {template.bodyType === 1 ? (
                    <div
                      contentEditable="false"
                      dangerouslySetInnerHTML={{ __html: template.body }}
                    />
                  ) : (
                    template.body
                  )}
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
