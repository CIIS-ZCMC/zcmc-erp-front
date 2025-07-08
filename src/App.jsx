import "./App.css";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { CssBaseline, GlobalStyles } from "@mui/joy";

import AnimatedRoutes from "./Routes/AnimatedRoutes";
import globalStyles from "./styles/globalStyles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        custom: {
          main: "#003049",
          light: "#004366",
          lighter: "#E5FBF5",
          lightBg: "#F2F8F6",
          buttonBg: "#1D70BC",
          fontLight: "#667085",
          fontReg: "#666666",
          active: "rgba(55, 150, 245, 0.12)",
          darkgreen: "#0E5844",
        },
      },
    },
  },
  components: {
    JoyButton: {
      defaultProps: {
        variant: "solid",
        color: "primary",
      },
    },
  },
  fontFamily: {
    display: "Poppins", // applies to `h1`–`h4`
    body: "Poppins", // applies to `title-*` and `body-*`
  },
});

function App() {
  return (
    <>
      <CssVarsProvider theme={theme}>
        <GlobalStyles styles={globalStyles} />
        <AnimatedRoutes />
      </CssVarsProvider>
    </>
  );
}

export default App;
