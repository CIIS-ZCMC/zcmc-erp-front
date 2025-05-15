import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/joy";
import styled from "@emotion/styled";
import { useAuthActions } from "../../Store/AuthStore";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
});

/**
 * Authentication Loader
 *
 * This will authenticate user from umis server via pr monitoring server
 *
 * Done Mock Testing status : [PASSED]
 *
 * @returns {functional component}
 */
const Authentication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authenticate } = useAuthActions();

  /**
   * Initialize Client
   *
   * retrieve the session_id (id) in parameters as unique id
   * to verify user authenticity.
   *
   * trigger authenticate request with param session_id
   *
   * @param {any} token : Token to allow cancelation of request in case the user remove the current tab
   */
  async function init() {
    const params = { session_id: id };

    const redirect_to = await authenticate(params);

    if (!!redirect_to) {
      navigate(redirect_to);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Container>
      <CircularProgress size="lg" color="success" />
      <Typography level="h6" color="neutral.300" sx={{ mt: 3 }}>
        Signing in might take a few seconds...
      </Typography>
    </Container>
  );
};

export default Authentication;
