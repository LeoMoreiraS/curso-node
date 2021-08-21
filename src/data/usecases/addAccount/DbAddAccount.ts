import { AccountModel } from '../../../domain/models/Account';
import { AddAccount, AddAccountModel } from '../../../domain/useCases/AddAccount';
import { Encrypter } from './protocols/Encrypter';

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
