import { Encrypter, AddAccount, AddAccountModel, AccountModel } from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encrypted = await this.encrypter.encrypt(account.password);
    const accountd: AccountModel = {
      name: account.name,
      email: account.email,
      password: encrypted,
      id: 'valid-id'
    };
    return accountd;
  }
}
