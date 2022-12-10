const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())

// app.get("/contact-mail",(req,res)=>{
    //     res.send("get methode")
    // })
app.listen(4000,()=>{console.log("server is running in 4000 port")})

        var contactMail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'hamza.nawabi119@gmail.com',
            pass: 'htmerjpiqxvscniw'
            }
        });
        contactMail.verify((error)=>{
            if(error){
                console.log(error)
            }else{
                console.log("your message Send it")
            }
        })
        // var mailOptions = {
        //     from: '420MyBlog@gmail.com',
        //     to: 'hamza.nawabi119@gmail.com',
        //     subject: 'Sending Email using Node.js',
        //     text: 'That was easy!'
        // };
app.post("/contactMail",(req,res)=>{
    // res.send("post methode")    
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message
    const doctor = req.body.doctor

    const mail = {
        from:"hamza.nawabi119@gmail.com",
        to:"hamza.nawabi119@gmail.com",
        subject:"message Send From The Nawabi Blog",
        html:`
        User_Name:<b>${name}</b><br/>
        User_Mail:<b>${email}</b><br/>
        User_Message:<b>${message}</b><br/>
        Doctor_Name:<b>${doctor}</b><br/>
        `
    }
    contactMail.sendMail(mail,(error)=>{
        if(error){
            res.json(error)
        }else{
            res.json({message:"We Recieved Your Message"})
        }
    }); 
})
