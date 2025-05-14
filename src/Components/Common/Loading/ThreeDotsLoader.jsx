import { Box } from "@mui/joy";
import { ThreeDots } from "react-loader-spinner";

export const ThreeDotsLoader = () => {
  return (
    <Box display="flex" alignItems={"center"} justifyContent={"center"}>
      <ThreeDots
        visible={true}
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </Box>
  );
};
