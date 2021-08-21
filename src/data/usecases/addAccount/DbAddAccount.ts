import { AddAccountRepository } from '../../protocols/AddAccountRepository';
import { Encrypter, AddAccount, AddAccountModel, AccountModel } from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encrypted = await this.encrypter.encrypt(account.password);
    const accountd = await this.addAccountRepository.add({ name: account.name, email: account.email, password: encrypted });
    return accountd;
  }
}
