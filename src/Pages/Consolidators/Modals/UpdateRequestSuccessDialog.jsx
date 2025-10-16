import React from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Sheet,
  List,
  ListItem,
  ListItemDecorator,
  Chip,
  Button,
  Divider,
  Box,
  Stack,
  Grid, // Added Grid here
} from "@mui/joy";
import { CheckCircle, Info } from "lucide-react"; // Using lucide-react for icons

const UpdateRequestSuccessDialog = ({ open, onClose, responseData }) => {
  if (!responseData || !responseData.data) {
    // Fallback for unexpected data structure
    return (
      <Modal open={open} onClose={onClose}>
        <ModalDialog role="alertdialog" sx={{ maxWidth: 500, p: 3 }}>
          <Typography
            id="alert-dialog-title"
            component="h2"
            level="h4"
            startDecorator={<Info size={24} />}
            gutterBottom
          >
            Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            The operation was completed, but there's no detailed information to
            display.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
            <Button onClick={onClose} autoFocus variant="solid">
              Close
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    );
  }

  const { data, message } = responseData;
  const item = data; // Assuming 'data' inside responseData contains the item details

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        role="alertdialog"
        sx={{ maxWidth: 600, width: "90%", p: 3, overflowY: "auto" }}
      >
        <Stack spacing={1.5}>
          <Typography
            id="alert-dialog-title"
            component="h2"
            level="h4"
            startDecorator={<CheckCircle size={24} />}
            sx={{ color: "success.plainColor" }}
          >
            {message || "Item Updated Successfully!"}
          </Typography>
          <Divider />

          <Sheet
            variant="outlined"
            sx={{ p: 2, borderRadius: "md", bgcolor: "background.level1" }}
          >
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Item Name:
                </Typography>
                <Typography>{item.name || "N/A"}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Item Code:
                </Typography>
                <Typography>{item.code || "N/A"}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Status:
                </Typography>
                <Chip
                  size="sm"
                  color={item.status === "approved" ? "success" : "warning"}
                  variant="soft"
                >
                  {item.status || "N/A"}
                </Chip>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Estimated Budget:
                </Typography>
                <Typography>
                  {item.estimated_budget
                    ? `₱ ${parseFloat(item.estimated_budget).toLocaleString()}`
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Category:
                </Typography>
                <Typography>{item.item_category?.name || "N/A"}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Classification:
                </Typography>
                <Typography>
                  {item.item_classification?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography level="title-sm" fontWeight="bold">
                  Unit:
                </Typography>
                <Typography>{item.item_unit?.name || "N/A"}</Typography>
              </Grid>
            </Grid>
          </Sheet>

          {item.item_specifications && item.item_specifications.length > 0 && (
            <>
              <Typography level="title-md" fontWeight="bold" mt={1}>
                Specifications:
              </Typography>
              <Sheet
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: "md",
                  maxHeight: 150,
                  overflowY: "auto",
                  bgcolor: "background.level1",
                }}
              >
                <List size="sm" aria-labelledby="specifications-list-title">
                  {item.item_specifications.map((spec, index) => (
                    <ListItem key={spec.id || index}>
                      <ListItemDecorator>
                        <CheckCircle
                          size={16}
                          sx={{ color: "success.plainColor" }}
                        />
                      </ListItemDecorator>
                      {spec.description}
                    </ListItem>
                  ))}
                </List>
              </Sheet>
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
            <Button onClick={onClose} autoFocus variant="solid">
              Close
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default UpdateRequestSuccessDialog;
