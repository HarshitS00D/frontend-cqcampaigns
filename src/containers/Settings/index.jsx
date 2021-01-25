import { PageHeader, Divider } from "antd";
import SettingsForm from "../../components/Settings/SettingsForm";

const Settings = () => {
  return (
    <>
      <PageHeader className="site-page-header" title="Settings" />
      <Divider />
      <SettingsForm />
    </>
  );
};

export default Settings;
