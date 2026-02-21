const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('=== EMAIL SERVICE ===');
        console.log('Sending email to:', options.email);
        console.log('Subject:', options.subject);
        
        // Log email configuration (without showing full password)
        console.log('Email user:', process.env.EMAIL_USER);
        console.log('Email pass length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true, // Enable debug logs
            logger: true // Log to console
        });

        // Verify connection configuration
        await transporter.verify();
        console.log('Email server connection verified');

        // Mail options
        const mailOptions = {
            from: `"FoodieExpress" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.text || '',
            html: options.html || options.message || ''
        };

        console.log('Mail options prepared');

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        
        return info;
        
    } catch (error) {
        console.error('Email service error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error command:', error.command);
        
        if (error.response) {
            console.error('Error response:', error.response);
        }
        
        throw error; // Re-throw to be handled by the controller
    }
};

module.exports = sendEmail;