import { Container } from "@mui/material";
import style from "./Page.module.css";

export default function Page(props) {
  console.log(props.flex);
  return (
    <Container
      className={`${style.page} ${props.flex && style["page-flex"]}`}
      style={props.flex ? {display: "flex"} : {}}
      maxWidth={false}
    >
      {props.children}
    </Container>
  );
}
