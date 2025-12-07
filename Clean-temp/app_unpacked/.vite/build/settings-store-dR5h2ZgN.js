var J = Object.defineProperty;
var H = (a, t, e) => t in a ? J(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var h = (a, t, e) => H(a, typeof t != "symbol" ? t + "" : t, e);
import { app as k, safeStorage as v } from "electron";
import p from "node:fs/promises";
import R from "node:path";
import { p as j, l as P } from "./main-DsWLSrNk.js";
try {
  (function() {
    var a = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new a.Error().stack;
    t && (a._sentryDebugIds = a._sentryDebugIds || {}, a._sentryDebugIds[t] = "611c90b2-22d1-48d6-9a09-1300dc25ae66", a._sentryDebugIdIdentifier = "sentry-dbid-611c90b2-22d1-48d6-9a09-1300dc25ae66");
  })();
} catch {
}
function T(a, t) {
  let e;
  try {
    e = a();
  } catch {
    return;
  }
  return {
    getItem: (o) => {
      var n;
      const c = (g) => g === null ? null : JSON.parse(g, void 0), u = (n = e.getItem(o)) != null ? n : null;
      return u instanceof Promise ? u.then(c) : c(u);
    },
    setItem: (o, n) => e.setItem(o, JSON.stringify(n, void 0)),
    removeItem: (o) => e.removeItem(o)
  };
}
const D = (a) => (t) => {
  try {
    const e = a(t);
    return e instanceof Promise ? e : {
      then(r) {
        return D(r)(e);
      },
      catch(r) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(r) {
        return this;
      },
      catch(r) {
        return D(r)(e);
      }
    };
  }
}, U = (a, t) => (e, r, o) => {
  let n = {
    storage: T(() => localStorage),
    partialize: (s) => s,
    version: 0,
    merge: (s, m) => ({
      ...m,
      ...s
    }),
    ...t
  }, c = !1;
  const u = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let d = n.storage;
  if (!d)
    return a(
      (...s) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${n.name}', the given storage is currently unavailable.`
        ), e(...s);
      },
      r,
      o
    );
  const b = () => {
    const s = n.partialize({ ...r() });
    return d.setItem(n.name, {
      state: s,
      version: n.version
    });
  }, O = o.setState;
  o.setState = (s, m) => (O(s, m), b());
  const y = a(
    (...s) => (e(...s), b()),
    r,
    o
  );
  o.getInitialState = () => y;
  let f;
  const E = () => {
    var s, m;
    if (!d) return;
    c = !1, u.forEach((i) => {
      var l;
      return i((l = r()) != null ? l : y);
    });
    const S = ((m = n.onRehydrateStorage) == null ? void 0 : m.call(n, (s = r()) != null ? s : y)) || void 0;
    return D(d.getItem.bind(d))(n.name).then((i) => {
      if (i)
        if (typeof i.version == "number" && i.version !== n.version) {
          if (n.migrate) {
            const l = n.migrate(
              i.state,
              i.version
            );
            return l instanceof Promise ? l.then((I) => [!0, I]) : [!0, l];
          }
          console.error(
            "State loaded from storage couldn't be migrated since no migrate function was provided"
          );
        } else
          return [!1, i.state];
      return [!1, void 0];
    }).then((i) => {
      var l;
      const [I, F] = i;
      if (f = n.merge(
        F,
        (l = r()) != null ? l : y
      ), e(f, !0), I)
        return b();
    }).then(() => {
      S == null || S(f, void 0), f = r(), c = !0, g.forEach((i) => i(f));
    }).catch((i) => {
      S == null || S(void 0, i);
    });
  };
  return o.persist = {
    setOptions: (s) => {
      n = {
        ...n,
        ...s
      }, s.storage && (d = s.storage);
    },
    clearStorage: () => {
      d == null || d.removeItem(n.name);
    },
    getOptions: () => n,
    rehydrate: () => E(),
    hasHydrated: () => c,
    onHydrate: (s) => (u.add(s), () => {
      u.delete(s);
    }),
    onFinishHydration: (s) => (g.add(s), () => {
      g.delete(s);
    })
  }, n.skipHydration || E(), f || y;
}, A = U, L = "config.json";
class w {
  constructor(t) {
    h(this, "storagePath");
    h(this, "getItem", async (t) => {
      if (v.isEncryptionAvailable() === !1)
        return P.warn("UnsafeEncryptedPersistStorage: Encryption not available, skipping read to storage."), null;
      const r = (await this.readStorage())[t];
      if (!r || typeof r != "string")
        return null;
      const o = Buffer.from(r, "base64"), n = v.decryptString(o);
      if (!n)
        return null;
      const c = JSON.parse(n);
      return c ? {
        state: c,
        version: 0
      } : null;
    });
    h(this, "setItem", async (t, e) => {
      if (v.isEncryptionAvailable() === !1) {
        P.warn("UnsafeEncryptedPersistStorage: Encryption not available, skipping write to storage.");
        return;
      }
      const r = v.encryptString(JSON.stringify(e.state)).toString("base64"), o = await this.readStorage();
      o[t] = r, await this.writeStorage(o);
    });
    h(this, "removeItem", async (t) => {
      const e = await this.readStorage();
      delete e[t], await this.writeStorage(e);
    });
    this.storagePath = t;
  }
  static async createStorage() {
    const t = R.join(k.getPath("userData"), L);
    return await w.initializeStorage(t), new w(t);
  }
  static async initializeStorage(t) {
    try {
      await p.access(t);
    } catch {
      await p.writeFile(t, JSON.stringify({}), "utf-8");
    }
  }
  async readStorage() {
    const t = await p.readFile(this.storagePath, "utf-8");
    if (!t.trim())
      return {};
    try {
      return JSON.parse(t);
    } catch (r) {
      return P.error("Error parsing storage data, returning empty object.", r), {};
    }
  }
  async writeStorage(t) {
    const e = this.storagePath + ".tmp", r = JSON.stringify(t);
    await p.writeFile(e, r, "utf-8"), await p.rename(e, this.storagePath);
  }
}
async function x(a, t) {
  return new Promise((e) => {
    (async () => {
      const r = j()(await B(a, t, () => {
        e(r);
      }));
    })();
  });
}
const B = async (a, t, e) => A(t, {
  name: a,
  storage: await w.createStorage(),
  onRehydrateStorage: (r) => (o) => {
    e();
  }
}), N = {
  companionWindowShortcut: "Option+Space",
  legacyUserDataFolderDetected: void 0
};
let _ = null;
const z = async () => (_ || (_ = await x("Settings", (a) => ({
  ...N,
  reset: () => a(N)
}))), _);
export {
  z as default
};
