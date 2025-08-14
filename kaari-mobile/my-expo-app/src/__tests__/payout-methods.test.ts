import { mem } from './setup-memory';
import { addPayoutMethod, getPayoutMethods, setDefaultPayoutMethod, deletePayoutMethod } from '../backend/server-actions/PayoutMethodServerActions';
import { getAuth } from 'firebase/auth';

jest.mock('firebase/auth', () => ({ getAuth: () => ({ currentUser: { uid: 'adv1' } }) }));

describe('PayoutMethodServerActions', () => {
  beforeEach(() => {
    mem.reset();
  });

  it('adds and lists payout methods, sets default, removes', async () => {
    const m = await addPayoutMethod({ type: 'IBAN', accountNumber: 'IBAN123', bankName: 'Bank', accountHolderName: 'Holder', setAsDefault: true });
    expect(m.id).toBeDefined();
    const list1 = await getPayoutMethods();
    expect(list1.length).toBe(1);
    expect(list1[0].isDefault).toBe(true);

    const m2 = await addPayoutMethod({ type: 'RIB', accountNumber: 'RIB456', bankName: 'Bank2', accountHolderName: 'Holder2' });
    await setDefaultPayoutMethod(m2.id);
    const list2 = await getPayoutMethods();
    const def = list2.find((x) => x.isDefault);
    expect(def?.id).toBe(m2.id);

    await deletePayoutMethod(m.id);
    const list3 = await getPayoutMethods();
    expect(list3.length).toBe(1);
  });
});


