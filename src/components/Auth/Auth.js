import { Alert, Box, Paper, Snackbar, Tab, Tabs } from "@mui/material";
import style from "./Auth.module.css";
import { useState } from "react";
import SignInForm from "./SignInForm";
import LogInForm from "./LogInForm";

export default function Auth() {
  const [selectedTab, setSelectedTab] = useState("signup");

  function handleTabChange(event, newValue) {
    setSelectedTab(newValue);
  }

  const [loadingTab, setLoadingTab] = useState("none");

  function authActionHandler(tab, loading) {
    if (loading) {
      setLoadingTab(tab);
    } else {
      setLoadingTab("none");
    }
  }

  //auth toasts
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({});

  function handleToastOpen() {
    setToastOpen(true);
    setToastMessage({type: "error", message: "error!"}); 

    setTimeout(()=>{
      setToastMessage({type: "success", message: "we did it!"}); 
    }, 1200)
  }

  function handleToastClose(event, reason) {
    if (reason === "clickaway") return;
    setToastOpen(false);
  }

  return (
    <Paper className={style.wrapper} elevation={1}>
      <Box className={style["tab-wrapper"]}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab
            value="signup"
            label="Sign Up"
            disabled={loadingTab !== "none" && loadingTab !== "signup"}
          />
          <Tab
            value="login"
            label="Log In"
            disabled={loadingTab !== "none" && loadingTab !== "login"}
          />
        </Tabs>
      </Box>
      {selectedTab === "signup" && <SignInForm onSignIn={authActionHandler} />}
      {selectedTab === "login" && <LogInForm onLogIn={authActionHandler} />}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastMessage.type}
          sx={{ width: "100%" }}
        >
          {toastMessage.message}
        </Alert>
      </Snackbar>
      <button onClick={handleToastOpen}>test toast</button>
    </Paper>
  );
}
