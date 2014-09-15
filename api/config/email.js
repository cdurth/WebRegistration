/* EMAIL SETTINGS */
module.exports = {
    /* Settings for office365 */
    host: "HOST",
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