//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

//pages
import LandingPage from "./pages/LandingPage";

//react
import { useEffect } from "react";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import RootLayout from "./pages/RootLayout";

function App() {
  initializeApp(firebaseConfig);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        //get settings?
        console.log(user);
      } else {
        console.log("no user");
      }
    });
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [{ index: true, element: <LandingPage /> }],
    },
  ]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
