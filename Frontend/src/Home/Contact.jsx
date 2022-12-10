import NavBarSection from "./Navbar"
import { Button, TextField,InputLabel,NativeSelect, FormControl } from "@mui/material"
import axios from "axios"
import { useState } from "react"; 
const doctors = ["Ahmadi","Noori","Azizi"]
function ContactPage(){
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [message,setMessag] = useState();
    const [ doctor,setDoctor ] = useState()
    const [sattue,setSattue] = useState("submit");
    console.log(doctor)
    console.log(name)
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            setSattue("sending....")
            let res = await axios.post("http://localhost:4000/contactMail",{
            doctor:doctor,
            name:name,
            email:email,
            message:message
        })
        window.location.reload()
        }catch(error){
            console.log(error)
        }
        // alert("submit ed") 
    }
    const MyStyle = {
        width:"300px",
        marginTop:"20px"
    }
    return(<>
    <NavBarSection/><br/>
    <form onSubmit={handleSubmit}>
    <FormControl style={MyStyle}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Doctor
            </InputLabel>
            <NativeSelect
                inputProps={{
                id: 'uncontrolled-native',
                }}
                onChange={(e)=>setDoctor(e.target.value)}
            >
                    <option >select</option>
                {doctors.map((item)=>(
                    <option value={item}>{item}</option>
                ))}
             
            </NativeSelect>
            </FormControl><br/>
        <TextField style={MyStyle} variant="standard" name="name" placeholder="username" onChange={(e)=>setName(e.target.value)} required></TextField><br/>
        <TextField style={MyStyle} variant="standard" name="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required></TextField><br/>
        <TextField style={MyStyle} multiline rows={4} name="password" variant="standard" onChange={(e)=>setMessag(e.target.value)} placeholder="Message" required></TextField><br/>
        <Button style={MyStyle} variant="contained" type="submit" required>{sattue}</Button><br/>
    </form>
    </>)
}
export default ContactPage