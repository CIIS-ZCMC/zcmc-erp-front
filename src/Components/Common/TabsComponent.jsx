import { Tabs, TabList, Tab, TabPanel } from "@mui/joy"

const TabsComponent = ({ tabs, tabPanel }) => {
    return (
        <>
            <Tabs defaultValue={0}>
                <TabList>
                    {tabs}
                    <Tab>First tab</Tab>
                    <Tab>Second tab</Tab>
                    <Tab>Third tab</Tab>
                </TabList>
                <TabPanel value={0}>
                    <b>First</b> tab panel
                </TabPanel>
                <TabPanel value={1}>
                    <b>Second</b> tab panel
                </TabPanel>
                <TabPanel value={2}>
                    <b>Third</b> tab panel
                </TabPanel>
            </Tabs>
        </>
    )
}

export default TabsComponent