/* EMAIL SETTINGS */
module.exports = {
/* setup for office365 */
    host: "HOSTNAME",
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, 
    auth: {
        user: "USERNAME",
        pass: "PASSWORD"
    },
    tls: {
        ciphers:'SSLv3'
    }
}