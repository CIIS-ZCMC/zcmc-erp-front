// services/submissionService.js

import { nextYear } from "@Utils/Functions";

// This function only handles the "create" call
const SubmissionServices = {
  submit: async (payload, createFn, APPLICATION_OBJECTIVE_ID) => {
    const responseMessages = {
      existing: {
        status: 200,
        title: "Existing AOP",
        description: "You already have an AOP application in your area.",
      },
      success: {
        status: 200,
        title: `AOP for F.Y. ${nextYear} successfully ${
          APPLICATION_OBJECTIVE_ID ? "updated" : "submitted for approval"
        }.`,
        isGlobal: false,
        description: APPLICATION_OBJECTIVE_ID
          ? "Your AOP has been successfully updated."
          : "Your AOP request has been sent to the next approving body.",
      },
      error: (status, message) => ({
        status,
        title: "Submission failed",
        description: message || "An unexpected error occurred.",
      }),
    };

    try {
      const { status, message } = await new Promise((resolve) => {
        createFn(payload, (status, message) => {
          resolve({ status, message });
        });
      });

      if (status === 200 && message === responseMessages.existing.description) {
        return { type: "existing", ...responseMessages.existing };
      }

      if (status === 200) {
        return { type: "success", ...responseMessages.success };
      }

      return { type: "error", ...responseMessages.error(status, message) };
    } catch (err) {
      console.error("Submission error:", err);
      return {
        type: "error",
        ...responseMessages.error(err?.status || 500, err?.message),
      };
    }
  },
};

export default SubmissionServices;
