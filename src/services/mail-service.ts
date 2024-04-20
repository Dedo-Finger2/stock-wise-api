interface IAddress {
  name: string,
  address: string
}

export interface IMessage {
  to: IAddress,
  from: IAddress,
  subject: string,
  html: string
}


export interface IMailService {
  sendMessage(message: IMessage): Promise<void>
}
