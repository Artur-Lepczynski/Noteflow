import { Button, Container, Paper, Typography, useTheme } from "@mui/material";
import style from "./Landing.module.css";
import Page from "../UI/Page";
import Auth from "../Auth/Auth";

export default function Landing() {
  // const theme = useTheme();
  // console.log(theme)

  return (
    <Page flex>
      <div className={style.wrapper}>
        <div className={style["title-wrapper"]}>
          <Typography
            variant="h2"
            component="h1"
            marginBottom
            color={"primary.main"}
          >
            Noteflow
          </Typography>
          <Typography variant="p">
            Create and manage simple notes
          </Typography>
        </div>
        <Auth/>
      </div>
    </Page>
  );
}
