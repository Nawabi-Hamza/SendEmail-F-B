import NavBarSection from "./Navbar"
import { Button } from "@mui/material"
function HomePage(){
    return(<>
    <NavBarSection/><br/>
    Home Page
    <Button href="/contact">Hello go to contact page for mail</Button>
    </>)
}
export default HomePage