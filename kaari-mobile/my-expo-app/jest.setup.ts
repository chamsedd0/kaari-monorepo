export {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any;

jest.mock('@backend/firebase/config', () => {
  const store = new Map();
  const memory = {
    data: store,
    set: (key: string, value: any) => store.set(key, value),
    get: (key: string) => store.get(key),
    clear: () => store.clear(),
  };
  return {
    auth: { currentUser: { uid: 'u1' } },
    db: memory,
    storage: {},
  };
});

jest.mock('@backend/firebase/auth', () => {
  return {
    getCurrentUserProfile: jest.fn(async () => ({
      id: 'u1',
      email: 'u1@example.com',
      name: 'Test',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };
});

// Simple in-memory mock for firestore helpers used by actions
const memoryDB = {
  collections: new Map(),
  col(name: string) {
    if (!this.collections.has(name)) this.collections.set(name, new Map());
    return this.collections.get(name);
  },
  reset() {
    this.collections.clear();
  },
};

jest.mock('@backend/firebase/firestore', () => {
  const db = memoryDB;
  let autoId = 1;
  const newId = () => 'id_' + autoId++;
  return {
    __memoryDB: db,
    getDocumentById: async (col: string, id: string) => {
      const c = db.col(col);
      const v = c.get(id);
      return v ? { id, ...v } : null;
    },
    createDocument: async (col: string, data: Record<string, any>) => {
      const c = db.col(col);
      const id = newId();
      c.set(id, { ...data });
      return { id, ...(data || {}) };
    },
    updateDocument: async (col: string, id: string, partial: Record<string, any>) => {
      const c = db.col(col);
      const prev = c.get(id) || {};
      c.set(id, { ...prev, ...(partial || {}) });
      return { id, ...(c.get(id) || {}) };
    },
    deleteDocument: async (col: string, id: string) => {
      const c = db.col(col);
      return c.delete(id);
    },
    getDocumentsByField: async (col: string, field: string, value: any) => {
      const c = db.col(col) as Map<string, any>;
      const entries = Array.from(c.entries()) as Array<[string, any]>;
      return entries
        .filter(([, v]) => v[field] === value && !v.deleted)
        .map(([id, v]) => ({ id, ...v }));
    },
    getDocuments: async (
      col: string,
      { filters }: { filters: Array<{ field: string; operator: string; value: any }> } = { filters: [] }
    ) => {
      const c = db.col(col) as Map<string, any>;
      const entries = Array.from(c.entries()) as Array<[string, any]>;
      const items = entries.map(([id, v]) => ({ id, ...v }));
      if (!filters || !filters.length) return items as any[];
      return items.filter((doc: any) =>
        filters.every((f) => {
          switch (f.operator) {
            case '==':
              return doc[f.field] === f.value;
            default:
              return true;
          }
        })
      );
    },
  };
});

// expose for test imports when needed
declare const globalThis: any;
globalThis.___MEM_DB = memoryDB;

// Mock Firebase Admin SDK-like Firestore used by payout methods
jest.mock('firebase/firestore', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store: Map<string, Map<string, any>> = new Map();
  const ensure = (col: string) => {
    if (!store.has(col)) store.set(col, new Map());
    return store.get(col)!;
  };
  let seq = 1;
  const genId = () => 'pm_' + seq++;
  return {
    collection: (_db: unknown, col: string) => col,
    doc: (_db: unknown, col: string, id: string) => ({ col, id }),
    where: (field: string, operator: string, value: unknown) => ({ field, operator, value }),
    query: (col: string, ...conds: Array<{ field: string; operator: string; value: unknown }>) => ({ col, conds }),
    getDocs: async (qRef: { col: string; conds: Array<{ field: string; operator: string; value: unknown }> }) => {
      const c = ensure(qRef.col);
      const entries = Array.from(c.entries());
      const items = entries
        .map(([id, v]) => ({ id, ...v }))
        .filter((doc) =>
          (qRef.conds || []).every((f) => (f.operator === '==' ? (doc as any)[f.field] === f.value : true))
        );
      return {
        docs: items.map((d) => ({ id: d.id, data: () => ({ ...d, id: undefined }) })),
        empty: items.length === 0,
      } as any;
    },
    getDoc: async (ref: { col: string; id: string }) => {
      const c = ensure(ref.col);
      const v = c.get(ref.id);
      return { exists: () => !!v, data: () => v } as any;
    },
    addDoc: async (col: string, payload: any) => {
      const c = ensure(col);
      const id = genId();
      c.set(id, { ...payload });
      return { id } as any;
    },
    updateDoc: async (ref: { col: string; id: string }, patch: any) => {
      const c = ensure(ref.col);
      const prev = c.get(ref.id) || {};
      c.set(ref.id, { ...prev, ...patch });
    },
    deleteDoc: async (ref: { col: string; id: string }) => {
      const c = ensure(ref.col);
      c.delete(ref.id);
    },
    Timestamp: { now: () => ({ toDate: () => new Date() }) },
  };
});


