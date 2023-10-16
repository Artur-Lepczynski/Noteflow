import { Outlet } from "react-router-dom";

export default function RootLayout(props) {
  return (
    <>
    {/* sidebar */}
    <Outlet/>
    {/* notifications */}
    </>
  )
}