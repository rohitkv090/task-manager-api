const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'rohitkv090@gmail.com',
        subject:'Thanks for joining us!',
        text:`Welcome to Task app,${name}. Let me know if you find any bugs or report any crashes`
    })
}

const sendAccountDeleteMail=(email,name)=>{
    sgMail.send(
        {
            to:email,
            from:'rohitkv090@gmail.com',
            subject:'Account Deleted',
            text:`${name},your account has been closed successfull. Please give us feedback so we can improve our services`
        }
    )
}
module.exports={
    sendWelcomeMail,sendAccountDeleteMail
}