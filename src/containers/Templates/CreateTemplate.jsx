import { PageHeader, Divider } from "antd";

import TemplateForm from "../../components/Templates/TemplateForm";
const CreateTemplate = () => {
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Create Template"
        subTitle="Create or Edit your templates here"
      />
      <Divider />
      <TemplateForm />
    </>
  );
};

export default CreateTemplate;
