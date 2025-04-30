import { Box, TabList, Tabs, Typography } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import PropTypes from "prop-types";
import { useState } from "react";

CustomTabComponent.propTypes = {
  onChange: PropTypes.func,
  tabOptions: PropTypes.array,
};

function CustomTabComponent({ onChange, tabOptions }) {
  const [activeTab, setActiveTab] = useState(0);

  //  ON CHANGE
  const handleChange = (_, value) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };

  return (
    <Box>
      <Tabs
        value={activeTab} // Set the value to activeTab
        onChange={handleChange} // Update active tab on change
        sx={() => ({
          height: 40,
          p: 0.7,
          borderRadius: 100,
          mx: "auto",
          backgroundColor: "neutral.100",
          [`& .${tabClasses.root}`]: {
            flex: 1,
            transition: "0.3s",
            fontWeight: "md",
            fontSize: "md",
          },
        })}
      >
        <TabList
          variant="plain"
          size="sm"
          disableUnderline
          sx={{
            borderRadius: 100,
            gap: 1,
            height: 40,
            p: 0,
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "xs",
              bgcolor: "white",
            },
          }}
        >
          {tabOptions?.map(({ name }, key) => (
            <Tab key={key} disableIndicator>
              <Typography
                fontSize={12}
                sx={{
                  color: activeTab === key ? "success.600" : "neutral",
                  fontWeight: activeTab === key ? 600 : 500,
                }}
              >
                {name}
                {/* ({percent}) */}
              </Typography>
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </Box>
  );
}

export default CustomTabComponent;
