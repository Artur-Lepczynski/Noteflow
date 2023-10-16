import style from "./SignInForm.module.css";
import { useInput } from "../../hooks/useInput";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export default function SignInForm(props) {
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

  //repeated password
  const {
    enteredValue: enteredRepeatedPassword,
    enteredValueisValid: enteredRepeatedPasswordisValid,
    inputIsValid: repeatedPasswordInputIsValid,
    inputBlurHandler: repeatedPasswordInputBlurHandler,
    inputChangeHandler: repeatedPasswordInputChangeHandler,
  } = useInput((repeatedPassword) => {
    return repeatedPassword === enteredPassword;
  }, "");

  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);

  function handleClickShowRepeatedPassword() {
    setShowRepeatedPassword((show) => !show);
  }

  function handleMouseDownRepeatedPassword(event) {
    event.preventDefault();
  }

  const formIsValid =
    enteredEmailisValid &&
    enteredPasswordisValid &&
    enteredRepeatedPasswordisValid;

  const [formIsLoading, setFormIsLoading] = useState(false);

  //sign in
  function handleSignIn() {
    if (!formIsValid) {
      return;
    }
    setFormIsLoading(true);
    props.onSignIn("signup", true);
    console.log(
      "signing in",
      enteredEmail,
      enteredPassword,
      enteredRepeatedPassword
    );

    const auth = getAuth(); 
    createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword).then(()=>{
      console.log("user created");
      //redirect

    }).catch((error)=>{
      console.log(error);
      //show error notification
    }).finally(()=>{
      setFormIsLoading(false);
      props.onSignIn("signup", false);
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

        <FormControl fullWidth variant="outlined" className={style.input}>
          <InputLabel htmlFor="repeated-password">Repeat Password</InputLabel>
          <OutlinedInput
            id="repeated-password"
            type={showRepeatedPassword ? "text" : "password"}
            value={enteredRepeatedPassword}
            onChange={repeatedPasswordInputChangeHandler}
            onBlur={repeatedPasswordInputBlurHandler}
            error={!repeatedPasswordInputIsValid}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowRepeatedPassword}
                  onMouseDown={handleMouseDownRepeatedPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Repeat Password"
          />
          <FormHelperText style={{ color: theme.palette.error.main }}>
            {repeatedPasswordInputIsValid ? " " : "Passwords don't match"}
          </FormHelperText>
        </FormControl>
      </Box>

      <Box className={style["button-wrapper"]}>
        <LoadingButton
          className={style["action-button"]}
          variant="contained"
          disabled={!formIsValid}
          loading={formIsLoading}
          onClick={handleSignIn}
        >
          Sign up
        </LoadingButton>
      </Box>
    </Box>
  );
}
