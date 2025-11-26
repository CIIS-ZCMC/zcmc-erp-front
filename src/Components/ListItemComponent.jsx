import {
  ListDivider,
  ListItem,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";

export default function ListItemComponent() {
  return (
    <div>
      <ListItem>
        <ListItemDecorator>
          <Checkbox checked={!!status} color={!!status && "success"} />
        </ListItemDecorator>
        <Stack>
          <Typography level={status ? "title-sm" : "body-sm"}>
            {title}
          </Typography>
          <Typography level="body-xs">{description}</Typography>
        </Stack>
      </ListItem>
      <ListDivider inset={"gutter"} />
    </div>
  );
}
