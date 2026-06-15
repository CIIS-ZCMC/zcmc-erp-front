import React from "react";
import { Box, FormLabel, Radio, RadioGroup, Sheet } from "@mui/joy";

const IconLessRadioButtonComponent = ({ data, onChange }) => {
  return (
    <Box>
      <FormLabel
        id="storage-label"
        sx={{
          fontWeight: "xl",
          fontSize: "xs",
        }}
      >
        Storage
      </FormLabel>
      <RadioGroup
        aria-labelledby="storage-label"
        defaultValue={data?.[0]?.id}
        size="sm"
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        sx={{
          gap: 1.5,
          display: "flex",
          flexDirection: "row",
          p: 1,
        }}
      >
        {data.map(({ id, name }) => (
          <Sheet
            key={id}
            sx={{
              borderRadius: "md",
              boxShadow: "sm",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              minWidth: 100,
            }}
          >
            <Radio
              label={`${name}`}
              overlay
              disableIcon
              value={id}
              slotProps={{
                label: ({ checked }) => ({
                  sx: {
                    fontWeight: "lg",
                    fontSize: "md",
                    color: checked ? "text.primary" : "text.secondary",
                  },
                }),
                action: ({ checked }) => ({
                  sx: (theme) => ({
                    ...(checked && {
                      "--variant-borderWidth": "2px",
                      "&&": {
                        // && to increase the specificity to win the base :hover styles
                        borderColor: theme.vars.palette.primary[500],
                      },
                    }),
                  }),
                }),
              }}
            />
          </Sheet>
        ))}
      </RadioGroup>
    </Box>
  );
};

export default IconLessRadioButtonComponent;
