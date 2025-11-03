import "./App.css";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { CssBaseline, GlobalStyles } from "@mui/joy";

import AnimatedRoutes from "./Routes/AnimatedRoutes";
import globalStyles from "./styles/globalStyles";
import { Warning } from "@mui/icons-material";

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
          warning: "#ED6C02",
        },
        primary: {
          solidColor: "#ffffff",
          solidBg: "#004366", // Your custom primary button background
          solidHoverBg: "#004366", // On hover
          solidActiveBg: "#004366",
          neutralBg: "#F9FAFB",

          plainColor: "#004366",

          outlinedBorder: "#004366",
          outlinedColor: "#004366",

          softColor: "#004366",
          softBg: "#004366", // <-- this sets the text color for plain buttons
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
