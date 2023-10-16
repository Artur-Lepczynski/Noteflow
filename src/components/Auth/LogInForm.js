import { useTheme } from "@emotion/react";
import style from "./LogInForm.module.css";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useInput } from "../../hooks/useInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

export default function LogInForm(props) {
  const theme = useTheme();

  //email
  const {
    enteredValue: enteredEmail,
    enteredValueisValid: enteredEmailisValid,
    inputIsValid: emailInputIsValid,
    inputBlurHandler: emailInputBlurHandler,
    inputChangeHandler: emailInputChangeHandler,
  } = useInput((email) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }, "");

  //password
  const {
    enteredValue: enteredPassword,
    enteredValueisValid: enteredPasswordisValid,
    inputIsValid: passwordInputIsValid,
    inputBlurHandler: passwordInputBlurHandler,
    inputChangeHandler: passwordInputChangeHandler,
  } = useInput((password) => {
    return password.trim().length > 6;
  }, "");

  const [showPassword, setShowPassword] = useState(false);

  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  const formIsValid = enteredEmailisValid && enteredPasswordisValid;

  const [formIsLoading, setFormIsLoading] = useState(false);

  function handleLogIn() {
    if (!formIsValid) return;

    setFormIsLoading(true);
    props.onLogIn("login", true);

    console.log("Log In", enteredEmail, enteredPassword);

    const auth = getAuth(); 

    signInWithEmailAndPassword(auth, enteredEmail, enteredPassword).then(()=>{
      console.log("logged in");
      //redirect

    }).catch((error)=>{
      console.log(error);
      //show error notification

    }).finally(()=>{
      setFormIsLoading(false);
      props.onLogIn("login", false);
    });
  }

  //reset password
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordFormIsLoading, setForgotPasswordFormIsLoading] =
    useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  
  const {
    enteredValue: enteredForgotPasswordEmail,
    enteredValueisValid: enteredForgotPasswordEmailisValid,
    inputIsValid: forgotPasswordEmailInputIsValid,
    inputBlurHandler: forgotPasswordEmailInputBlurHandler,
    inputChangeHandler: forgotPasswordEmailInputChangeHandler,
    reset: forgotPasswordEmailReset,
  } = useInput((email) => {
    const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }, "");

  function handleForgotPasswordDialogOpen() {
    setForgotPasswordMessage(null);
    forgotPasswordEmailReset();
    setForgotPasswordDialogOpen(true);
    setEmailSent(false);
  }

  function handleForgotPasswordDialogClose() {
    setForgotPasswordDialogOpen(false);
  }

  function handleForgotPasswordDialogSend() {
    setForgotPasswordFormIsLoading(true);
    if(!enteredForgotPasswordEmailisValid) return;

    
    const auth = getAuth();
    
    sendPasswordResetEmail(auth, enteredForgotPasswordEmail).then(()=>{
      console.log("sending password reset email to", enteredForgotPasswordEmail);
      //TODO: change app name after setting up hosting
      setEmailSent(true);
      setForgotPasswordMessage({type: "success", message: "Password reset email sent"});
    }).catch((error)=>{
      if(error.code === "auth/user-not-found"){
        setForgotPasswordMessage({type: "error", message: "There is no user with this email"});
      }else if(error.code === "auth/invalid-email"){
        setForgotPasswordMessage({type: "error", message: "Please enter a valid email"});
      }else{
        setForgotPasswordMessage({type: "error", message: "Something went wrong. Please try again later."});
      }

    }).finally(()=>{
      setForgotPasswordFormIsLoading(false);
    });
  }

  return (
    <Box className={style.wrapper}>
      <Box className={style["input-wrapper"]}>
        <TextField
          id="email"
          className={style.input}
          label="Email"
          fullWidth={true}
          value={enteredEmail}
          helperText={emailInputIsValid ? " " : "Please enter a valid email"}
          error={!emailInputIsValid}
          onChange={emailInputChangeHandler}
          onBlur={emailInputBlurHandler}
        />

        <FormControl fullWidth variant="outlined" className={style.input}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            value={enteredPassword}
            onChange={passwordInputChangeHandler}
            onBlur={passwordInputBlurHandler}
            error={!passwordInputIsValid}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText style={{ color: theme.palette.error.main }}>
            {passwordInputIsValid
              ? " "
              : "Password should be at least 7 characters long"}
          </FormHelperText>
        </FormControl>
      </Box>

      <Box className={style["button-wrapper"]}>
        <Button
          disabled={formIsLoading}
          onClick={handleForgotPasswordDialogOpen}
        >
          Forgot password?
        </Button>
        <LoadingButton
          onClick={handleLogIn}
          disabled={!formIsValid}
          loading={formIsLoading}
          variant="contained"
        >
          Log In
        </LoadingButton>
      </Box>


      <Dialog
        open={forgotPasswordDialogOpen}
        onClose={handleForgotPasswordDialogClose}
      >
        <DialogTitle>Password reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your email address here. We
            will send you instructions on how to reset it.
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={enteredForgotPasswordEmail}
            helperText={
              forgotPasswordEmailInputIsValid
                ? " "
                : "Please enter a valid email"
            }
            error={!forgotPasswordEmailInputIsValid}
            onChange={forgotPasswordEmailInputChangeHandler}
            onBlur={forgotPasswordEmailInputBlurHandler}
          />
          {forgotPasswordMessage && <Alert severity={forgotPasswordMessage.type}>{forgotPasswordMessage.message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordDialogClose}>{emailSent ? "close" : "cancel"}</Button>
          {!emailSent && <LoadingButton
            onClick={handleForgotPasswordDialogSend}
            loading={forgotPasswordFormIsLoading}
            disabled={!enteredForgotPasswordEmailisValid}
          >
            Send
          </LoadingButton>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
