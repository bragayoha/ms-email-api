const newBetEmail = require('./consumers/send_new_bet_email')
const adminNewBetEmail = require('./consumers/send_admin_new_bet_email')
const betUsEmail = require('./consumers/send_let_bet_us_email')
const resetPasswordEmail = require('./consumers/send_reset_password_email')
const welcomeEmail = require('./consumers/send_welcome_email')

newBetEmail.runSendNewBetEmail().catch(console.error)
adminNewBetEmail.runSendAdminNewBetEmail().catch(console.error)
betUsEmail.runLetBetUsEmail().catch(console.error)
resetPasswordEmail.runResetPasswordEmail().catch(console.error)
welcomeEmail.runSendWelcomeEmail().catch(console.error)