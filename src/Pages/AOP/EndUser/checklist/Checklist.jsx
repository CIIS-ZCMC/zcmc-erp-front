import React, { useState, useEffect } from "react";

import {
  Typography,
  List,
  ListItem,
  ListDivider,
  ListItemDecorator,
  Stack,
  Checkbox,
} from "@mui/joy";

import BoxComponent from "@Components/Common/Card/BoxComponent";
import useAOPHook from "../../../../Hooks/AOP/AOPHook";
import useAOPStore from "../../../../Store/AOPStore";
import { grey } from "@mui/material/colors";

const Checklist = ({ fiscalYear }) => {
  const { getAopChecklist } = useAOPHook();
  const { aopChecklist } = useAOPStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const params = { year: fiscalYear };

    getAopChecklist(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    // console.log('aop check list:', aopChecklist)
  }, [aopChecklist]);

  return (
    <>
      <BoxComponent height="58vh" padding={2}>
        <Typography level="title-lg">AOP Submission Checklist</Typography>

        <Stack
          mt={2}
          sx={{
            height: "calc(58vh - 56px)", // subtract the height of the title + margin
            overflowY: "auto",
          }}
        >
          <List size="lg" component="nav" variant="">
            {aopChecklist?.map(({ title, description, status }) => (
              <>
                <ListItem>
                  <ListItemDecorator>
                    <Checkbox
                      checked={!!status}
                      color={!!status && "success"}
                      variant="soft"
                    />
                  </ListItemDecorator>
                  <Stack>
                    <Typography
                      level={status ? "title-sm" : "body-sm"}
                      sx={{
                        color: status ? grey[900] : grey[400],
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      level="body-xs"
                      textAlign={"justify"}
                      sx={{
                        color: status ? grey[700] : grey[400],
                      }}
                    >
                      {description}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListDivider inset={"gutter"} />
              </>
            ))}
          </List>
        </Stack>
      </BoxComponent>
    </>
  );
};

export default Checklist;
