import User from "App/Models/User"
import { sendMail } from "./sendMail"
import Logger from '@ioc:Adonis/Core/Logger'

export async function smToAdm(user) {
  try {
    const adms = await User.query().whereHas('roles', builder => builder.where('role_id', 1) )

    await Promise.all(
      adms.map(async (adm) => {
        try{
          await sendMail(adm, `${user.name} have a new bet!`,'send_admin_new_bet_email')
          return Logger.info('Success in send email')
        } catch (err) {
          return Logger.error('Error in send email')
        }
      })
    )
  } catch (error) {
    Logger.error(error)
  }

}
