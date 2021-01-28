import { PageHeader, Divider } from "antd";
import { withRouter } from "react-router-dom";

import TemplateForm from "../../components/Templates/TemplateForm";
const CreateTemplate = (props) => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Create Template"
        subTitle="Create or Edit your templates here"
        onBack={() => props.history.goBack()}
      />
      <Divider />
      <TemplateForm />
    </>
  );
};

export default withRouter(CreateTemplate);
