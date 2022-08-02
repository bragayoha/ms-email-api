import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export async function sendMail(user: User, template: string): Promise<void> {
  await Mail.send((message) => {
    message
      .from('bet-system@email.com')
      .to(user.email)
      .subject('The Best Betting Web$ite to Change Your Life!')
      .htmlView(template, { user })
  })
}
