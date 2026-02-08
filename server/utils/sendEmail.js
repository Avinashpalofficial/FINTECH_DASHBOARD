import nodemailer from 'nodemailer'
export const sendEmail =  async(options)=>{
           try {
                     const  transPorter =  nodemailer.createTransport({
                 host: process.env.MAIL_HOST,
                 port:process.env.MAIL_PORT,
                 auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS
                 }
           })
           const mailOptions= {
            from:process.env.MAIL_USER,
            to:options.email,
            subject:options.subject,
            html:options.message,
            text:options.text
           }
           const information = await transPorter.sendMail(mailOptions)
           } catch (error) {
             console.error('Error sending email: ', error);
           }
}