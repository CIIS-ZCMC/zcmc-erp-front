import { Link, useLocation } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import PropTypes from "prop-types";

const TabsComponent = ({ tabs = [], pathMap }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  // Find current tab value based on path
  const currentTab =
    Object.entries(pathMap).find(
      ([index, path]) => path === currentPath
    )?.[0] || "0";

  return (
    <>
      <Tabs value={currentTab}>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              value={String(index)}
              component={Link}
              to={pathMap[index]}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
};

TabsComponent.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TabsComponent;
