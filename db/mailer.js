import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'suppritdas@gmail.com',
        pass: 'ecpxqbkvmgevcfkv',
    },
});
