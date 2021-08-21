import { AccountModel, AddAccountModel } from '../usecases/addAccount/DbAddAccountProtocols';

export interface AddAccountRepository{
  add: (account: AddAccountModel) => Promise<AccountModel>
}
