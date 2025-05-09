import { Modal, ModalDialog } from "@mui/joy";
import PropTypes from "prop-types";
import { Bars, InfinitySpin, Oval, ThreeDots } from "react-loader-spinner";

PageLoader.propTypes = { isLoading: PropTypes.bool };

function PageLoader({ isLoading }) {
  return (
    isLoading && (
      <Modal
        open={isLoading}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   opacity: 0.7,
          //   bgcolor: "neutral.50",
        }}
      >
        <ThreeDots
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </Modal>
    )
  );
}

export default PageLoader;
