var Zl = Object.defineProperty;
var Ql = (e, t, n) => t in e ? Zl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var x = (e, t, n) => Ql(e, typeof t != "symbol" ? t + "" : t, n);
import { app as he, ipcMain as ze, globalShortcut as Xt, clipboard as Qn, Menu as $i, BrowserWindow as ft, MenuItem as ec, shell as tc, screen as er, session as gi } from "electron";
import { i as _i, a as nc, l as G, g as Se, b as rc, c as ic, d as Ne, v as ka, D as He, e as oc, f as nt, h as tr, j as sc, P as we, A as ac, k as uc, m as ur, R as ke, n as Qe, o as Ma, W as lc, p as cc, q as $t, r as dc, Z as kr, s as dt, t as rt, S as Na, u as Mr, w as Vo, x as fc, y as hc, z as zo, O as Jn, B as mc, C as pc, E as gc } from "./main-DsWLSrNk.js";
import _c from "node:path";
import lr from "./settings-store-dR5h2ZgN.js";
import * as Ko from "os";
import Nr from "os";
import * as qi from "node:crypto";
import { KeyObject as vi, createPrivateKey as vc, constants as Jo, createSecretKey as yc } from "node:crypto";
import { Buffer as Ua } from "node:buffer";
import * as Fa from "node:util";
import { promisify as bc } from "node:util";
import { fileURLToPath as Ec } from "node:url";
import ja from "path";
try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new e.Error().stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "ada927c7-5a28-4591-bb57-3007e9a5e09a", e._sentryDebugIdIdentifier = "sentry-dbid-ada927c7-5a28-4591-bb57-3007e9a5e09a");
  })();
} catch {
}
const wc = "chatgpt", Sc = "chatgpt-alt", Tc = "oauth_complete", Cc = "redirect_to_desktop", Ic = "scheme", Rc = "ms-windows-store://pdp/?productid=9nt1r1c2hh7j", Ac = "https://apps.microsoft.com/detail/9nt1r1c2hh7j", Oc = "app_qEje4JHPFcYq49ZfW3PYZgMt", Pc = "app_adDF3xIsfqQCilyRG96cLZpb", Dc = ["openai-sidetron", "openai-sidetron-dev"], mt = {
  defaultDesktopURLScheme: wc,
  altDesktopURLScheme: Sc,
  desktopAuthPath: Tc,
  redirectToDesktopParam: Cc,
  schemeAuthParam: Ic,
  msWindowsStoreURL: Rc,
  msWindowsStoreWebURL: Ac,
  OAI_SIDETRON_OAUTH_CLIENT_ID: Oc,
  OAI_DEV_HYDRA_CLIENT_ID: Pc,
  sidetronOauthProviders: Dc
}, wn = nc ? mt.altDesktopURLScheme : mt.defaultDesktopURLScheme;
function Lc() {
  !he.isPackaged && _i ? (he.removeAsDefaultProtocolClient(wn), he.setAsDefaultProtocolClient(wn, process.execPath, [
    /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
    _c.resolve(process.argv[1])
  ])) : he.setAsDefaultProtocolClient(
    /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
    wn
  );
}
function xc(e) {
  if (e)
    try {
      const t = new URL(e);
      if (t.host === mt.desktopAuthPath)
        return kc(t);
      G.error("Received unexpected URL: ", e);
      return;
    } catch {
      return;
    }
}
function kc(e) {
  const t = e.searchParams.get("state"), n = Se().getState().lastAuthRequestState;
  if (n === null) {
    G.info("Received auth URL without a previous state, ignoring.");
    return;
  } else if (t === null) {
    G.info("Received auth URL without a current state, ignoring.");
    return;
  } else if (n !== t) {
    G.info("Received auth URL with a state mismatch, ignoring.");
    return;
  }
  e.searchParams.delete(mt.redirectToDesktopParam), e.host = rc(), Se().getState().setAuthState(null);
  const r = decodeURI(e.toString()).replace(`${wn}:`, `${ic()}`);
  return new URL(r);
}
const {
  redirectToDesktopParam: Mc,
  msWindowsStoreURL: Nc
} = mt, Wa = [
  "challenges.cloudflare.com",
  // for captcha challenge redirects
  "openai-zerotrust.cloudflareaccess.com"
], Sn = [
  "chatgpt.com",
  "about:blank",
  // for chatbar
  "oaiusercontent.com",
  // for files uploaded by user or provided by Code Interpreter
  "auth0.openai.com/v2/logout",
  // for logout
  "auth.api.openai.org/totp_enroll",
  // for MFA enrollment
  "auth.api.openai.org/recovery_enroll",
  // for MFA enrollment
  "auth.openai.com/totp_enroll",
  // for MFA enrollment
  "auth.openai.com/recovery_enroll",
  // for MFA enrollment
  ...Wa
];
if (Ne) {
  const e = [
    "chatgpt-staging.com",
    "localhost:3000",
    "auth0-dev.openai.com/v2/logout",
    // for logout in dev
    // For ChatGPT-Preview via. Cloudflare + azure auth for internal users
    // Hard code the internal domains for now
    "openai-zerotrust.cloudflareaccess.com",
    "login.microsoftonline.com/a48cca56-e6da-484e-a814-9c849652bcb3/oauth2/authorize",
    "login.microsoftonline.com/a48cca56-e6da-484e-a814-9c849652bcb3/login",
    "device.login.microsoftonline.com",
    "login.microsoftonline.com/common/DeviceAuthTls/reprocess",
    "login.microsoftonline.com/common/SAS/ProcessAuth",
    "login.microsoftonline.com/kmsi"
  ];
  Sn.push(...e);
}
const Uc = ["/search", "/codex"], Fc = ["operator", "sora"], jc = [
  // prod 1p auth endpoints
  "https://auth.openai.com/authorize",
  "https://auth.openai.com/api/authorize",
  "https://auth.openai.com/api/accounts/authorize",
  // staging 1p auth endpoints
  "https://auth.api.openai.org/authorize",
  "https://auth.api.openai.org/api/authorize",
  "https://auth.api.openai.org/api/accounts/authorize",
  // staging auth0 endpoints
  "https://auth0-dev.openai.com/authorize"
], Wc = ["pay.openai.com"], Bc = ["https:", "http:"], Hc = ["ms-settings:privacy-microphone", "ms-settings:startupapps", Nc], Gc = [mt.OAI_DEV_HYDRA_CLIENT_ID, mt.OAI_SIDETRON_OAUTH_CLIENT_ID];
function $c(e) {
  return e ? !!jc.some((t) => e.startsWith(t)) : !1;
}
function qc(e) {
  try {
    const t = new URL(e);
    return t ? Wa.some((n) => t.hostname.includes(n)) : !1;
  } catch {
    return !1;
  }
}
function Vc(e) {
  try {
    const t = new URL(e), n = t.searchParams.get("redirect_uri"), r = t.searchParams.get("client_id");
    if (r && Gc.includes(r))
      return G.info("web-domains.modifyURLToIncludeDesktopRedirectParam, not modifying URL"), e;
    if (!n)
      return e;
    const o = `${n}?${Mc}=true`;
    return t.searchParams.set("redirect_uri", o), t.toString();
  } catch (t) {
    return G.error("web-domains.modifyURLToIncludeDesktopRedirectParam - invalid URL:", {
      originalUrl: e,
      error: t
    }), e;
  }
}
function Ba(e) {
  const {
    host: t,
    protocol: n
  } = e;
  if (n === "https:")
    return !0;
  const r = Ne && t === "localhost:3000", i = e.toString() === "about:blank";
  return r || i ? !0 : (n === "data:" || G.warn(`web-domains.isSecureURL - Non-HTTPS URL ${e.toString()}`), !1);
}
function zc(e) {
  if (!e)
    return !1;
  try {
    const t = new URL(e);
    return !Sn.includes(t.host);
  } catch (t) {
    return G.warn("web-domains.isCopyableLink - invalid url", {
      url: e,
      error: t
    }), !1;
  }
}
function Qt(e) {
  if (!e)
    return !1;
  try {
    const t = new URL(e), {
      host: n
    } = t;
    if (!Ba(t) || Sn.includes(n) && Uc.some((o) => t.pathname.startsWith(o)))
      return !1;
    const r = Sn[0].toLowerCase();
    if (Fc.some((o) => n === `${o}.${r}`))
      return !1;
    const i = Sn.some(
      (o) => n === o || n.endsWith(`.${o}`) || e === o || // specifically to check for "about:blank" from chatbar
      t.host + t.pathname === o
      // specifically for the google ACS redirect
    );
    return e !== "about:blank" && !e.startsWith("http://localhost") && t.protocol !== "https:" ? !1 : i;
  } catch (t) {
    return G.warn("web-domains.isFirstPartyURL -  not a first party URL", {
      url: e,
      error: t
    }), !1;
  }
}
function Kc(e) {
  if (!e)
    return !1;
  try {
    const t = new URL(e);
    if (t.searchParams.has("redirect_uri") && t.searchParams.has("state"))
      return !0;
  } catch (t) {
    return G.warn("web-domains.isExternalAuthURL - invalid url", {
      url: e,
      error: t
    }), !1;
  }
  return !1;
}
function Vi(e) {
  if (!e)
    return !1;
  try {
    const t = new URL(e);
    return Ba(t) ? Wc.includes(t.host) : !1;
  } catch (t) {
    return G.warn("web-domains.isPaymentDomain - invalid url", {
      url: e,
      error: t
    }), !1;
  }
}
const Jc = (e) => {
  try {
    const n = new URL(e).protocol;
    return Bc.includes(n) || Hc.includes(e);
  } catch {
    return !1;
  }
};
class zi {
  constructor(t) {
    x(this, "subscribers");
    this.subscribers = zi.createTypedEmitterAllEventSubscribers(t) || {};
  }
  publish(t, n) {
    const r = this.subscribers[t] || {};
    for (const i of Object.values(r))
      i(n);
  }
  subscribe(t, n) {
    const r = ka();
    this.subscribers[t] || (this.subscribers[t] = {});
    let i = this.subscribers[t];
    return i[r] = n, () => {
      delete i[r];
    };
  }
  static createTypedEmitterAllEventSubscribers(t) {
    return t.reduce((n, r) => (n[r] = {}, n), {});
  }
}
class Xc extends zi {
  constructor() {
    super(Object.values(He));
  }
}
const Ge = new Xc();
function Yc(e) {
  ze.on(oc, function(t, n) {
    Ke(t.senderFrame) && Ge.publish(n.eventName, n.payload);
  }), ze.handle(nt.REQUEST_SYSTEM_PERMISSION, async (t, n) => {
    if (Ke(t.senderFrame))
      return await e.requestSystemPermission(n);
  }), ze.handle(nt.TAKE_PHOTO, async (t, n) => {
    if (Ke(t.senderFrame))
      return await e.takePhoto(t.frameId);
  }), ze.handle(nt.TAKE_SCREENSHOT, async (t, n) => {
    if (Ke(t.senderFrame))
      return await e.takeScreenshot();
  }), ze.handle(nt.GET_SETTING_VALUE, async (t, n) => {
    if (Ke(t.senderFrame))
      return await e.getSettingValue(n);
  }), ze.handle(nt.CHECK_FOR_UPDATES, async (t, n) => {
    if (Ke(t.senderFrame))
      return await e.checkForUpdates();
  }), ze.handle(nt.PAIRING_GET_APPS, async (t, n) => {
    if (Ke(t.senderFrame))
      return await (await e.pairing).getApps();
  }), ze.handle(nt.PAIRING_GET_APP_HEADER, async (t, n) => {
    if (Ke(t.senderFrame))
      return await (await e.pairing).getAppHeader(n);
  }), ze.handle(nt.PAIRING_GET_CONTENT_FOR_PAIRED_APPS, async (t, n) => {
    if (Ke(t.senderFrame))
      return await (await e.pairing).getContentForPairedApps(n);
  }), ze.handle(nt.PAIRING_GET_SCREENSHOT_FOR_APP, async (t, n) => {
    if (Ke(t.senderFrame))
      return await (await e.pairing).getScreenshotForApp(n);
  });
}
function Ke(e) {
  return e && Qt(e.url) ? !0 : (G.error(`Received IPC event from invalid sender frame: ${e == null ? void 0 : e.url}`), !1);
}
const sn = (e, t, n) => (...r) => e() ? t(...r) : n;
var Ur = { exports: {} }, Xo;
function Zc() {
  return Xo || (Xo = 1, function(e) {
    var t, n, r, i, o, s, a, l, c, u, f, p, g, m, h, v, w, E, R, M, b, P, U, H, Y, ue, de, Ce, ye, ve, V, N;
    (function(O) {
      var z = typeof tr == "object" ? tr : typeof self == "object" ? self : typeof this == "object" ? this : {};
      O(X(z, X(e.exports)));
      function X(ee, T) {
        return ee !== z && (typeof Object.create == "function" ? Object.defineProperty(ee, "__esModule", { value: !0 }) : ee.__esModule = !0), function(_, S) {
          return ee[_] = T ? T(_, S) : S;
        };
      }
    })(function(O) {
      var z = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(_, S) {
        _.__proto__ = S;
      } || function(_, S) {
        for (var C in S) Object.prototype.hasOwnProperty.call(S, C) && (_[C] = S[C]);
      };
      t = function(_, S) {
        if (typeof S != "function" && S !== null)
          throw new TypeError("Class extends value " + String(S) + " is not a constructor or null");
        z(_, S);
        function C() {
          this.constructor = _;
        }
        _.prototype = S === null ? Object.create(S) : (C.prototype = S.prototype, new C());
      }, n = Object.assign || function(_) {
        for (var S, C = 1, I = arguments.length; C < I; C++) {
          S = arguments[C];
          for (var L in S) Object.prototype.hasOwnProperty.call(S, L) && (_[L] = S[L]);
        }
        return _;
      }, r = function(_, S) {
        var C = {};
        for (var I in _) Object.prototype.hasOwnProperty.call(_, I) && S.indexOf(I) < 0 && (C[I] = _[I]);
        if (_ != null && typeof Object.getOwnPropertySymbols == "function")
          for (var L = 0, I = Object.getOwnPropertySymbols(_); L < I.length; L++)
            S.indexOf(I[L]) < 0 && Object.prototype.propertyIsEnumerable.call(_, I[L]) && (C[I[L]] = _[I[L]]);
        return C;
      }, i = function(_, S, C, I) {
        var L = arguments.length, k = L < 3 ? S : I === null ? I = Object.getOwnPropertyDescriptor(S, C) : I, W;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") k = Reflect.decorate(_, S, C, I);
        else for (var q = _.length - 1; q >= 0; q--) (W = _[q]) && (k = (L < 3 ? W(k) : L > 3 ? W(S, C, k) : W(S, C)) || k);
        return L > 3 && k && Object.defineProperty(S, C, k), k;
      }, o = function(_, S) {
        return function(C, I) {
          S(C, I, _);
        };
      }, s = function(_, S, C, I, L, k) {
        function W(Ve) {
          if (Ve !== void 0 && typeof Ve != "function") throw new TypeError("Function expected");
          return Ve;
        }
        for (var q = I.kind, Z = q === "getter" ? "get" : q === "setter" ? "set" : "value", J = !S && _ ? I.static ? _ : _.prototype : null, B = S || (J ? Object.getOwnPropertyDescriptor(J, I.name) : {}), ae, Re = !1, se = C.length - 1; se >= 0; se--) {
          var be = {};
          for (var Te in I) be[Te] = Te === "access" ? {} : I[Te];
          for (var Te in I.access) be.access[Te] = I.access[Te];
          be.addInitializer = function(Ve) {
            if (Re) throw new TypeError("Cannot add initializers after decoration has completed");
            k.push(W(Ve || null));
          };
          var We = (0, C[se])(q === "accessor" ? { get: B.get, set: B.set } : B[Z], be);
          if (q === "accessor") {
            if (We === void 0) continue;
            if (We === null || typeof We != "object") throw new TypeError("Object expected");
            (ae = W(We.get)) && (B.get = ae), (ae = W(We.set)) && (B.set = ae), (ae = W(We.init)) && L.unshift(ae);
          } else (ae = W(We)) && (q === "field" ? L.unshift(ae) : B[Z] = ae);
        }
        J && Object.defineProperty(J, I.name, B), Re = !0;
      }, a = function(_, S, C) {
        for (var I = arguments.length > 2, L = 0; L < S.length; L++)
          C = I ? S[L].call(_, C) : S[L].call(_);
        return I ? C : void 0;
      }, l = function(_) {
        return typeof _ == "symbol" ? _ : "".concat(_);
      }, c = function(_, S, C) {
        return typeof S == "symbol" && (S = S.description ? "[".concat(S.description, "]") : ""), Object.defineProperty(_, "name", { configurable: !0, value: C ? "".concat(C, " ", S) : S });
      }, u = function(_, S) {
        if (typeof Reflect == "object" && typeof Reflect.metadata == "function") return Reflect.metadata(_, S);
      }, f = function(_, S, C, I) {
        function L(k) {
          return k instanceof C ? k : new C(function(W) {
            W(k);
          });
        }
        return new (C || (C = Promise))(function(k, W) {
          function q(B) {
            try {
              J(I.next(B));
            } catch (ae) {
              W(ae);
            }
          }
          function Z(B) {
            try {
              J(I.throw(B));
            } catch (ae) {
              W(ae);
            }
          }
          function J(B) {
            B.done ? k(B.value) : L(B.value).then(q, Z);
          }
          J((I = I.apply(_, S || [])).next());
        });
      }, p = function(_, S) {
        var C = { label: 0, sent: function() {
          if (k[0] & 1) throw k[1];
          return k[1];
        }, trys: [], ops: [] }, I, L, k, W = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
        return W.next = q(0), W.throw = q(1), W.return = q(2), typeof Symbol == "function" && (W[Symbol.iterator] = function() {
          return this;
        }), W;
        function q(J) {
          return function(B) {
            return Z([J, B]);
          };
        }
        function Z(J) {
          if (I) throw new TypeError("Generator is already executing.");
          for (; W && (W = 0, J[0] && (C = 0)), C; ) try {
            if (I = 1, L && (k = J[0] & 2 ? L.return : J[0] ? L.throw || ((k = L.return) && k.call(L), 0) : L.next) && !(k = k.call(L, J[1])).done) return k;
            switch (L = 0, k && (J = [J[0] & 2, k.value]), J[0]) {
              case 0:
              case 1:
                k = J;
                break;
              case 4:
                return C.label++, { value: J[1], done: !1 };
              case 5:
                C.label++, L = J[1], J = [0];
                continue;
              case 7:
                J = C.ops.pop(), C.trys.pop();
                continue;
              default:
                if (k = C.trys, !(k = k.length > 0 && k[k.length - 1]) && (J[0] === 6 || J[0] === 2)) {
                  C = 0;
                  continue;
                }
                if (J[0] === 3 && (!k || J[1] > k[0] && J[1] < k[3])) {
                  C.label = J[1];
                  break;
                }
                if (J[0] === 6 && C.label < k[1]) {
                  C.label = k[1], k = J;
                  break;
                }
                if (k && C.label < k[2]) {
                  C.label = k[2], C.ops.push(J);
                  break;
                }
                k[2] && C.ops.pop(), C.trys.pop();
                continue;
            }
            J = S.call(_, C);
          } catch (B) {
            J = [6, B], L = 0;
          } finally {
            I = k = 0;
          }
          if (J[0] & 5) throw J[1];
          return { value: J[0] ? J[1] : void 0, done: !0 };
        }
      }, g = function(_, S) {
        for (var C in _) C !== "default" && !Object.prototype.hasOwnProperty.call(S, C) && ye(S, _, C);
      }, ye = Object.create ? function(_, S, C, I) {
        I === void 0 && (I = C);
        var L = Object.getOwnPropertyDescriptor(S, C);
        (!L || ("get" in L ? !S.__esModule : L.writable || L.configurable)) && (L = { enumerable: !0, get: function() {
          return S[C];
        } }), Object.defineProperty(_, I, L);
      } : function(_, S, C, I) {
        I === void 0 && (I = C), _[I] = S[C];
      }, m = function(_) {
        var S = typeof Symbol == "function" && Symbol.iterator, C = S && _[S], I = 0;
        if (C) return C.call(_);
        if (_ && typeof _.length == "number") return {
          next: function() {
            return _ && I >= _.length && (_ = void 0), { value: _ && _[I++], done: !_ };
          }
        };
        throw new TypeError(S ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, h = function(_, S) {
        var C = typeof Symbol == "function" && _[Symbol.iterator];
        if (!C) return _;
        var I = C.call(_), L, k = [], W;
        try {
          for (; (S === void 0 || S-- > 0) && !(L = I.next()).done; ) k.push(L.value);
        } catch (q) {
          W = { error: q };
        } finally {
          try {
            L && !L.done && (C = I.return) && C.call(I);
          } finally {
            if (W) throw W.error;
          }
        }
        return k;
      }, v = function() {
        for (var _ = [], S = 0; S < arguments.length; S++)
          _ = _.concat(h(arguments[S]));
        return _;
      }, w = function() {
        for (var _ = 0, S = 0, C = arguments.length; S < C; S++) _ += arguments[S].length;
        for (var I = Array(_), L = 0, S = 0; S < C; S++)
          for (var k = arguments[S], W = 0, q = k.length; W < q; W++, L++)
            I[L] = k[W];
        return I;
      }, E = function(_, S, C) {
        if (C || arguments.length === 2) for (var I = 0, L = S.length, k; I < L; I++)
          (k || !(I in S)) && (k || (k = Array.prototype.slice.call(S, 0, I)), k[I] = S[I]);
        return _.concat(k || Array.prototype.slice.call(S));
      }, R = function(_) {
        return this instanceof R ? (this.v = _, this) : new R(_);
      }, M = function(_, S, C) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var I = C.apply(_, S || []), L, k = [];
        return L = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), q("next"), q("throw"), q("return", W), L[Symbol.asyncIterator] = function() {
          return this;
        }, L;
        function W(se) {
          return function(be) {
            return Promise.resolve(be).then(se, ae);
          };
        }
        function q(se, be) {
          I[se] && (L[se] = function(Te) {
            return new Promise(function(We, Ve) {
              k.push([se, Te, We, Ve]) > 1 || Z(se, Te);
            });
          }, be && (L[se] = be(L[se])));
        }
        function Z(se, be) {
          try {
            J(I[se](be));
          } catch (Te) {
            Re(k[0][3], Te);
          }
        }
        function J(se) {
          se.value instanceof R ? Promise.resolve(se.value.v).then(B, ae) : Re(k[0][2], se);
        }
        function B(se) {
          Z("next", se);
        }
        function ae(se) {
          Z("throw", se);
        }
        function Re(se, be) {
          se(be), k.shift(), k.length && Z(k[0][0], k[0][1]);
        }
      }, b = function(_) {
        var S, C;
        return S = {}, I("next"), I("throw", function(L) {
          throw L;
        }), I("return"), S[Symbol.iterator] = function() {
          return this;
        }, S;
        function I(L, k) {
          S[L] = _[L] ? function(W) {
            return (C = !C) ? { value: R(_[L](W)), done: !1 } : k ? k(W) : W;
          } : k;
        }
      }, P = function(_) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var S = _[Symbol.asyncIterator], C;
        return S ? S.call(_) : (_ = typeof m == "function" ? m(_) : _[Symbol.iterator](), C = {}, I("next"), I("throw"), I("return"), C[Symbol.asyncIterator] = function() {
          return this;
        }, C);
        function I(k) {
          C[k] = _[k] && function(W) {
            return new Promise(function(q, Z) {
              W = _[k](W), L(q, Z, W.done, W.value);
            });
          };
        }
        function L(k, W, q, Z) {
          Promise.resolve(Z).then(function(J) {
            k({ value: J, done: q });
          }, W);
        }
      }, U = function(_, S) {
        return Object.defineProperty ? Object.defineProperty(_, "raw", { value: S }) : _.raw = S, _;
      };
      var X = Object.create ? function(_, S) {
        Object.defineProperty(_, "default", { enumerable: !0, value: S });
      } : function(_, S) {
        _.default = S;
      }, ee = function(_) {
        return ee = Object.getOwnPropertyNames || function(S) {
          var C = [];
          for (var I in S) Object.prototype.hasOwnProperty.call(S, I) && (C[C.length] = I);
          return C;
        }, ee(_);
      };
      H = function(_) {
        if (_ && _.__esModule) return _;
        var S = {};
        if (_ != null) for (var C = ee(_), I = 0; I < C.length; I++) C[I] !== "default" && ye(S, _, C[I]);
        return X(S, _), S;
      }, Y = function(_) {
        return _ && _.__esModule ? _ : { default: _ };
      }, ue = function(_, S, C, I) {
        if (C === "a" && !I) throw new TypeError("Private accessor was defined without a getter");
        if (typeof S == "function" ? _ !== S || !I : !S.has(_)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return C === "m" ? I : C === "a" ? I.call(_) : I ? I.value : S.get(_);
      }, de = function(_, S, C, I, L) {
        if (I === "m") throw new TypeError("Private method is not writable");
        if (I === "a" && !L) throw new TypeError("Private accessor was defined without a setter");
        if (typeof S == "function" ? _ !== S || !L : !S.has(_)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return I === "a" ? L.call(_, C) : L ? L.value = C : S.set(_, C), C;
      }, Ce = function(_, S) {
        if (S === null || typeof S != "object" && typeof S != "function") throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof _ == "function" ? S === _ : _.has(S);
      }, ve = function(_, S, C) {
        if (S != null) {
          if (typeof S != "object" && typeof S != "function") throw new TypeError("Object expected.");
          var I, L;
          if (C) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            I = S[Symbol.asyncDispose];
          }
          if (I === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            I = S[Symbol.dispose], C && (L = I);
          }
          if (typeof I != "function") throw new TypeError("Object not disposable.");
          L && (I = function() {
            try {
              L.call(this);
            } catch (k) {
              return Promise.reject(k);
            }
          }), _.stack.push({ value: S, dispose: I, async: C });
        } else C && _.stack.push({ async: !0 });
        return S;
      };
      var T = typeof SuppressedError == "function" ? SuppressedError : function(_, S, C) {
        var I = new Error(C);
        return I.name = "SuppressedError", I.error = _, I.suppressed = S, I;
      };
      V = function(_) {
        function S(k) {
          _.error = _.hasError ? new T(k, _.error, "An error was suppressed during disposal.") : k, _.hasError = !0;
        }
        var C, I = 0;
        function L() {
          for (; C = _.stack.pop(); )
            try {
              if (!C.async && I === 1) return I = 0, _.stack.push(C), Promise.resolve().then(L);
              if (C.dispose) {
                var k = C.dispose.call(C.value);
                if (C.async) return I |= 2, Promise.resolve(k).then(L, function(W) {
                  return S(W), L();
                });
              } else I |= 1;
            } catch (W) {
              S(W);
            }
          if (I === 1) return _.hasError ? Promise.reject(_.error) : Promise.resolve();
          if (_.hasError) throw _.error;
        }
        return L();
      }, N = function(_, S) {
        return typeof _ == "string" && /^\.\.?\//.test(_) ? _.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(C, I, L, k, W) {
          return I ? S ? ".jsx" : ".js" : L && (!k || !W) ? C : L + k + "." + W.toLowerCase() + "js";
        }) : _;
      }, O("__extends", t), O("__assign", n), O("__rest", r), O("__decorate", i), O("__param", o), O("__esDecorate", s), O("__runInitializers", a), O("__propKey", l), O("__setFunctionName", c), O("__metadata", u), O("__awaiter", f), O("__generator", p), O("__exportStar", g), O("__createBinding", ye), O("__values", m), O("__read", h), O("__spread", v), O("__spreadArrays", w), O("__spreadArray", E), O("__await", R), O("__asyncGenerator", M), O("__asyncDelegator", b), O("__asyncValues", P), O("__makeTemplateObject", U), O("__importStar", H), O("__importDefault", Y), O("__classPrivateFieldGet", ue), O("__classPrivateFieldSet", de), O("__classPrivateFieldIn", Ce), O("__addDisposableResource", ve), O("__disposeResources", V), O("__rewriteRelativeImportExtension", N);
    });
  }(Ur)), Ur.exports;
}
var Qc = /* @__PURE__ */ Zc();
const ed = /* @__PURE__ */ sc(Qc), {
  __extends: Le,
  __assign: F,
  __rest: Cn,
  __decorate: Cg,
  __param: Ig,
  __esDecorate: Rg,
  __runInitializers: Ag,
  __propKey: Og,
  __setFunctionName: Pg,
  __metadata: Dg,
  __awaiter: Je,
  __generator: Xe,
  __exportStar: Lg,
  __createBinding: xg,
  __values: kg,
  __read: Mg,
  __spread: Ng,
  __spreadArrays: Ug,
  __spreadArray: Ue,
  __await: Fg,
  __asyncGenerator: jg,
  __asyncDelegator: Wg,
  __asyncValues: Bg,
  __makeTemplateObject: Hg,
  __importStar: Gg,
  __importDefault: $g,
  __classPrivateFieldGet: qg,
  __classPrivateFieldSet: Vg,
  __classPrivateFieldIn: zg,
  __addDisposableResource: Kg,
  __disposeResources: Jg,
  __rewriteRelativeImportExtension: Xg
} = ed;
function yi(e, t, n) {
  t.split && (t = t.split("."));
  for (var r = 0, i = t.length, o = e, s, a; r < i && (a = "" + t[r++], !(a === "__proto__" || a === "constructor" || a === "prototype")); )
    o = o[a] = r === i ? n : typeof (s = o[a]) == typeof t ? s : t[r] * 0 !== 0 || ~("" + t[r]).indexOf(".") ? {} : [];
}
var td = function(e, t) {
  return Object.keys(e).filter(function(n) {
    return t(n, e[n]);
  }).reduce(function(n, r) {
    return n[r] = e[r], n;
  }, {});
}, et = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      var i = e.call(this, "".concat(n, " ").concat(r)) || this;
      return i.field = n, i;
    }
    return t;
  }(Error)
);
function cr(e) {
  return typeof e == "string";
}
function Ha(e) {
  return e != null;
}
function Ga(e) {
  return Object.prototype.toString.call(e).slice(8, -1).toLowerCase() === "object";
}
var dr = "is not a string", Ki = "is not an object", $a = "is nil";
function nd(e) {
  var t = ".userId/anonymousId/previousId/groupId", n = function(i) {
    var o, s, a;
    return (a = (s = (o = i.userId) !== null && o !== void 0 ? o : i.anonymousId) !== null && s !== void 0 ? s : i.groupId) !== null && a !== void 0 ? a : i.previousId;
  }, r = n(e);
  if (Ha(r)) {
    if (!cr(r))
      throw new et(t, dr);
  } else throw new et(t, $a);
}
function rd(e) {
  if (!Ha(e))
    throw new et("Event", $a);
  if (typeof e != "object")
    throw new et("Event", Ki);
}
function id(e) {
  if (!cr(e.type))
    throw new et(".type", dr);
}
function od(e) {
  if (!cr(e.event))
    throw new et(".event", dr);
}
function sd(e) {
  if (!Ga(e.properties))
    throw new et(".properties", Ki);
}
function ad(e) {
  if (!Ga(e.traits))
    throw new et(".traits", Ki);
}
function ud(e) {
  if (!cr(e.messageId))
    throw new et(".messageId", dr);
}
function ld(e) {
  rd(e), id(e), ud(e), e.type === "track" && (od(e), sd(e)), ["group", "identify"].includes(e.type) && ad(e);
}
var cd = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      var n, r;
      this.settings = t, this.createMessageId = t.createMessageId, this.onEventMethodCall = (n = t.onEventMethodCall) !== null && n !== void 0 ? n : function() {
      }, this.onFinishedEvent = (r = t.onFinishedEvent) !== null && r !== void 0 ? r : function() {
      };
    }
    return e;
  }()
), dd = (
  /** @class */
  function() {
    function e(t) {
      this.settings = new cd(t);
    }
    return e.prototype.track = function(t, n, r, i) {
      return this.settings.onEventMethodCall({ type: "track", options: r }), this.normalize(F(F({}, this.baseEvent()), { event: t, type: "track", properties: n ?? {}, options: F({}, r), integrations: F({}, i) }));
    }, e.prototype.page = function(t, n, r, i, o) {
      var s;
      this.settings.onEventMethodCall({ type: "page", options: i });
      var a = {
        type: "page",
        properties: F({}, r),
        options: F({}, i),
        integrations: F({}, o)
      };
      return t !== null && (a.category = t, a.properties = (s = a.properties) !== null && s !== void 0 ? s : {}, a.properties.category = t), n !== null && (a.name = n), this.normalize(F(F({}, this.baseEvent()), a));
    }, e.prototype.screen = function(t, n, r, i, o) {
      this.settings.onEventMethodCall({ type: "screen", options: i });
      var s = {
        type: "screen",
        properties: F({}, r),
        options: F({}, i),
        integrations: F({}, o)
      };
      return t !== null && (s.category = t), n !== null && (s.name = n), this.normalize(F(F({}, this.baseEvent()), s));
    }, e.prototype.identify = function(t, n, r, i) {
      return this.settings.onEventMethodCall({ type: "identify", options: r }), this.normalize(F(F({}, this.baseEvent()), { type: "identify", userId: t, traits: n ?? {}, options: F({}, r), integrations: i }));
    }, e.prototype.group = function(t, n, r, i) {
      return this.settings.onEventMethodCall({ type: "group", options: r }), this.normalize(F(F({}, this.baseEvent()), {
        type: "group",
        traits: n ?? {},
        options: F({}, r),
        integrations: F({}, i),
        //
        groupId: t
      }));
    }, e.prototype.alias = function(t, n, r, i) {
      this.settings.onEventMethodCall({ type: "alias", options: r });
      var o = {
        userId: t,
        type: "alias",
        options: F({}, r),
        integrations: F({}, i)
      };
      return n !== null && (o.previousId = n), t === void 0 ? this.normalize(F(F({}, o), this.baseEvent())) : this.normalize(F(F({}, this.baseEvent()), o));
    }, e.prototype.baseEvent = function() {
      return {
        integrations: {},
        options: {}
      };
    }, e.prototype.context = function(t) {
      var n, r = [
        "userId",
        "anonymousId",
        "timestamp",
        "messageId"
      ];
      delete t.integrations;
      var i = Object.keys(t), o = (n = t.context) !== null && n !== void 0 ? n : {}, s = {};
      return i.forEach(function(a) {
        a !== "context" && (r.includes(a) ? yi(s, a, t[a]) : yi(o, a, t[a]));
      }), [o, s];
    }, e.prototype.normalize = function(t) {
      var n, r, i = Object.keys((n = t.integrations) !== null && n !== void 0 ? n : {}).reduce(function(p, g) {
        var m, h;
        return F(F({}, p), (m = {}, m[g] = !!(!((h = t.integrations) === null || h === void 0) && h[g]), m));
      }, {});
      t.options = td(t.options || {}, function(p, g) {
        return g !== void 0;
      });
      var o = F(F({}, i), (r = t.options) === null || r === void 0 ? void 0 : r.integrations), s = t.options ? this.context(t.options) : [], a = s[0], l = s[1], c = t.options, u = Cn(t, ["options"]), f = F(F(F(F({ timestamp: /* @__PURE__ */ new Date() }, u), { context: a, integrations: o }), l), { messageId: c.messageId || this.settings.createMessageId() });
      return this.settings.onFinishedEvent(f), ld(f), f;
    }, e;
  }()
);
function qa(e, t) {
  return new Promise(function(n, r) {
    var i = setTimeout(function() {
      r(Error("Promise timed out"));
    }, t);
    e.then(function(o) {
      return clearTimeout(i), n(o);
    }).catch(r);
  });
}
function Va(e) {
  return new Promise(function(t) {
    return setTimeout(t, e);
  });
}
function fd(e, t, n) {
  var r = function() {
    try {
      return Promise.resolve(t(e));
    } catch (i) {
      return Promise.reject(i);
    }
  };
  return Va(n).then(function() {
    return qa(r(), 1e3);
  }).catch(function(i) {
    e == null || e.log("warn", "Callback Error", { error: i }), e == null || e.stats.increment("callback_error");
  }).then(function() {
    return e;
  });
}
var hd = function() {
  var e, t, n = !1, r = new Promise(function(i, o) {
    e = function() {
      for (var s = [], a = 0; a < arguments.length; a++)
        s[a] = arguments[a];
      n = !0, i.apply(void 0, s);
    }, t = function() {
      for (var s = [], a = 0; a < arguments.length; a++)
        s[a] = arguments[a];
      n = !0, o.apply(void 0, s);
    };
  });
  return {
    resolve: e,
    reject: t,
    promise: r,
    isSettled: function() {
      return n;
    }
  };
}, In = (
  /** @class */
  function() {
    function e(t) {
      var n;
      this.callbacks = {}, this.warned = !1, this.maxListeners = (n = t == null ? void 0 : t.maxListeners) !== null && n !== void 0 ? n : 10;
    }
    return e.prototype.warnIfPossibleMemoryLeak = function(t) {
      this.warned || this.maxListeners && this.callbacks[t].length > this.maxListeners && (console.warn("Event Emitter: Possible memory leak detected; ".concat(String(t), " has exceeded ").concat(this.maxListeners, " listeners.")), this.warned = !0);
    }, e.prototype.on = function(t, n) {
      return this.callbacks[t] ? (this.callbacks[t].push(n), this.warnIfPossibleMemoryLeak(t)) : this.callbacks[t] = [n], this;
    }, e.prototype.once = function(t, n) {
      var r = this, i = function() {
        for (var o = [], s = 0; s < arguments.length; s++)
          o[s] = arguments[s];
        r.off(t, i), n.apply(r, o);
      };
      return this.on(t, i), this;
    }, e.prototype.off = function(t, n) {
      var r, i = (r = this.callbacks[t]) !== null && r !== void 0 ? r : [], o = i.filter(function(s) {
        return s !== n;
      });
      return this.callbacks[t] = o, this;
    }, e.prototype.emit = function(t) {
      for (var n = this, r, i = [], o = 1; o < arguments.length; o++)
        i[o - 1] = arguments[o];
      var s = (r = this.callbacks[t]) !== null && r !== void 0 ? r : [];
      return s.forEach(function(a) {
        a.apply(n, i);
      }), this;
    }, e;
  }()
);
function Ji(e) {
  var t = Math.random() + 1, n = e.minTimeout, r = n === void 0 ? 500 : n, i = e.factor, o = i === void 0 ? 2 : i, s = e.attempt, a = e.maxTimeout, l = a === void 0 ? 1 / 0 : a;
  return Math.min(t * r * Math.pow(o, s), l);
}
var za = "onRemoveFromFuture", md = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i) {
      var o = e.call(this) || this;
      return o.future = [], o.maxAttempts = n, o.queue = r, o.seen = i ?? {}, o;
    }
    return t.prototype.push = function() {
      for (var n = this, r = [], i = 0; i < arguments.length; i++)
        r[i] = arguments[i];
      var o = r.map(function(s) {
        var a = n.updateAttempts(s);
        return a > n.maxAttempts || n.includes(s) ? !1 : (n.queue.push(s), !0);
      });
      return this.queue = this.queue.sort(function(s, a) {
        return n.getAttempts(s) - n.getAttempts(a);
      }), o;
    }, t.prototype.pushWithBackoff = function(n, r) {
      var i = this;
      if (r === void 0 && (r = 0), r == 0 && this.getAttempts(n) === 0)
        return this.push(n)[0];
      var o = this.updateAttempts(n);
      if (o > this.maxAttempts || this.includes(n))
        return !1;
      var s = Ji({ attempt: o - 1 });
      return r > 0 && s < r && (s = r), setTimeout(function() {
        i.queue.push(n), i.future = i.future.filter(function(a) {
          return a.id !== n.id;
        }), i.emit(za);
      }, s), this.future.push(n), !0;
    }, t.prototype.getAttempts = function(n) {
      var r;
      return (r = this.seen[n.id]) !== null && r !== void 0 ? r : 0;
    }, t.prototype.updateAttempts = function(n) {
      return this.seen[n.id] = this.getAttempts(n) + 1, this.getAttempts(n);
    }, t.prototype.includes = function(n) {
      return this.queue.includes(n) || this.future.includes(n) || !!this.queue.find(function(r) {
        return r.id === n.id;
      }) || !!this.future.find(function(r) {
        return r.id === n.id;
      });
    }, t.prototype.pop = function() {
      return this.queue.shift();
    }, Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this.queue.length;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "todo", {
      get: function() {
        return this.queue.length + this.future.length;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(In)
), Ut = 256, Xn = [], Wn;
for (; Ut--; ) Xn[Ut] = (Ut + 256).toString(16).substring(1);
function fr() {
  var e = 0, t, n = "";
  if (!Wn || Ut + 16 > 256) {
    for (Wn = Array(e = 256); e--; ) Wn[e] = 256 * Math.random() | 0;
    e = Ut = 0;
  }
  for (; e < 16; e++)
    t = Wn[Ut + e], e == 6 ? n += Xn[t & 15 | 64] : e == 8 ? n += Xn[t & 63 | 128] : n += Xn[t], e & 1 && e > 1 && e < 11 && (n += "-");
  return Ut++, n;
}
var pd = (
  /** @class */
  function() {
    function e() {
      this._logs = [];
    }
    return e.prototype.log = function(t, n, r) {
      var i = /* @__PURE__ */ new Date();
      this._logs.push({
        level: t,
        message: n,
        time: i,
        extras: r
      });
    }, Object.defineProperty(e.prototype, "logs", {
      get: function() {
        return this._logs;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.flush = function() {
      if (this.logs.length > 1) {
        var t = this._logs.reduce(function(n, r) {
          var i, o, s, a = F(F({}, r), { json: JSON.stringify(r.extras, null, " "), extras: r.extras });
          delete a.time;
          var l = (s = (o = r.time) === null || o === void 0 ? void 0 : o.toISOString()) !== null && s !== void 0 ? s : "";
          return n[l] && (l = "".concat(l, "-").concat(Math.random())), F(F({}, n), (i = {}, i[l] = a, i));
        }, {});
        console.table ? console.table(t) : console.log(t);
      } else
        this.logs.forEach(function(n) {
          var r = n.level, i = n.message, o = n.extras;
          r === "info" || r === "debug" ? console.log(i, o ?? "") : console[r](i, o ?? "");
        });
      this._logs = [];
    }, e;
  }()
), gd = function(e) {
  var t = {
    gauge: "g",
    counter: "c"
  };
  return t[e];
}, _d = (
  /** @class */
  function() {
    function e() {
      this.metrics = [];
    }
    return e.prototype.increment = function(t, n, r) {
      n === void 0 && (n = 1), this.metrics.push({
        metric: t,
        value: n,
        tags: r ?? [],
        type: "counter",
        timestamp: Date.now()
      });
    }, e.prototype.gauge = function(t, n, r) {
      this.metrics.push({
        metric: t,
        value: n,
        tags: r ?? [],
        type: "gauge",
        timestamp: Date.now()
      });
    }, e.prototype.flush = function() {
      var t = this.metrics.map(function(n) {
        return F(F({}, n), { tags: n.tags.join(",") });
      });
      console.table ? console.table(t) : console.log(t), this.metrics = [];
    }, e.prototype.serialize = function() {
      return this.metrics.map(function(t) {
        return {
          m: t.metric,
          v: t.value,
          t: t.tags,
          k: gd(t.type),
          e: t.timestamp
        };
      });
    }, e;
  }()
), vd = (
  /** @class */
  function(e) {
    Le(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.gauge = function() {
    }, t.prototype.increment = function() {
    }, t.prototype.flush = function() {
    }, t.prototype.serialize = function() {
      return [];
    }, t;
  }(_d)
), nr = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      var n, r, i;
      this.retry = (n = t.retry) !== null && n !== void 0 ? n : !0, this.type = (r = t.type) !== null && r !== void 0 ? r : "plugin Error", this.reason = (i = t.reason) !== null && i !== void 0 ? i : "";
    }
    return e;
  }()
), rr = (
  /** @class */
  function() {
    function e(t, n, r, i) {
      n === void 0 && (n = fr()), r === void 0 && (r = new vd()), i === void 0 && (i = new pd()), this.attempts = 0, this.event = t, this._id = n, this.logger = i, this.stats = r;
    }
    return e.system = function() {
    }, e.prototype.isSame = function(t) {
      return t.id === this.id;
    }, e.prototype.cancel = function(t) {
      throw t || new nr({ reason: "Context Cancel" });
    }, e.prototype.log = function(t, n, r) {
      this.logger.log(t, n, r);
    }, Object.defineProperty(e.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.updateEvent = function(t, n) {
      var r;
      if (t.split(".")[0] === "integrations") {
        var i = t.split(".")[1];
        if (((r = this.event.integrations) === null || r === void 0 ? void 0 : r[i]) === !1)
          return this.event;
      }
      return yi(this.event, t, n), this.event;
    }, e.prototype.failedDelivery = function() {
      return this._failedDelivery;
    }, e.prototype.setFailedDelivery = function(t) {
      this._failedDelivery = t;
    }, e.prototype.logs = function() {
      return this.logger.logs;
    }, e.prototype.flush = function() {
      this.logger.flush(), this.stats.flush();
    }, e.prototype.toJSON = function() {
      return {
        id: this._id,
        event: this.event,
        logs: this.logger.logs,
        metrics: this.stats.metrics
      };
    }, e;
  }()
);
function yd(e, t) {
  var n = {};
  return e.forEach(function(r) {
    var i, o = void 0;
    {
      var s = r[t];
      o = typeof s != "string" ? JSON.stringify(s) : s;
    }
    o !== void 0 && (n[o] = Ue(Ue([], (i = n[o]) !== null && i !== void 0 ? i : [], !0), [r], !1));
  }), n;
}
var bd = function(e) {
  return typeof e == "object" && e !== null && "then" in e && typeof e.then == "function";
}, Ed = function() {
  var e, t, n = 0;
  return {
    done: function() {
      return e;
    },
    run: function(r) {
      var i = r();
      return bd(i) && (++n === 1 && (e = new Promise(function(o) {
        return t = o;
      })), i.finally(function() {
        return --n === 0 && t();
      })), i;
    }
  };
};
function wd(e) {
  return Je(this, void 0, void 0, function() {
    var t;
    return Xe(this, function(n) {
      switch (n.label) {
        case 0:
          return n.trys.push([0, 2, , 3]), [4, e()];
        case 1:
          return [2, n.sent()];
        case 2:
          return t = n.sent(), [2, Promise.reject(t)];
        case 3:
          return [
            2
            /*return*/
          ];
      }
    });
  });
}
function Yn(e, t) {
  e.log("debug", "plugin", { plugin: t.name });
  var n = (/* @__PURE__ */ new Date()).getTime(), r = t[e.event.type];
  if (r === void 0)
    return Promise.resolve(e);
  var i = wd(function() {
    return r.apply(t, [e]);
  }).then(function(o) {
    var s = (/* @__PURE__ */ new Date()).getTime() - n;
    return o.stats.gauge("plugin_time", s, ["plugin:".concat(t.name)]), o;
  }).catch(function(o) {
    if (o instanceof nr && o.type === "middleware_cancellation")
      throw o;
    return o instanceof nr ? (e.log("warn", o.type, {
      plugin: t.name,
      error: o
    }), o) : (e.log("error", "plugin Error", {
      plugin: t.name,
      error: o
    }), e.stats.increment("plugin_error", 1, ["plugin:".concat(t.name)]), o);
  });
  return i;
}
function Sd(e, t) {
  return Yn(e, t).then(function(n) {
    if (n instanceof rr)
      return n;
    e.log("debug", "Context canceled"), e.stats.increment("context_canceled"), e.cancel(n);
  });
}
var Td = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n) {
      var r = e.call(this) || this;
      return r.criticalTasks = Ed(), r.plugins = [], r.failedInitializations = [], r.flushing = !1, r.queue = n, r.queue.on(za, function() {
        r.scheduleFlush(0);
      }), r;
    }
    return t.prototype.register = function(n, r, i) {
      return Je(this, void 0, void 0, function() {
        var o, s, a = this;
        return Xe(this, function(l) {
          switch (l.label) {
            case 0:
              return this.plugins.push(r), o = function(c) {
                a.failedInitializations.push(r.name), a.emit("initialization_failure", r), console.warn(r.name, c), n.log("warn", "Failed to load destination", {
                  plugin: r.name,
                  error: c
                }), a.plugins = a.plugins.filter(function(u) {
                  return u !== r;
                });
              }, r.type === "destination" && r.name !== "Segment.io" ? (r.load(n, i).catch(o), [3, 4]) : [3, 1];
            case 1:
              return l.trys.push([1, 3, , 4]), [4, r.load(n, i)];
            case 2:
              return l.sent(), [3, 4];
            case 3:
              return s = l.sent(), o(s), [3, 4];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, t.prototype.deregister = function(n, r, i) {
      return Je(this, void 0, void 0, function() {
        var o;
        return Xe(this, function(s) {
          switch (s.label) {
            case 0:
              return s.trys.push([0, 3, , 4]), r.unload ? [4, Promise.resolve(r.unload(n, i))] : [3, 2];
            case 1:
              s.sent(), s.label = 2;
            case 2:
              return this.plugins = this.plugins.filter(function(a) {
                return a.name !== r.name;
              }), [3, 4];
            case 3:
              return o = s.sent(), n.log("warn", "Failed to unload destination", {
                plugin: r.name,
                error: o
              }), [3, 4];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, t.prototype.dispatch = function(n) {
      return Je(this, void 0, void 0, function() {
        var r;
        return Xe(this, function(i) {
          return n.log("debug", "Dispatching"), n.stats.increment("message_dispatched"), this.queue.push(n), r = this.subscribeToDelivery(n), this.scheduleFlush(0), [2, r];
        });
      });
    }, t.prototype.subscribeToDelivery = function(n) {
      return Je(this, void 0, void 0, function() {
        var r = this;
        return Xe(this, function(i) {
          return [2, new Promise(function(o) {
            var s = function(a, l) {
              a.isSame(n) && (r.off("flush", s), o(a));
            };
            r.on("flush", s);
          })];
        });
      });
    }, t.prototype.dispatchSingle = function(n) {
      return Je(this, void 0, void 0, function() {
        var r = this;
        return Xe(this, function(i) {
          return n.log("debug", "Dispatching"), n.stats.increment("message_dispatched"), this.queue.updateAttempts(n), n.attempts = 1, [2, this.deliver(n).catch(function(o) {
            var s = r.enqueuRetry(o, n);
            return s ? r.subscribeToDelivery(n) : (n.setFailedDelivery({ reason: o }), n);
          })];
        });
      });
    }, t.prototype.isEmpty = function() {
      return this.queue.length === 0;
    }, t.prototype.scheduleFlush = function(n) {
      var r = this;
      n === void 0 && (n = 500), !this.flushing && (this.flushing = !0, setTimeout(function() {
        r.flush().then(function() {
          setTimeout(function() {
            r.flushing = !1, r.queue.length && r.scheduleFlush(0);
          }, 0);
        });
      }, n));
    }, t.prototype.deliver = function(n) {
      return Je(this, void 0, void 0, function() {
        var r, i, o, s;
        return Xe(this, function(a) {
          switch (a.label) {
            case 0:
              return [4, this.criticalTasks.done()];
            case 1:
              a.sent(), r = Date.now(), a.label = 2;
            case 2:
              return a.trys.push([2, 4, , 5]), [4, this.flushOne(n)];
            case 3:
              return n = a.sent(), i = Date.now() - r, this.emit("delivery_success", n), n.stats.gauge("delivered", i), n.log("debug", "Delivered", n.event), [2, n];
            case 4:
              throw o = a.sent(), s = o, n.log("error", "Failed to deliver", s), this.emit("delivery_failure", n, s), n.stats.increment("delivery_failed"), o;
            case 5:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, t.prototype.enqueuRetry = function(n, r) {
      var i = !(n instanceof nr) || n.retry;
      return i ? this.queue.pushWithBackoff(r) : !1;
    }, t.prototype.flush = function() {
      return Je(this, void 0, void 0, function() {
        var n, r, i;
        return Xe(this, function(o) {
          switch (o.label) {
            case 0:
              if (this.queue.length === 0)
                return [2, []];
              if (n = this.queue.pop(), !n)
                return [2, []];
              n.attempts = this.queue.getAttempts(n), o.label = 1;
            case 1:
              return o.trys.push([1, 3, , 4]), [4, this.deliver(n)];
            case 2:
              return n = o.sent(), this.emit("flush", n, !0), [3, 4];
            case 3:
              return r = o.sent(), i = this.enqueuRetry(r, n), i || (n.setFailedDelivery({ reason: r }), this.emit("flush", n, !1)), [2, []];
            case 4:
              return [2, [n]];
          }
        });
      });
    }, t.prototype.isReady = function() {
      return !0;
    }, t.prototype.availableExtensions = function(n) {
      var r = this.plugins.filter(function(g) {
        var m, h, v;
        if (g.type !== "destination" && g.name !== "Segment.io")
          return !0;
        var w = void 0;
        return (m = g.alternativeNames) === null || m === void 0 || m.forEach(function(E) {
          n[E] !== void 0 && (w = n[E]);
        }), (v = (h = n[g.name]) !== null && h !== void 0 ? h : w) !== null && v !== void 0 ? v : (g.name === "Segment.io" ? !0 : n.All) !== !1;
      }), i = yd(r, "type"), o = i.before, s = o === void 0 ? [] : o, a = i.enrichment, l = a === void 0 ? [] : a, c = i.destination, u = c === void 0 ? [] : c, f = i.after, p = f === void 0 ? [] : f;
      return {
        before: s,
        enrichment: l,
        destinations: u,
        after: p
      };
    }, t.prototype.flushOne = function(n) {
      var r, i;
      return Je(this, void 0, void 0, function() {
        var o, s, a, l, c, u, m, f, p, g, m, h, v, w, E;
        return Xe(this, function(R) {
          switch (R.label) {
            case 0:
              if (!this.isReady())
                throw new Error("Not ready");
              n.attempts > 1 && this.emit("delivery_retry", n), o = this.availableExtensions((r = n.event.integrations) !== null && r !== void 0 ? r : {}), s = o.before, a = o.enrichment, l = 0, c = s, R.label = 1;
            case 1:
              return l < c.length ? (u = c[l], [4, Sd(n, u)]) : [3, 4];
            case 2:
              m = R.sent(), m instanceof rr && (n = m), this.emit("message_enriched", n, u), R.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              f = 0, p = a, R.label = 5;
            case 5:
              return f < p.length ? (g = p[f], [4, Yn(n, g)]) : [3, 8];
            case 6:
              m = R.sent(), m instanceof rr && (n = m), this.emit("message_enriched", n, g), R.label = 7;
            case 7:
              return f++, [3, 5];
            case 8:
              return h = this.availableExtensions((i = n.event.integrations) !== null && i !== void 0 ? i : {}), v = h.destinations, w = h.after, [4, new Promise(function(M, b) {
                setTimeout(function() {
                  var P = v.map(function(U) {
                    return Yn(n, U);
                  });
                  Promise.all(P).then(M).catch(b);
                }, 0);
              })];
            case 9:
              return R.sent(), n.stats.increment("message_delivered"), this.emit("message_delivered", n), E = w.map(function(M) {
                return Yn(n, M);
              }), [4, Promise.all(E)];
            case 10:
              return R.sent(), [2, n];
          }
        });
      });
    }, t;
  }(In)
), Cd = function(e, t) {
  var n = Date.now() - e;
  return Math.max((t ?? 300) - n, 0);
};
function Id(e, t, n, r) {
  return Je(this, void 0, void 0, function() {
    var i, o;
    return Xe(this, function(s) {
      switch (s.label) {
        case 0:
          return n.emit("dispatch_start", e), i = Date.now(), t.isEmpty() ? [4, t.dispatchSingle(e)] : [3, 2];
        case 1:
          return o = s.sent(), [3, 4];
        case 2:
          return [4, t.dispatch(e)];
        case 3:
          o = s.sent(), s.label = 4;
        case 4:
          return r != null && r.callback ? [4, fd(o, r.callback, Cd(i, r.timeout))] : [3, 6];
        case 5:
          o = s.sent(), s.label = 6;
        case 6:
          return r != null && r.debug && o.flush(), [2, o];
      }
    });
  });
}
function Rd(e) {
  for (var t = e.constructor.prototype, n = 0, r = Object.getOwnPropertyNames(t); n < r.length; n++) {
    var i = r[n];
    if (i !== "constructor") {
      var o = Object.getOwnPropertyDescriptor(e.constructor.prototype, i);
      o && typeof o.value == "function" && (e[i] = e[i].bind(e));
    }
  }
  return e;
}
const Ad = (e) => {
  if (!e.writeKey)
    throw new et("writeKey", "writeKey is missing.");
}, Ka = "2.3.0", Od = (e) => e.replace(/\/$/, ""), Pd = (e, t) => Od(new URL(t || "", e).href), Yo = 32, Zo = 480;
class Dd {
  constructor(t) {
    x(this, "id", fr());
    x(this, "items", []);
    x(this, "sizeInBytes", 0);
    x(this, "maxEventCount");
    this.maxEventCount = Math.max(1, t);
  }
  tryAdd(t) {
    if (this.length === this.maxEventCount)
      return {
        success: !1,
        message: `Event limit of ${this.maxEventCount} has been exceeded.`
      };
    const n = this.calculateSize(t.context);
    return n > Yo * 1024 ? {
      success: !1,
      message: `Event exceeds maximum event size of ${Yo} KB`
    } : this.sizeInBytes + n > Zo * 1024 ? {
      success: !1,
      message: `Event has caused batch size to exceed ${Zo} KB`
    } : (this.items.push(t), this.sizeInBytes += n, { success: !0 });
  }
  get length() {
    return this.items.length;
  }
  calculateSize(t) {
    return encodeURI(JSON.stringify(t.event)).split(/%..|i/).length;
  }
  getEvents() {
    return this.items.map(({ context: n }) => n.event);
  }
  getContexts() {
    return this.items.map((t) => t.context);
  }
  resolveEvents() {
    this.items.forEach(({ resolver: t, context: n }) => t(n));
  }
}
const bn = new TextEncoder(), Qo = new TextDecoder();
function Ld(...e) {
  const t = e.reduce((i, { length: o }) => i + o, 0), n = new Uint8Array(t);
  let r = 0;
  for (const i of e)
    n.set(i, r), r += i.length;
  return n;
}
const Fr = (e) => Ua.from(e).toString("base64url");
class Xi extends Error {
  constructor(n) {
    var r;
    super(n);
    x(this, "code", "ERR_JOSE_GENERIC");
    this.name = this.constructor.name, (r = Error.captureStackTrace) == null || r.call(Error, this, this.constructor);
  }
  static get code() {
    return "ERR_JOSE_GENERIC";
  }
}
class Rn extends Xi {
  constructor() {
    super(...arguments);
    x(this, "code", "ERR_JOSE_NOT_SUPPORTED");
  }
  static get code() {
    return "ERR_JOSE_NOT_SUPPORTED";
  }
}
class an extends Xi {
  constructor() {
    super(...arguments);
    x(this, "code", "ERR_JWS_INVALID");
  }
  static get code() {
    return "ERR_JWS_INVALID";
  }
}
class xd extends Xi {
  constructor() {
    super(...arguments);
    x(this, "code", "ERR_JWT_INVALID");
  }
  static get code() {
    return "ERR_JWT_INVALID";
  }
}
const Ja = (e) => Fa.types.isKeyObject(e), jr = qi.webcrypto, Yi = (e) => Fa.types.isCryptoKey(e);
function it(e, t = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
}
function Bn(e, t) {
  return e.name === t;
}
function Wr(e) {
  return parseInt(e.name.slice(4), 10);
}
function kd(e) {
  switch (e) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function Md(e, t) {
  if (t.length && !t.some((n) => e.usages.includes(n))) {
    let n = "CryptoKey does not support this operation, its usages must include ";
    if (t.length > 2) {
      const r = t.pop();
      n += `one of ${t.join(", ")}, or ${r}.`;
    } else t.length === 2 ? n += `one of ${t[0]} or ${t[1]}.` : n += `${t[0]}.`;
    throw new TypeError(n);
  }
}
function Nd(e, t, ...n) {
  switch (t) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!Bn(e.algorithm, "HMAC"))
        throw it("HMAC");
      const r = parseInt(t.slice(2), 10);
      if (Wr(e.algorithm.hash) !== r)
        throw it(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!Bn(e.algorithm, "RSASSA-PKCS1-v1_5"))
        throw it("RSASSA-PKCS1-v1_5");
      const r = parseInt(t.slice(2), 10);
      if (Wr(e.algorithm.hash) !== r)
        throw it(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!Bn(e.algorithm, "RSA-PSS"))
        throw it("RSA-PSS");
      const r = parseInt(t.slice(2), 10);
      if (Wr(e.algorithm.hash) !== r)
        throw it(`SHA-${r}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (e.algorithm.name !== "Ed25519" && e.algorithm.name !== "Ed448")
        throw it("Ed25519 or Ed448");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!Bn(e.algorithm, "ECDSA"))
        throw it("ECDSA");
      const r = kd(t);
      if (e.algorithm.namedCurve !== r)
        throw it(r, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  Md(e, n);
}
function Xa(e, t, ...n) {
  var r;
  if (n.length > 2) {
    const i = n.pop();
    e += `one of type ${n.join(", ")}, or ${i}.`;
  } else n.length === 2 ? e += `one of type ${n[0]} or ${n[1]}.` : e += `of type ${n[0]}.`;
  return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t != null && (r = t.constructor) != null && r.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
const bi = (e, ...t) => Xa("Key must be ", e, ...t);
function Ya(e, t, ...n) {
  return Xa(`Key for the ${e} algorithm must be `, t, ...n);
}
const Za = (e) => Ja(e) || Yi(e), Yt = ["KeyObject"];
(globalThis.CryptoKey || jr != null && jr.CryptoKey) && Yt.push("CryptoKey");
const Ud = (...e) => {
  const t = e.filter(Boolean);
  if (t.length === 0 || t.length === 1)
    return !0;
  let n;
  for (const r of t) {
    const i = Object.keys(r);
    if (!n || n.size === 0) {
      n = new Set(i);
      continue;
    }
    for (const o of i) {
      if (n.has(o))
        return !1;
      n.add(o);
    }
  }
  return !0;
};
function Fd(e) {
  return typeof e == "object" && e !== null;
}
function jd(e) {
  if (!Fd(e) || Object.prototype.toString.call(e) !== "[object Object]")
    return !1;
  if (Object.getPrototypeOf(e) === null)
    return !0;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
const Wd = (e) => {
  switch (e) {
    case "prime256v1":
      return "P-256";
    case "secp384r1":
      return "P-384";
    case "secp521r1":
      return "P-521";
    case "secp256k1":
      return "secp256k1";
    default:
      throw new Rn("Unsupported key curve for this operation");
  }
}, Bd = (e, t) => {
  let n;
  if (Yi(e))
    n = vi.from(e);
  else if (Ja(e))
    n = e;
  else
    throw new TypeError(bi(e, ...Yt));
  if (n.type === "secret")
    throw new TypeError('only "private" or "public" type keys can be used for this operation');
  switch (n.asymmetricKeyType) {
    case "ed25519":
    case "ed448":
      return `Ed${n.asymmetricKeyType.slice(2)}`;
    case "x25519":
    case "x448":
      return `X${n.asymmetricKeyType.slice(1)}`;
    case "ec": {
      const r = n.asymmetricKeyDetails.namedCurve;
      return Wd(r);
    }
    default:
      throw new TypeError("Invalid asymmetric key type for this operation");
  }
}, es = (e, t) => {
  const { modulusLength: n } = e.asymmetricKeyDetails;
  if (typeof n != "number" || n < 2048)
    throw new TypeError(`${t} requires key modulusLength to be 2048 bits or larger`);
}, Hd = (e) => vc({
  key: Ua.from(e.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ""), "base64"),
  type: "pkcs8",
  format: "der"
});
async function Gd(e, t, n) {
  if (typeof e != "string" || e.indexOf("-----BEGIN PRIVATE KEY-----") !== 0)
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
  return Hd(e);
}
const Ei = (e) => e == null ? void 0 : e[Symbol.toStringTag], $d = (e, t) => {
  if (!(t instanceof Uint8Array)) {
    if (!Za(t))
      throw new TypeError(Ya(e, t, ...Yt, "Uint8Array"));
    if (t.type !== "secret")
      throw new TypeError(`${Ei(t)} instances for symmetric algorithms must be of type "secret"`);
  }
}, qd = (e, t, n) => {
  if (!Za(t))
    throw new TypeError(Ya(e, t, ...Yt));
  if (t.type === "secret")
    throw new TypeError(`${Ei(t)} instances for asymmetric algorithms must not be of type "secret"`);
  if (t.type === "public")
    throw new TypeError(`${Ei(t)} instances for asymmetric algorithm signing must be of type "private"`);
  t.algorithm, t.algorithm;
}, Vd = (e, t, n) => {
  e.startsWith("HS") || e === "dir" || e.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(e) ? $d(e, t) : qd(e, t, n);
};
function zd(e, t, n, r, i) {
  if (i.crit !== void 0 && (r == null ? void 0 : r.crit) === void 0)
    throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!r || r.crit === void 0)
    return /* @__PURE__ */ new Set();
  if (!Array.isArray(r.crit) || r.crit.length === 0 || r.crit.some((s) => typeof s != "string" || s.length === 0))
    throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  let o;
  n !== void 0 ? o = new Map([...Object.entries(n), ...t.entries()]) : o = t;
  for (const s of r.crit) {
    if (!o.has(s))
      throw new Rn(`Extension Header Parameter "${s}" is not recognized`);
    if (i[s] === void 0)
      throw new e(`Extension Header Parameter "${s}" is missing`);
    if (o.get(s) && r[s] === void 0)
      throw new e(`Extension Header Parameter "${s}" MUST be integrity protected`);
  }
  return new Set(r.crit);
}
function Kd(e) {
  switch (e) {
    case "PS256":
    case "RS256":
    case "ES256":
    case "ES256K":
      return "sha256";
    case "PS384":
    case "RS384":
    case "ES384":
      return "sha384";
    case "PS512":
    case "RS512":
    case "ES512":
      return "sha512";
    case "EdDSA":
      return;
    default:
      throw new Rn(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
const Jd = {
  padding: Jo.RSA_PKCS1_PSS_PADDING,
  saltLength: Jo.RSA_PSS_SALTLEN_DIGEST
}, Xd = /* @__PURE__ */ new Map([
  ["ES256", "P-256"],
  ["ES256K", "secp256k1"],
  ["ES384", "P-384"],
  ["ES512", "P-521"]
]);
function Yd(e, t) {
  switch (e) {
    case "EdDSA":
      if (!["ed25519", "ed448"].includes(t.asymmetricKeyType))
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448");
      return t;
    case "RS256":
    case "RS384":
    case "RS512":
      if (t.asymmetricKeyType !== "rsa")
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
      return es(t, e), t;
    case "PS256":
    case "PS384":
    case "PS512":
      if (t.asymmetricKeyType === "rsa-pss") {
        const { hashAlgorithm: n, mgf1HashAlgorithm: r, saltLength: i } = t.asymmetricKeyDetails, o = parseInt(e.slice(-3), 10);
        if (n !== void 0 && (n !== `sha${o}` || r !== n))
          throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${e}`);
        if (i !== void 0 && i > o >> 3)
          throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${e}`);
      } else if (t.asymmetricKeyType !== "rsa")
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss");
      return es(t, e), { key: t, ...Jd };
    case "ES256":
    case "ES256K":
    case "ES384":
    case "ES512": {
      if (t.asymmetricKeyType !== "ec")
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ec");
      const n = Bd(t), r = Xd.get(e);
      if (n !== r)
        throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${r}, got ${n}`);
      return { dsaEncoding: "ieee-p1363", key: t };
    }
    default:
      throw new Rn(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
function Zd(e) {
  switch (e) {
    case "HS256":
      return "sha256";
    case "HS384":
      return "sha384";
    case "HS512":
      return "sha512";
    default:
      throw new Rn(`alg ${e} is not supported either by JOSE or your javascript runtime`);
  }
}
function Qd(e, t, n) {
  if (t instanceof Uint8Array) {
    if (!e.startsWith("HS"))
      throw new TypeError(bi(t, ...Yt));
    return yc(t);
  }
  if (t instanceof vi)
    return t;
  if (Yi(t))
    return Nd(t, e, n), vi.from(t);
  throw new TypeError(bi(t, ...Yt, "Uint8Array"));
}
const ef = bc(qi.sign), tf = async (e, t, n) => {
  const r = Qd(e, t, "sign");
  if (e.startsWith("HS")) {
    const i = qi.createHmac(Zd(e), r);
    return i.update(n), i.digest();
  }
  return ef(Kd(e), n, Yd(e, r));
}, _t = (e) => Math.floor(e.getTime() / 1e3), Qa = 60, eu = Qa * 60, Zi = eu * 24, nf = Zi * 7, rf = Zi * 365.25, of = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, Br = (e) => {
  const t = of.exec(e);
  if (!t || t[4] && t[1])
    throw new TypeError("Invalid time period format");
  const n = parseFloat(t[2]), r = t[3].toLowerCase();
  let i;
  switch (r) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      i = Math.round(n);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      i = Math.round(n * Qa);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      i = Math.round(n * eu);
      break;
    case "day":
    case "days":
    case "d":
      i = Math.round(n * Zi);
      break;
    case "week":
    case "weeks":
    case "w":
      i = Math.round(n * nf);
      break;
    default:
      i = Math.round(n * rf);
      break;
  }
  return t[1] === "-" || t[4] === "ago" ? -i : i;
};
class sf {
  constructor(t) {
    x(this, "_payload");
    x(this, "_protectedHeader");
    x(this, "_unprotectedHeader");
    if (!(t instanceof Uint8Array))
      throw new TypeError("payload must be an instance of Uint8Array");
    this._payload = t;
  }
  setProtectedHeader(t) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = t, this;
  }
  setUnprotectedHeader(t) {
    if (this._unprotectedHeader)
      throw new TypeError("setUnprotectedHeader can only be called once");
    return this._unprotectedHeader = t, this;
  }
  async sign(t, n) {
    if (!this._protectedHeader && !this._unprotectedHeader)
      throw new an("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    if (!Ud(this._protectedHeader, this._unprotectedHeader))
      throw new an("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    const r = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    }, i = zd(an, /* @__PURE__ */ new Map([["b64", !0]]), n == null ? void 0 : n.crit, this._protectedHeader, r);
    let o = !0;
    if (i.has("b64") && (o = this._protectedHeader.b64, typeof o != "boolean"))
      throw new an('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    const { alg: s } = r;
    if (typeof s != "string" || !s)
      throw new an('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    Vd(s, t, "sign");
    let a = this._payload;
    o && (a = bn.encode(Fr(a)));
    let l;
    this._protectedHeader ? l = bn.encode(Fr(JSON.stringify(this._protectedHeader))) : l = bn.encode("");
    const c = Ld(l, bn.encode("."), a), u = await tf(s, t, c), f = {
      signature: Fr(u),
      payload: ""
    };
    return o && (f.payload = Qo.decode(a)), this._unprotectedHeader && (f.header = this._unprotectedHeader), this._protectedHeader && (f.protected = Qo.decode(l)), f;
  }
}
class af {
  constructor(t) {
    x(this, "_flattened");
    this._flattened = new sf(t);
  }
  setProtectedHeader(t) {
    return this._flattened.setProtectedHeader(t), this;
  }
  async sign(t, n) {
    const r = await this._flattened.sign(t, n);
    if (r.payload === void 0)
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    return `${r.protected}.${r.payload}.${r.signature}`;
  }
}
function vt(e, t) {
  if (!Number.isFinite(t))
    throw new TypeError(`Invalid ${e} input`);
  return t;
}
class uf {
  constructor(t = {}) {
    x(this, "_payload");
    if (!jd(t))
      throw new TypeError("JWT Claims Set MUST be an object");
    this._payload = t;
  }
  setIssuer(t) {
    return this._payload = { ...this._payload, iss: t }, this;
  }
  setSubject(t) {
    return this._payload = { ...this._payload, sub: t }, this;
  }
  setAudience(t) {
    return this._payload = { ...this._payload, aud: t }, this;
  }
  setJti(t) {
    return this._payload = { ...this._payload, jti: t }, this;
  }
  setNotBefore(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, nbf: vt("setNotBefore", t) } : t instanceof Date ? this._payload = { ...this._payload, nbf: vt("setNotBefore", _t(t)) } : this._payload = { ...this._payload, nbf: _t(/* @__PURE__ */ new Date()) + Br(t) }, this;
  }
  setExpirationTime(t) {
    return typeof t == "number" ? this._payload = { ...this._payload, exp: vt("setExpirationTime", t) } : t instanceof Date ? this._payload = { ...this._payload, exp: vt("setExpirationTime", _t(t)) } : this._payload = { ...this._payload, exp: _t(/* @__PURE__ */ new Date()) + Br(t) }, this;
  }
  setIssuedAt(t) {
    return typeof t > "u" ? this._payload = { ...this._payload, iat: _t(/* @__PURE__ */ new Date()) } : t instanceof Date ? this._payload = { ...this._payload, iat: vt("setIssuedAt", _t(t)) } : typeof t == "string" ? this._payload = {
      ...this._payload,
      iat: vt("setIssuedAt", _t(/* @__PURE__ */ new Date()) + Br(t))
    } : this._payload = { ...this._payload, iat: vt("setIssuedAt", t) }, this;
  }
}
class lf extends uf {
  constructor() {
    super(...arguments);
    x(this, "_protectedHeader");
  }
  setProtectedHeader(n) {
    return this._protectedHeader = n, this;
  }
  async sign(n, r) {
    var o;
    const i = new af(bn.encode(JSON.stringify(this._payload)));
    if (i.setProtectedHeader(this._protectedHeader), Array.isArray((o = this._protectedHeader) == null ? void 0 : o.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1)
      throw new xd("JWTs MUST NOT use unencoded payload");
    return i.sign(n, r);
  }
}
const cf = (e) => !!(e && typeof e == "object" && "access_token" in e && "expires_in" in e && typeof e.access_token == "string" && typeof e.expires_in == "number"), df = (e) => typeof e.text == "function";
function ff(e) {
  const t = {};
  if (!e)
    return {};
  if (hf(e)) {
    for (const [n, r] of e.entries())
      t[n.toLowerCase()] = r;
    return t;
  }
  for (const [n, r] of Object.entries(e))
    t[n.toLowerCase()] = r;
  return t;
}
function hf(e) {
  return typeof e == "object" && e !== null && "entries" in Object(e) && typeof Object(e).entries == "function";
}
class mf {
  constructor(t) {
    x(this, "alg", "RS256");
    x(this, "grantType", "client_credentials");
    x(this, "clientAssertionType", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
    x(this, "clientId");
    x(this, "clientKey");
    x(this, "keyId");
    x(this, "scope");
    x(this, "authServer");
    x(this, "httpClient");
    x(this, "maxRetries");
    x(this, "clockSkewInSeconds", 0);
    x(this, "accessToken");
    x(this, "tokenEmitter", new In());
    x(this, "retryCount");
    x(this, "pollerTimer");
    this.keyId = t.keyId, this.clientId = t.clientId, this.clientKey = t.clientKey, this.authServer = t.authServer ?? "https://oauth2.segment.io", this.scope = t.scope ?? "tracking_api:write", this.httpClient = t.httpClient, this.maxRetries = t.maxRetries, this.tokenEmitter.on("access_token", (n) => {
      "token" in n && (this.accessToken = n.token);
    }), this.retryCount = 0;
  }
  stopPoller() {
    clearTimeout(this.pollerTimer);
  }
  async pollerLoop() {
    let t = 25, n;
    try {
      n = await this.requestAccessToken();
    } catch (i) {
      return this.handleTransientError({ error: i });
    }
    if (!df(n))
      return this.handleInvalidCustomResponse();
    const r = ff(n.headers);
    if (r.date && this.updateClockSkew(Date.parse(r.date)), n.status === 200)
      try {
        const i = await n.text(), o = JSON.parse(i);
        if (!cf(o))
          throw new Error("Response did not contain a valid access_token and expires_in");
        return o.expires_at = Math.round(Date.now() / 1e3) + o.expires_in, this.tokenEmitter.emit("access_token", { token: o }), this.retryCount = 0, t = o.expires_in / 2 * 1e3, this.queueNextPoll(t);
      } catch (i) {
        return this.handleTransientError({ error: i, forceEmitError: !0 });
      }
    else return n.status === 429 ? await this.handleRateLimited(n, r, t) : [400, 401, 415].includes(n.status) ? this.handleUnrecoverableErrors(n) : this.handleTransientError({
      error: new Error(`[${n.status}] ${n.statusText}`)
    });
  }
  handleTransientError({ error: t, forceEmitError: n }) {
    this.incrementRetries({ error: t, forceEmitError: n });
    const r = Ji({
      attempt: this.retryCount,
      minTimeout: 25,
      maxTimeout: 1e3
    });
    this.queueNextPoll(r);
  }
  handleInvalidCustomResponse() {
    this.tokenEmitter.emit("access_token", {
      error: new Error("HTTPClient does not implement response.text method")
    });
  }
  async handleRateLimited(t, n, r) {
    if (this.incrementRetries({
      error: new Error(`[${t.status}] ${t.statusText}`)
    }), n["x-ratelimit-reset"]) {
      const i = parseInt(n["x-ratelimit-reset"], 10);
      isFinite(i) ? r = i - Date.now() + this.clockSkewInSeconds * 1e3 : r = 5 * 1e3, await Va(r), r = 0;
    }
    this.queueNextPoll(r);
  }
  handleUnrecoverableErrors(t) {
    this.retryCount = 0, this.tokenEmitter.emit("access_token", {
      error: new Error(`[${t.status}] ${t.statusText}`)
    }), this.stopPoller();
  }
  updateClockSkew(t) {
    this.clockSkewInSeconds = (Date.now() - t) / 1e3;
  }
  incrementRetries({ error: t, forceEmitError: n }) {
    this.retryCount++, (n || this.retryCount % this.maxRetries === 0) && (this.retryCount = 0, this.tokenEmitter.emit("access_token", { error: t }));
  }
  queueNextPoll(t) {
    this.pollerTimer = setTimeout(() => this.pollerLoop(), t), this.pollerTimer.unref && this.pollerTimer.unref();
  }
  /**
   * Solely responsible for building the HTTP request and calling the token service.
   */
  async requestAccessToken() {
    const i = fr(), o = Math.round(Date.now() / 1e3) - this.clockSkewInSeconds, s = {
      iss: this.clientId,
      sub: this.clientId,
      aud: this.authServer,
      iat: o - 5,
      exp: o + 55,
      jti: i
    }, a = await Gd(this.clientKey), l = await new lf(s).setProtectedHeader({ alg: this.alg, kid: this.keyId, typ: "JWT" }).sign(a), c = `grant_type=${this.grantType}&client_assertion_type=${this.clientAssertionType}&client_assertion=${l}&scope=${this.scope}`, f = {
      method: "POST",
      url: `${this.authServer}/token`,
      body: c,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      httpRequestTimeout: 1e4
    };
    return this.httpClient.makeRequest(f);
  }
  async getAccessToken() {
    return this.isValidToken(this.accessToken) ? this.accessToken : (this.stopPoller(), this.pollerLoop().catch(() => {
    }), new Promise((t, n) => {
      this.tokenEmitter.once("access_token", (r) => {
        "token" in r ? t(r.token) : n(r.error);
      });
    }));
  }
  clearToken() {
    this.accessToken = void 0;
  }
  isValidToken(t) {
    return typeof t < "u" && t !== null && t.expires_in < Date.now() / 1e3;
  }
}
function pf(e) {
  return new Promise((t) => setTimeout(t, e));
}
function un() {
}
class gf {
  constructor({ host: t, path: n, maxRetries: r, flushAt: i, flushInterval: o, writeKey: s, httpRequestTimeout: a, httpClient: l, disable: c, oauthSettings: u }, f) {
    x(this, "pendingFlushTimeout");
    x(this, "_batch");
    x(this, "_flushInterval");
    x(this, "_flushAt");
    x(this, "_maxRetries");
    x(this, "_url");
    x(this, "_flushPendingItemsCount");
    x(this, "_httpRequestTimeout");
    x(this, "_emitter");
    x(this, "_disable");
    x(this, "_httpClient");
    x(this, "_writeKey");
    x(this, "_tokenManager");
    this._emitter = f, this._maxRetries = r, this._flushAt = Math.max(i, 1), this._flushInterval = o, this._url = Pd(t ?? "https://api.segment.io", n ?? "/v1/batch"), this._httpRequestTimeout = a ?? 1e4, this._disable = !!c, this._httpClient = l, this._writeKey = s, u && (this._tokenManager = new mf({
      ...u,
      httpClient: u.httpClient ?? l,
      maxRetries: u.maxRetries ?? r
    }));
  }
  createBatch() {
    this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
    const t = new Dd(this._flushAt);
    return this._batch = t, this.pendingFlushTimeout = setTimeout(() => {
      t === this._batch && (this._batch = void 0), this.pendingFlushTimeout = void 0, t.length && this.send(t).catch(un);
    }, this._flushInterval), t;
  }
  clearBatch() {
    this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), this._batch = void 0;
  }
  flush(t) {
    if (!t) {
      this._tokenManager && this._tokenManager.stopPoller();
      return;
    }
    if (this._flushPendingItemsCount = t, !this._batch)
      return;
    this._batch.length === t && (this.send(this._batch).catch(un).finally(() => {
      this._tokenManager && this._tokenManager.stopPoller();
    }), this.clearBatch());
  }
  /**
   * Enqueues the context for future delivery.
   * @param ctx - Context containing a Segment event.
   * @returns a promise that resolves with the context after the event has been delivered.
   */
  enqueue(t) {
    const n = this._batch ?? this.createBatch(), { promise: r, resolve: i } = hd(), o = {
      context: t,
      resolver: i
    };
    if (n.tryAdd(o).success) {
      const c = n.length === this._flushPendingItemsCount;
      return (n.length === this._flushAt || c) && (this.send(n).catch(un), this.clearBatch()), r;
    }
    n.length && (this.send(n).catch(un), this.clearBatch());
    const a = this.createBatch(), l = a.tryAdd(o);
    return l.success ? (a.length === this._flushPendingItemsCount && (this.send(a).catch(un), this.clearBatch()), r) : (t.setFailedDelivery({
      reason: new Error(l.message)
    }), Promise.resolve(t));
  }
  async send(t) {
    this._flushPendingItemsCount && (this._flushPendingItemsCount -= t.length);
    const n = t.getEvents(), r = this._maxRetries + 1;
    let i = 0;
    for (; i < r; ) {
      i++;
      let o, s;
      try {
        if (this._disable)
          return t.resolveEvents();
        let a;
        if (this._tokenManager) {
          const f = await this._tokenManager.getAccessToken();
          f && f.access_token && (a = `Bearer ${f.access_token}`);
        }
        const l = {
          "Content-Type": "application/json",
          "User-Agent": "analytics-node-next/latest",
          ...a ? { Authorization: a } : {}
        }, c = {
          url: this._url,
          method: "POST",
          headers: l,
          body: JSON.stringify({
            batch: n,
            writeKey: this._writeKey,
            sentAt: /* @__PURE__ */ new Date()
          }),
          httpRequestTimeout: this._httpRequestTimeout
        };
        this._emitter.emit("http_request", {
          body: c.body,
          method: c.method,
          url: c.url,
          headers: c.headers
        });
        const u = await this._httpClient.makeRequest(c);
        if (u.status >= 200 && u.status < 300) {
          t.resolveEvents();
          return;
        } else if (this._tokenManager && (u.status === 400 || u.status === 401 || u.status === 403))
          this._tokenManager.clearToken(), s = new Error(`[${u.status}] ${u.statusText}`);
        else if (u.status === 400) {
          ts(t, new Error(`[${u.status}] ${u.statusText}`));
          return;
        } else if (u.status === 429) {
          if (u.headers && "x-ratelimit-reset" in u.headers) {
            const f = parseInt(u.headers["x-ratelimit-reset"], 10);
            isFinite(f) && (o = f - Date.now());
          }
          s = new Error(`[${u.status}] ${u.statusText}`);
        } else
          s = new Error(`[${u.status}] ${u.statusText}`);
      } catch (a) {
        s = a;
      }
      if (i === r) {
        ts(t, s);
        return;
      }
      await pf(o || Ji({
        attempt: i,
        minTimeout: 25,
        maxTimeout: 1e3
      }));
    }
  }
}
function ts(e, t) {
  e.getContexts().forEach((n) => n.setFailedDelivery({ reason: t })), e.resolveEvents();
}
const tu = () => typeof process == "object" && process && typeof process.env == "object" && process.env && typeof process.version == "string" ? "node" : typeof window == "object" ? "browser" : typeof WebSocketPair < "u" ? "cloudflare-worker" : typeof EdgeRuntime == "string" ? "vercel-edge" : (
  // @ts-ignore
  typeof WorkerGlobalScope < "u" && // @ts-ignore
  typeof importScripts == "function" ? "web-worker" : "unknown"
);
function _f(e) {
  e.updateEvent("context.library.name", "@segment/analytics-node"), e.updateEvent("context.library.version", Ka);
  const t = tu();
  t === "node" && e.updateEvent("_metadata.nodeVersion", process.version), e.updateEvent("_metadata.jsRuntime", t);
}
function vf(e) {
  function t(n) {
    return _f(n), e.enqueue(n);
  }
  return {
    name: "Segment.io",
    type: "destination",
    version: "1.0.0",
    isLoaded: () => !0,
    load: () => Promise.resolve(),
    alias: t,
    group: t,
    identify: t,
    page: t,
    screen: t,
    track: t
  };
}
const yf = (e, t) => {
  const n = new gf(e, t);
  return {
    publisher: n,
    plugin: vf(n)
  };
}, bf = () => `node-next-${Date.now()}-${fr()}`;
class Ef extends dd {
  constructor() {
    super({
      createMessageId: bf,
      onFinishedEvent: (t) => {
        nd(t);
      }
    });
  }
}
let wi = class extends rr {
  static system() {
    return new this({ type: "track", event: "system" });
  }
};
const wf = (e) => (t) => {
  const n = t.failedDelivery();
  return e(n ? n.reason : void 0, t);
}, Sf = async (e, t, n, r) => {
  try {
    const i = new wi(e), o = await Id(i, t, n, {
      ...r ? { callback: wf(r) } : {}
    }), s = o.failedDelivery();
    s ? n.emit("error", {
      code: "delivery_failure",
      reason: s.reason,
      ctx: o
    }) : n.emit(e.type, o);
  } catch (i) {
    n.emit("error", {
      code: "unknown",
      reason: i
    });
  }
};
class Tf extends In {
}
class Cf extends md {
  constructor() {
    super(1, []);
  }
  // do not use an internal "seen" map
  getAttempts(t) {
    return t.attempts ?? 0;
  }
  updateAttempts(t) {
    return t.attempts = this.getAttempts(t) + 1, this.getAttempts(t);
  }
}
class If extends Td {
  constructor() {
    super(new Cf());
  }
}
class Rf {
  constructor() {
    x(this, "onabort", null);
    x(this, "aborted", !1);
    x(this, "eventEmitter", new In());
  }
  toString() {
    return "[object AbortSignal]";
  }
  get [Symbol.toStringTag]() {
    return "AbortSignal";
  }
  removeEventListener(...t) {
    this.eventEmitter.off(...t);
  }
  addEventListener(...t) {
    this.eventEmitter.on(...t);
  }
  dispatchEvent(t) {
    const n = { type: t, target: this }, r = `on${t}`;
    typeof this[r] == "function" && this[r](n), this.eventEmitter.emit(t, n);
  }
}
let Af = class {
  constructor() {
    x(this, "signal", new Rf());
  }
  abort() {
    this.signal.aborted || (this.signal.aborted = !0, this.signal.dispatchEvent("abort"));
  }
  toString() {
    return "[object AbortController]";
  }
  get [Symbol.toStringTag]() {
    return "AbortController";
  }
};
const Of = (e) => {
  var r;
  if (tu() === "cloudflare-worker")
    return [];
  const t = new (globalThis.AbortController || Af)(), n = setTimeout(() => {
    t.abort();
  }, e);
  return (r = n == null ? void 0 : n.unref) == null || r.call(n), [t.signal, n];
}, Pf = async (...e) => {
  if (globalThis.fetch)
    return globalThis.fetch(...e);
  if (typeof EdgeRuntime != "string")
    return (await import("./main-DsWLSrNk.js").then((t) => t.F)).default(...e);
  throw new Error("Invariant: an edge runtime that does not support fetch should not exist");
};
class Si {
  constructor(t) {
    x(this, "_fetch");
    this._fetch = t ?? Pf;
  }
  async makeRequest(t) {
    const [n, r] = Of(t.httpRequestTimeout), i = {
      url: t.url,
      method: t.method,
      headers: t.headers,
      body: t.body,
      signal: n
    };
    return this._fetch(t.url, i).finally(() => clearTimeout(r));
  }
}
class Df extends Tf {
  constructor(n) {
    super();
    x(this, "_eventFactory");
    x(this, "_isClosed", !1);
    x(this, "_pendingEvents", 0);
    x(this, "_closeAndFlushDefaultTimeout");
    x(this, "_publisher");
    x(this, "_isFlushing", !1);
    x(this, "_queue");
    x(this, "ready");
    Ad(n), this._eventFactory = new Ef(), this._queue = new If();
    const r = n.flushInterval ?? 1e4;
    this._closeAndFlushDefaultTimeout = r * 1.25;
    const { plugin: i, publisher: o } = yf({
      writeKey: n.writeKey,
      host: n.host,
      path: n.path,
      maxRetries: n.maxRetries ?? 3,
      flushAt: n.flushAt ?? n.maxEventsInBatch ?? 15,
      httpRequestTimeout: n.httpRequestTimeout,
      disable: n.disable,
      flushInterval: r,
      httpClient: typeof n.httpClient == "function" ? new Si(n.httpClient) : n.httpClient ?? new Si(),
      oauthSettings: n.oauthSettings
    }, this);
    this._publisher = o, this.ready = this.register(i).then(() => {
    }), this.emit("initialize", n), Rd(this);
  }
  get VERSION() {
    return Ka;
  }
  /**
   * Call this method to stop collecting new events and flush all existing events.
   * This method also waits for any event method-specific callbacks to be triggered,
   * and any of their subsequent promises to be resolved/rejected.
   */
  closeAndFlush({ timeout: n = this._closeAndFlushDefaultTimeout } = {}) {
    return this.flush({ timeout: n, close: !0 });
  }
  /**
   * Call this method to flush all existing events..
   * This method also waits for any event method-specific callbacks to be triggered,
   * and any of their subsequent promises to be resolved/rejected.
   */
  async flush({ timeout: n, close: r = !1 } = {}) {
    if (this._isFlushing) {
      console.warn("Overlapping flush calls detected. Please wait for the previous flush to finish before calling .flush again");
      return;
    } else
      this._isFlushing = !0;
    r && (this._isClosed = !0), this._publisher.flush(this._pendingEvents);
    const i = new Promise((o) => {
      this._pendingEvents ? this.once("drained", () => {
        o();
      }) : o();
    }).finally(() => {
      this._isFlushing = !1;
    });
    return n ? qa(i, n).catch(() => {
    }) : i;
  }
  _dispatch(n, r) {
    if (this._isClosed) {
      this.emit("call_after_close", n);
      return;
    }
    this._pendingEvents++, Sf(n, this._queue, this, r).catch((i) => i).finally(() => {
      this._pendingEvents--, this._pendingEvents || this.emit("drained");
    });
  }
  /**
   * Combines two unassociated user identities.
   * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#alias
   */
  alias({ userId: n, previousId: r, context: i, timestamp: o, integrations: s, messageId: a }, l) {
    const c = this._eventFactory.alias(n, r, {
      context: i,
      integrations: s,
      timestamp: o,
      messageId: a
    });
    this._dispatch(c, l);
  }
  /**
   * Associates an identified user with a collective.
   *  @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#group
   */
  group({ timestamp: n, groupId: r, userId: i, anonymousId: o, traits: s = {}, context: a, integrations: l, messageId: c }, u) {
    const f = this._eventFactory.group(r, s, {
      context: a,
      anonymousId: o,
      userId: i,
      timestamp: n,
      integrations: l,
      messageId: c
    });
    this._dispatch(f, u);
  }
  /**
   * Includes a unique userId and (maybe anonymousId) and any optional traits you know about them.
   * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#identify
   */
  identify({ userId: n, anonymousId: r, traits: i = {}, context: o, timestamp: s, integrations: a, messageId: l }, c) {
    const u = this._eventFactory.identify(n, i, {
      context: o,
      anonymousId: r,
      userId: n,
      timestamp: s,
      integrations: a,
      messageId: l
    });
    this._dispatch(u, c);
  }
  /**
   * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
   * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#page
   */
  page({ userId: n, anonymousId: r, category: i, name: o, properties: s, context: a, timestamp: l, integrations: c, messageId: u }, f) {
    const p = this._eventFactory.page(i ?? null, o ?? null, s, { context: a, anonymousId: r, userId: n, timestamp: l, integrations: c, messageId: u });
    this._dispatch(p, f);
  }
  /**
   * Records screen views on your app, along with optional extra information
   * about the screen viewed by the user.
   *
   * TODO: This is not documented on the segment docs ATM (for node).
   */
  screen({ userId: n, anonymousId: r, category: i, name: o, properties: s, context: a, timestamp: l, integrations: c, messageId: u }, f) {
    const p = this._eventFactory.screen(i ?? null, o ?? null, s, { context: a, anonymousId: r, userId: n, timestamp: l, integrations: c, messageId: u });
    this._dispatch(p, f);
  }
  /**
   * Records actions your users perform.
   * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#track
   */
  track({ userId: n, anonymousId: r, event: i, properties: o, context: s, timestamp: a, integrations: l, messageId: c }, u) {
    const f = this._eventFactory.track(i, o, {
      context: s,
      userId: n,
      anonymousId: r,
      timestamp: a,
      integrations: l,
      messageId: c
    });
    this._dispatch(f, u);
  }
  /**
   * Registers one or more plugins to augment Analytics functionality.
   * @param plugins
   */
  register(...n) {
    return this._queue.criticalTasks.run(async () => {
      const r = wi.system(), i = n.map((o) => this._queue.register(r, o, this));
      await Promise.all(i), this.emit("register", n.map((o) => o.name));
    });
  }
  /**
   * Deregisters one or more plugins based on their names.
   * @param pluginNames - The names of one or more plugins to deregister.
   */
  async deregister(...n) {
    const r = wi.system(), i = n.map((o) => {
      const s = this._queue.plugins.find((a) => a.name === o);
      if (s)
        return this._queue.deregister(r, s, this);
      r.log("warn", `plugin ${o} not found`);
    });
    await Promise.all(i), this.emit("deregister", n);
  }
}
const yt = "Electron Main: ";
var Fe = ((e) => (e.AppBootStarted = `${yt}Boot Started`, e.AppWindowShown = `${yt}Window Shown`, e.AppWindowStateChanged = `${yt}Window State Changed`, e.AuthLoginChanged = `${yt}Login Changed`, e.AuthLogout = `${yt}Logout`, e.CompanionWindowShortcutLaunch = `${yt}Companion Window Shortcut Launch`, e.KeyboardShortcutPressed = `${yt}Keyboard Shortcut Pressed`, e))(Fe || {});
const Ti = ur();
class Lf extends Si {
  async makeRequest(t) {
    const n = await super.makeRequest({
      ...t,
      headers: {
        ...t.headers,
        "User-Agent": Ti,
        "oai-client-user-agent": Ti
      }
    });
    return n.status != 200 && ke.recordEvent(Qe.AnalyticsFlushFailure, {
      status_code: n.status,
      status_text: n.statusText
    }), n;
  }
}
function xf() {
  return Ne && process.env.CES_HOST !== void 0 ? {
    host: process.env.CES_HOST,
    path: "/v1/batch"
  } : {
    host: "https://chatgpt.com",
    path: "/ces/v1/batch"
  };
}
const Hr = {
  app_session_id: ac,
  app_version: he.getVersion(),
  environment: Ne ? "development" : "production",
  os_name: Ko.type(),
  os_version: Ko.release(),
  platform_device_id: we.getDeviceID()
}, kf = {
  app_name: "chatgpt-electron",
  userAgent: Ti
};
class Mf {
  constructor() {
    x(this, "segmentAnalytics");
    x(this, "userTraits");
    x(this, "anonymousId");
    x(this, "userId");
    x(this, "webDeviceId");
    const {
      host: t,
      path: n
    } = xf();
    this.userTraits = Hr, this.segmentAnalytics = new Df({
      writeKey: "oai",
      host: t,
      path: n,
      flushInterval: Ne ? 1e3 : 1e4,
      httpClient: new Lf()
    }), this.anonymousId = Se().getState().loggedOutUserId, this.userId = void 0, this.webDeviceId = void 0, this.segmentAnalytics.identify({
      anonymousId: this.anonymousId,
      traits: this.userTraits,
      context: this.getCesEventContext()
    }), Se().subscribe((r) => {
      var i, o;
      if (this.webDeviceId !== r.webDeviceId && (this.webDeviceId = r.webDeviceId), this.userId !== ((i = r.loggedInUser) == null ? void 0 : i.userId)) {
        const s = uc(r.loggedInUser);
        ((o = r.loggedInUser) == null ? void 0 : o.userId) !== void 0 ? (this.userId = r.loggedInUser.userId, this.userTraits = {
          ...Hr,
          ...s
        }, this.segmentAnalytics.identify({
          userId: this.userId,
          traits: this.userTraits,
          context: this.getCesEventContext()
        }), this.track(Fe.AuthLoginChanged)) : (this.userId = void 0, this.anonymousId = r.loggedOutUserId, this.userTraits = Hr, this.segmentAnalytics.identify({
          anonymousId: this.anonymousId,
          traits: this.userTraits,
          context: this.getCesEventContext()
        }), this.track(Fe.AuthLogout));
      }
    });
  }
  getCesEventContext() {
    return {
      ...kf,
      device_id: this.webDeviceId !== void 0 ? this.webDeviceId : we.getDeviceID()
    };
  }
  track(t, n) {
    const r = n !== void 0 ? n : {}, i = this.getCesEventContext(), o = this.userId === void 0 ? {
      anonymousId: this.anonymousId,
      event: t,
      properties: r,
      context: {
        ...i,
        user_traits: this.userTraits
      }
    } : {
      userId: this.userId,
      event: t,
      properties: r,
      context: {
        ...i,
        user_traits: this.userTraits
      }
    };
    this.segmentAnalytics.track(o), ke.recordEvent(Qe.AnalyticsEventReported, {
      analytics_event: t,
      ...r
    });
  }
  async shutdown() {
    await this.segmentAnalytics.closeAndFlush();
  }
}
let qt;
class $e {
  static initialize() {
    qt === void 0 && (qt = new Mf());
  }
  static track(t, n) {
    if (qt === void 0)
      throw new Error("AnalyticsTracker used before initialization");
    qt.track(t, n);
  }
  static async shutdown() {
    if (qt === void 0)
      throw new Error("AnalyticsTracker used before initialization");
    await qt.shutdown();
  }
}
let Ci;
async function Nf(e, t) {
  G.info("Sidetron Shortcuts: registering global shortcuts"), Ci = t;
  const n = await lr(), r = (i) => {
    $e.track(Fe.KeyboardShortcutPressed, {
      shortcut: i,
      action: "showHideCompanionWindow"
    }), e.onShowHideCompanionWindow();
  };
  ou(n.getState().companionWindowShortcut, "companionWindowShortcut", r), n.subscribe((i, o) => {
    G.info("Sidetron Shortcuts: Settings changed, updating global shortcuts"), Hf({
      state: i,
      prevState: o,
      shortcutKey: "companionWindowShortcut",
      onShortcut: r
    });
  }), Ge.subscribe(He.HOTKEY_RECORDING_STATE, (i) => {
    G.info("Sidetron Shortcuts: Hotkey recording state changed", i), i.inProgress ? nu() : Qi();
  });
}
const Uf = 15e3;
function nu() {
  Ff(), setTimeout(Qi, Uf);
}
function Qi() {
  iu();
}
const ru = [
  "Option+Space"
  // On Windows, brings up the "Move" menu
], Ii = /* @__PURE__ */ new Map();
function Ff() {
  G.info("Sidetron Shortcuts: Reserving protected shortcuts"), ru.forEach(jf);
}
function iu() {
  G.info("Sidetron Shortcuts: Releasing shortcut reservations (may see this multiple times)"), ru.forEach(Wf);
}
function jf(e) {
  if (Xt.isRegistered(e)) {
    G.debug(`Sidetron Shortcuts: ${e} already registered - not reserving`);
    return;
  }
  G.debug(`Sidetron Shortcuts: reserving ${e}`), Ii.set(e, !0), Xt.register(e, () => {
    G.info(`Sidetron Shortcuts: Reserved ${e} pressed`), iu(), Bf(e);
  });
}
function Wf(e) {
  if (!Ii.get(e)) {
    G.debug(`Sidetron Shortcuts: ${e} not reserved - skipping release`);
    return;
  }
  Xt.unregister(e), Ii.set(e, !1), G.info(`Sidetron Shortcuts: released reservation on ${e}`);
}
function Bf(e) {
  G.debug(`Sidetron Shortcuts: sending ${e} to web app`);
  const t = e.split("+");
  t.forEach((n) => {
    Ci().sendInputEventToWebApp({
      type: "keyDown",
      keyCode: n
    });
  }), t.forEach((n) => {
    Ci().sendInputEventToWebApp({
      type: "keyUp",
      keyCode: n
    });
  });
}
function Hf({
  state: e,
  prevState: t,
  shortcutKey: n,
  onShortcut: r
}) {
  const i = t[n], o = e[n];
  G.debug(`Sidetron Shortcuts: ${n} changed from ${i} to ${o}`), Qi(), Gf(i, n), ou(o, n, r);
}
function Gf(e, t) {
  if (e === "") {
    G.info(`Sidetron Shortcuts: ${t} is empty, skipping un-registration`);
    return;
  }
  Xt.unregister(e);
}
function ou(e, t, n) {
  if (e === "") {
    G.info(`Sidetron Shortcuts: ${t} is empty, skipping registration`);
    return;
  }
  if (Xt.isRegistered(e)) {
    G.warn(`Sidetron Shortcuts: ${t} already registered: ${e}`);
    return;
  }
  Xt.register(e, () => n(e)) ? G.info(`Sidetron Shortcuts: ${t} registered for ${e}`) : G.warn(`Sidetron Shortcuts: ${t} failed to register for ${e}`);
}
var bt = {}, Et = {}, Gr = {}, $r = {}, ns;
function De() {
  return ns || (ns = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Log = e.LogLevel = void 0;
    const t = " DEBUG ", n = "  INFO ", r = "  WARN ", i = " ERROR ";
    function o(a) {
      return a.unshift("[Statsig]"), a;
    }
    e.LogLevel = {
      None: 0,
      Error: 1,
      Warn: 2,
      Info: 3,
      Debug: 4
    };
    class s {
      static info(...l) {
        s.level >= e.LogLevel.Info && console.info(n, ...o(l));
      }
      static debug(...l) {
        s.level >= e.LogLevel.Debug && console.debug(t, ...o(l));
      }
      static warn(...l) {
        s.level >= e.LogLevel.Warn && console.warn(r, ...o(l));
      }
      static error(...l) {
        s.level >= e.LogLevel.Error && console.error(i, ...o(l));
      }
    }
    e.Log = s, s.level = e.LogLevel.Warn;
  }($r)), $r;
}
var rs;
function ht() {
  return rs || (rs = 1, function(e) {
    var t, n, r;
    Object.defineProperty(e, "__esModule", { value: !0 }), e._getInstance = e._getStatsigGlobalFlag = e._getStatsigGlobal = void 0;
    const i = De(), o = () => {
      try {
        return typeof __STATSIG__ < "u" ? __STATSIG__ : p;
      } catch {
        return p;
      }
    };
    e._getStatsigGlobal = o;
    const s = (g) => (0, e._getStatsigGlobal)()[g];
    e._getStatsigGlobalFlag = s;
    const a = (g) => {
      const m = (0, e._getStatsigGlobal)();
      return g ? m.instances && m.instances[g] : (m.instances && Object.keys(m.instances).length > 1 && i.Log.warn("Call made to Statsig global instance without an SDK key but there is more than one client instance. If you are using mulitple clients, please specify the SDK key."), m.firstInstance);
    };
    e._getInstance = a;
    const l = "__STATSIG__", c = typeof window < "u" ? window : {}, u = typeof tr < "u" ? tr : {}, f = typeof globalThis < "u" ? globalThis : {}, p = (r = (n = (t = c[l]) !== null && t !== void 0 ? t : u[l]) !== null && n !== void 0 ? n : f[l]) !== null && r !== void 0 ? r : {
      instance: e._getInstance
    };
    c[l] = p, u[l] = p, f[l] = p;
  }(Gr)), Gr;
}
var qr = {}, is;
function Ri() {
  return is || (is = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Diagnostics = void 0;
    const t = /* @__PURE__ */ new Map(), n = "start", r = "end", i = "statsig::diagnostics";
    e.Diagnostics = {
      _getMarkers: (c) => t.get(c),
      _markInitOverallStart: (c) => {
        a(c, o({}, n, "overall"));
      },
      _markInitOverallEnd: (c, u, f) => {
        a(c, o({
          success: u,
          error: u ? void 0 : { name: "InitializeError", message: "Failed to initialize" },
          evaluationDetails: f
        }, r, "overall"));
      },
      _markInitNetworkReqStart: (c, u) => {
        a(c, o(u, n, "initialize", "network_request"));
      },
      _markInitNetworkReqEnd: (c, u) => {
        a(c, o(u, r, "initialize", "network_request"));
      },
      _markInitProcessStart: (c) => {
        a(c, o({}, n, "initialize", "process"));
      },
      _markInitProcessEnd: (c, u) => {
        a(c, o(u, r, "initialize", "process"));
      },
      _clearMarkers: (c) => {
        t.delete(c);
      },
      _formatError(c) {
        if (c && typeof c == "object")
          return {
            code: l(c, "code"),
            name: l(c, "name"),
            message: l(c, "message")
          };
      },
      _getDiagnosticsData(c, u, f, p) {
        var g;
        return {
          success: (c == null ? void 0 : c.ok) === !0,
          statusCode: c == null ? void 0 : c.status,
          sdkRegion: (g = c == null ? void 0 : c.headers) === null || g === void 0 ? void 0 : g.get("x-statsig-region"),
          isDelta: f.includes('"is_delta":true') === !0 ? !0 : void 0,
          attempt: u,
          error: e.Diagnostics._formatError(p)
        };
      },
      _enqueueDiagnosticsEvent(c, u, f, p) {
        const g = e.Diagnostics._getMarkers(f);
        if (g == null || g.length <= 0)
          return -1;
        const m = g[g.length - 1].timestamp - g[0].timestamp;
        e.Diagnostics._clearMarkers(f);
        const h = s(c, {
          context: "initialize",
          markers: g.slice(),
          statsigOptions: p
        });
        return u.enqueue(h), m;
      }
    };
    function o(c, u, f, p) {
      return Object.assign({ key: f, action: u, step: p, timestamp: Date.now() }, c);
    }
    function s(c, u) {
      return {
        eventName: i,
        user: c,
        value: null,
        metadata: u,
        time: Date.now()
      };
    }
    function a(c, u) {
      var f;
      const p = (f = t.get(c)) !== null && f !== void 0 ? f : [];
      p.push(u), t.set(c, p);
    }
    function l(c, u) {
      if (u in c)
        return c[u];
    }
  }(qr)), qr;
}
var wt = {}, St = {}, Vr = {}, Tt = {}, os;
function eo() {
  if (os) return Tt;
  os = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt._isTypeMatch = Tt._typeOf = void 0;
  function e(n) {
    return Array.isArray(n) ? "array" : typeof n;
  }
  Tt._typeOf = e;
  function t(n, r) {
    const i = (o) => Array.isArray(o) ? "array" : o === null ? "null" : typeof o;
    return i(n) === i(r);
  }
  return Tt._isTypeMatch = t, Tt;
}
var ss;
function en() {
  return ss || (ss = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e._getSortedObject = e._DJB2Object = e._DJB2 = void 0;
    const t = eo(), n = (o) => {
      let s = 0;
      for (let a = 0; a < o.length; a++) {
        const l = o.charCodeAt(a);
        s = (s << 5) - s + l, s = s & s;
      }
      return String(s >>> 0);
    };
    e._DJB2 = n;
    const r = (o, s) => (0, e._DJB2)(JSON.stringify((0, e._getSortedObject)(o, s)));
    e._DJB2Object = r;
    const i = (o, s) => {
      if (o == null)
        return null;
      const a = Object.keys(o).sort(), l = {};
      return a.forEach((c) => {
        const u = o[c];
        if (s === 0 || (0, t._typeOf)(u) !== "object") {
          l[c] = u;
          return;
        }
        l[c] = (0, e._getSortedObject)(u, s != null ? s - 1 : s);
      }), l;
    };
    e._getSortedObject = i;
  }(Vr)), Vr;
}
var as;
function hr() {
  if (as) return St;
  as = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St._getStorageKey = St._getUserStorageKey = void 0;
  const e = en();
  function t(r, i, o) {
    var s;
    if (o)
      return o(r, i);
    const a = i && i.customIDs ? i.customIDs : {}, l = [
      `uid:${(s = i == null ? void 0 : i.userID) !== null && s !== void 0 ? s : ""}`,
      `cids:${Object.keys(a).sort((c, u) => c.localeCompare(u)).map((c) => `${c}-${a[c]}`).join(",")}`,
      `k:${r}`
    ];
    return (0, e._DJB2)(l.join("|"));
  }
  St._getUserStorageKey = t;
  function n(r, i, o) {
    return i ? t(r, i, o) : (0, e._DJB2)(`k:${r}`);
  }
  return St._getStorageKey = n, St;
}
var zr = {}, us;
function mr() {
  return us || (us = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.NetworkParam = e.NetworkDefault = e.Endpoint = void 0, e.Endpoint = {
      _initialize: "initialize",
      _rgstr: "rgstr",
      _download_config_specs: "download_config_specs"
    }, e.NetworkDefault = {
      [e.Endpoint._rgstr]: "https://prodregistryv2.org/v1",
      [e.Endpoint._initialize]: "https://featureassets.org/v1",
      [e.Endpoint._download_config_specs]: "https://api.statsigcdn.com/v1"
    }, e.NetworkParam = {
      EventCount: "ec",
      SdkKey: "k",
      SdkType: "st",
      SdkVersion: "sv",
      Time: "t",
      SessionID: "sid",
      StatsigEncoded: "se",
      IsGzipped: "gz"
    };
  }(zr)), zr;
}
var Kr = {}, ls;
function Wt() {
  return ls || (ls = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e._getUnloadEvent = e._getCurrentPageUrlSafe = e._addDocumentEventListenerSafe = e._addWindowEventListenerSafe = e._isServerEnv = e._getDocumentSafe = e._getWindowSafe = void 0;
    const t = () => typeof window < "u" ? window : null;
    e._getWindowSafe = t;
    const n = () => {
      var l;
      const c = (0, e._getWindowSafe)();
      return (l = c == null ? void 0 : c.document) !== null && l !== void 0 ? l : null;
    };
    e._getDocumentSafe = n;
    const r = () => {
      if ((0, e._getDocumentSafe)() !== null)
        return !1;
      const l = typeof process < "u" && process.versions != null && process.versions.node != null;
      return typeof EdgeRuntime == "string" || l;
    };
    e._isServerEnv = r;
    const i = (l, c) => {
      const u = (0, e._getWindowSafe)();
      typeof (u == null ? void 0 : u.addEventListener) == "function" && u.addEventListener(l, c);
    };
    e._addWindowEventListenerSafe = i;
    const o = (l, c) => {
      const u = (0, e._getDocumentSafe)();
      typeof (u == null ? void 0 : u.addEventListener) == "function" && u.addEventListener(l, c);
    };
    e._addDocumentEventListenerSafe = o;
    const s = () => {
      var l;
      try {
        return (l = (0, e._getWindowSafe)()) === null || l === void 0 ? void 0 : l.location.href.split(/[?#]/)[0];
      } catch {
        return;
      }
    };
    e._getCurrentPageUrlSafe = s;
    const a = () => {
      const l = (0, e._getWindowSafe)();
      return l && "onpagehide" in l ? "pagehide" : "beforeunload";
    };
    e._getUnloadEvent = a;
  }(Kr)), Kr;
}
var Me = {}, cs;
function su() {
  if (cs) return Me;
  cs = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me._createLayerParameterExposure = Me._createConfigExposure = Me._mapExposures = Me._createGateExposure = Me._isExposureEvent = void 0;
  const e = "statsig::config_exposure", t = "statsig::gate_exposure", n = "statsig::layer_exposure", r = (u, f, p, g, m) => (p.bootstrapMetadata && (g.bootstrapMetadata = p.bootstrapMetadata), {
    eventName: u,
    user: f,
    value: null,
    metadata: c(p, g),
    secondaryExposures: m,
    time: Date.now()
  }), i = ({ eventName: u }) => u === t || u === e || u === n;
  Me._isExposureEvent = i;
  const o = (u, f, p) => {
    var g, m, h;
    const v = {
      gate: f.name,
      gateValue: String(f.value),
      ruleID: f.ruleID
    };
    return ((g = f.__evaluation) === null || g === void 0 ? void 0 : g.version) != null && (v.configVersion = f.__evaluation.version), r(t, u, f.details, v, s((h = (m = f.__evaluation) === null || m === void 0 ? void 0 : m.secondary_exposures) !== null && h !== void 0 ? h : [], p));
  };
  Me._createGateExposure = o;
  function s(u, f) {
    return u.map((p) => typeof p == "string" ? (f ?? {})[p] : p).filter((p) => p != null);
  }
  Me._mapExposures = s;
  const a = (u, f, p) => {
    var g, m, h, v;
    const w = {
      config: f.name,
      ruleID: f.ruleID
    };
    return ((g = f.__evaluation) === null || g === void 0 ? void 0 : g.version) != null && (w.configVersion = f.__evaluation.version), ((m = f.__evaluation) === null || m === void 0 ? void 0 : m.passed) != null && (w.rulePassed = String(f.__evaluation.passed)), r(e, u, f.details, w, s((v = (h = f.__evaluation) === null || h === void 0 ? void 0 : h.secondary_exposures) !== null && v !== void 0 ? v : [], p));
  };
  Me._createConfigExposure = a;
  const l = (u, f, p, g) => {
    var m, h, v, w, E, R, M;
    const b = f.__evaluation, P = ((m = b == null ? void 0 : b.explicit_parameters) === null || m === void 0 ? void 0 : m.includes(p)) === !0;
    let U = "", H = (h = b == null ? void 0 : b.undelegated_secondary_exposures) !== null && h !== void 0 ? h : [];
    P && (U = (v = b.allocated_experiment_name) !== null && v !== void 0 ? v : "", H = (w = b.secondary_exposures) !== null && w !== void 0 ? w : []);
    const Y = (E = f.__evaluation) === null || E === void 0 ? void 0 : E.parameter_rule_ids, ue = {
      config: f.name,
      parameterName: p,
      ruleID: (R = Y == null ? void 0 : Y[p]) !== null && R !== void 0 ? R : f.ruleID,
      allocatedExperiment: U,
      isExplicitParameter: String(P)
    };
    return ((M = f.__evaluation) === null || M === void 0 ? void 0 : M.version) != null && (ue.configVersion = f.__evaluation.version), r(n, u, f.details, ue, s(H, g));
  };
  Me._createLayerParameterExposure = l;
  const c = (u, f) => (f.reason = u.reason, u.lcut && (f.lcut = String(u.lcut)), u.receivedAt && (f.receivedAt = String(u.receivedAt)), f);
  return Me;
}
var Ct = {}, ds;
function pr() {
  return ds || (ds = 1, Object.defineProperty(Ct, "__esModule", { value: !0 }), Ct.LoggingEnabledOption = Ct.LogEventCompressionMode = void 0, Ct.LogEventCompressionMode = {
    /** Do not compress request bodies */
    Disabled: "d",
    /** Compress request bodies unless a network proxy is configured */
    Enabled: "e",
    /** Always compress request bodies, even when a proxy is configured */
    Forced: "f"
  }, Ct.LoggingEnabledOption = {
    disabled: "disabled",
    browserOnly: "browser-only",
    always: "always"
  }), Ct;
}
var Jr = {}, fs;
function pt() {
  return fs || (fs = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e._setObjectInStorage = e._getObjectFromStorage = e.Storage = void 0;
    const t = De(), n = Wt(), r = {}, i = {
      isReady: () => !0,
      isReadyResolver: () => null,
      getProviderName: () => "InMemory",
      getItem: (f) => r[f] ? r[f] : null,
      setItem: (f, p) => {
        r[f] = p;
      },
      removeItem: (f) => {
        delete r[f];
      },
      getAllKeys: () => Object.keys(r)
    };
    let o = null;
    try {
      const f = (0, n._getWindowSafe)();
      f && f.localStorage && typeof f.localStorage.getItem == "function" && (o = {
        isReady: () => !0,
        isReadyResolver: () => null,
        getProviderName: () => "LocalStorage",
        getItem: (p) => f.localStorage.getItem(p),
        setItem: (p, g) => f.localStorage.setItem(p, g),
        removeItem: (p) => f.localStorage.removeItem(p),
        getAllKeys: () => Object.keys(f.localStorage)
      });
    } catch {
      t.Log.warn("Failed to setup localStorageProvider.");
    }
    let s = o ?? i, a = s;
    function l(f) {
      try {
        return f();
      } catch (p) {
        if (p instanceof Error && p.name === "SecurityError")
          return e.Storage._setProvider(i), null;
        if (p instanceof Error && p.name === "QuotaExceededError") {
          const m = e.Storage.getAllKeys().filter((h) => h.startsWith("statsig."));
          p.message = `${p.message}. Statsig Keys: ${m.length}`;
        }
        throw p;
      }
    }
    e.Storage = {
      isReady: () => a.isReady(),
      isReadyResolver: () => a.isReadyResolver(),
      getProviderName: () => a.getProviderName(),
      getItem: (f) => l(() => a.getItem(f)),
      setItem: (f, p) => l(() => a.setItem(f, p)),
      removeItem: (f) => a.removeItem(f),
      getAllKeys: () => a.getAllKeys(),
      // StorageProviderManagment
      _setProvider: (f) => {
        s = f, a = f;
      },
      _setDisabled: (f) => {
        f ? a = i : a = s;
      }
    };
    function c(f) {
      const p = e.Storage.getItem(f);
      return JSON.parse(p ?? "null");
    }
    e._getObjectFromStorage = c;
    function u(f, p) {
      e.Storage.setItem(f, JSON.stringify(p));
    }
    e._setObjectInStorage = u;
  }(Jr)), Jr;
}
var ln = {}, hs;
function au() {
  if (hs) return ln;
  hs = 1, Object.defineProperty(ln, "__esModule", { value: !0 }), ln.UrlConfiguration = void 0;
  const e = en(), t = mr(), n = {
    [t.Endpoint._initialize]: "i",
    [t.Endpoint._rgstr]: "e",
    [t.Endpoint._download_config_specs]: "d"
  };
  let r = class {
    constructor(o, s, a, l) {
      this.customUrl = null, this.fallbackUrls = null, this.endpoint = o, this.endpointDnsKey = n[o], s && (this.customUrl = s), !s && a && (this.customUrl = a.endsWith("/") ? `${a}${o}` : `${a}/${o}`), l && (this.fallbackUrls = l);
      const c = t.NetworkDefault[o];
      this.defaultUrl = `${c}/${o}`;
    }
    getUrl() {
      var o;
      return (o = this.customUrl) !== null && o !== void 0 ? o : this.defaultUrl;
    }
    getChecksum() {
      var o;
      const s = ((o = this.fallbackUrls) !== null && o !== void 0 ? o : []).sort().join(",");
      return (0, e._DJB2)(this.customUrl + s);
    }
  };
  return ln.UrlConfiguration = r, ln;
}
var Xr = {}, ms;
function to() {
  return ms || (ms = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e._notifyVisibilityChanged = e._subscribeToVisiblityChanged = e._isUnloading = e._isCurrentlyVisible = void 0;
    const t = Wt(), n = "foreground", r = "background", i = [];
    let o = n, s = !1;
    const a = () => o === n;
    e._isCurrentlyVisible = a;
    const l = () => s;
    e._isUnloading = l;
    const c = (f) => {
      i.unshift(f);
    };
    e._subscribeToVisiblityChanged = c;
    const u = (f) => {
      f !== o && (o = f, i.forEach((p) => p(f)));
    };
    e._notifyVisibilityChanged = u, (0, t._addWindowEventListenerSafe)("focus", () => {
      s = !1, (0, e._notifyVisibilityChanged)(n);
    }), (0, t._addWindowEventListenerSafe)("blur", () => (0, e._notifyVisibilityChanged)(r)), (0, t._addDocumentEventListenerSafe)("visibilitychange", () => {
      (0, e._notifyVisibilityChanged)(document.visibilityState === "visible" ? n : r);
    }), (0, t._addWindowEventListenerSafe)((0, t._getUnloadEvent)(), () => {
      s = !0, (0, e._notifyVisibilityChanged)(r);
    });
  }(Xr)), Xr;
}
var ps;
function uu() {
  if (ps) return wt;
  ps = 1;
  var e = wt && wt.__awaiter || function(M, b, P, U) {
    function H(Y) {
      return Y instanceof P ? Y : new P(function(ue) {
        ue(Y);
      });
    }
    return new (P || (P = Promise))(function(Y, ue) {
      function de(ve) {
        try {
          ye(U.next(ve));
        } catch (V) {
          ue(V);
        }
      }
      function Ce(ve) {
        try {
          ye(U.throw(ve));
        } catch (V) {
          ue(V);
        }
      }
      function ye(ve) {
        ve.done ? Y(ve.value) : H(ve.value).then(de, Ce);
      }
      ye((U = U.apply(M, b || [])).next());
    });
  };
  Object.defineProperty(wt, "__esModule", { value: !0 }), wt.EventLogger = void 0;
  const t = hr(), n = en(), r = De(), i = mr(), o = Wt(), s = su(), a = pr(), l = pt(), c = au(), u = to(), f = 100, p = 1e4, g = 1e3, m = 6e5, h = 500, v = 200, w = {}, E = {
    Startup: "startup",
    GainedFocus: "gained_focus"
  };
  let R = class Kt {
    static _safeFlushAndForget(b) {
      var P;
      (P = w[b]) === null || P === void 0 || P.flush().catch(() => {
      });
    }
    static _safeRetryFailedLogs(b) {
      var P;
      (P = w[b]) === null || P === void 0 || P._retryFailedLogs(E.GainedFocus);
    }
    constructor(b, P, U, H) {
      var Y, ue;
      this._sdkKey = b, this._emitter = P, this._network = U, this._options = H, this._queue = [], this._lastExposureTimeMap = {}, this._nonExposedChecks = {}, this._hasRunQuickFlush = !1, this._creationTime = Date.now(), this._loggingEnabled = (Y = H == null ? void 0 : H.loggingEnabled) !== null && Y !== void 0 ? Y : (H == null ? void 0 : H.disableLogging) === !0 ? a.LoggingEnabledOption.disabled : a.LoggingEnabledOption.browserOnly, H != null && H.loggingEnabled && H.disableLogging !== void 0 && r.Log.warn("Detected both loggingEnabled and disableLogging options. loggingEnabled takes precedence - please remove disableLogging."), this._maxQueueSize = (ue = H == null ? void 0 : H.loggingBufferMaxSize) !== null && ue !== void 0 ? ue : f;
      const de = H == null ? void 0 : H.networkConfig;
      this._logEventUrlConfig = new c.UrlConfiguration(i.Endpoint._rgstr, de == null ? void 0 : de.logEventUrl, de == null ? void 0 : de.api, de == null ? void 0 : de.logEventFallbackUrls);
    }
    setLogEventCompressionMode(b) {
      this._network.setLogEventCompressionMode(b);
    }
    setLoggingEnabled(b) {
      if (this._loggingEnabled === "disabled" && b !== "disabled") {
        const P = this._getStorageKey(), U = (0, l._getObjectFromStorage)(P);
        U && this._queue.push(...U), l.Storage.removeItem(P);
      }
      this._loggingEnabled = b;
    }
    enqueue(b) {
      this._shouldLogEvent(b) && (this._normalizeAndAppendEvent(b), this._quickFlushIfNeeded(), this._queue.length > this._maxQueueSize && Kt._safeFlushAndForget(this._sdkKey));
    }
    incrementNonExposureCount(b) {
      var P;
      const U = (P = this._nonExposedChecks[b]) !== null && P !== void 0 ? P : 0;
      this._nonExposedChecks[b] = U + 1;
    }
    reset() {
      this.flush().catch(() => {
      }), this._lastExposureTimeMap = {};
    }
    start() {
      var b;
      const P = (0, o._isServerEnv)();
      P && ((b = this._options) === null || b === void 0 ? void 0 : b.loggingEnabled) !== "always" || (w[this._sdkKey] = this, P || (0, u._subscribeToVisiblityChanged)((U) => {
        U === "background" ? Kt._safeFlushAndForget(this._sdkKey) : U === "foreground" && Kt._safeRetryFailedLogs(this._sdkKey);
      }), this._retryFailedLogs(E.Startup), this._startBackgroundFlushInterval());
    }
    stop() {
      return e(this, void 0, void 0, function* () {
        this._flushIntervalId && (clearInterval(this._flushIntervalId), this._flushIntervalId = null), delete w[this._sdkKey], yield this.flush();
      });
    }
    flush() {
      return e(this, void 0, void 0, function* () {
        if (this._appendAndResetNonExposedChecks(), this._queue.length === 0)
          return;
        const b = this._queue;
        this._queue = [], yield this._sendEvents(b);
      });
    }
    /**
     * We 'Quick Flush' following the very first event enqueued
     * within the quick flush window
     */
    _quickFlushIfNeeded() {
      this._hasRunQuickFlush || (this._hasRunQuickFlush = !0, !(Date.now() - this._creationTime > v) && setTimeout(() => Kt._safeFlushAndForget(this._sdkKey), v));
    }
    _shouldLogEvent(b) {
      var P;
      if (((P = this._options) === null || P === void 0 ? void 0 : P.loggingEnabled) !== "always" && (0, o._isServerEnv)())
        return !1;
      if (!(0, s._isExposureEvent)(b))
        return !0;
      const U = b.user ? b.user : { statsigEnvironment: void 0 }, H = (0, t._getUserStorageKey)(this._sdkKey, U), Y = b.metadata ? b.metadata : {}, ue = [
        b.eventName,
        H,
        Y.gate,
        Y.config,
        Y.ruleID,
        Y.allocatedExperiment,
        Y.parameterName,
        String(Y.isExplicitParameter),
        Y.reason
      ].join("|"), de = this._lastExposureTimeMap[ue], Ce = Date.now();
      return de && Ce - de < m ? !1 : (Object.keys(this._lastExposureTimeMap).length > g && (this._lastExposureTimeMap = {}), this._lastExposureTimeMap[ue] = Ce, !0);
    }
    _sendEvents(b) {
      return e(this, void 0, void 0, function* () {
        var P, U;
        if (this._loggingEnabled === "disabled")
          return this._saveFailedLogsToStorage(b), !1;
        try {
          const Y = (0, u._isUnloading)() && this._network.isBeaconSupported() && ((U = (P = this._options) === null || P === void 0 ? void 0 : P.networkConfig) === null || U === void 0 ? void 0 : U.networkOverrideFunc) == null;
          return this._emitter({
            name: "pre_logs_flushed",
            events: b
          }), (Y ? this._sendEventsViaBeacon(b) : yield this._sendEventsViaPost(b)).success ? (this._emitter({
            name: "logs_flushed",
            events: b
          }), !0) : (r.Log.warn("Failed to flush events."), this._saveFailedLogsToStorage(b), !1);
        } catch {
          return r.Log.warn("Failed to flush events."), !1;
        }
      });
    }
    _sendEventsViaPost(b) {
      return e(this, void 0, void 0, function* () {
        var P;
        const U = yield this._network.post(this._getRequestData(b)), H = (P = U == null ? void 0 : U.code) !== null && P !== void 0 ? P : -1;
        return { success: H >= 200 && H < 300 };
      });
    }
    _sendEventsViaBeacon(b) {
      return {
        success: this._network.beacon(this._getRequestData(b))
      };
    }
    _getRequestData(b) {
      return {
        sdkKey: this._sdkKey,
        data: {
          events: b
        },
        urlConfig: this._logEventUrlConfig,
        retries: 3,
        isCompressable: !0,
        params: {
          [i.NetworkParam.EventCount]: String(b.length)
        },
        credentials: "same-origin"
      };
    }
    _saveFailedLogsToStorage(b) {
      for (; b.length > h; )
        b.shift();
      const P = this._getStorageKey();
      try {
        const U = this._getFailedLogsFromStorage(P);
        (0, l._setObjectInStorage)(P, [...U, ...b]);
      } catch {
        r.Log.warn("Unable to save failed logs to storage");
      }
    }
    _getFailedLogsFromStorage(b) {
      let P = [];
      try {
        const U = (0, l._getObjectFromStorage)(b);
        return Array.isArray(U) && (P = U), P;
      } catch {
        return [];
      }
    }
    _retryFailedLogs(b) {
      const P = this._getStorageKey();
      e(this, void 0, void 0, function* () {
        l.Storage.isReady() || (yield l.Storage.isReadyResolver());
        const U = (0, l._getObjectFromStorage)(P);
        if (!U)
          return;
        b === E.Startup && l.Storage.removeItem(P), (yield this._sendEvents(U)) && b === E.GainedFocus && l.Storage.removeItem(P);
      }).catch(() => {
        r.Log.warn("Failed to flush stored logs");
      });
    }
    _getStorageKey() {
      return `statsig.failed_logs.${(0, n._DJB2)(this._sdkKey)}`;
    }
    _normalizeAndAppendEvent(b) {
      b.user && (b.user = Object.assign({}, b.user), delete b.user.privateAttributes);
      const P = {}, U = this._getCurrentPageUrl();
      U && (P.statsigMetadata = { currentPage: U });
      const H = Object.assign(Object.assign({}, b), P);
      r.Log.debug("Enqueued Event:", H), this._queue.push(H);
    }
    _appendAndResetNonExposedChecks() {
      Object.keys(this._nonExposedChecks).length !== 0 && (this._normalizeAndAppendEvent({
        eventName: "statsig::non_exposed_checks",
        user: null,
        time: Date.now(),
        metadata: {
          checks: Object.assign({}, this._nonExposedChecks)
        }
      }), this._nonExposedChecks = {});
    }
    _getCurrentPageUrl() {
      var b;
      if (((b = this._options) === null || b === void 0 ? void 0 : b.includeCurrentPageUrlWithEvents) !== !1)
        return (0, o._getCurrentPageUrlSafe)();
    }
    _startBackgroundFlushInterval() {
      var b, P;
      const U = (P = (b = this._options) === null || b === void 0 ? void 0 : b.loggingIntervalMs) !== null && P !== void 0 ? P : p, H = setInterval(() => {
        const Y = w[this._sdkKey];
        !Y || Y._flushIntervalId !== H ? clearInterval(H) : Kt._safeFlushAndForget(this._sdkKey);
      }, U);
      this._flushIntervalId = H;
    }
  };
  return wt.EventLogger = R, wt;
}
var Yr = {}, gs;
function ir() {
  return gs || (gs = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.StatsigMetadataProvider = e.SDK_VERSION = void 0, e.SDK_VERSION = "3.25.3";
    let t = {
      sdkVersion: e.SDK_VERSION,
      sdkType: "js-mono"
      // js-mono is overwritten by Precomp and OnDevice clients
    };
    e.StatsigMetadataProvider = {
      get: () => t,
      add: (n) => {
        t = Object.assign(Object.assign({}, t), n);
      }
    };
  }(Yr)), Yr;
}
var Zr = {}, _s;
function $f() {
  return _s || (_s = 1, Object.defineProperty(Zr, "__esModule", { value: !0 })), Zr;
}
var ot = {}, It = {}, cn = {}, vs;
function no() {
  if (vs) return cn;
  vs = 1, Object.defineProperty(cn, "__esModule", { value: !0 }), cn.getUUID = void 0;
  function e() {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
    let t = (/* @__PURE__ */ new Date()).getTime(), n = typeof performance < "u" && performance.now && performance.now() * 1e3 || 0;
    return `xxxxxxxx-xxxx-4xxx-${"89ab"[Math.floor(Math.random() * 4)]}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (i) => {
      let o = Math.random() * 16;
      return t > 0 ? (o = (t + o) % 16 | 0, t = Math.floor(t / 16)) : (o = (n + o) % 16 | 0, n = Math.floor(n / 16)), (i === "x" ? o : o & 7 | 8).toString(16);
    });
  }
  return cn.getUUID = e, cn;
}
var ys;
function gr() {
  if (ys) return It;
  ys = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.getCookieName = It.StableID = void 0;
  const e = hr(), t = De(), n = Wt(), r = pt(), i = no(), o = {}, s = {}, a = {};
  It.StableID = {
    cookiesEnabled: !1,
    randomID: Math.random().toString(36),
    get: (m) => {
      if (a[m])
        return null;
      if (o[m] != null)
        return o[m];
      let h = null;
      return h = f(m), h != null ? (o[m] = h, c(h, m), h) : (h = u(m), h == null && (h = (0, i.getUUID)()), c(h, m), p(h, m), o[m] = h, h);
    },
    setOverride: (m, h) => {
      o[h] = m, c(m, h), p(m, h);
    },
    _setCookiesEnabled: (m, h) => {
      s[m] = h;
    },
    _setDisabled: (m, h) => {
      a[m] = h;
    }
  };
  function l(m) {
    return `statsig.stable_id.${(0, e._getStorageKey)(m)}`;
  }
  function c(m, h) {
    const v = l(h);
    try {
      (0, r._setObjectInStorage)(v, m);
    } catch {
      t.Log.warn("Failed to save StableID to storage");
    }
  }
  function u(m) {
    const h = l(m);
    return (0, r._getObjectFromStorage)(h);
  }
  function f(m) {
    if (!s[m] || (0, n._getDocumentSafe)() == null)
      return null;
    const h = document.cookie.split(";");
    for (const v of h) {
      const [w, E] = v.trim().split("=");
      if (w === g(m))
        return decodeURIComponent(E);
    }
    return null;
  }
  function p(m, h) {
    if (!s[h] || (0, n._getDocumentSafe)() == null)
      return;
    const v = /* @__PURE__ */ new Date();
    v.setFullYear(v.getFullYear() + 1), document.cookie = `${g(h)}=${encodeURIComponent(m)}; expires=${v.toUTCString()}; path=/`;
  }
  function g(m) {
    return `statsig.stable_id.${(0, e._getStorageKey)(m)}`;
  }
  return It.getCookieName = g, It;
}
var Rt = {}, bs;
function lu() {
  if (bs) return Rt;
  bs = 1, Object.defineProperty(Rt, "__esModule", { value: !0 }), Rt._getFullUserHash = Rt._normalizeUser = void 0;
  const e = en(), t = De();
  function n(i, o, s) {
    try {
      const a = JSON.parse(JSON.stringify(i));
      return o != null && o.environment != null ? a.statsigEnvironment = o.environment : s != null && (a.statsigEnvironment = { tier: s }), a;
    } catch {
      return t.Log.error("Failed to JSON.stringify user"), { statsigEnvironment: void 0 };
    }
  }
  Rt._normalizeUser = n;
  function r(i) {
    return i ? (0, e._DJB2Object)(i) : null;
  }
  return Rt._getFullUserHash = r, Rt;
}
var dn = {}, Es;
function cu() {
  if (Es) return dn;
  Es = 1, Object.defineProperty(dn, "__esModule", { value: !0 }), dn._typedJsonParse = void 0;
  const e = De();
  function t(n, r, i) {
    try {
      const o = JSON.parse(n);
      if (o && typeof o == "object" && r in o)
        return o;
    } catch {
    }
    return e.Log.error(`Failed to parse ${i}`), null;
  }
  return dn._typedJsonParse = t, dn;
}
var ws;
function qf() {
  if (ws) return ot;
  ws = 1;
  var e = ot && ot.__awaiter || function(p, g, m, h) {
    function v(w) {
      return w instanceof m ? w : new m(function(E) {
        E(w);
      });
    }
    return new (m || (m = Promise))(function(w, E) {
      function R(P) {
        try {
          b(h.next(P));
        } catch (U) {
          E(U);
        }
      }
      function M(P) {
        try {
          b(h.throw(P));
        } catch (U) {
          E(U);
        }
      }
      function b(P) {
        P.done ? w(P.value) : v(P.value).then(R, M);
      }
      b((h = h.apply(p, g || [])).next());
    });
  };
  Object.defineProperty(ot, "__esModule", { value: !0 }), ot._makeDataAdapterResult = ot.DataAdapterCore = void 0;
  const t = De(), n = gr(), r = lu(), i = pt(), o = cu(), s = 10, a = 8;
  let l = class {
    constructor(g, m) {
      this._adapterName = g, this._cacheSuffix = m, this._options = null, this._sdkKey = null, this._cacheLimit = s, this._lastModifiedStoreKey = `statsig.last_modified_time.${m}`, this._inMemoryCache = new u();
    }
    attach(g, m, h) {
      this._sdkKey = g, this._options = m;
    }
    getDataSync(g) {
      const m = g && (0, r._normalizeUser)(g, this._options), h = this._getCacheKey(m), v = this._inMemoryCache.get(h, m);
      if (v && this._getIsCacheValueValid(v))
        return v;
      const w = this._loadFromCache(h);
      return w && this._getIsCacheValueValid(w) ? (this._inMemoryCache.add(h, w, this._cacheLimit), this._inMemoryCache.get(h, m)) : null;
    }
    setData(g, m) {
      const h = m && (0, r._normalizeUser)(m, this._options), v = this._getCacheKey(h);
      this._inMemoryCache.add(v, c("Bootstrap", g, null, h), this._cacheLimit);
    }
    _getIsCacheValueValid(g) {
      return g.stableID == null || g.stableID === n.StableID.get(this._getSdkKey());
    }
    _getDataAsyncImpl(g, m, h) {
      return e(this, void 0, void 0, function* () {
        i.Storage.isReady() || (yield i.Storage.isReadyResolver());
        const v = g ?? this.getDataSync(m), w = [this._fetchAndPrepFromNetwork(v, m, h)];
        return h != null && h.timeoutMs && w.push(new Promise((E) => setTimeout(E, h.timeoutMs)).then(() => (t.Log.debug("Fetching latest value timed out"), null))), yield Promise.race(w);
      });
    }
    _prefetchDataImpl(g, m) {
      return e(this, void 0, void 0, function* () {
        const h = g && (0, r._normalizeUser)(g, this._options), v = this._getCacheKey(h), w = yield this._getDataAsyncImpl(null, h, m);
        w && this._inMemoryCache.add(v, Object.assign(Object.assign({}, w), { source: "Prefetch" }), this._cacheLimit);
      });
    }
    _fetchAndPrepFromNetwork(g, m, h) {
      return e(this, void 0, void 0, function* () {
        var v;
        const w = (v = g == null ? void 0 : g.data) !== null && v !== void 0 ? v : null, E = g != null && this._isCachedResultValidFor204(g, m), R = yield this._fetchFromNetwork(w, m, h, E);
        if (!R)
          return t.Log.debug("No response returned for latest value"), null;
        const M = (0, o._typedJsonParse)(R, "has_updates", "Response"), b = this._getSdkKey(), P = n.StableID.get(b);
        let U = null;
        if ((M == null ? void 0 : M.has_updates) === !0)
          U = c("Network", R, P, m);
        else if (w && (M == null ? void 0 : M.has_updates) === !1)
          U = c("NetworkNotModified", w, P, m);
        else
          return null;
        const H = this._getCacheKey(m);
        return this._inMemoryCache.add(H, U, this._cacheLimit), this._writeToCache(H, U), U;
      });
    }
    _getSdkKey() {
      return this._sdkKey != null ? this._sdkKey : (t.Log.error(`${this._adapterName} is not attached to a Client`), "");
    }
    _loadFromCache(g) {
      var m;
      const h = (m = i.Storage.getItem) === null || m === void 0 ? void 0 : m.call(i.Storage, g);
      if (h == null)
        return null;
      const v = (0, o._typedJsonParse)(h, "source", "Cached Result");
      return v ? Object.assign(Object.assign({}, v), { source: "Cache" }) : null;
    }
    _writeToCache(g, m) {
      const h = JSON.stringify(m);
      for (let v = 0; v < a; v++)
        try {
          i.Storage.setItem(g, h);
          break;
        } catch (w) {
          if (!(w instanceof Error) || w.name !== "QuotaExceededError" || this._cacheLimit <= 1)
            throw w;
          this._cacheLimit = Math.ceil(this._cacheLimit / 2), this._runLocalStorageCacheEviction(g, this._cacheLimit - 1);
        }
      this._runLocalStorageCacheEviction(g);
    }
    _runLocalStorageCacheEviction(g, m = this._cacheLimit) {
      var h;
      const v = (h = (0, i._getObjectFromStorage)(this._lastModifiedStoreKey)) !== null && h !== void 0 ? h : {};
      v[g] = Date.now();
      const w = f(v, m);
      for (const E of w)
        delete v[E], i.Storage.removeItem(E);
      (0, i._setObjectInStorage)(this._lastModifiedStoreKey, v);
    }
  };
  ot.DataAdapterCore = l;
  function c(p, g, m, h) {
    return {
      source: p,
      data: g,
      receivedAt: Date.now(),
      stableID: m,
      fullUserHash: (0, r._getFullUserHash)(h)
    };
  }
  ot._makeDataAdapterResult = c;
  class u {
    constructor() {
      this._data = {};
    }
    get(g, m) {
      var h;
      const v = this._data[g], w = v == null ? void 0 : v.stableID, E = (h = m == null ? void 0 : m.customIDs) === null || h === void 0 ? void 0 : h.stableID;
      return E && w && E !== w ? (t.Log.warn("'StatsigUser.customIDs.stableID' mismatch"), null) : v;
    }
    add(g, m, h) {
      const v = f(this._data, h - 1);
      for (const w of v)
        delete this._data[w];
      this._data[g] = m;
    }
    merge(g) {
      this._data = Object.assign(Object.assign({}, this._data), g);
    }
  }
  function f(p, g) {
    const m = Object.keys(p);
    return m.length <= g ? [] : g === 0 ? m : m.sort((h, v) => {
      const w = p[h], E = p[v];
      return typeof w == "object" && typeof E == "object" ? w.receivedAt - E.receivedAt : w - E;
    }).slice(0, m.length - g);
  }
  return ot;
}
var Qr = {}, Ss;
function Vf() {
  return Ss || (Ss = 1, Object.defineProperty(Qr, "__esModule", { value: !0 })), Qr;
}
var fn = {}, hn = {}, Ts;
function ro() {
  if (Ts) return hn;
  Ts = 1, Object.defineProperty(hn, "__esModule", { value: !0 }), hn.SDKType = void 0;
  const e = {};
  let t;
  return hn.SDKType = {
    _get: (n) => {
      var r;
      return ((r = e[n]) !== null && r !== void 0 ? r : "js-mono") + (t ?? "");
    },
    _setClientType(n, r) {
      e[n] = r;
    },
    _setBindingType(n) {
      (!t || t === "-react") && (t = "-" + n);
    }
  }, hn;
}
var Cs;
function du() {
  return Cs || (Cs = 1, function(e) {
    var t = fn && fn.__awaiter || function(f, p, g, m) {
      function h(v) {
        return v instanceof g ? v : new g(function(w) {
          w(v);
        });
      }
      return new (g || (g = Promise))(function(v, w) {
        function E(b) {
          try {
            M(m.next(b));
          } catch (P) {
            w(P);
          }
        }
        function R(b) {
          try {
            M(m.throw(b));
          } catch (P) {
            w(P);
          }
        }
        function M(b) {
          b.done ? v(b.value) : h(b.value).then(E, R);
        }
        M((m = m.apply(f, p || [])).next());
      });
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ErrorBoundary = e.EXCEPTION_ENDPOINT = void 0;
    const n = De(), r = ro(), i = ir();
    e.EXCEPTION_ENDPOINT = "https://statsigapi.net/v1/sdk_exception";
    const o = "[Statsig] UnknownError";
    let s = class {
      constructor(p, g, m, h) {
        this._sdkKey = p, this._options = g, this._emitter = m, this._lastSeenError = h, this._seen = /* @__PURE__ */ new Set();
      }
      wrap(p, g) {
        try {
          const m = p;
          c(m).forEach((h) => {
            const v = m[h];
            "$EB" in v || (m[h] = (...w) => this._capture(g ? `${g}:${h}` : h, () => v.apply(p, w)), m[h].$EB = !0);
          });
        } catch (m) {
          this._onError("eb:wrap", m);
        }
      }
      logError(p, g) {
        this._onError(p, g);
      }
      getLastSeenErrorAndReset() {
        const p = this._lastSeenError;
        return this._lastSeenError = void 0, p ?? null;
      }
      attachErrorIfNoneExists(p) {
        this._lastSeenError || (this._lastSeenError = a(p));
      }
      _capture(p, g) {
        try {
          const m = g();
          return m && m instanceof Promise ? m.catch((h) => this._onError(p, h)) : m;
        } catch (m) {
          return this._onError(p, m), null;
        }
      }
      _onError(p, g) {
        try {
          n.Log.warn(`Caught error in ${p}`, { error: g }), t(this, void 0, void 0, function* () {
            var h, v, w, E, R, M, b;
            const P = g || Error(o), U = P instanceof Error, H = U ? P.name : "No Name", Y = a(P);
            if (this._lastSeenError = Y, this._seen.has(H))
              return;
            if (this._seen.add(H), !((v = (h = this._options) === null || h === void 0 ? void 0 : h.networkConfig) === null || v === void 0) && v.preventAllNetworkTraffic) {
              (w = this._emitter) === null || w === void 0 || w.call(this, {
                name: "error",
                error: g,
                tag: p
              });
              return;
            }
            const ue = r.SDKType._get(this._sdkKey), de = i.StatsigMetadataProvider.get(), Ce = U ? P.stack : l(P), ye = Object.assign({ tag: p, exception: H, info: Ce, statsigOptions: u(this._options) }, Object.assign(Object.assign({}, de), { sdkType: ue }));
            yield ((M = (R = (E = this._options) === null || E === void 0 ? void 0 : E.networkConfig) === null || R === void 0 ? void 0 : R.networkOverrideFunc) !== null && M !== void 0 ? M : fetch)(e.EXCEPTION_ENDPOINT, {
              method: "POST",
              headers: {
                "STATSIG-API-KEY": this._sdkKey,
                "STATSIG-SDK-TYPE": String(ue),
                "STATSIG-SDK-VERSION": String(de.sdkVersion),
                "Content-Type": "application/json"
              },
              body: JSON.stringify(ye)
            }), (b = this._emitter) === null || b === void 0 || b.call(this, {
              name: "error",
              error: g,
              tag: p
            });
          }).then(() => {
          }).catch(() => {
          });
        } catch {
        }
      }
    };
    e.ErrorBoundary = s;
    function a(f) {
      return f instanceof Error ? f : typeof f == "string" ? new Error(f) : new Error("An unknown error occurred.");
    }
    function l(f) {
      try {
        return JSON.stringify(f);
      } catch {
        return o;
      }
    }
    function c(f) {
      const p = /* @__PURE__ */ new Set();
      let g = Object.getPrototypeOf(f);
      for (; g && g !== Object.prototype; )
        Object.getOwnPropertyNames(g).filter((m) => typeof (g == null ? void 0 : g[m]) == "function").forEach((m) => p.add(m)), g = Object.getPrototypeOf(g);
      return Array.from(p);
    }
    function u(f) {
      if (!f)
        return {};
      const p = {};
      return Object.keys(f).forEach((g) => {
        const m = g, h = f[m];
        switch (typeof h) {
          case "number":
          case "bigint":
          case "boolean":
            p[String(m)] = h;
            break;
          case "string":
            h.length < 50 ? p[String(m)] = h : p[String(m)] = "set";
            break;
          case "object":
            m === "environment" ? p.environment = h : m === "networkConfig" ? p.networkConfig = h : p[String(m)] = h != null ? "set" : "unset";
            break;
        }
      }), p;
    }
  }(fn)), fn;
}
var ei = {}, Is;
function zf() {
  return Is || (Is = 1, Object.defineProperty(ei, "__esModule", { value: !0 })), ei;
}
var ti = {}, Rs;
function Kf() {
  return Rs || (Rs = 1, Object.defineProperty(ti, "__esModule", { value: !0 })), ti;
}
var ni = {}, As;
function Jf() {
  return As || (As = 1, Object.defineProperty(ni, "__esModule", { value: !0 })), ni;
}
var At = {}, Os;
function fu() {
  if (Os) return At;
  Os = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.createMemoKey = At.MemoPrefix = void 0, At.MemoPrefix = {
    _gate: "g",
    _dynamicConfig: "c",
    _experiment: "e",
    _configList: "cl",
    _layer: "l",
    _paramStore: "p"
  };
  const e = /* @__PURE__ */ new Set([
    // Add keys that should be memoized based only on their existence, not their value
  ]), t = /* @__PURE__ */ new Set([
    // Add keys that if exist, should not be memoized
    "userPersistedValues"
  ]);
  function n(r, i, o) {
    let s = `${r}|${i}`;
    if (!o)
      return s;
    for (const a of Object.keys(o)) {
      if (t.has(a))
        return;
      e.has(a) ? s += `|${a}=true` : s += `|${a}=${o[a]}`;
    }
    return s;
  }
  return At.createMemoKey = n, At;
}
var Ot = {}, st = {}, Pt = {}, Ps;
function Xf() {
  if (Ps) return Pt;
  Ps = 1;
  var e = Pt && Pt.__awaiter || function(a, l, c, u) {
    function f(p) {
      return p instanceof c ? p : new c(function(g) {
        g(p);
      });
    }
    return new (c || (c = Promise))(function(p, g) {
      function m(w) {
        try {
          v(u.next(w));
        } catch (E) {
          g(E);
        }
      }
      function h(w) {
        try {
          v(u.throw(w));
        } catch (E) {
          g(E);
        }
      }
      function v(w) {
        w.done ? p(w.value) : f(w.value).then(m, h);
      }
      v((u = u.apply(a, l || [])).next());
    });
  };
  Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt._fetchTxtRecords = void 0;
  const t = new Uint8Array([
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    13,
    102,
    101,
    97,
    116,
    117,
    114,
    101,
    97,
    115,
    115,
    101,
    116,
    115,
    3,
    111,
    114,
    103,
    0,
    0,
    16,
    0,
    1
  ]), n = "https://cloudflare-dns.com/dns-query", r = [
    "i",
    // initialize
    "e",
    // events
    "d"
    // dcs
  ], i = 200;
  function o(a) {
    return e(this, void 0, void 0, function* () {
      const l = yield a(n, {
        method: "POST",
        headers: {
          "Content-Type": "application/dns-message",
          Accept: "application/dns-message"
        },
        body: t
      });
      if (!l.ok) {
        const f = new Error("Failed to fetch TXT records from DNS");
        throw f.name = "DnsTxtFetchError", f;
      }
      const c = yield l.arrayBuffer(), u = new Uint8Array(c);
      return s(u);
    });
  }
  Pt._fetchTxtRecords = o;
  function s(a) {
    const l = a.findIndex((u, f) => f < i && String.fromCharCode(u) === "=" && r.includes(String.fromCharCode(a[f - 1])));
    if (l === -1) {
      const u = new Error("Failed to parse TXT records from DNS");
      throw u.name = "DnsTxtParseError", u;
    }
    let c = "";
    for (let u = l - 1; u < a.length; u++)
      c += String.fromCharCode(a[u]);
    return c.split(",");
  }
  return Pt;
}
var Ds;
function Yf() {
  if (Ds) return st;
  Ds = 1;
  var e = st && st.__awaiter || function(g, m, h, v) {
    function w(E) {
      return E instanceof h ? E : new h(function(R) {
        R(E);
      });
    }
    return new (h || (h = Promise))(function(E, R) {
      function M(U) {
        try {
          P(v.next(U));
        } catch (H) {
          R(H);
        }
      }
      function b(U) {
        try {
          P(v.throw(U));
        } catch (H) {
          R(H);
        }
      }
      function P(U) {
        U.done ? E(U.value) : w(U.value).then(M, b);
      }
      P((v = v.apply(g, m || [])).next());
    });
  };
  Object.defineProperty(st, "__esModule", { value: !0 }), st._isDomainFailure = st.NetworkFallbackResolver = void 0;
  const t = Xf(), n = en(), r = De(), i = pt(), o = 7 * 24 * 60 * 60 * 1e3, s = 4 * 60 * 60 * 1e3;
  let a = class {
    constructor(m) {
      var h;
      this._fallbackInfo = null, this._errorBoundary = null, this._dnsQueryCooldowns = {}, this._networkOverrideFunc = (h = m.networkConfig) === null || h === void 0 ? void 0 : h.networkOverrideFunc;
    }
    setErrorBoundary(m) {
      this._errorBoundary = m;
    }
    tryBumpExpiryTime(m, h) {
      var v;
      const w = (v = this._fallbackInfo) === null || v === void 0 ? void 0 : v[h.endpoint];
      w && (w.expiryTime = Date.now() + o, u(m, Object.assign(Object.assign({}, this._fallbackInfo), { [h.endpoint]: w })));
    }
    getActiveFallbackUrl(m, h) {
      var v, w;
      if (h.customUrl != null && h.fallbackUrls != null)
        return null;
      let E = this._fallbackInfo;
      E == null && (E = (v = f(m)) !== null && v !== void 0 ? v : {}, this._fallbackInfo = E);
      const R = E[h.endpoint];
      return !R || Date.now() > ((w = R.expiryTime) !== null && w !== void 0 ? w : 0) || h.getChecksum() !== R.urlConfigChecksum ? (delete E[h.endpoint], this._fallbackInfo = E, u(m, this._fallbackInfo), null) : R.url ? R.url : null;
    }
    tryFetchUpdatedFallbackInfo(m, h, v, w) {
      return e(this, void 0, void 0, function* () {
        var E, R;
        try {
          if (!l(v, w))
            return !1;
          const b = h.customUrl == null && h.fallbackUrls == null ? yield this._tryFetchFallbackUrlsFromNetwork(h) : h.fallbackUrls, P = this._pickNewFallbackUrl((E = this._fallbackInfo) === null || E === void 0 ? void 0 : E[h.endpoint], b);
          return P ? (this._updateFallbackInfoWithNewUrl(m, h, P), !0) : !1;
        } catch (M) {
          return (R = this._errorBoundary) === null || R === void 0 || R.logError("tryFetchUpdatedFallbackInfo", M), !1;
        }
      });
    }
    _updateFallbackInfoWithNewUrl(m, h, v) {
      var w, E, R;
      const M = {
        urlConfigChecksum: h.getChecksum(),
        url: v,
        expiryTime: Date.now() + o,
        previous: []
      }, b = h.endpoint, P = (w = this._fallbackInfo) === null || w === void 0 ? void 0 : w[b];
      P && M.previous.push(...P.previous), M.previous.length > 10 && (M.previous = []);
      const U = (R = (E = this._fallbackInfo) === null || E === void 0 ? void 0 : E[b]) === null || R === void 0 ? void 0 : R.url;
      U != null && M.previous.push(U), this._fallbackInfo = Object.assign(Object.assign({}, this._fallbackInfo), { [b]: M }), u(m, this._fallbackInfo);
    }
    _tryFetchFallbackUrlsFromNetwork(m) {
      return e(this, void 0, void 0, function* () {
        var h;
        const v = this._dnsQueryCooldowns[m.endpoint];
        if (v && Date.now() < v)
          return null;
        this._dnsQueryCooldowns[m.endpoint] = Date.now() + s;
        const w = [], E = yield (0, t._fetchTxtRecords)((h = this._networkOverrideFunc) !== null && h !== void 0 ? h : fetch), R = p(m.defaultUrl);
        for (const M of E) {
          if (!M.startsWith(m.endpointDnsKey + "="))
            continue;
          const b = M.split("=");
          if (b.length > 1) {
            let P = b[1];
            P.endsWith("/") && (P = P.slice(0, -1)), w.push(`https://${P}${R}`);
          }
        }
        return w;
      });
    }
    _pickNewFallbackUrl(m, h) {
      var v;
      if (h == null)
        return null;
      const w = new Set((v = m == null ? void 0 : m.previous) !== null && v !== void 0 ? v : []), E = m == null ? void 0 : m.url;
      let R = null;
      for (const M of h) {
        const b = M.endsWith("/") ? M.slice(0, -1) : M;
        if (!w.has(M) && b !== E) {
          R = b;
          break;
        }
      }
      return R;
    }
  };
  st.NetworkFallbackResolver = a;
  function l(g, m) {
    var h;
    const v = (h = g == null ? void 0 : g.toLowerCase()) !== null && h !== void 0 ? h : "";
    return m || v.includes("uncaught exception") || v.includes("failed to fetch") || v.includes("networkerror when attempting to fetch resource");
  }
  st._isDomainFailure = l;
  function c(g) {
    return `statsig.network_fallback.${(0, n._DJB2)(g)}`;
  }
  function u(g, m) {
    const h = c(g);
    if (!m || Object.keys(m).length === 0) {
      i.Storage.removeItem(h);
      return;
    }
    i.Storage.setItem(h, JSON.stringify(m));
  }
  function f(g) {
    const m = c(g), h = i.Storage.getItem(m);
    if (!h)
      return null;
    try {
      return JSON.parse(h);
    } catch {
      return r.Log.error("Failed to parse FallbackInfo"), null;
    }
  }
  function p(g) {
    try {
      return new URL(g).pathname;
    } catch {
      return null;
    }
  }
  return st;
}
var mn = {}, Ls;
function hu() {
  if (Ls) return mn;
  Ls = 1, Object.defineProperty(mn, "__esModule", { value: !0 }), mn.SDKFlags = void 0;
  const e = {};
  return mn.SDKFlags = {
    setFlags: (t, n) => {
      e[t] = n;
    },
    get: (t, n) => {
      var r, i;
      return (i = (r = e[t]) === null || r === void 0 ? void 0 : r[n]) !== null && i !== void 0 ? i : !1;
    }
  }, mn;
}
var ri = {}, xs;
function io() {
  return xs || (xs = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.StatsigSession = e.SessionID = void 0;
    const t = ht(), n = hr(), r = De(), i = pt(), o = no(), s = 30 * 60 * 1e3, a = 4 * 60 * 60 * 1e3, l = {};
    e.SessionID = {
      get: (E) => e.StatsigSession.get(E).data.sessionID
    }, e.StatsigSession = {
      get: (E) => {
        l[E] == null && (l[E] = c(E));
        const R = l[E];
        return f(R);
      },
      overrideInitialSessionID: (E, R) => {
        l[R] = u(E, R);
      }
    };
    function c(E) {
      let R = w(E);
      const M = Date.now();
      return R || (R = {
        sessionID: (0, o.getUUID)(),
        startTime: M,
        lastUpdate: M
      }), {
        data: R,
        sdkKey: E
      };
    }
    function u(E, R) {
      const M = Date.now();
      return {
        data: {
          sessionID: E,
          startTime: M,
          lastUpdate: M
        },
        sdkKey: R
      };
    }
    function f(E) {
      const R = Date.now(), M = E.data, b = E.sdkKey;
      if (g(M) || m(M)) {
        M.sessionID = (0, o.getUUID)(), M.startTime = R;
        const U = __STATSIG__ == null ? void 0 : __STATSIG__.instance(b);
        U && U.$emt({ name: "session_expired" });
      }
      M.lastUpdate = R, v(M, E.sdkKey), clearTimeout(E.idleTimeoutID), clearTimeout(E.ageTimeoutID);
      const P = R - M.startTime;
      return E.idleTimeoutID = p(b, s), E.ageTimeoutID = p(b, a - P), E;
    }
    function p(E, R) {
      return setTimeout(() => {
        var M;
        const b = (M = (0, t._getStatsigGlobal)()) === null || M === void 0 ? void 0 : M.instance(E);
        b && b.$emt({ name: "session_expired" });
      }, R);
    }
    function g({ lastUpdate: E }) {
      return Date.now() - E > s;
    }
    function m({ startTime: E }) {
      return Date.now() - E > a;
    }
    function h(E) {
      return `statsig.session_id.${(0, n._getStorageKey)(E)}`;
    }
    function v(E, R) {
      const M = h(R);
      try {
        (0, i._setObjectInStorage)(M, E);
      } catch {
        r.Log.warn("Failed to save SessionID");
      }
    }
    function w(E) {
      const R = h(E);
      return (0, i._getObjectFromStorage)(R);
    }
  }(ri)), ri;
}
var pn = {}, ks;
function mu() {
  return ks || (ks = 1, Object.defineProperty(pn, "__esModule", { value: !0 }), pn.ErrorTag = void 0, pn.ErrorTag = {
    NetworkError: "NetworkError"
  }), pn;
}
var Ms;
function Zf() {
  if (Ms) return Ot;
  Ms = 1;
  var e = Ot && Ot.__awaiter || function(V, N, O, z) {
    function X(ee) {
      return ee instanceof O ? ee : new O(function(T) {
        T(ee);
      });
    }
    return new (O || (O = Promise))(function(ee, T) {
      function _(I) {
        try {
          C(z.next(I));
        } catch (L) {
          T(L);
        }
      }
      function S(I) {
        try {
          C(z.throw(I));
        } catch (L) {
          T(L);
        }
      }
      function C(I) {
        I.done ? ee(I.value) : X(I.value).then(_, S);
      }
      C((z = z.apply(V, N || [])).next());
    });
  };
  Object.defineProperty(Ot, "__esModule", { value: !0 }), Ot.NetworkCore = void 0, ht();
  const t = ht(), n = Ri(), r = De(), i = mr(), o = Yf(), s = hu(), a = ro(), l = Wt(), c = io(), u = gr(), f = mu(), p = ir(), g = pr(), m = to(), h = 1e4, v = 500, w = 3e4, E = 1e3, R = 50, M = R / E, b = /* @__PURE__ */ new Set([408, 500, 502, 503, 504, 522, 524, 599]);
  let P = class {
    constructor(N, O) {
      this._emitter = O, this._errorBoundary = null, this._timeout = h, this._netConfig = {}, this._options = {}, this._leakyBucket = {}, this._lastUsedInitUrl = null, N && (this._options = N), this._options.networkConfig && (this._netConfig = this._options.networkConfig), this._netConfig.networkTimeoutMs && (this._timeout = this._netConfig.networkTimeoutMs), this._fallbackResolver = new o.NetworkFallbackResolver(this._options), this.setLogEventCompressionMode(this._getLogEventCompressionMode(N));
    }
    setLogEventCompressionMode(N) {
      this._options.logEventCompressionMode = N;
    }
    setErrorBoundary(N) {
      this._errorBoundary = N, this._errorBoundary.wrap(this), this._errorBoundary.wrap(this._fallbackResolver), this._fallbackResolver.setErrorBoundary(N);
    }
    isBeaconSupported() {
      return typeof navigator < "u" && typeof navigator.sendBeacon == "function";
    }
    getLastUsedInitUrlAndReset() {
      const N = this._lastUsedInitUrl;
      return this._lastUsedInitUrl = null, N;
    }
    beacon(N) {
      if (!U(N))
        return !1;
      const O = this._getInternalRequestArgs("POST", N), z = this._getPopulatedURL(O), X = navigator;
      return X.sendBeacon.bind(X)(z, O.body);
    }
    post(N) {
      return e(this, void 0, void 0, function* () {
        const O = this._getInternalRequestArgs("POST", N);
        return this._tryEncodeBody(O), yield this._tryToCompressBody(O), this._sendRequest(O);
      });
    }
    get(N) {
      const O = this._getInternalRequestArgs("GET", N);
      return this._sendRequest(O);
    }
    _sendRequest(N) {
      return e(this, void 0, void 0, function* () {
        var O, z, X, ee;
        if (!U(N) || this._netConfig.preventAllNetworkTraffic)
          return null;
        const { method: T, body: _, retries: S, attempt: C } = N, I = N.urlConfig.endpoint;
        if (this._isRateLimited(I))
          return r.Log.warn(`Request to ${I} was blocked because you are making requests too frequently.`), null;
        const L = C ?? 1, k = typeof AbortController < "u" ? new AbortController() : null, W = setTimeout(() => {
          k == null || k.abort(`Timeout of ${this._timeout}ms expired.`);
        }, this._timeout), q = this._getPopulatedURL(N);
        let Z = null;
        const J = (0, m._isUnloading)();
        try {
          const B = {
            method: T,
            body: _,
            headers: Object.assign({}, N.headers),
            signal: k == null ? void 0 : k.signal,
            priority: N.priority,
            keepalive: J
          };
          Ce(N, L);
          const ae = this._leakyBucket[I];
          if (ae && (ae.lastRequestTime = Date.now(), this._leakyBucket[I] = ae), Z = yield ((O = this._netConfig.networkOverrideFunc) !== null && O !== void 0 ? O : fetch)(q, B), clearTimeout(W), !Z.ok) {
            const be = yield Z.text().catch(() => "No Text"), Te = new Error(`NetworkError: ${q} ${be}`);
            throw Te.name = "NetworkError", Te;
          }
          const se = yield Z.text();
          return ye(N, Z, L, se), this._fallbackResolver.tryBumpExpiryTime(N.sdkKey, N.urlConfig), {
            body: se,
            code: Z.status
          };
        } catch (B) {
          const ae = ue(k, B), Re = de(k);
          if (ye(N, Z, L, "", B), (yield this._fallbackResolver.tryFetchUpdatedFallbackInfo(N.sdkKey, N.urlConfig, ae, Re)) && (N.fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(N.sdkKey, N.urlConfig)), !S || L > S || !b.has((z = Z == null ? void 0 : Z.status) !== null && z !== void 0 ? z : 500)) {
            (X = this._emitter) === null || X === void 0 || X.call(this, {
              name: "error",
              error: B,
              tag: f.ErrorTag.NetworkError,
              requestArgs: N
            });
            const be = `A networking error occurred during ${T} request to ${q}.`;
            return r.Log.error(be, ae, B), (ee = this._errorBoundary) === null || ee === void 0 || ee.attachErrorIfNoneExists(be), null;
          }
          return yield ve(L), this._sendRequest(Object.assign(Object.assign({}, N), { retries: S, attempt: L + 1 }));
        }
      });
    }
    _getLogEventCompressionMode(N) {
      let O = N == null ? void 0 : N.logEventCompressionMode;
      return !O && (N == null ? void 0 : N.disableCompression) === !0 && (O = g.LogEventCompressionMode.Disabled), O || (O = g.LogEventCompressionMode.Enabled), O;
    }
    _isRateLimited(N) {
      var O;
      const z = Date.now(), X = (O = this._leakyBucket[N]) !== null && O !== void 0 ? O : {
        count: 0,
        lastRequestTime: z
      }, ee = z - X.lastRequestTime, T = Math.floor(ee * M);
      return X.count = Math.max(0, X.count - T), X.count >= R ? !0 : (X.count += 1, X.lastRequestTime = z, this._leakyBucket[N] = X, !1);
    }
    _getPopulatedURL(N) {
      var O;
      const z = (O = N.fallbackUrl) !== null && O !== void 0 ? O : N.urlConfig.getUrl();
      (N.urlConfig.endpoint === i.Endpoint._initialize || N.urlConfig.endpoint === i.Endpoint._download_config_specs) && (this._lastUsedInitUrl = z);
      const X = Object.assign({ [i.NetworkParam.SdkKey]: N.sdkKey, [i.NetworkParam.SdkType]: a.SDKType._get(N.sdkKey), [i.NetworkParam.SdkVersion]: p.SDK_VERSION, [i.NetworkParam.Time]: String(Date.now()), [i.NetworkParam.SessionID]: c.SessionID.get(N.sdkKey) }, N.params), ee = Object.keys(X).map((T) => `${encodeURIComponent(T)}=${encodeURIComponent(X[T])}`).join("&");
      return `${z}${ee ? `?${ee}` : ""}`;
    }
    _tryEncodeBody(N) {
      var O;
      const z = (0, l._getWindowSafe)(), X = N.body;
      if (!(!N.isStatsigEncodable || this._options.disableStatsigEncoding || typeof X != "string" || (0, t._getStatsigGlobalFlag)("no-encode") != null || !(z != null && z.btoa)))
        try {
          N.body = z.btoa(X).split("").reverse().join(""), N.params = Object.assign(Object.assign({}, (O = N.params) !== null && O !== void 0 ? O : {}), { [i.NetworkParam.StatsigEncoded]: "1" });
        } catch (ee) {
          r.Log.warn(`Request encoding failed for ${N.urlConfig.getUrl()}`, ee);
        }
    }
    _tryToCompressBody(N) {
      return e(this, void 0, void 0, function* () {
        var O;
        const z = N.body;
        if (!(typeof z != "string" || !Y(N, this._options)))
          try {
            const X = new TextEncoder().encode(z), ee = new CompressionStream("gzip"), T = ee.writable.getWriter();
            T.write(X).catch(r.Log.error), T.close().catch(r.Log.error);
            const _ = ee.readable.getReader(), S = [];
            let C;
            for (; !(C = yield _.read()).done; )
              S.push(C.value);
            const I = S.reduce((W, q) => W + q.length, 0), L = new Uint8Array(I);
            let k = 0;
            for (const W of S)
              L.set(W, k), k += W.length;
            N.body = L, N.params = Object.assign(Object.assign({}, (O = N.params) !== null && O !== void 0 ? O : {}), { [i.NetworkParam.IsGzipped]: "1" });
          } catch (X) {
            r.Log.warn(`Request compression failed for ${N.urlConfig.getUrl()}`, X);
          }
      });
    }
    _getInternalRequestArgs(N, O) {
      const z = this._fallbackResolver.getActiveFallbackUrl(O.sdkKey, O.urlConfig), X = Object.assign(Object.assign({}, O), {
        method: N,
        fallbackUrl: z
      });
      return "data" in O && H(X, O.data), X;
    }
  };
  Ot.NetworkCore = P;
  const U = (V) => V.sdkKey ? !0 : (r.Log.warn("Unable to make request without an SDK key"), !1), H = (V, N) => {
    const { sdkKey: O, fallbackUrl: z } = V, X = u.StableID.get(O), ee = c.SessionID.get(O), T = a.SDKType._get(O);
    V.body = JSON.stringify(Object.assign(Object.assign({}, N), { statsigMetadata: Object.assign(Object.assign({}, p.StatsigMetadataProvider.get()), {
      stableID: X,
      sessionID: ee,
      sdkType: T,
      fallbackUrl: z
    }) }));
  };
  function Y(V, N) {
    if (!V.isCompressable || (0, t._getStatsigGlobalFlag)("no-compress") != null || typeof CompressionStream > "u" || typeof TextEncoder > "u")
      return !1;
    const O = V.urlConfig.customUrl != null || V.urlConfig.fallbackUrls != null, z = s.SDKFlags.get(V.sdkKey, "enable_log_event_compression") === !0;
    switch (N.logEventCompressionMode) {
      case g.LogEventCompressionMode.Disabled:
        return !1;
      case g.LogEventCompressionMode.Enabled:
        return !(O && !z);
      case g.LogEventCompressionMode.Forced:
        return !0;
      default:
        return !1;
    }
  }
  function ue(V, N) {
    return V != null && V.signal.aborted && typeof V.signal.reason == "string" ? V.signal.reason : typeof N == "string" ? N : N instanceof Error ? `${N.name}: ${N.message}` : "Unknown Error";
  }
  function de(V) {
    return (V == null ? void 0 : V.signal.aborted) && typeof V.signal.reason == "string" && V.signal.reason.includes("Timeout") || !1;
  }
  function Ce(V, N) {
    V.urlConfig.endpoint === i.Endpoint._initialize && n.Diagnostics._markInitNetworkReqStart(V.sdkKey, {
      attempt: N
    });
  }
  function ye(V, N, O, z, X) {
    V.urlConfig.endpoint === i.Endpoint._initialize && n.Diagnostics._markInitNetworkReqEnd(V.sdkKey, n.Diagnostics._getDiagnosticsData(N, O, z, X));
  }
  function ve(V) {
    return e(this, void 0, void 0, function* () {
      yield new Promise((N) => setTimeout(N, Math.min(v * (V * V), w)));
    });
  }
  return Ot;
}
var ii = {}, Ns;
function Qf() {
  return Ns || (Ns = 1, Object.defineProperty(ii, "__esModule", { value: !0 })), ii;
}
var oi = {}, Us;
function eh() {
  return Us || (Us = 1, Object.defineProperty(oi, "__esModule", { value: !0 })), oi;
}
var si = {}, Fs;
function th() {
  return Fs || (Fs = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e._fastApproxSizeOf = void 0;
    const t = 2, n = 1, r = (i, o) => {
      let s = 0;
      const a = Object.keys(i);
      for (let l = 0; l < a.length; l++) {
        const c = a[l], u = i[c];
        if (s += c.length, typeof u == "object" && u !== null ? s += (0, e._fastApproxSizeOf)(u, o) + t : s += String(u).length + n, s >= o)
          return s;
      }
      return s;
    };
    e._fastApproxSizeOf = r;
  }(si)), si;
}
var Dt = {}, js;
function nh() {
  if (js) return Dt;
  js = 1;
  var e = Dt && Dt.__awaiter || function(m, h, v, w) {
    function E(R) {
      return R instanceof v ? R : new v(function(M) {
        M(R);
      });
    }
    return new (v || (v = Promise))(function(R, M) {
      function b(H) {
        try {
          U(w.next(H));
        } catch (Y) {
          M(Y);
        }
      }
      function P(H) {
        try {
          U(w.throw(H));
        } catch (Y) {
          M(Y);
        }
      }
      function U(H) {
        H.done ? R(H.value) : E(H.value).then(b, P);
      }
      U((w = w.apply(m, h || [])).next());
    });
  };
  Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.StatsigClientBase = void 0, ht();
  const t = ht(), n = du(), r = uu(), i = De(), o = fu(), s = Wt(), a = io(), l = gr(), c = pr(), u = pt(), f = 3e3;
  let p = class {
    constructor(h, v, w, E) {
      var R, M, b, P;
      this.loadingStatus = "Uninitialized", this._initializePromise = null, this._listeners = {};
      const U = this.$emt.bind(this);
      (E == null ? void 0 : E.logLevel) != null && (i.Log.level = E.logLevel), E != null && E.disableStorage && u.Storage._setDisabled(!0), E != null && E.initialSessionID && a.StatsigSession.overrideInitialSessionID(E.initialSessionID, h), E != null && E.storageProvider && u.Storage._setProvider(E.storageProvider), E != null && E.enableCookies && l.StableID._setCookiesEnabled(h, E.enableCookies), E != null && E.disableStableID && l.StableID._setDisabled(h, !0), this._sdkKey = h, this._options = E ?? {}, this._memoCache = {}, this.overrideAdapter = (R = E == null ? void 0 : E.overrideAdapter) !== null && R !== void 0 ? R : null, this._logger = new r.EventLogger(h, U, w, E), this._errorBoundary = new n.ErrorBoundary(h, E, U), this._errorBoundary.wrap(this), this._errorBoundary.wrap(v), this._errorBoundary.wrap(this._logger), w.setErrorBoundary(this._errorBoundary), this.dataAdapter = v, this.dataAdapter.attach(h, E, w), this.storageProvider = u.Storage, (P = (b = (M = this.overrideAdapter) === null || M === void 0 ? void 0 : M.loadFromStorage) === null || b === void 0 ? void 0 : b.call(M)) === null || P === void 0 || P.catch((H) => this._errorBoundary.logError("OA::loadFromStorage", H)), this._primeReadyRipcord(), g(h, this);
    }
    /**
     * Updates runtime configuration options for the SDK, allowing toggling of certain behaviors such as logging and storage to comply with user preferences or regulations such as GDPR.
     *
     * @param {StatsigRuntimeMutableOptions} options - The configuration options that dictate the runtime behavior of the SDK.
     */
    updateRuntimeOptions(h) {
      h.loggingEnabled ? (this._options.loggingEnabled = h.loggingEnabled, this._logger.setLoggingEnabled(h.loggingEnabled)) : h.disableLogging != null && (this._options.disableLogging = h.disableLogging, this._logger.setLoggingEnabled(h.disableLogging ? "disabled" : "browser-only")), h.disableStorage != null && (this._options.disableStorage = h.disableStorage, u.Storage._setDisabled(h.disableStorage)), h.enableCookies != null && (this._options.enableCookies = h.enableCookies, l.StableID._setCookiesEnabled(this._sdkKey, h.enableCookies)), h.logEventCompressionMode ? this._logger.setLogEventCompressionMode(h.logEventCompressionMode) : h.disableCompression && this._logger.setLogEventCompressionMode(c.LogEventCompressionMode.Disabled);
    }
    /**
     * Flushes any currently queued events.
     */
    flush() {
      return this._logger.flush();
    }
    /**
     * Gracefully shuts down the SDK, ensuring that all pending events are send before the SDK stops.
     * This function emits a 'pre_shutdown' event and then waits for the logger to complete its shutdown process.
     *
     * @returns {Promise<void>} A promise that resolves when all shutdown procedures, including logging shutdown, have been completed.
     */
    shutdown() {
      return e(this, void 0, void 0, function* () {
        this.$emt({ name: "pre_shutdown" }), this._setStatus("Uninitialized", null), this._initializePromise = null, yield this._logger.stop();
      });
    }
    /**
     * Subscribes a callback function to a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
     * Once subscribed, the listener callback will be invoked whenever the specified event is emitted.
     *
     * @param {StatsigClientEventName} event - The name of the event to subscribe to, or '*' to subscribe to all events.
     * @param {StatsigClientEventCallback<T>} listener - The callback function to execute when the event occurs. The function receives event-specific data as its parameter.
     * @see {@link off} for unsubscribing from events.
     */
    on(h, v) {
      this._listeners[h] || (this._listeners[h] = []), this._listeners[h].push(v);
    }
    /**
     * Unsubscribes a previously registered callback function from a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
     *
     * @param {StatsigClientEventName} event - The name of the event from which to unsubscribe, or '*' to unsubscribe from all events.
     * @param {StatsigClientEventCallback<T>} listener - The callback function to remove from the event's notification list.
     * @see {@link on} for subscribing to events.
     */
    off(h, v) {
      if (this._listeners[h]) {
        const w = this._listeners[h].indexOf(v);
        w !== -1 && this._listeners[h].splice(w, 1);
      }
    }
    $on(h, v) {
      v.__isInternal = !0, this.on(h, v);
    }
    $emt(h) {
      var v;
      const w = (E) => {
        try {
          E(h);
        } catch (R) {
          if (E.__isInternal === !0) {
            this._errorBoundary.logError(`__emit:${h.name}`, R);
            return;
          }
          i.Log.error("An error occurred in a StatsigClientEvent listener. This is not an issue with Statsig.", h);
        }
      };
      this._listeners[h.name] && this._listeners[h.name].forEach((E) => w(E)), (v = this._listeners["*"]) === null || v === void 0 || v.forEach(w);
    }
    _setStatus(h, v) {
      this.loadingStatus = h, this._memoCache = {}, this.$emt({ name: "values_updated", status: h, values: v });
    }
    _enqueueExposure(h, v, w) {
      if ((w == null ? void 0 : w.disableExposureLog) === !0) {
        this._logger.incrementNonExposureCount(h);
        return;
      }
      this._logger.enqueue(v);
    }
    _memoize(h, v) {
      return (w, E) => {
        if (this._options.disableEvaluationMemoization)
          return v(w, E);
        const R = (0, o.createMemoKey)(h, w, E);
        return R ? (R in this._memoCache || (Object.keys(this._memoCache).length >= f && (this._memoCache = {}), this._memoCache[R] = v(w, E)), this._memoCache[R]) : v(w, E);
      };
    }
  };
  Dt.StatsigClientBase = p;
  function g(m, h) {
    var v;
    if ((0, s._isServerEnv)())
      return;
    const w = (0, t._getStatsigGlobal)(), E = (v = w.instances) !== null && v !== void 0 ? v : {}, R = h;
    E[m] != null && i.Log.warn("Creating multiple Statsig clients with the same SDK key can lead to unexpected behavior. Multi-instance support requires different SDK keys."), E[m] = R, w.firstInstance || (w.firstInstance = R), w.instances = E, __STATSIG__ = w;
  }
  return Dt;
}
var gn = {}, Ws;
function rh() {
  return Ws || (Ws = 1, Object.defineProperty(gn, "__esModule", { value: !0 }), gn.DataAdapterCachePrefix = void 0, gn.DataAdapterCachePrefix = "statsig.cached"), gn;
}
var ai = {}, Bs;
function ih() {
  return Bs || (Bs = 1, Object.defineProperty(ai, "__esModule", { value: !0 })), ai;
}
var Oe = {}, Hs;
function oh() {
  if (Hs) return Oe;
  Hs = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe._makeTypedGet = Oe._mergeOverride = Oe._makeLayer = Oe._makeExperiment = Oe._makeDynamicConfig = Oe._makeFeatureGate = void 0;
  const e = De(), t = eo();
  function n(c, u, f, p) {
    var g;
    return {
      name: c,
      details: u,
      ruleID: (g = f == null ? void 0 : f.rule_id) !== null && g !== void 0 ? g : "",
      __evaluation: f,
      value: p
    };
  }
  function r(c, u, f) {
    var p;
    return Object.assign(Object.assign({}, n(c, u, f, (f == null ? void 0 : f.value) === !0)), { idType: (p = f == null ? void 0 : f.id_type) !== null && p !== void 0 ? p : null });
  }
  Oe._makeFeatureGate = r;
  function i(c, u, f) {
    var p;
    const g = (p = f == null ? void 0 : f.value) !== null && p !== void 0 ? p : {};
    return Object.assign(Object.assign({}, n(c, u, f, g)), { get: l(c, f == null ? void 0 : f.value) });
  }
  Oe._makeDynamicConfig = i;
  function o(c, u, f) {
    var p;
    const g = i(c, u, f);
    return Object.assign(Object.assign({}, g), { groupName: (p = f == null ? void 0 : f.group_name) !== null && p !== void 0 ? p : null });
  }
  Oe._makeExperiment = o;
  function s(c, u, f, p) {
    var g, m;
    return Object.assign(Object.assign({}, n(c, u, f, void 0)), { get: l(c, f == null ? void 0 : f.value, p), groupName: (g = f == null ? void 0 : f.group_name) !== null && g !== void 0 ? g : null, __value: (m = f == null ? void 0 : f.value) !== null && m !== void 0 ? m : {} });
  }
  Oe._makeLayer = s;
  function a(c, u, f, p) {
    return Object.assign(Object.assign(Object.assign({}, c), u), { get: l(c.name, f, p) });
  }
  Oe._mergeOverride = a;
  function l(c, u, f) {
    return (p, g) => {
      var m;
      const h = (m = u == null ? void 0 : u[p]) !== null && m !== void 0 ? m : null;
      return h == null ? g ?? null : g != null && !(0, t._isTypeMatch)(h, g) ? (e.Log.warn(`Parameter type mismatch. '${c}.${p}' was found to be type '${typeof h}' but fallback/return type is '${typeof g}'. See https://docs.statsig.com/client/javascript-sdk/#typed-getters`), g ?? null) : (f == null || f(p), h);
    };
  }
  return Oe._makeTypedGet = l, Oe;
}
var ui = {}, Gs;
function sh() {
  return Gs || (Gs = 1, Object.defineProperty(ui, "__esModule", { value: !0 })), ui;
}
var Lt = {}, $s;
function ah() {
  if ($s) return Lt;
  $s = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.UPDATE_DETAIL_ERROR_MESSAGES = Lt.createUpdateDetails = void 0;
  const e = (t, n, r, i, o, s) => ({
    duration: r,
    source: n,
    success: t,
    error: i,
    sourceUrl: o,
    warnings: s
  });
  return Lt.createUpdateDetails = e, Lt.UPDATE_DETAIL_ERROR_MESSAGES = {
    NO_NETWORK_DATA: "No data was returned from the network. This may be due to a network timeout if a timeout value was specified in the options or ad blocker error."
  }, Lt;
}
var qs;
function ut() {
  return qs || (qs = 1, function(e) {
    var t = Et && Et.__createBinding || (Object.create ? function(c, u, f, p) {
      p === void 0 && (p = f);
      var g = Object.getOwnPropertyDescriptor(u, f);
      (!g || ("get" in g ? !u.__esModule : g.writable || g.configurable)) && (g = { enumerable: !0, get: function() {
        return u[f];
      } }), Object.defineProperty(c, p, g);
    } : function(c, u, f, p) {
      p === void 0 && (p = f), c[p] = u[f];
    }), n = Et && Et.__exportStar || function(c, u) {
      for (var f in c) f !== "default" && !Object.prototype.hasOwnProperty.call(u, f) && t(u, c, f);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Storage = e.Log = e.EventLogger = e.Diagnostics = void 0, ht();
    const r = ht(), i = Ri();
    Object.defineProperty(e, "Diagnostics", { enumerable: !0, get: function() {
      return i.Diagnostics;
    } });
    const o = uu();
    Object.defineProperty(e, "EventLogger", { enumerable: !0, get: function() {
      return o.EventLogger;
    } });
    const s = De();
    Object.defineProperty(e, "Log", { enumerable: !0, get: function() {
      return s.Log;
    } });
    const a = ir(), l = pt();
    Object.defineProperty(e, "Storage", { enumerable: !0, get: function() {
      return l.Storage;
    } }), n(ht(), e), n(hr(), e), n($f(), e), n(qf(), e), n(Ri(), e), n(Vf(), e), n(du(), e), n(zf(), e), n(Kf(), e), n(en(), e), n(Jf(), e), n(De(), e), n(fu(), e), n(mr(), e), n(Zf(), e), n(Qf(), e), n(eh(), e), n(Wt(), e), n(ro(), e), n(io(), e), n(th(), e), n(gr(), e), n(nh(), e), n(mu(), e), n(rh(), e), n(su(), e), n(ir(), e), n(pr(), e), n(ih(), e), n(oh(), e), n(sh(), e), n(lu(), e), n(pt(), e), n(cu(), e), n(eo(), e), n(au(), e), n(no(), e), n(to(), e), n(ah(), e), n(hu(), e), Object.assign((0, r._getStatsigGlobal)(), { Log: s.Log, SDK_VERSION: a.SDK_VERSION });
  }(Et)), Et;
}
var Vt = {}, Hn = {}, Vs;
function uh() {
  if (Vs) return Hn;
  Vs = 1, Object.defineProperty(Hn, "__esModule", { value: !0 });
  const e = ut();
  let t = class {
    constructor(r) {
      this._sdkKey = r, this._rawValues = null, this._values = null, this._source = "Uninitialized", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null, this._warnings = /* @__PURE__ */ new Set();
    }
    reset() {
      this._values = null, this._rawValues = null, this._source = "Loading", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null, this._warnings.clear();
    }
    finalize() {
      this._values || (this._source = "NoValues");
    }
    getValues() {
      return this._rawValues ? (0, e._typedJsonParse)(this._rawValues, "has_updates", "EvaluationStoreValues") : null;
    }
    setValues(r, i) {
      var o;
      if (!r)
        return !1;
      const s = (0, e._typedJsonParse)(r.data, "has_updates", "EvaluationResponse");
      return s == null ? !1 : (this._source = r.source, (s == null ? void 0 : s.has_updates) !== !0 || (this._rawValues = r.data, this._lcut = s.time, this._receivedAt = r.receivedAt, this._values = s, this._bootstrapMetadata = this._extractBootstrapMetadata(r.source, s), r.source && s.user && this._setWarningState(i, s), e.SDKFlags.setFlags(this._sdkKey, (o = s.sdk_flags) !== null && o !== void 0 ? o : {})), !0);
    }
    getWarnings() {
      if (this._warnings.size !== 0)
        return Array.from(this._warnings);
    }
    getGate(r) {
      var i;
      return this._getDetailedStoreResult((i = this._values) === null || i === void 0 ? void 0 : i.feature_gates, r);
    }
    getConfig(r) {
      var i;
      return this._getDetailedStoreResult((i = this._values) === null || i === void 0 ? void 0 : i.dynamic_configs, r);
    }
    getConfigList() {
      var r;
      return !((r = this._values) === null || r === void 0) && r.dynamic_configs ? Object.values(this._values.dynamic_configs).map((i) => i.name) : [];
    }
    getLayer(r) {
      var i;
      return this._getDetailedStoreResult((i = this._values) === null || i === void 0 ? void 0 : i.layer_configs, r);
    }
    getParamStore(r) {
      var i;
      return this._getDetailedStoreResult((i = this._values) === null || i === void 0 ? void 0 : i.param_stores, r);
    }
    getSource() {
      return this._source;
    }
    getExposureMapping() {
      var r;
      return (r = this._values) === null || r === void 0 ? void 0 : r.exposures;
    }
    _extractBootstrapMetadata(r, i) {
      if (r !== "Bootstrap")
        return null;
      const o = {};
      return i.user && (o.user = i.user), i.sdkInfo && (o.generatorSDKInfo = i.sdkInfo), o.lcut = i.time, o;
    }
    _getDetailedStoreResult(r, i) {
      let o = null;
      return r && (o = r[i] ? r[i] : r[(0, e._DJB2)(i)]), {
        result: o,
        details: this._getDetails(o == null)
      };
    }
    _setWarningState(r, i) {
      var o, s;
      const a = e.StableID.get(this._sdkKey);
      if (((o = r.customIDs) === null || o === void 0 ? void 0 : o.stableID) !== a && // don't throw if they're both undefined
      (!((s = r.customIDs) === null || s === void 0) && s.stableID || a)) {
        this._warnings.add("StableIDMismatch");
        return;
      }
      if ("user" in i) {
        const l = i.user, c = Object.assign(Object.assign({}, r), { analyticsOnlyMetadata: void 0, privateAttributes: void 0 });
        (0, e._getFullUserHash)(c) !== (0, e._getFullUserHash)(l) && this._warnings.add("PartialUserMatch");
      }
    }
    getCurrentSourceDetails() {
      if (this._source === "Uninitialized" || this._source === "NoValues")
        return { reason: this._source };
      const r = {
        reason: this._source,
        lcut: this._lcut,
        receivedAt: this._receivedAt
      };
      return this._warnings.size > 0 && (r.warnings = Array.from(this._warnings)), r;
    }
    _getDetails(r) {
      var i, o;
      const s = this.getCurrentSourceDetails();
      let a = s.reason;
      const l = (i = s.warnings) !== null && i !== void 0 ? i : [];
      this._source === "Bootstrap" && l.length > 0 && (a = a + l[0]), a !== "Uninitialized" && a !== "NoValues" && (a = `${a}:${r ? "Unrecognized" : "Recognized"}`);
      const c = this._source === "Bootstrap" && (o = this._bootstrapMetadata) !== null && o !== void 0 ? o : void 0;
      return c && (s.bootstrapMetadata = c), Object.assign(Object.assign({}, s), { reason: a });
    }
  };
  return Hn.default = t, Hn;
}
var zt = {}, _n = {}, zs;
function lh() {
  if (zs) return _n;
  zs = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n._resolveDeltasResponse = void 0;
  const e = ut(), t = 2;
  function n(s, a) {
    const l = (0, e._typedJsonParse)(a, "checksum", "DeltasEvaluationResponse");
    if (!l)
      return {
        hadBadDeltaChecksum: !0
      };
    const c = r(s, l), u = i(c), f = (0, e._DJB2Object)({
      feature_gates: u.feature_gates,
      dynamic_configs: u.dynamic_configs,
      layer_configs: u.layer_configs
    }, t);
    return f === l.checksumV2 ? JSON.stringify(u) : {
      hadBadDeltaChecksum: !0,
      badChecksum: f,
      badMergedConfigs: u,
      badFullResponse: l.deltas_full_response
    };
  }
  _n._resolveDeltasResponse = n;
  function r(s, a) {
    return Object.assign(Object.assign(Object.assign({}, s), a), { feature_gates: Object.assign(Object.assign({}, s.feature_gates), a.feature_gates), layer_configs: Object.assign(Object.assign({}, s.layer_configs), a.layer_configs), dynamic_configs: Object.assign(Object.assign({}, s.dynamic_configs), a.dynamic_configs) });
  }
  function i(s) {
    const a = s;
    return o(s.deleted_gates, a.feature_gates), delete a.deleted_gates, o(s.deleted_configs, a.dynamic_configs), delete a.deleted_configs, o(s.deleted_layers, a.layer_configs), delete a.deleted_layers, a;
  }
  function o(s, a) {
    s == null || s.forEach((l) => {
      delete a[l];
    });
  }
  return _n;
}
var Ks;
function pu() {
  if (Ks) return zt;
  Ks = 1;
  var e = zt && zt.__awaiter || function(i, o, s, a) {
    function l(c) {
      return c instanceof s ? c : new s(function(u) {
        u(c);
      });
    }
    return new (s || (s = Promise))(function(c, u) {
      function f(m) {
        try {
          g(a.next(m));
        } catch (h) {
          u(h);
        }
      }
      function p(m) {
        try {
          g(a.throw(m));
        } catch (h) {
          u(h);
        }
      }
      function g(m) {
        m.done ? c(m.value) : l(m.value).then(f, p);
      }
      g((a = a.apply(i, o || [])).next());
    });
  };
  Object.defineProperty(zt, "__esModule", { value: !0 });
  const t = ut(), n = lh();
  class r extends t.NetworkCore {
    constructor(o, s) {
      super(o, s);
      const a = o == null ? void 0 : o.networkConfig;
      this._option = o, this._initializeUrlConfig = new t.UrlConfiguration(t.Endpoint._initialize, a == null ? void 0 : a.initializeUrl, a == null ? void 0 : a.api, a == null ? void 0 : a.initializeFallbackUrls);
    }
    fetchEvaluations(o, s, a, l, c) {
      return e(this, void 0, void 0, function* () {
        var u, f, p, g, m, h;
        const v = s ? (0, t._typedJsonParse)(s, "has_updates", "InitializeResponse") : null;
        let w = {
          user: l,
          hash: (p = (f = (u = this._option) === null || u === void 0 ? void 0 : u.networkConfig) === null || f === void 0 ? void 0 : f.initializeHashAlgorithm) !== null && p !== void 0 ? p : "djb2",
          deltasResponseRequested: !1,
          full_checksum: null
        };
        if (v != null && v.has_updates) {
          const E = (v == null ? void 0 : v.hash_used) !== ((h = (m = (g = this._option) === null || g === void 0 ? void 0 : g.networkConfig) === null || m === void 0 ? void 0 : m.initializeHashAlgorithm) !== null && h !== void 0 ? h : "djb2");
          w = Object.assign(Object.assign({}, w), { sinceTime: c && !E ? v.time : 0, previousDerivedFields: "derived_fields" in v && c ? v.derived_fields : {}, deltasResponseRequested: !0, full_checksum: v.full_checksum, partialUserMatchSinceTime: E ? 0 : v.time });
        }
        return this._fetchEvaluations(o, v, w, a);
      });
    }
    _fetchEvaluations(o, s, a, l) {
      return e(this, void 0, void 0, function* () {
        var c, u;
        const f = yield this.post({
          sdkKey: o,
          urlConfig: this._initializeUrlConfig,
          data: a,
          retries: 2,
          isStatsigEncodable: !0,
          priority: l
        });
        if ((f == null ? void 0 : f.code) === 204)
          return '{"has_updates": false}';
        if ((f == null ? void 0 : f.code) !== 200)
          return (c = f == null ? void 0 : f.body) !== null && c !== void 0 ? c : null;
        if ((s == null ? void 0 : s.has_updates) !== !0 || ((u = f.body) === null || u === void 0 ? void 0 : u.includes('"is_delta":true')) !== !0 || a.deltasResponseRequested !== !0)
          return f.body;
        const p = (0, n._resolveDeltasResponse)(s, f.body);
        return typeof p == "string" ? p : this._fetchEvaluations(o, s, Object.assign(Object.assign(Object.assign({}, a), p), { deltasResponseRequested: !1 }), l);
      });
    }
  }
  return zt.default = r, zt;
}
var vn = {}, Js;
function ch() {
  if (Js) return vn;
  Js = 1, Object.defineProperty(vn, "__esModule", { value: !0 }), vn._makeParamStoreGetter = void 0;
  const e = ut(), t = {
    disableExposureLog: !0
  };
  function n(u) {
    return u == null || u.disableExposureLog === !1;
  }
  function r(u, f) {
    return f != null && !(0, e._isTypeMatch)(u, f);
  }
  function i(u, f) {
    return u.value;
  }
  function o(u, f, p) {
    return u.getFeatureGate(f.gate_name, n(p) ? void 0 : t).value ? f.pass_value : f.fail_value;
  }
  function s(u, f, p, g) {
    const h = u.getDynamicConfig(f.config_name, n(g) ? void 0 : t).get(f.param_name);
    return r(h, p) ? p : h;
  }
  function a(u, f, p, g) {
    const h = u.getExperiment(f.experiment_name, n(g) ? void 0 : t).get(f.param_name);
    return r(h, p) ? p : h;
  }
  function l(u, f, p, g) {
    const h = u.getLayer(f.layer_name, n(g) ? void 0 : t).get(f.param_name);
    return r(h, p) ? p : h;
  }
  function c(u, f, p) {
    return (g, m) => {
      if (f == null)
        return m;
      const h = f[g];
      if (h == null || m != null && (0, e._typeOf)(m) !== h.param_type)
        return m;
      switch (h.ref_type) {
        case "static":
          return i(h);
        case "gate":
          return o(u, h, p);
        case "dynamic_config":
          return s(u, h, m, p);
        case "experiment":
          return a(u, h, m, p);
        case "layer":
          return l(u, h, m, p);
        default:
          return m;
      }
    };
  }
  return vn._makeParamStoreGetter = c, vn;
}
var xt = {}, Xs;
function dh() {
  if (Xs) return xt;
  Xs = 1;
  var e = xt && xt.__awaiter || function(i, o, s, a) {
    function l(c) {
      return c instanceof s ? c : new s(function(u) {
        u(c);
      });
    }
    return new (s || (s = Promise))(function(c, u) {
      function f(m) {
        try {
          g(a.next(m));
        } catch (h) {
          u(h);
        }
      }
      function p(m) {
        try {
          g(a.throw(m));
        } catch (h) {
          u(h);
        }
      }
      function g(m) {
        m.done ? c(m.value) : l(m.value).then(f, p);
      }
      g((a = a.apply(i, o || [])).next());
    });
  };
  Object.defineProperty(xt, "__esModule", { value: !0 }), xt.StatsigEvaluationsDataAdapter = void 0;
  const t = ut(), n = pu();
  let r = class extends t.DataAdapterCore {
    constructor() {
      super("EvaluationsDataAdapter", "evaluations"), this._network = null, this._options = null;
    }
    attach(o, s, a) {
      super.attach(o, s, a), a !== null && a instanceof n.default ? this._network = a : this._network = new n.default(s ?? {});
    }
    getDataAsync(o, s, a) {
      return this._getDataAsyncImpl(o, (0, t._normalizeUser)(s, this._options), a);
    }
    prefetchData(o, s) {
      return this._prefetchDataImpl(o, s);
    }
    setData(o) {
      const s = (0, t._typedJsonParse)(o, "has_updates", "data");
      s && "user" in s ? super.setData(o, s.user) : t.Log.error("StatsigUser not found. You may be using an older server SDK version. Please upgrade your SDK or use setDataLegacy.");
    }
    setDataLegacy(o, s) {
      super.setData(o, s);
    }
    _fetchFromNetwork(o, s, a, l) {
      return e(this, void 0, void 0, function* () {
        var c;
        const u = yield (c = this._network) === null || c === void 0 ? void 0 : c.fetchEvaluations(this._getSdkKey(), o, a == null ? void 0 : a.priority, s, l);
        return u ?? null;
      });
    }
    _getCacheKey(o) {
      var s;
      const a = (0, t._getStorageKey)(this._getSdkKey(), o, (s = this._options) === null || s === void 0 ? void 0 : s.customUserCacheKeyFunc);
      return `${t.DataAdapterCachePrefix}.${this._cacheSuffix}.${a}`;
    }
    _isCachedResultValidFor204(o, s) {
      return o.fullUserHash != null && o.fullUserHash === (0, t._getFullUserHash)(s);
    }
  };
  return xt.StatsigEvaluationsDataAdapter = r, xt;
}
var Ys;
function fh() {
  if (Ys) return Vt;
  Ys = 1;
  var e = Vt && Vt.__awaiter || function(a, l, c, u) {
    function f(p) {
      return p instanceof c ? p : new c(function(g) {
        g(p);
      });
    }
    return new (c || (c = Promise))(function(p, g) {
      function m(w) {
        try {
          v(u.next(w));
        } catch (E) {
          g(E);
        }
      }
      function h(w) {
        try {
          v(u.throw(w));
        } catch (E) {
          g(E);
        }
      }
      function v(w) {
        w.done ? p(w.value) : f(w.value).then(m, h);
      }
      v((u = u.apply(a, l || [])).next());
    });
  };
  Object.defineProperty(Vt, "__esModule", { value: !0 });
  const t = ut(), n = uh(), r = pu(), i = ch(), o = dh();
  let s = class Ai extends t.StatsigClientBase {
    /**
     * Retrieves an instance of the StatsigClient based on the provided SDK key.
     *  If no SDK key is provided, the method returns the most recently created instance of the StatsigClient.
     *  The method ensures that each unique SDK key corresponds to a single instance of StatsigClient, effectively implementing a singleton pattern for each key.
     *  If no instance exists for the given SDK key, a new StatsigClient instance will be created and returned.
     *
     * @param {string} [sdkKey] - Optional. The SDK key used to identify a specific instance of the StatsigClient. If omitted, the method returns the last created instance.
     * @returns {StatsigClient} Returns the StatsigClient instance associated with the given SDK key, creating a new one if needed.
     */
    static instance(l) {
      const c = (0, t._getStatsigGlobal)().instance(l);
      return c instanceof Ai ? c : (t.Log.warn((0, t._isServerEnv)() ? "StatsigClient.instance is not supported in server environments" : "Unable to find StatsigClient instance"), new Ai(l ?? "", {}));
    }
    /**
     * StatsigClient constructor
     *
     * @param {string} sdkKey A Statsig client SDK key. eg "client-xyz123..."
     * @param {StatsigUser} user StatsigUser object containing various attributes related to a user.
     * @param {StatsigOptions | null} options StatsigOptions, used to customize the behavior of the SDK.
     */
    constructor(l, c, u = null) {
      var f, p;
      t.SDKType._setClientType(l, "javascript-client");
      const g = new r.default(u, (h) => {
        this.$emt(h);
      });
      super(l, (f = u == null ? void 0 : u.dataAdapter) !== null && f !== void 0 ? f : new o.StatsigEvaluationsDataAdapter(), g, u), this._possibleFirstTouchMetadata = {}, this.getFeatureGate = this._memoize(t.MemoPrefix._gate, this._getFeatureGateImpl.bind(this)), this.getDynamicConfig = this._memoize(t.MemoPrefix._dynamicConfig, this._getDynamicConfigImpl.bind(this)), this.getExperiment = this._memoize(t.MemoPrefix._experiment, this._getExperimentImpl.bind(this)), this.getConfigList = this._memoize(t.MemoPrefix._configList, this._getConfigListImpl.bind(this)), this.getLayer = this._memoize(t.MemoPrefix._layer, this._getLayerImpl.bind(this)), this.getParameterStore = this._memoize(t.MemoPrefix._paramStore, this._getParameterStoreImpl.bind(this)), this._store = new n.default(l), this._network = g, this._user = this._configureUser(c, u), this._sdkInstanceID = (0, t.getUUID)();
      const m = (p = u == null ? void 0 : u.plugins) !== null && p !== void 0 ? p : [];
      for (const h of m)
        h.bind(this);
    }
    /**
     * Initializes the StatsigClient using cached values. This method sets up the client synchronously by utilizing previously cached values.
     * After initialization, cache values are updated in the background for future use, either in subsequent sessions or when `updateUser` is called.
     * This is useful for quickly starting with the last-known-good configurations while refreshing data to keep settings up-to-date.
     *
     * @see {@link initializeAsync} for the asynchronous version of this method.
     */
    initializeSync(l) {
      var c;
      return this.loadingStatus !== "Uninitialized" ? (0, t.createUpdateDetails)(!0, this._store.getSource(), -1, null, null, ["MultipleInitializations", ...(c = this._store.getWarnings()) !== null && c !== void 0 ? c : []]) : (this._logger.start(), this.updateUserSync(this._user, l));
    }
    /**
     * Initializes the StatsigClient asynchronously by first using cached values and then updating to the latest values from the network.
     * Once the network values are fetched, they replace the existing cached values. If this method's promise is not awaited,
     * there might be a transition from cached to network values during the session, which can affect consistency.
     * This method is useful when it's acceptable to begin with potentially stale data and switch to the latest configuration as it becomes available.
     *
     * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
     * @returns {Promise<void>} A promise that resolves once the client is fully initialized with the latest values from the network or a timeout (if set) is hit.
     * @see {@link initializeSync} for the synchronous version of this method.
     */
    initializeAsync(l) {
      return e(this, void 0, void 0, function* () {
        return this._initializePromise ? this._initializePromise : (this._initializePromise = this._initializeAsyncImpl(l), this._initializePromise);
      });
    }
    /**
     * Synchronously updates the user in the Statsig client and switches the internal state to use cached values for the newly specified user.
     * After the initial switch to cached values, this method updates these values in the background, preparing them for future sessions or subsequent calls to updateUser.
     * This method ensures the client is quickly ready with available data.
     *
     * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
     * @see {@link updateUserAsync} for the asynchronous version of this method.
     */
    updateUserSync(l, c) {
      const u = performance.now();
      try {
        return this._updateUserSyncImpl(l, c, u);
      } catch (f) {
        const p = f instanceof Error ? f : new Error(String(f));
        return this._createErrorUpdateDetails(p, u);
      }
    }
    _updateUserSyncImpl(l, c, u) {
      var f;
      const p = [...(f = this._store.getWarnings()) !== null && f !== void 0 ? f : []];
      this._resetForUser(l);
      const g = this.dataAdapter.getDataSync(this._user);
      g == null && p.push("NoCachedValues"), this._store.setValues(g, this._user), this._finalizeUpdate(g);
      const m = c == null ? void 0 : c.disableBackgroundCacheRefresh;
      return m === !0 || m == null && (g == null ? void 0 : g.source) === "Bootstrap" ? (0, t.createUpdateDetails)(!0, this._store.getSource(), performance.now() - u, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), p) : (this._runPostUpdate(g ?? null, this._user), (0, t.createUpdateDetails)(!0, this._store.getSource(), performance.now() - u, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), p));
    }
    /**
     * Asynchronously updates the user in the Statsig client by initially using cached values and then fetching the latest values from the network.
     * When the latest values are fetched, they replace the cached values. If the promise returned by this method is not awaited,
     * the client's state may shift from cached to updated network values during the session, potentially affecting consistency.
     * This method is best used in scenarios where up-to-date configuration is critical and initial delays are acceptable.
     *
     * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
     * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
     * @returns {Promise<void>} A promise that resolves once the client is fully updated with the latest values from the network or a timeout (if set) is hit.
     * @see {@link updateUserSync} for the synchronous version of this method.
     */
    updateUserAsync(l, c) {
      return e(this, void 0, void 0, function* () {
        const u = performance.now();
        try {
          return yield this._updateUserAsyncImpl(l, c);
        } catch (f) {
          const p = f instanceof Error ? f : new Error(String(f));
          return this._createErrorUpdateDetails(p, u);
        }
      });
    }
    _updateUserAsyncImpl(l, c) {
      return e(this, void 0, void 0, function* () {
        this._resetForUser(l);
        const u = this._user;
        t.Diagnostics._markInitOverallStart(this._sdkKey);
        let f = this.dataAdapter.getDataSync(u);
        if (this._store.setValues(f, this._user), this._setStatus("Loading", f), f = yield this.dataAdapter.getDataAsync(f, u, c), u !== this._user)
          return (0, t.createUpdateDetails)(!1, this._store.getSource(), -1, new Error("User changed during update"), this._network.getLastUsedInitUrlAndReset());
        let p = !1;
        f != null && (t.Diagnostics._markInitProcessStart(this._sdkKey), p = this._store.setValues(f, this._user), t.Diagnostics._markInitProcessEnd(this._sdkKey, {
          success: p
        })), this._finalizeUpdate(f), p || (this._errorBoundary.attachErrorIfNoneExists(t.UPDATE_DETAIL_ERROR_MESSAGES.NO_NETWORK_DATA), this.$emt({ name: "initialization_failure" })), t.Diagnostics._markInitOverallEnd(this._sdkKey, p, this._store.getCurrentSourceDetails());
        const g = t.Diagnostics._enqueueDiagnosticsEvent(this._user, this._logger, this._sdkKey, this._options);
        return (0, t.createUpdateDetails)(p, this._store.getSource(), g, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), this._store.getWarnings());
      });
    }
    /**
     * Retrieves a synchronous context containing data currently being used by the SDK. Represented as a {@link PrecomputedEvaluationsContext} object.
     *
     * @returns {PrecomputedEvaluationsContext} The current synchronous context for the this StatsigClient instance.
     */
    getContext() {
      return {
        sdkKey: this._sdkKey,
        options: this._options,
        values: this._store.getValues(),
        user: JSON.parse(JSON.stringify(this._user)),
        errorBoundary: this._errorBoundary,
        session: t.StatsigSession.get(this._sdkKey),
        stableID: t.StableID.get(this._sdkKey),
        sdkInstanceID: this._sdkInstanceID
      };
    }
    /**
     * Retrieves the value of a feature gate for the current user, represented as a simple boolean.
     *
     * @param {string} name - The name of the feature gate to retrieve.
     * @param {FeatureGateEvaluationOptions} [options] - Optional. Additional options to customize the method call.
     * @returns {boolean} - The boolean value representing the gate's current evaluation results for the user.
     */
    checkGate(l, c) {
      return this.getFeatureGate(l, c).value;
    }
    /**
     * Logs an event to the internal logging system. This function allows logging by either passing a fully formed event object or by specifying the event name with optional value and metadata.
     *
     * @param {StatsigEvent|string} eventOrName - The event object conforming to the StatsigEvent interface, or the name of the event as a string.
     * @param {string|number} value - Optional. The value associated with the event, which can be a string or a number. This parameter is ignored if the first parameter is a StatsigEvent object.
     * @param {Record<string, string>} metadata - Optional. A key-value record containing metadata about the event. This is also ignored if the first parameter is an event object.
     */
    logEvent(l, c, u) {
      const f = typeof l == "string" ? {
        eventName: l,
        value: c,
        metadata: u
      } : l;
      this.$emt({
        name: "log_event_called",
        event: f
      }), this._logger.enqueue(Object.assign(Object.assign({}, f), { user: this._user, time: Date.now() }));
    }
    /**
     * Updates the user with analytics only metadata. This will override any existing analytics only metadata.
     *
     * @param {Record<string, string | number | boolean>} metadata - The metadata to add to the user.
     */
    updateUserWithAnalyticsOnlyMetadata(l) {
      this._user = this._configureUser(Object.assign(Object.assign({}, this._user), { analyticsOnlyMetadata: l }), this._options);
    }
    _primeReadyRipcord() {
      this.$on("error", () => {
        this.loadingStatus === "Loading" && this._finalizeUpdate(null);
      });
    }
    _initializeAsyncImpl(l) {
      return e(this, void 0, void 0, function* () {
        return t.Storage.isReady() || (yield t.Storage.isReadyResolver()), this._logger.start(), this.updateUserAsync(this._user, l);
      });
    }
    _createErrorUpdateDetails(l, c) {
      var u;
      return (0, t.createUpdateDetails)(!1, this._store.getSource(), performance.now() - c, l, null, [...(u = this._store.getWarnings()) !== null && u !== void 0 ? u : []]);
    }
    _finalizeUpdate(l) {
      this._store.finalize(), this._setStatus("Ready", l);
    }
    _runPostUpdate(l, c) {
      this.dataAdapter.getDataAsync(l, c, { priority: "low" }).catch((u) => {
        t.Log.error("An error occurred after update.", u);
      });
    }
    _resetForUser(l) {
      this._logger.reset(), this._store.reset(), this._user = this._configureUser(l, this._options);
    }
    _configureUser(l, c) {
      var u;
      const f = (0, t._normalizeUser)(l, c), p = (u = f.customIDs) === null || u === void 0 ? void 0 : u.stableID;
      return p && t.StableID.setOverride(p, this._sdkKey), Object.keys(this._possibleFirstTouchMetadata).length > 0 && (f.analyticsOnlyMetadata = Object.assign(Object.assign({}, f.analyticsOnlyMetadata), this._possibleFirstTouchMetadata)), f;
    }
    _getFeatureGateImpl(l, c) {
      var u, f;
      const { result: p, details: g } = this._store.getGate(l), m = (0, t._makeFeatureGate)(l, g, p), h = (f = (u = this.overrideAdapter) === null || u === void 0 ? void 0 : u.getGateOverride) === null || f === void 0 ? void 0 : f.call(u, m, this._user, c), v = h ?? m;
      return this._enqueueExposure(l, (0, t._createGateExposure)(this._user, v, this._store.getExposureMapping()), c), this.$emt({ name: "gate_evaluation", gate: v }), v;
    }
    _getDynamicConfigImpl(l, c) {
      var u, f;
      const { result: p, details: g } = this._store.getConfig(l), m = (0, t._makeDynamicConfig)(l, g, p), h = (f = (u = this.overrideAdapter) === null || u === void 0 ? void 0 : u.getDynamicConfigOverride) === null || f === void 0 ? void 0 : f.call(u, m, this._user, c), v = h ?? m;
      return this._enqueueExposure(l, (0, t._createConfigExposure)(this._user, v, this._store.getExposureMapping()), c), this.$emt({ name: "dynamic_config_evaluation", dynamicConfig: v }), v;
    }
    _getExperimentImpl(l, c) {
      var u, f, p, g;
      const { result: m, details: h } = this._store.getConfig(l), v = (0, t._makeExperiment)(l, h, m);
      v.__evaluation != null && (v.__evaluation.secondary_exposures = (0, t._mapExposures)((f = (u = v.__evaluation) === null || u === void 0 ? void 0 : u.secondary_exposures) !== null && f !== void 0 ? f : [], this._store.getExposureMapping()));
      const w = (g = (p = this.overrideAdapter) === null || p === void 0 ? void 0 : p.getExperimentOverride) === null || g === void 0 ? void 0 : g.call(p, v, this._user, c), E = w ?? v;
      return this._enqueueExposure(l, (0, t._createConfigExposure)(this._user, E, this._store.getExposureMapping()), c), this.$emt({ name: "experiment_evaluation", experiment: E }), E;
    }
    _getConfigListImpl() {
      return this._store.getConfigList();
    }
    _getLayerImpl(l, c) {
      var u, f, p;
      const { result: g, details: m } = this._store.getLayer(l), h = (0, t._makeLayer)(l, m, g), v = (f = (u = this.overrideAdapter) === null || u === void 0 ? void 0 : u.getLayerOverride) === null || f === void 0 ? void 0 : f.call(u, h, this._user, c);
      c != null && c.disableExposureLog && this._logger.incrementNonExposureCount(l);
      const w = (0, t._mergeOverride)(h, v, (p = v == null ? void 0 : v.__value) !== null && p !== void 0 ? p : h.__value, (E) => {
        c != null && c.disableExposureLog || this._enqueueExposure(l, (0, t._createLayerParameterExposure)(this._user, w, E, this._store.getExposureMapping()), c);
      });
      return this.$emt({ name: "layer_evaluation", layer: w }), w;
    }
    _getParameterStoreImpl(l, c) {
      var u, f;
      const { result: p, details: g } = this._store.getParamStore(l);
      this._logger.incrementNonExposureCount(l);
      const m = {
        name: l,
        details: g,
        __configuration: p,
        get: (0, i._makeParamStoreGetter)(this, p, c)
      }, h = (f = (u = this.overrideAdapter) === null || u === void 0 ? void 0 : u.getParamStoreOverride) === null || f === void 0 ? void 0 : f.call(u, m, c);
      return h != null && (m.__configuration = h.config, m.details = h.details, m.get = (0, i._makeParamStoreGetter)(this, h.config, c)), m;
    }
  };
  return Vt.default = s, Vt;
}
var Zs;
function hh() {
  return Zs || (Zs = 1, function(e) {
    var t = bt && bt.__createBinding || (Object.create ? function(s, a, l, c) {
      c === void 0 && (c = l);
      var u = Object.getOwnPropertyDescriptor(a, l);
      (!u || ("get" in u ? !a.__esModule : u.writable || u.configurable)) && (u = { enumerable: !0, get: function() {
        return a[l];
      } }), Object.defineProperty(s, c, u);
    } : function(s, a, l, c) {
      c === void 0 && (c = l), s[c] = a[l];
    }), n = bt && bt.__exportStar || function(s, a) {
      for (var l in s) l !== "default" && !Object.prototype.hasOwnProperty.call(a, l) && t(a, s, l);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.StatsigClient = void 0;
    const r = ut(), i = fh();
    e.StatsigClient = i.default, n(ut(), e);
    const o = Object.assign((0, r._getStatsigGlobal)(), {
      StatsigClient: i.default
    });
    e.default = o;
  }(bt)), bt;
}
var mh = hh(), kt = {}, Mt = {}, Qs;
function ph() {
  if (Qs) return Mt;
  Qs = 1;
  var e = Mt && Mt.__awaiter || function(s, a, l, c) {
    function u(f) {
      return f instanceof l ? f : new l(function(p) {
        p(f);
      });
    }
    return new (l || (l = Promise))(function(f, p) {
      function g(v) {
        try {
          h(c.next(v));
        } catch (w) {
          p(w);
        }
      }
      function m(v) {
        try {
          h(c.throw(v));
        } catch (w) {
          p(w);
        }
      }
      function h(v) {
        v.done ? f(v.value) : u(v.value).then(g, m);
      }
      h((c = c.apply(s, a || [])).next());
    });
  };
  Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.LocalOverrideAdapter = void 0;
  const t = ut(), n = "LocalOverride:Recognized";
  function r() {
    return {
      gate: {},
      dynamicConfig: {},
      experiment: {},
      layer: {}
    };
  }
  function i(s, a) {
    return {
      gate: Object.assign({}, s.gate, a.gate),
      dynamicConfig: Object.assign({}, s.dynamicConfig, a.dynamicConfig),
      experiment: Object.assign({}, s.experiment, a.experiment),
      layer: Object.assign({}, s.layer, a.layer)
    };
  }
  let o = class {
    constructor(a) {
      this._overrides = r(), this._sdkKey = a ?? null;
    }
    _getLocalOverridesStorageKey(a) {
      return `statsig.local-overrides.${(0, t._getStorageKey)(a)}`;
    }
    loadFromStorage() {
      return e(this, void 0, void 0, function* () {
        if (this._sdkKey == null)
          return;
        t.Storage.isReady() || (yield t.Storage.isReadyResolver());
        const a = this._getLocalOverridesStorageKey(this._sdkKey), l = t.Storage.getItem(a), c = l ? (0, t._typedJsonParse)(l, "gate", "LocalOverrideAdapter overrides") : null, u = this._hasInMemoryOverrides();
        c && (this._overrides = u ? i(c, this._overrides) : c), u && this._saveOverridesToStorage();
      });
    }
    _saveOverridesToStorage() {
      if (this._sdkKey == null || !t.Storage.isReady())
        return;
      const a = this._getLocalOverridesStorageKey(this._sdkKey);
      t.Storage.setItem(a, JSON.stringify(this._overrides));
    }
    overrideGate(a, l) {
      this._overrides.gate[a] = l, this._overrides.gate[(0, t._DJB2)(a)] = l, this._saveOverridesToStorage();
    }
    _warnIfStorageNotReady() {
      t.Storage.isReady() || t.Log.warn("Storage is not ready. Override removal may not persist.");
    }
    removeGateOverride(a) {
      this._warnIfStorageNotReady(), delete this._overrides.gate[a], delete this._overrides.gate[(0, t._DJB2)(a)], this._saveOverridesToStorage();
    }
    getGateOverride(a, l) {
      var c;
      const u = (c = this._overrides.gate[a.name]) !== null && c !== void 0 ? c : this._overrides.gate[(0, t._DJB2)(a.name)];
      return u == null ? null : Object.assign(Object.assign({}, a), { value: u, details: Object.assign(Object.assign({}, a.details), { reason: n }) });
    }
    overrideDynamicConfig(a, l) {
      this._overrides.dynamicConfig[a] = l, this._overrides.dynamicConfig[(0, t._DJB2)(a)] = l, this._saveOverridesToStorage();
    }
    removeDynamicConfigOverride(a) {
      this._warnIfStorageNotReady(), delete this._overrides.dynamicConfig[a], delete this._overrides.dynamicConfig[(0, t._DJB2)(a)], this._saveOverridesToStorage();
    }
    getDynamicConfigOverride(a, l) {
      return this._getConfigOverride(a, this._overrides.dynamicConfig);
    }
    overrideExperiment(a, l) {
      this._overrides.experiment[a] = l, this._overrides.experiment[(0, t._DJB2)(a)] = l, this._saveOverridesToStorage();
    }
    removeExperimentOverride(a) {
      this._warnIfStorageNotReady(), delete this._overrides.experiment[a], delete this._overrides.experiment[(0, t._DJB2)(a)], this._saveOverridesToStorage();
    }
    getExperimentOverride(a, l) {
      return this._getConfigOverride(a, this._overrides.experiment);
    }
    overrideLayer(a, l) {
      this._overrides.layer[a] = l, this._overrides.layer[(0, t._DJB2)(a)] = l, this._saveOverridesToStorage();
    }
    removeLayerOverride(a) {
      this._warnIfStorageNotReady(), delete this._overrides.layer[a], delete this._overrides.layer[(0, t._DJB2)(a)], this._saveOverridesToStorage();
    }
    getAllOverrides() {
      return JSON.parse(JSON.stringify(this._overrides));
    }
    removeAllOverrides() {
      this._warnIfStorageNotReady(), this._overrides = r(), this._saveOverridesToStorage();
    }
    getLayerOverride(a, l) {
      var c;
      const u = (c = this._overrides.layer[a.name]) !== null && c !== void 0 ? c : this._overrides.layer[(0, t._DJB2)(a.name)];
      return u == null ? null : Object.assign(Object.assign({}, a), { __value: u, get: (0, t._makeTypedGet)(a.name, u), details: Object.assign(Object.assign({}, a.details), { reason: n }) });
    }
    _getConfigOverride(a, l) {
      var c;
      const u = (c = l[a.name]) !== null && c !== void 0 ? c : l[(0, t._DJB2)(a.name)];
      return u == null ? null : Object.assign(Object.assign({}, a), { value: u, get: (0, t._makeTypedGet)(a.name, u), details: Object.assign(Object.assign({}, a.details), { reason: n }) });
    }
    _hasInMemoryOverrides() {
      return Object.keys(this._overrides.gate).length > 0 || Object.keys(this._overrides.dynamicConfig).length > 0 || Object.keys(this._overrides.experiment).length > 0 || Object.keys(this._overrides.layer).length > 0;
    }
  };
  return Mt.LocalOverrideAdapter = o, Mt;
}
var ea;
function gh() {
  return ea || (ea = 1, function(e) {
    var t = kt && kt.__createBinding || (Object.create ? function(r, i, o, s) {
      s === void 0 && (s = o);
      var a = Object.getOwnPropertyDescriptor(i, o);
      (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
        return i[o];
      } }), Object.defineProperty(r, s, a);
    } : function(r, i, o, s) {
      s === void 0 && (s = o), r[s] = i[o];
    }), n = kt && kt.__exportStar || function(r, i) {
      for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(i, o) && t(i, r, o);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), n(ph(), e);
  }(kt)), kt;
}
var _h = gh();
const vh = new Error("request for lock canceled");
var yh = function(e, t, n, r) {
  function i(o) {
    return o instanceof n ? o : new n(function(s) {
      s(o);
    });
  }
  return new (n || (n = Promise))(function(o, s) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (f) {
        s(f);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (f) {
        s(f);
      }
    }
    function c(u) {
      u.done ? o(u.value) : i(u.value).then(a, l);
    }
    c((r = r.apply(e, t || [])).next());
  });
};
class bh {
  constructor(t, n = vh) {
    this._value = t, this._cancelError = n, this._queue = [], this._weightedWaiters = [];
  }
  acquire(t = 1, n = 0) {
    if (t <= 0)
      throw new Error(`invalid weight ${t}: must be positive`);
    return new Promise((r, i) => {
      const o = { resolve: r, reject: i, weight: t, priority: n }, s = gu(this._queue, (a) => n <= a.priority);
      s === -1 && t <= this._value ? this._dispatchItem(o) : this._queue.splice(s + 1, 0, o);
    });
  }
  runExclusive(t) {
    return yh(this, arguments, void 0, function* (n, r = 1, i = 0) {
      const [o, s] = yield this.acquire(r, i);
      try {
        return yield n(o);
      } finally {
        s();
      }
    });
  }
  waitForUnlock(t = 1, n = 0) {
    if (t <= 0)
      throw new Error(`invalid weight ${t}: must be positive`);
    return this._couldLockImmediately(t, n) ? Promise.resolve() : new Promise((r) => {
      this._weightedWaiters[t - 1] || (this._weightedWaiters[t - 1] = []), Eh(this._weightedWaiters[t - 1], { resolve: r, priority: n });
    });
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(t) {
    this._value = t, this._dispatchQueue();
  }
  release(t = 1) {
    if (t <= 0)
      throw new Error(`invalid weight ${t}: must be positive`);
    this._value += t, this._dispatchQueue();
  }
  cancel() {
    this._queue.forEach((t) => t.reject(this._cancelError)), this._queue = [];
  }
  _dispatchQueue() {
    for (this._drainUnlockWaiters(); this._queue.length > 0 && this._queue[0].weight <= this._value; )
      this._dispatchItem(this._queue.shift()), this._drainUnlockWaiters();
  }
  _dispatchItem(t) {
    const n = this._value;
    this._value -= t.weight, t.resolve([n, this._newReleaser(t.weight)]);
  }
  _newReleaser(t) {
    let n = !1;
    return () => {
      n || (n = !0, this.release(t));
    };
  }
  _drainUnlockWaiters() {
    if (this._queue.length === 0)
      for (let t = this._value; t > 0; t--) {
        const n = this._weightedWaiters[t - 1];
        n && (n.forEach((r) => r.resolve()), this._weightedWaiters[t - 1] = []);
      }
    else {
      const t = this._queue[0].priority;
      for (let n = this._value; n > 0; n--) {
        const r = this._weightedWaiters[n - 1];
        if (!r)
          continue;
        const i = r.findIndex((o) => o.priority <= t);
        (i === -1 ? r : r.splice(0, i)).forEach((o) => o.resolve());
      }
    }
  }
  _couldLockImmediately(t, n) {
    return (this._queue.length === 0 || this._queue[0].priority < n) && t <= this._value;
  }
}
function Eh(e, t) {
  const n = gu(e, (r) => t.priority <= r.priority);
  e.splice(n + 1, 0, t);
}
function gu(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (t(e[n]))
      return n;
  return -1;
}
var wh = function(e, t, n, r) {
  function i(o) {
    return o instanceof n ? o : new n(function(s) {
      s(o);
    });
  }
  return new (n || (n = Promise))(function(o, s) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (f) {
        s(f);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (f) {
        s(f);
      }
    }
    function c(u) {
      u.done ? o(u.value) : i(u.value).then(a, l);
    }
    c((r = r.apply(e, t || [])).next());
  });
};
class Sh {
  constructor(t) {
    this._semaphore = new bh(1, t);
  }
  acquire() {
    return wh(this, arguments, void 0, function* (t = 0) {
      const [, n] = yield this._semaphore.acquire(1, t);
      return n;
    });
  }
  runExclusive(t, n = 0) {
    return this._semaphore.runExclusive(() => t(), 1, n);
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock(t = 0) {
    return this._semaphore.waitForUnlock(1, t);
  }
  release() {
    this._semaphore.isLocked() && this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
}
var _u = /* @__PURE__ */ ((e) => (e.GET_STATSIG_CLIENT = "get_statsig_client", e))(_u || {});
const Th = {
  get_statsig_client: new Sh()
};
async function Ch(e, t) {
  const n = await Th[e].acquire();
  try {
    return await t();
  } finally {
    n();
  }
}
const _r = "PUBLICLY-VISIBLE-js-client-browser", vr = "PUBLICLY-VISIBLE-react-client-experimental", vu = {
  // Key taken from https://github.com/openai/openai/blob/a175fc0a1cd1626918a9ee60c7f321bfa6370259/chatgpt/web/utils/statsig/constants.ts#L6
  [_r]: "client-tnE5GCU2F2cTxRiMbvTczMDT1jpwIigZHsZSdqiy4u",
  // Key taken from https://github.com/openai/openai/blob/a175fc0a1cd1626918a9ee60c7f321bfa6370259/chatgpt/web/utils/statsig/statsig-experimental.tsx#L19
  [vr]: "client-e603C1J5XKDc1uGaxqjKesU5bmT1Pge1gCndOG5OdhH"
}, Ih = "https://ab.chatgpt.com/v1";
class Rh {
  constructor(t) {
    x(this, "client");
    this.client = t;
  }
  checkGate(t) {
    return this.client.checkGate(t);
  }
  getFeatureGate(t) {
    return this.client.getFeatureGate(t);
  }
  getDynamicConfig(t) {
    return this.client.getDynamicConfig(t);
  }
}
const Jt = {
  [_r]: void 0,
  [vr]: void 0
};
async function or(e) {
  const t = e ?? vr;
  return await Ch(_u.GET_STATSIG_CLIENT, () => Ph(t));
}
async function Ah() {
  if (Object.values(Jt).some((e) => e !== void 0))
    throw new Error("Multi-initialized statsigClient");
  Se().subscribe(async (e) => {
    var t, n;
    for (const r of Object.keys(vu))
      (!(r in Jt) || !yu(
        (t = Jt[r]) == null ? void 0 : t.client.getContext().user,
        // @ts-expect-error https://linear.app/openai/issue/WIN-845/need-to-reconcile-statsiguser-types-between-web-and-sidetron
        (n = e.loggedInUser) == null ? void 0 : n.statsigUser
      )) && await or(r);
  });
}
function Oh() {
  return Ne ? new _h.LocalOverrideAdapter() : void 0;
}
async function Ph(e) {
  const t = Se().getState().loggedInUser, n = (t == null ? void 0 : t.statsigUser) ?? {
    userID: (t == null ? void 0 : t.userId) ?? Se().getState().loggedOutUserId,
    privateAttributes: {
      email: t == null ? void 0 : t.email
    }
  }, r = {
    ...n,
    custom: {
      ...n.custom || {},
      client_type: "windows_app",
      sidetron_version: he.getVersion()
    },
    appVersion: he.getVersion(),
    browserName: "Electron",
    userAgent: ur()
  }, i = Jt[e];
  if (i) {
    const o = i.client.getContext().user;
    return yu(o, r) || await i.client.updateUserAsync(r), i;
  } else {
    const o = new Rh(new mh.StatsigClient(vu[e], r, {
      networkConfig: {
        api: Ih
      },
      disableLogging: !1,
      environment: {
        tier: Ne ? "development" : "production"
      },
      overrideAdapter: Oh()
    }));
    return Jt[e] = o, await o.client.initializeAsync(), o;
  }
}
function yu(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.userID === t.userID;
}
async function Dh() {
  for (const e of Object.values(Jt))
    await (e == null ? void 0 : e.client.shutdown());
}
async function yr() {
  try {
    await Dh(), await $e.shutdown();
  } finally {
    he.quit();
  }
}
async function Lh() {
  ke.recordEvent(Qe.RelaunchingApp), he.relaunch({
    execPath: process.execPath,
    args: process.argv.slice(1)
  }), yr();
}
const xh = () => {
  const e = lc, t = Ma(), n = t.getState().currentWebEnvironment;
  return e.map((r) => ({
    label: r.name,
    type: "radio",
    checked: n.name === r.name,
    click: () => {
      t.getState().setEnvironment(r);
    }
  }));
};
function kh(e) {
  const t = Qn.readText();
  t.startsWith(`${wn}://${mt.desktopAuthPath}`) && e(t) && Qn.clear();
}
var Gn = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ta;
function Mh() {
  if (ta) return te;
  ta = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), o = Symbol.for("react.provider"), s = Symbol.for("react.context"), a = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), c = Symbol.for("react.memo"), u = Symbol.for("react.lazy"), f = Symbol.iterator;
  function p(T) {
    return T === null || typeof T != "object" ? null : (T = f && T[f] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var g = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, m = Object.assign, h = {};
  function v(T, _, S) {
    this.props = T, this.context = _, this.refs = h, this.updater = S || g;
  }
  v.prototype.isReactComponent = {}, v.prototype.setState = function(T, _) {
    if (typeof T != "object" && typeof T != "function" && T != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, T, _, "setState");
  }, v.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function w() {
  }
  w.prototype = v.prototype;
  function E(T, _, S) {
    this.props = T, this.context = _, this.refs = h, this.updater = S || g;
  }
  var R = E.prototype = new w();
  R.constructor = E, m(R, v.prototype), R.isPureReactComponent = !0;
  var M = Array.isArray, b = Object.prototype.hasOwnProperty, P = { current: null }, U = { key: !0, ref: !0, __self: !0, __source: !0 };
  function H(T, _, S) {
    var C, I = {}, L = null, k = null;
    if (_ != null) for (C in _.ref !== void 0 && (k = _.ref), _.key !== void 0 && (L = "" + _.key), _) b.call(_, C) && !U.hasOwnProperty(C) && (I[C] = _[C]);
    var W = arguments.length - 2;
    if (W === 1) I.children = S;
    else if (1 < W) {
      for (var q = Array(W), Z = 0; Z < W; Z++) q[Z] = arguments[Z + 2];
      I.children = q;
    }
    if (T && T.defaultProps) for (C in W = T.defaultProps, W) I[C] === void 0 && (I[C] = W[C]);
    return { $$typeof: e, type: T, key: L, ref: k, props: I, _owner: P.current };
  }
  function Y(T, _) {
    return { $$typeof: e, type: T.type, key: _, ref: T.ref, props: T.props, _owner: T._owner };
  }
  function ue(T) {
    return typeof T == "object" && T !== null && T.$$typeof === e;
  }
  function de(T) {
    var _ = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function(S) {
      return _[S];
    });
  }
  var Ce = /\/+/g;
  function ye(T, _) {
    return typeof T == "object" && T !== null && T.key != null ? de("" + T.key) : _.toString(36);
  }
  function ve(T, _, S, C, I) {
    var L = typeof T;
    (L === "undefined" || L === "boolean") && (T = null);
    var k = !1;
    if (T === null) k = !0;
    else switch (L) {
      case "string":
      case "number":
        k = !0;
        break;
      case "object":
        switch (T.$$typeof) {
          case e:
          case t:
            k = !0;
        }
    }
    if (k) return k = T, I = I(k), T = C === "" ? "." + ye(k, 0) : C, M(I) ? (S = "", T != null && (S = T.replace(Ce, "$&/") + "/"), ve(I, _, S, "", function(Z) {
      return Z;
    })) : I != null && (ue(I) && (I = Y(I, S + (!I.key || k && k.key === I.key ? "" : ("" + I.key).replace(Ce, "$&/") + "/") + T)), _.push(I)), 1;
    if (k = 0, C = C === "" ? "." : C + ":", M(T)) for (var W = 0; W < T.length; W++) {
      L = T[W];
      var q = C + ye(L, W);
      k += ve(L, _, S, q, I);
    }
    else if (q = p(T), typeof q == "function") for (T = q.call(T), W = 0; !(L = T.next()).done; ) L = L.value, q = C + ye(L, W++), k += ve(L, _, S, q, I);
    else if (L === "object") throw _ = String(T), Error("Objects are not valid as a React child (found: " + (_ === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : _) + "). If you meant to render a collection of children, use an array instead.");
    return k;
  }
  function V(T, _, S) {
    if (T == null) return T;
    var C = [], I = 0;
    return ve(T, C, "", "", function(L) {
      return _.call(S, L, I++);
    }), C;
  }
  function N(T) {
    if (T._status === -1) {
      var _ = T._result;
      _ = _(), _.then(function(S) {
        (T._status === 0 || T._status === -1) && (T._status = 1, T._result = S);
      }, function(S) {
        (T._status === 0 || T._status === -1) && (T._status = 2, T._result = S);
      }), T._status === -1 && (T._status = 0, T._result = _);
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var O = { current: null }, z = { transition: null }, X = { ReactCurrentDispatcher: O, ReactCurrentBatchConfig: z, ReactCurrentOwner: P };
  function ee() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: V, forEach: function(T, _, S) {
    V(T, function() {
      _.apply(this, arguments);
    }, S);
  }, count: function(T) {
    var _ = 0;
    return V(T, function() {
      _++;
    }), _;
  }, toArray: function(T) {
    return V(T, function(_) {
      return _;
    }) || [];
  }, only: function(T) {
    if (!ue(T)) throw Error("React.Children.only expected to receive a single React element child.");
    return T;
  } }, te.Component = v, te.Fragment = n, te.Profiler = i, te.PureComponent = E, te.StrictMode = r, te.Suspense = l, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = X, te.act = ee, te.cloneElement = function(T, _, S) {
    if (T == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
    var C = m({}, T.props), I = T.key, L = T.ref, k = T._owner;
    if (_ != null) {
      if (_.ref !== void 0 && (L = _.ref, k = P.current), _.key !== void 0 && (I = "" + _.key), T.type && T.type.defaultProps) var W = T.type.defaultProps;
      for (q in _) b.call(_, q) && !U.hasOwnProperty(q) && (C[q] = _[q] === void 0 && W !== void 0 ? W[q] : _[q]);
    }
    var q = arguments.length - 2;
    if (q === 1) C.children = S;
    else if (1 < q) {
      W = Array(q);
      for (var Z = 0; Z < q; Z++) W[Z] = arguments[Z + 2];
      C.children = W;
    }
    return { $$typeof: e, type: T.type, key: I, ref: L, props: C, _owner: k };
  }, te.createContext = function(T) {
    return T = { $$typeof: s, _currentValue: T, _currentValue2: T, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, T.Provider = { $$typeof: o, _context: T }, T.Consumer = T;
  }, te.createElement = H, te.createFactory = function(T) {
    var _ = H.bind(null, T);
    return _.type = T, _;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(T) {
    return { $$typeof: a, render: T };
  }, te.isValidElement = ue, te.lazy = function(T) {
    return { $$typeof: u, _payload: { _status: -1, _result: T }, _init: N };
  }, te.memo = function(T, _) {
    return { $$typeof: c, type: T, compare: _ === void 0 ? null : _ };
  }, te.startTransition = function(T) {
    var _ = z.transition;
    z.transition = {};
    try {
      T();
    } finally {
      z.transition = _;
    }
  }, te.unstable_act = ee, te.useCallback = function(T, _) {
    return O.current.useCallback(T, _);
  }, te.useContext = function(T) {
    return O.current.useContext(T);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(T) {
    return O.current.useDeferredValue(T);
  }, te.useEffect = function(T, _) {
    return O.current.useEffect(T, _);
  }, te.useId = function() {
    return O.current.useId();
  }, te.useImperativeHandle = function(T, _, S) {
    return O.current.useImperativeHandle(T, _, S);
  }, te.useInsertionEffect = function(T, _) {
    return O.current.useInsertionEffect(T, _);
  }, te.useLayoutEffect = function(T, _) {
    return O.current.useLayoutEffect(T, _);
  }, te.useMemo = function(T, _) {
    return O.current.useMemo(T, _);
  }, te.useReducer = function(T, _, S) {
    return O.current.useReducer(T, _, S);
  }, te.useRef = function(T) {
    return O.current.useRef(T);
  }, te.useState = function(T) {
    return O.current.useState(T);
  }, te.useSyncExternalStore = function(T, _, S) {
    return O.current.useSyncExternalStore(T, _, S);
  }, te.useTransition = function() {
    return O.current.useTransition();
  }, te.version = "18.3.1", te;
}
var En = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
En.exports;
var na;
function Nh() {
  return na || (na = 1, function(e, t) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var n = "18.3.1", r = Symbol.for("react.element"), i = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), g = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), h = Symbol.for("react.offscreen"), v = Symbol.iterator, w = "@@iterator";
      function E(d) {
        if (d === null || typeof d != "object")
          return null;
        var y = v && d[v] || d[w];
        return typeof y == "function" ? y : null;
      }
      var R = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, M = {
        transition: null
      }, b = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, P = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, U = {}, H = null;
      function Y(d) {
        H = d;
      }
      U.setExtraStackFrame = function(d) {
        H = d;
      }, U.getCurrentStack = null, U.getStackAddendum = function() {
        var d = "";
        H && (d += H);
        var y = U.getCurrentStack;
        return y && (d += y() || ""), d;
      };
      var ue = !1, de = !1, Ce = !1, ye = !1, ve = !1, V = {
        ReactCurrentDispatcher: R,
        ReactCurrentBatchConfig: M,
        ReactCurrentOwner: P
      };
      V.ReactDebugCurrentFrame = U, V.ReactCurrentActQueue = b;
      function N(d) {
        {
          for (var y = arguments.length, A = new Array(y > 1 ? y - 1 : 0), D = 1; D < y; D++)
            A[D - 1] = arguments[D];
          z("warn", d, A);
        }
      }
      function O(d) {
        {
          for (var y = arguments.length, A = new Array(y > 1 ? y - 1 : 0), D = 1; D < y; D++)
            A[D - 1] = arguments[D];
          z("error", d, A);
        }
      }
      function z(d, y, A) {
        {
          var D = V.ReactDebugCurrentFrame, j = D.getStackAddendum();
          j !== "" && (y += "%s", A = A.concat([j]));
          var K = A.map(function($) {
            return String($);
          });
          K.unshift("Warning: " + y), Function.prototype.apply.call(console[d], console, K);
        }
      }
      var X = {};
      function ee(d, y) {
        {
          var A = d.constructor, D = A && (A.displayName || A.name) || "ReactClass", j = D + "." + y;
          if (X[j])
            return;
          O("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", y, D), X[j] = !0;
        }
      }
      var T = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(d) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(d, y, A) {
          ee(d, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(d, y, A, D) {
          ee(d, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(d, y, A, D) {
          ee(d, "setState");
        }
      }, _ = Object.assign, S = {};
      Object.freeze(S);
      function C(d, y, A) {
        this.props = d, this.context = y, this.refs = S, this.updater = A || T;
      }
      C.prototype.isReactComponent = {}, C.prototype.setState = function(d, y) {
        if (typeof d != "object" && typeof d != "function" && d != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, d, y, "setState");
      }, C.prototype.forceUpdate = function(d) {
        this.updater.enqueueForceUpdate(this, d, "forceUpdate");
      };
      {
        var I = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, L = function(d, y) {
          Object.defineProperty(C.prototype, d, {
            get: function() {
              N("%s(...) is deprecated in plain JavaScript React classes. %s", y[0], y[1]);
            }
          });
        };
        for (var k in I)
          I.hasOwnProperty(k) && L(k, I[k]);
      }
      function W() {
      }
      W.prototype = C.prototype;
      function q(d, y, A) {
        this.props = d, this.context = y, this.refs = S, this.updater = A || T;
      }
      var Z = q.prototype = new W();
      Z.constructor = q, _(Z, C.prototype), Z.isPureReactComponent = !0;
      function J() {
        var d = {
          current: null
        };
        return Object.seal(d), d;
      }
      var B = Array.isArray;
      function ae(d) {
        return B(d);
      }
      function Re(d) {
        {
          var y = typeof Symbol == "function" && Symbol.toStringTag, A = y && d[Symbol.toStringTag] || d.constructor.name || "Object";
          return A;
        }
      }
      function se(d) {
        try {
          return be(d), !1;
        } catch {
          return !0;
        }
      }
      function be(d) {
        return "" + d;
      }
      function Te(d) {
        if (se(d))
          return O("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Re(d)), be(d);
      }
      function We(d, y, A) {
        var D = d.displayName;
        if (D)
          return D;
        var j = y.displayName || y.name || "";
        return j !== "" ? A + "(" + j + ")" : A;
      }
      function Ve(d) {
        return d.displayName || "Context";
      }
      function ct(d) {
        if (d == null)
          return null;
        if (typeof d.tag == "number" && O("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof d == "function")
          return d.displayName || d.name || null;
        if (typeof d == "string")
          return d;
        switch (d) {
          case o:
            return "Fragment";
          case i:
            return "Portal";
          case a:
            return "Profiler";
          case s:
            return "StrictMode";
          case f:
            return "Suspense";
          case p:
            return "SuspenseList";
        }
        if (typeof d == "object")
          switch (d.$$typeof) {
            case c:
              var y = d;
              return Ve(y) + ".Consumer";
            case l:
              var A = d;
              return Ve(A._context) + ".Provider";
            case u:
              return We(d, d.render, "ForwardRef");
            case g:
              var D = d.displayName || null;
              return D !== null ? D : ct(d.type) || "Memo";
            case m: {
              var j = d, K = j._payload, $ = j._init;
              try {
                return ct($(K));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var nn = Object.prototype.hasOwnProperty, co = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, fo, ho, wr;
      wr = {};
      function mo(d) {
        if (nn.call(d, "ref")) {
          var y = Object.getOwnPropertyDescriptor(d, "ref").get;
          if (y && y.isReactWarning)
            return !1;
        }
        return d.ref !== void 0;
      }
      function po(d) {
        if (nn.call(d, "key")) {
          var y = Object.getOwnPropertyDescriptor(d, "key").get;
          if (y && y.isReactWarning)
            return !1;
        }
        return d.key !== void 0;
      }
      function Yu(d, y) {
        var A = function() {
          fo || (fo = !0, O("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", y));
        };
        A.isReactWarning = !0, Object.defineProperty(d, "key", {
          get: A,
          configurable: !0
        });
      }
      function Zu(d, y) {
        var A = function() {
          ho || (ho = !0, O("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", y));
        };
        A.isReactWarning = !0, Object.defineProperty(d, "ref", {
          get: A,
          configurable: !0
        });
      }
      function Qu(d) {
        if (typeof d.ref == "string" && P.current && d.__self && P.current.stateNode !== d.__self) {
          var y = ct(P.current.type);
          wr[y] || (O('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', y, d.ref), wr[y] = !0);
        }
      }
      var Sr = function(d, y, A, D, j, K, $) {
        var Q = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: r,
          // Built-in properties that belong on the element
          type: d,
          key: y,
          ref: A,
          props: $,
          // Record the component responsible for creating this element.
          _owner: K
        };
        return Q._store = {}, Object.defineProperty(Q._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Q, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: D
        }), Object.defineProperty(Q, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: j
        }), Object.freeze && (Object.freeze(Q.props), Object.freeze(Q)), Q;
      };
      function el(d, y, A) {
        var D, j = {}, K = null, $ = null, Q = null, ie = null;
        if (y != null) {
          mo(y) && ($ = y.ref, Qu(y)), po(y) && (Te(y.key), K = "" + y.key), Q = y.__self === void 0 ? null : y.__self, ie = y.__source === void 0 ? null : y.__source;
          for (D in y)
            nn.call(y, D) && !co.hasOwnProperty(D) && (j[D] = y[D]);
        }
        var fe = arguments.length - 2;
        if (fe === 1)
          j.children = A;
        else if (fe > 1) {
          for (var me = Array(fe), pe = 0; pe < fe; pe++)
            me[pe] = arguments[pe + 2];
          Object.freeze && Object.freeze(me), j.children = me;
        }
        if (d && d.defaultProps) {
          var _e = d.defaultProps;
          for (D in _e)
            j[D] === void 0 && (j[D] = _e[D]);
        }
        if (K || $) {
          var Ee = typeof d == "function" ? d.displayName || d.name || "Unknown" : d;
          K && Yu(j, Ee), $ && Zu(j, Ee);
        }
        return Sr(d, K, $, Q, ie, P.current, j);
      }
      function tl(d, y) {
        var A = Sr(d.type, y, d.ref, d._self, d._source, d._owner, d.props);
        return A;
      }
      function nl(d, y, A) {
        if (d == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + d + ".");
        var D, j = _({}, d.props), K = d.key, $ = d.ref, Q = d._self, ie = d._source, fe = d._owner;
        if (y != null) {
          mo(y) && ($ = y.ref, fe = P.current), po(y) && (Te(y.key), K = "" + y.key);
          var me;
          d.type && d.type.defaultProps && (me = d.type.defaultProps);
          for (D in y)
            nn.call(y, D) && !co.hasOwnProperty(D) && (y[D] === void 0 && me !== void 0 ? j[D] = me[D] : j[D] = y[D]);
        }
        var pe = arguments.length - 2;
        if (pe === 1)
          j.children = A;
        else if (pe > 1) {
          for (var _e = Array(pe), Ee = 0; Ee < pe; Ee++)
            _e[Ee] = arguments[Ee + 2];
          j.children = _e;
        }
        return Sr(d.type, K, $, Q, ie, fe, j);
      }
      function Bt(d) {
        return typeof d == "object" && d !== null && d.$$typeof === r;
      }
      var go = ".", rl = ":";
      function il(d) {
        var y = /[=:]/g, A = {
          "=": "=0",
          ":": "=2"
        }, D = d.replace(y, function(j) {
          return A[j];
        });
        return "$" + D;
      }
      var _o = !1, ol = /\/+/g;
      function vo(d) {
        return d.replace(ol, "$&/");
      }
      function Tr(d, y) {
        return typeof d == "object" && d !== null && d.key != null ? (Te(d.key), il("" + d.key)) : y.toString(36);
      }
      function Dn(d, y, A, D, j) {
        var K = typeof d;
        (K === "undefined" || K === "boolean") && (d = null);
        var $ = !1;
        if (d === null)
          $ = !0;
        else
          switch (K) {
            case "string":
            case "number":
              $ = !0;
              break;
            case "object":
              switch (d.$$typeof) {
                case r:
                case i:
                  $ = !0;
              }
          }
        if ($) {
          var Q = d, ie = j(Q), fe = D === "" ? go + Tr(Q, 0) : D;
          if (ae(ie)) {
            var me = "";
            fe != null && (me = vo(fe) + "/"), Dn(ie, y, me, "", function(Yl) {
              return Yl;
            });
          } else ie != null && (Bt(ie) && (ie.key && (!Q || Q.key !== ie.key) && Te(ie.key), ie = tl(
            ie,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            A + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (ie.key && (!Q || Q.key !== ie.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              vo("" + ie.key) + "/"
            ) : "") + fe
          )), y.push(ie));
          return 1;
        }
        var pe, _e, Ee = 0, Ie = D === "" ? go : D + rl;
        if (ae(d))
          for (var jn = 0; jn < d.length; jn++)
            pe = d[jn], _e = Ie + Tr(pe, jn), Ee += Dn(pe, y, A, _e, j);
        else {
          var xr = E(d);
          if (typeof xr == "function") {
            var Go = d;
            xr === Go.entries && (_o || N("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), _o = !0);
            for (var Jl = xr.call(Go), $o, Xl = 0; !($o = Jl.next()).done; )
              pe = $o.value, _e = Ie + Tr(pe, Xl++), Ee += Dn(pe, y, A, _e, j);
          } else if (K === "object") {
            var qo = String(d);
            throw new Error("Objects are not valid as a React child (found: " + (qo === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : qo) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Ee;
      }
      function Ln(d, y, A) {
        if (d == null)
          return d;
        var D = [], j = 0;
        return Dn(d, D, "", "", function(K) {
          return y.call(A, K, j++);
        }), D;
      }
      function sl(d) {
        var y = 0;
        return Ln(d, function() {
          y++;
        }), y;
      }
      function al(d, y, A) {
        Ln(d, function() {
          y.apply(this, arguments);
        }, A);
      }
      function ul(d) {
        return Ln(d, function(y) {
          return y;
        }) || [];
      }
      function ll(d) {
        if (!Bt(d))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return d;
      }
      function cl(d) {
        var y = {
          $$typeof: c,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: d,
          _currentValue2: d,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        y.Provider = {
          $$typeof: l,
          _context: y
        };
        var A = !1, D = !1, j = !1;
        {
          var K = {
            $$typeof: c,
            _context: y
          };
          Object.defineProperties(K, {
            Provider: {
              get: function() {
                return D || (D = !0, O("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), y.Provider;
              },
              set: function($) {
                y.Provider = $;
              }
            },
            _currentValue: {
              get: function() {
                return y._currentValue;
              },
              set: function($) {
                y._currentValue = $;
              }
            },
            _currentValue2: {
              get: function() {
                return y._currentValue2;
              },
              set: function($) {
                y._currentValue2 = $;
              }
            },
            _threadCount: {
              get: function() {
                return y._threadCount;
              },
              set: function($) {
                y._threadCount = $;
              }
            },
            Consumer: {
              get: function() {
                return A || (A = !0, O("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), y.Consumer;
              }
            },
            displayName: {
              get: function() {
                return y.displayName;
              },
              set: function($) {
                j || (N("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", $), j = !0);
              }
            }
          }), y.Consumer = K;
        }
        return y._currentRenderer = null, y._currentRenderer2 = null, y;
      }
      var rn = -1, Cr = 0, yo = 1, dl = 2;
      function fl(d) {
        if (d._status === rn) {
          var y = d._result, A = y();
          if (A.then(function(K) {
            if (d._status === Cr || d._status === rn) {
              var $ = d;
              $._status = yo, $._result = K;
            }
          }, function(K) {
            if (d._status === Cr || d._status === rn) {
              var $ = d;
              $._status = dl, $._result = K;
            }
          }), d._status === rn) {
            var D = d;
            D._status = Cr, D._result = A;
          }
        }
        if (d._status === yo) {
          var j = d._result;
          return j === void 0 && O(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, j), "default" in j || O(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, j), j.default;
        } else
          throw d._result;
      }
      function hl(d) {
        var y = {
          // We use these fields to store the result.
          _status: rn,
          _result: d
        }, A = {
          $$typeof: m,
          _payload: y,
          _init: fl
        };
        {
          var D, j;
          Object.defineProperties(A, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return D;
              },
              set: function(K) {
                O("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), D = K, Object.defineProperty(A, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return j;
              },
              set: function(K) {
                O("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), j = K, Object.defineProperty(A, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return A;
      }
      function ml(d) {
        d != null && d.$$typeof === g ? O("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof d != "function" ? O("forwardRef requires a render function but was given %s.", d === null ? "null" : typeof d) : d.length !== 0 && d.length !== 2 && O("forwardRef render functions accept exactly two parameters: props and ref. %s", d.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), d != null && (d.defaultProps != null || d.propTypes != null) && O("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var y = {
          $$typeof: u,
          render: d
        };
        {
          var A;
          Object.defineProperty(y, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return A;
            },
            set: function(D) {
              A = D, !d.name && !d.displayName && (d.displayName = D);
            }
          });
        }
        return y;
      }
      var bo;
      bo = Symbol.for("react.module.reference");
      function Eo(d) {
        return !!(typeof d == "string" || typeof d == "function" || d === o || d === a || ve || d === s || d === f || d === p || ye || d === h || ue || de || Ce || typeof d == "object" && d !== null && (d.$$typeof === m || d.$$typeof === g || d.$$typeof === l || d.$$typeof === c || d.$$typeof === u || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        d.$$typeof === bo || d.getModuleId !== void 0));
      }
      function pl(d, y) {
        Eo(d) || O("memo: The first argument must be a component. Instead received: %s", d === null ? "null" : typeof d);
        var A = {
          $$typeof: g,
          type: d,
          compare: y === void 0 ? null : y
        };
        {
          var D;
          Object.defineProperty(A, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return D;
            },
            set: function(j) {
              D = j, !d.name && !d.displayName && (d.displayName = j);
            }
          });
        }
        return A;
      }
      function Ae() {
        var d = R.current;
        return d === null && O(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), d;
      }
      function gl(d) {
        var y = Ae();
        if (d._context !== void 0) {
          var A = d._context;
          A.Consumer === d ? O("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : A.Provider === d && O("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return y.useContext(d);
      }
      function _l(d) {
        var y = Ae();
        return y.useState(d);
      }
      function vl(d, y, A) {
        var D = Ae();
        return D.useReducer(d, y, A);
      }
      function yl(d) {
        var y = Ae();
        return y.useRef(d);
      }
      function bl(d, y) {
        var A = Ae();
        return A.useEffect(d, y);
      }
      function El(d, y) {
        var A = Ae();
        return A.useInsertionEffect(d, y);
      }
      function wl(d, y) {
        var A = Ae();
        return A.useLayoutEffect(d, y);
      }
      function Sl(d, y) {
        var A = Ae();
        return A.useCallback(d, y);
      }
      function Tl(d, y) {
        var A = Ae();
        return A.useMemo(d, y);
      }
      function Cl(d, y, A) {
        var D = Ae();
        return D.useImperativeHandle(d, y, A);
      }
      function Il(d, y) {
        {
          var A = Ae();
          return A.useDebugValue(d, y);
        }
      }
      function Rl() {
        var d = Ae();
        return d.useTransition();
      }
      function Al(d) {
        var y = Ae();
        return y.useDeferredValue(d);
      }
      function Ol() {
        var d = Ae();
        return d.useId();
      }
      function Pl(d, y, A) {
        var D = Ae();
        return D.useSyncExternalStore(d, y, A);
      }
      var on = 0, wo, So, To, Co, Io, Ro, Ao;
      function Oo() {
      }
      Oo.__reactDisabledLog = !0;
      function Dl() {
        {
          if (on === 0) {
            wo = console.log, So = console.info, To = console.warn, Co = console.error, Io = console.group, Ro = console.groupCollapsed, Ao = console.groupEnd;
            var d = {
              configurable: !0,
              enumerable: !0,
              value: Oo,
              writable: !0
            };
            Object.defineProperties(console, {
              info: d,
              log: d,
              warn: d,
              error: d,
              group: d,
              groupCollapsed: d,
              groupEnd: d
            });
          }
          on++;
        }
      }
      function Ll() {
        {
          if (on--, on === 0) {
            var d = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _({}, d, {
                value: wo
              }),
              info: _({}, d, {
                value: So
              }),
              warn: _({}, d, {
                value: To
              }),
              error: _({}, d, {
                value: Co
              }),
              group: _({}, d, {
                value: Io
              }),
              groupCollapsed: _({}, d, {
                value: Ro
              }),
              groupEnd: _({}, d, {
                value: Ao
              })
            });
          }
          on < 0 && O("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Ir = V.ReactCurrentDispatcher, Rr;
      function xn(d, y, A) {
        {
          if (Rr === void 0)
            try {
              throw Error();
            } catch (j) {
              var D = j.stack.trim().match(/\n( *(at )?)/);
              Rr = D && D[1] || "";
            }
          return `
` + Rr + d;
        }
      }
      var Ar = !1, kn;
      {
        var xl = typeof WeakMap == "function" ? WeakMap : Map;
        kn = new xl();
      }
      function Po(d, y) {
        if (!d || Ar)
          return "";
        {
          var A = kn.get(d);
          if (A !== void 0)
            return A;
        }
        var D;
        Ar = !0;
        var j = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var K;
        K = Ir.current, Ir.current = null, Dl();
        try {
          if (y) {
            var $ = function() {
              throw Error();
            };
            if (Object.defineProperty($.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct($, []);
              } catch (Ie) {
                D = Ie;
              }
              Reflect.construct(d, [], $);
            } else {
              try {
                $.call();
              } catch (Ie) {
                D = Ie;
              }
              d.call($.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Ie) {
              D = Ie;
            }
            d();
          }
        } catch (Ie) {
          if (Ie && D && typeof Ie.stack == "string") {
            for (var Q = Ie.stack.split(`
`), ie = D.stack.split(`
`), fe = Q.length - 1, me = ie.length - 1; fe >= 1 && me >= 0 && Q[fe] !== ie[me]; )
              me--;
            for (; fe >= 1 && me >= 0; fe--, me--)
              if (Q[fe] !== ie[me]) {
                if (fe !== 1 || me !== 1)
                  do
                    if (fe--, me--, me < 0 || Q[fe] !== ie[me]) {
                      var pe = `
` + Q[fe].replace(" at new ", " at ");
                      return d.displayName && pe.includes("<anonymous>") && (pe = pe.replace("<anonymous>", d.displayName)), typeof d == "function" && kn.set(d, pe), pe;
                    }
                  while (fe >= 1 && me >= 0);
                break;
              }
          }
        } finally {
          Ar = !1, Ir.current = K, Ll(), Error.prepareStackTrace = j;
        }
        var _e = d ? d.displayName || d.name : "", Ee = _e ? xn(_e) : "";
        return typeof d == "function" && kn.set(d, Ee), Ee;
      }
      function kl(d, y, A) {
        return Po(d, !1);
      }
      function Ml(d) {
        var y = d.prototype;
        return !!(y && y.isReactComponent);
      }
      function Mn(d, y, A) {
        if (d == null)
          return "";
        if (typeof d == "function")
          return Po(d, Ml(d));
        if (typeof d == "string")
          return xn(d);
        switch (d) {
          case f:
            return xn("Suspense");
          case p:
            return xn("SuspenseList");
        }
        if (typeof d == "object")
          switch (d.$$typeof) {
            case u:
              return kl(d.render);
            case g:
              return Mn(d.type, y, A);
            case m: {
              var D = d, j = D._payload, K = D._init;
              try {
                return Mn(K(j), y, A);
              } catch {
              }
            }
          }
        return "";
      }
      var Do = {}, Lo = V.ReactDebugCurrentFrame;
      function Nn(d) {
        if (d) {
          var y = d._owner, A = Mn(d.type, d._source, y ? y.type : null);
          Lo.setExtraStackFrame(A);
        } else
          Lo.setExtraStackFrame(null);
      }
      function Nl(d, y, A, D, j) {
        {
          var K = Function.call.bind(nn);
          for (var $ in d)
            if (K(d, $)) {
              var Q = void 0;
              try {
                if (typeof d[$] != "function") {
                  var ie = Error((D || "React class") + ": " + A + " type `" + $ + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof d[$] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw ie.name = "Invariant Violation", ie;
                }
                Q = d[$](y, $, D, A, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (fe) {
                Q = fe;
              }
              Q && !(Q instanceof Error) && (Nn(j), O("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", D || "React class", A, $, typeof Q), Nn(null)), Q instanceof Error && !(Q.message in Do) && (Do[Q.message] = !0, Nn(j), O("Failed %s type: %s", A, Q.message), Nn(null));
            }
        }
      }
      function Ht(d) {
        if (d) {
          var y = d._owner, A = Mn(d.type, d._source, y ? y.type : null);
          Y(A);
        } else
          Y(null);
      }
      var Or;
      Or = !1;
      function xo() {
        if (P.current) {
          var d = ct(P.current.type);
          if (d)
            return `

Check the render method of \`` + d + "`.";
        }
        return "";
      }
      function Ul(d) {
        if (d !== void 0) {
          var y = d.fileName.replace(/^.*[\\\/]/, ""), A = d.lineNumber;
          return `

Check your code at ` + y + ":" + A + ".";
        }
        return "";
      }
      function Fl(d) {
        return d != null ? Ul(d.__source) : "";
      }
      var ko = {};
      function jl(d) {
        var y = xo();
        if (!y) {
          var A = typeof d == "string" ? d : d.displayName || d.name;
          A && (y = `

Check the top-level render call using <` + A + ">.");
        }
        return y;
      }
      function Mo(d, y) {
        if (!(!d._store || d._store.validated || d.key != null)) {
          d._store.validated = !0;
          var A = jl(y);
          if (!ko[A]) {
            ko[A] = !0;
            var D = "";
            d && d._owner && d._owner !== P.current && (D = " It was passed a child from " + ct(d._owner.type) + "."), Ht(d), O('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', A, D), Ht(null);
          }
        }
      }
      function No(d, y) {
        if (typeof d == "object") {
          if (ae(d))
            for (var A = 0; A < d.length; A++) {
              var D = d[A];
              Bt(D) && Mo(D, y);
            }
          else if (Bt(d))
            d._store && (d._store.validated = !0);
          else if (d) {
            var j = E(d);
            if (typeof j == "function" && j !== d.entries)
              for (var K = j.call(d), $; !($ = K.next()).done; )
                Bt($.value) && Mo($.value, y);
          }
        }
      }
      function Uo(d) {
        {
          var y = d.type;
          if (y == null || typeof y == "string")
            return;
          var A;
          if (typeof y == "function")
            A = y.propTypes;
          else if (typeof y == "object" && (y.$$typeof === u || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          y.$$typeof === g))
            A = y.propTypes;
          else
            return;
          if (A) {
            var D = ct(y);
            Nl(A, d.props, "prop", D, d);
          } else if (y.PropTypes !== void 0 && !Or) {
            Or = !0;
            var j = ct(y);
            O("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", j || "Unknown");
          }
          typeof y.getDefaultProps == "function" && !y.getDefaultProps.isReactClassApproved && O("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Wl(d) {
        {
          for (var y = Object.keys(d.props), A = 0; A < y.length; A++) {
            var D = y[A];
            if (D !== "children" && D !== "key") {
              Ht(d), O("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", D), Ht(null);
              break;
            }
          }
          d.ref !== null && (Ht(d), O("Invalid attribute `ref` supplied to `React.Fragment`."), Ht(null));
        }
      }
      function Fo(d, y, A) {
        var D = Eo(d);
        if (!D) {
          var j = "";
          (d === void 0 || typeof d == "object" && d !== null && Object.keys(d).length === 0) && (j += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var K = Fl(y);
          K ? j += K : j += xo();
          var $;
          d === null ? $ = "null" : ae(d) ? $ = "array" : d !== void 0 && d.$$typeof === r ? ($ = "<" + (ct(d.type) || "Unknown") + " />", j = " Did you accidentally export a JSX literal instead of a component?") : $ = typeof d, O("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", $, j);
        }
        var Q = el.apply(this, arguments);
        if (Q == null)
          return Q;
        if (D)
          for (var ie = 2; ie < arguments.length; ie++)
            No(arguments[ie], d);
        return d === o ? Wl(Q) : Uo(Q), Q;
      }
      var jo = !1;
      function Bl(d) {
        var y = Fo.bind(null, d);
        return y.type = d, jo || (jo = !0, N("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(y, "type", {
          enumerable: !1,
          get: function() {
            return N("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: d
            }), d;
          }
        }), y;
      }
      function Hl(d, y, A) {
        for (var D = nl.apply(this, arguments), j = 2; j < arguments.length; j++)
          No(arguments[j], D.type);
        return Uo(D), D;
      }
      function Gl(d, y) {
        var A = M.transition;
        M.transition = {};
        var D = M.transition;
        M.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          d();
        } finally {
          if (M.transition = A, A === null && D._updatedFibers) {
            var j = D._updatedFibers.size;
            j > 10 && N("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), D._updatedFibers.clear();
          }
        }
      }
      var Wo = !1, Un = null;
      function $l(d) {
        if (Un === null)
          try {
            var y = ("require" + Math.random()).slice(0, 7), A = e && e[y];
            Un = A.call(e, "timers").setImmediate;
          } catch {
            Un = function(j) {
              Wo === !1 && (Wo = !0, typeof MessageChannel > "u" && O("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var K = new MessageChannel();
              K.port1.onmessage = j, K.port2.postMessage(void 0);
            };
          }
        return Un(d);
      }
      var Gt = 0, Bo = !1;
      function Ho(d) {
        {
          var y = Gt;
          Gt++, b.current === null && (b.current = []);
          var A = b.isBatchingLegacy, D;
          try {
            if (b.isBatchingLegacy = !0, D = d(), !A && b.didScheduleLegacyUpdate) {
              var j = b.current;
              j !== null && (b.didScheduleLegacyUpdate = !1, Lr(j));
            }
          } catch (_e) {
            throw Fn(y), _e;
          } finally {
            b.isBatchingLegacy = A;
          }
          if (D !== null && typeof D == "object" && typeof D.then == "function") {
            var K = D, $ = !1, Q = {
              then: function(_e, Ee) {
                $ = !0, K.then(function(Ie) {
                  Fn(y), Gt === 0 ? Pr(Ie, _e, Ee) : _e(Ie);
                }, function(Ie) {
                  Fn(y), Ee(Ie);
                });
              }
            };
            return !Bo && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              $ || (Bo = !0, O("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Q;
          } else {
            var ie = D;
            if (Fn(y), Gt === 0) {
              var fe = b.current;
              fe !== null && (Lr(fe), b.current = null);
              var me = {
                then: function(_e, Ee) {
                  b.current === null ? (b.current = [], Pr(ie, _e, Ee)) : _e(ie);
                }
              };
              return me;
            } else {
              var pe = {
                then: function(_e, Ee) {
                  _e(ie);
                }
              };
              return pe;
            }
          }
        }
      }
      function Fn(d) {
        d !== Gt - 1 && O("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Gt = d;
      }
      function Pr(d, y, A) {
        {
          var D = b.current;
          if (D !== null)
            try {
              Lr(D), $l(function() {
                D.length === 0 ? (b.current = null, y(d)) : Pr(d, y, A);
              });
            } catch (j) {
              A(j);
            }
          else
            y(d);
        }
      }
      var Dr = !1;
      function Lr(d) {
        if (!Dr) {
          Dr = !0;
          var y = 0;
          try {
            for (; y < d.length; y++) {
              var A = d[y];
              do
                A = A(!0);
              while (A !== null);
            }
            d.length = 0;
          } catch (D) {
            throw d = d.slice(y + 1), D;
          } finally {
            Dr = !1;
          }
        }
      }
      var ql = Fo, Vl = Hl, zl = Bl, Kl = {
        map: Ln,
        forEach: al,
        count: sl,
        toArray: ul,
        only: ll
      };
      t.Children = Kl, t.Component = C, t.Fragment = o, t.Profiler = a, t.PureComponent = q, t.StrictMode = s, t.Suspense = f, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = V, t.act = Ho, t.cloneElement = Vl, t.createContext = cl, t.createElement = ql, t.createFactory = zl, t.createRef = J, t.forwardRef = ml, t.isValidElement = Bt, t.lazy = hl, t.memo = pl, t.startTransition = Gl, t.unstable_act = Ho, t.useCallback = Sl, t.useContext = gl, t.useDebugValue = Il, t.useDeferredValue = Al, t.useEffect = bl, t.useId = Ol, t.useImperativeHandle = Cl, t.useInsertionEffect = El, t.useLayoutEffect = wl, t.useMemo = Tl, t.useReducer = vl, t.useRef = yl, t.useState = _l, t.useSyncExternalStore = Pl, t.useTransition = Rl, t.version = n, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(En, En.exports)), En.exports;
}
var ra;
function Uh() {
  return ra || (ra = 1, process.env.NODE_ENV === "production" ? Gn.exports = Mh() : Gn.exports = Nh()), Gn.exports;
}
var qe = Uh();
function Ye(e, t) {
  var n = t && t.cache ? t.cache : $h, r = t && t.serializer ? t.serializer : Hh, i = t && t.strategy ? t.strategy : Wh;
  return i(e, {
    cache: n,
    serializer: r
  });
}
function Fh(e) {
  return e == null || typeof e == "number" || typeof e == "boolean";
}
function jh(e, t, n, r) {
  var i = Fh(r) ? r : n(r), o = t.get(i);
  return typeof o > "u" && (o = e.call(this, r), t.set(i, o)), o;
}
function bu(e, t, n) {
  var r = Array.prototype.slice.call(arguments, 3), i = n(r), o = t.get(i);
  return typeof o > "u" && (o = e.apply(this, r), t.set(i, o)), o;
}
function Eu(e, t, n, r, i) {
  return n.bind(t, e, r, i);
}
function Wh(e, t) {
  var n = e.length === 1 ? jh : bu;
  return Eu(e, this, n, t.cache.create(), t.serializer);
}
function Bh(e, t) {
  return Eu(e, this, bu, t.cache.create(), t.serializer);
}
var Hh = function() {
  return JSON.stringify(arguments);
}, Gh = (
  /** @class */
  function() {
    function e() {
      this.cache = /* @__PURE__ */ Object.create(null);
    }
    return e.prototype.get = function(t) {
      return this.cache[t];
    }, e.prototype.set = function(t, n) {
      this.cache[t] = n;
    }, e;
  }()
), $h = {
  create: function() {
    return new Gh();
  }
}, Ze = {
  variadic: Bh
}, re;
(function(e) {
  e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(re || (re = {}));
var ge;
(function(e) {
  e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
})(ge || (ge = {}));
var Zt;
(function(e) {
  e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
})(Zt || (Zt = {}));
function ia(e) {
  return e.type === ge.literal;
}
function qh(e) {
  return e.type === ge.argument;
}
function wu(e) {
  return e.type === ge.number;
}
function Su(e) {
  return e.type === ge.date;
}
function Tu(e) {
  return e.type === ge.time;
}
function Cu(e) {
  return e.type === ge.select;
}
function Iu(e) {
  return e.type === ge.plural;
}
function Vh(e) {
  return e.type === ge.pound;
}
function Ru(e) {
  return e.type === ge.tag;
}
function Au(e) {
  return !!(e && typeof e == "object" && e.type === Zt.number);
}
function Oi(e) {
  return !!(e && typeof e == "object" && e.type === Zt.dateTime);
}
var Ou = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, zh = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function Kh(e) {
  var t = {};
  return e.replace(zh, function(n) {
    var r = n.length;
    switch (n[0]) {
      // Era
      case "G":
        t.era = r === 4 ? "long" : r === 5 ? "narrow" : "short";
        break;
      // Year
      case "y":
        t.year = r === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      // Quarter
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      // Month
      case "M":
      case "L":
        t.month = ["numeric", "2-digit", "short", "long", "narrow"][r - 1];
        break;
      // Week
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        t.day = ["numeric", "2-digit"][r - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      // Weekday
      case "E":
        t.weekday = r === 4 ? "long" : r === 5 ? "narrow" : "short";
        break;
      case "e":
        if (r < 4)
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        t.weekday = ["short", "long", "narrow", "short"][r - 4];
        break;
      case "c":
        if (r < 4)
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        t.weekday = ["short", "long", "narrow", "short"][r - 4];
        break;
      // Period
      case "a":
        t.hour12 = !0;
        break;
      case "b":
      // am, pm, noon, midnight
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      // Hour
      case "h":
        t.hourCycle = "h12", t.hour = ["numeric", "2-digit"][r - 1];
        break;
      case "H":
        t.hourCycle = "h23", t.hour = ["numeric", "2-digit"][r - 1];
        break;
      case "K":
        t.hourCycle = "h11", t.hour = ["numeric", "2-digit"][r - 1];
        break;
      case "k":
        t.hourCycle = "h24", t.hour = ["numeric", "2-digit"][r - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      // Minute
      case "m":
        t.minute = ["numeric", "2-digit"][r - 1];
        break;
      // Second
      case "s":
        t.second = ["numeric", "2-digit"][r - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      // Zone
      case "z":
        t.timeZoneName = r < 4 ? "short" : "long";
        break;
      case "Z":
      // 1..3, 4, 5: The ISO8601 varios formats
      case "O":
      // 1, 4: milliseconds in day short, long
      case "v":
      // 1, 4: generic non-location format
      case "V":
      // 1, 2, 3, 4: time zone ID or city
      case "X":
      // 1, 2, 3, 4: The ISO8601 varios formats
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  }), t;
}
var Jh = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function Xh(e) {
  if (e.length === 0)
    throw new Error("Number skeleton cannot be empty");
  for (var t = e.split(Jh).filter(function(p) {
    return p.length > 0;
  }), n = [], r = 0, i = t; r < i.length; r++) {
    var o = i[r], s = o.split("/");
    if (s.length === 0)
      throw new Error("Invalid number skeleton");
    for (var a = s[0], l = s.slice(1), c = 0, u = l; c < u.length; c++) {
      var f = u[c];
      if (f.length === 0)
        throw new Error("Invalid number skeleton");
    }
    n.push({ stem: a, options: l });
  }
  return n;
}
function Yh(e) {
  return e.replace(/^(.*?)-/, "");
}
var oa = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g, Pu = /^(@+)?(\+|#+)?[rs]?$/g, Zh = /(\*)(0+)|(#+)(0+)|(0+)/g, Du = /^(0+)$/;
function sa(e) {
  var t = {};
  return e[e.length - 1] === "r" ? t.roundingPriority = "morePrecision" : e[e.length - 1] === "s" && (t.roundingPriority = "lessPrecision"), e.replace(Pu, function(n, r, i) {
    return typeof i != "string" ? (t.minimumSignificantDigits = r.length, t.maximumSignificantDigits = r.length) : i === "+" ? t.minimumSignificantDigits = r.length : r[0] === "#" ? t.maximumSignificantDigits = r.length : (t.minimumSignificantDigits = r.length, t.maximumSignificantDigits = r.length + (typeof i == "string" ? i.length : 0)), "";
  }), t;
}
function Lu(e) {
  switch (e) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function Qh(e) {
  var t;
  if (e[0] === "E" && e[1] === "E" ? (t = {
    notation: "engineering"
  }, e = e.slice(2)) : e[0] === "E" && (t = {
    notation: "scientific"
  }, e = e.slice(1)), t) {
    var n = e.slice(0, 2);
    if (n === "+!" ? (t.signDisplay = "always", e = e.slice(2)) : n === "+?" && (t.signDisplay = "exceptZero", e = e.slice(2)), !Du.test(e))
      throw new Error("Malformed concise eng/scientific notation");
    t.minimumIntegerDigits = e.length;
  }
  return t;
}
function aa(e) {
  var t = {}, n = Lu(e);
  return n || t;
}
function em(e) {
  for (var t = {}, n = 0, r = e; n < r.length; n++) {
    var i = r[n];
    switch (i.stem) {
      case "percent":
      case "%":
        t.style = "percent";
        continue;
      case "%x100":
        t.style = "percent", t.scale = 100;
        continue;
      case "currency":
        t.style = "currency", t.currency = i.options[0];
        continue;
      case "group-off":
      case ",_":
        t.useGrouping = !1;
        continue;
      case "precision-integer":
      case ".":
        t.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        t.style = "unit", t.unit = Yh(i.options[0]);
        continue;
      case "compact-short":
      case "K":
        t.notation = "compact", t.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        t.notation = "compact", t.compactDisplay = "long";
        continue;
      case "scientific":
        t = F(F(F({}, t), { notation: "scientific" }), i.options.reduce(function(l, c) {
          return F(F({}, l), aa(c));
        }, {}));
        continue;
      case "engineering":
        t = F(F(F({}, t), { notation: "engineering" }), i.options.reduce(function(l, c) {
          return F(F({}, l), aa(c));
        }, {}));
        continue;
      case "notation-simple":
        t.notation = "standard";
        continue;
      // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
      case "unit-width-narrow":
        t.currencyDisplay = "narrowSymbol", t.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        t.currencyDisplay = "code", t.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        t.currencyDisplay = "name", t.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        t.currencyDisplay = "symbol";
        continue;
      case "scale":
        t.scale = parseFloat(i.options[0]);
        continue;
      case "rounding-mode-floor":
        t.roundingMode = "floor";
        continue;
      case "rounding-mode-ceiling":
        t.roundingMode = "ceil";
        continue;
      case "rounding-mode-down":
        t.roundingMode = "trunc";
        continue;
      case "rounding-mode-up":
        t.roundingMode = "expand";
        continue;
      case "rounding-mode-half-even":
        t.roundingMode = "halfEven";
        continue;
      case "rounding-mode-half-down":
        t.roundingMode = "halfTrunc";
        continue;
      case "rounding-mode-half-up":
        t.roundingMode = "halfExpand";
        continue;
      // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
      case "integer-width":
        if (i.options.length > 1)
          throw new RangeError("integer-width stems only accept a single optional option");
        i.options[0].replace(Zh, function(l, c, u, f, p, g) {
          if (c)
            t.minimumIntegerDigits = u.length;
          else {
            if (f && p)
              throw new Error("We currently do not support maximum integer digits");
            if (g)
              throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (Du.test(i.stem)) {
      t.minimumIntegerDigits = i.stem.length;
      continue;
    }
    if (oa.test(i.stem)) {
      if (i.options.length > 1)
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      i.stem.replace(oa, function(l, c, u, f, p, g) {
        return u === "*" ? t.minimumFractionDigits = c.length : f && f[0] === "#" ? t.maximumFractionDigits = f.length : p && g ? (t.minimumFractionDigits = p.length, t.maximumFractionDigits = p.length + g.length) : (t.minimumFractionDigits = c.length, t.maximumFractionDigits = c.length), "";
      });
      var o = i.options[0];
      o === "w" ? t = F(F({}, t), { trailingZeroDisplay: "stripIfInteger" }) : o && (t = F(F({}, t), sa(o)));
      continue;
    }
    if (Pu.test(i.stem)) {
      t = F(F({}, t), sa(i.stem));
      continue;
    }
    var s = Lu(i.stem);
    s && (t = F(F({}, t), s));
    var a = Qh(i.stem);
    a && (t = F(F({}, t), a));
  }
  return t;
}
var $n = {
  "001": [
    "H",
    "h"
  ],
  419: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  AC: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  AD: [
    "H",
    "hB"
  ],
  AE: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  AF: [
    "H",
    "hb",
    "hB",
    "h"
  ],
  AG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  AI: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  AL: [
    "h",
    "H",
    "hB"
  ],
  AM: [
    "H",
    "hB"
  ],
  AO: [
    "H",
    "hB"
  ],
  AR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  AS: [
    "h",
    "H"
  ],
  AT: [
    "H",
    "hB"
  ],
  AU: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  AW: [
    "H",
    "hB"
  ],
  AX: [
    "H"
  ],
  AZ: [
    "H",
    "hB",
    "h"
  ],
  BA: [
    "H",
    "hB",
    "h"
  ],
  BB: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BD: [
    "h",
    "hB",
    "H"
  ],
  BE: [
    "H",
    "hB"
  ],
  BF: [
    "H",
    "hB"
  ],
  BG: [
    "H",
    "hB",
    "h"
  ],
  BH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  BI: [
    "H",
    "h"
  ],
  BJ: [
    "H",
    "hB"
  ],
  BL: [
    "H",
    "hB"
  ],
  BM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BN: [
    "hb",
    "hB",
    "h",
    "H"
  ],
  BO: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  BQ: [
    "H"
  ],
  BR: [
    "H",
    "hB"
  ],
  BS: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  BT: [
    "h",
    "H"
  ],
  BW: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  BY: [
    "H",
    "h"
  ],
  BZ: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CA: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  CC: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CD: [
    "hB",
    "H"
  ],
  CF: [
    "H",
    "h",
    "hB"
  ],
  CG: [
    "H",
    "hB"
  ],
  CH: [
    "H",
    "hB",
    "h"
  ],
  CI: [
    "H",
    "hB"
  ],
  CK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CL: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  CM: [
    "H",
    "h",
    "hB"
  ],
  CN: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  CO: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  CP: [
    "H"
  ],
  CR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  CU: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  CV: [
    "H",
    "hB"
  ],
  CW: [
    "H",
    "hB"
  ],
  CX: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  CY: [
    "h",
    "H",
    "hb",
    "hB"
  ],
  CZ: [
    "H"
  ],
  DE: [
    "H",
    "hB"
  ],
  DG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  DJ: [
    "h",
    "H"
  ],
  DK: [
    "H"
  ],
  DM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  DO: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  DZ: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  EA: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  EC: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  EE: [
    "H",
    "hB"
  ],
  EG: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  EH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  ER: [
    "h",
    "H"
  ],
  ES: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  ET: [
    "hB",
    "hb",
    "h",
    "H"
  ],
  FI: [
    "H"
  ],
  FJ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  FK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  FM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  FO: [
    "H",
    "h"
  ],
  FR: [
    "H",
    "hB"
  ],
  GA: [
    "H",
    "hB"
  ],
  GB: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GD: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GE: [
    "H",
    "hB",
    "h"
  ],
  GF: [
    "H",
    "hB"
  ],
  GG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GH: [
    "h",
    "H"
  ],
  GI: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  GL: [
    "H",
    "h"
  ],
  GM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GN: [
    "H",
    "hB"
  ],
  GP: [
    "H",
    "hB"
  ],
  GQ: [
    "H",
    "hB",
    "h",
    "hb"
  ],
  GR: [
    "h",
    "H",
    "hb",
    "hB"
  ],
  GT: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  GU: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  GW: [
    "H",
    "hB"
  ],
  GY: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  HK: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  HN: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  HR: [
    "H",
    "hB"
  ],
  HU: [
    "H",
    "h"
  ],
  IC: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  ID: [
    "H"
  ],
  IE: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IL: [
    "H",
    "hB"
  ],
  IM: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IN: [
    "h",
    "H"
  ],
  IO: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  IQ: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  IR: [
    "hB",
    "H"
  ],
  IS: [
    "H"
  ],
  IT: [
    "H",
    "hB"
  ],
  JE: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  JM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  JO: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  JP: [
    "H",
    "K",
    "h"
  ],
  KE: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  KG: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  KH: [
    "hB",
    "h",
    "H",
    "hb"
  ],
  KI: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KM: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  KN: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KP: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  KR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  KW: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  KY: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  KZ: [
    "H",
    "hB"
  ],
  LA: [
    "H",
    "hb",
    "hB",
    "h"
  ],
  LB: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  LC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  LI: [
    "H",
    "hB",
    "h"
  ],
  LK: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  LR: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  LS: [
    "h",
    "H"
  ],
  LT: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  LU: [
    "H",
    "h",
    "hB"
  ],
  LV: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  LY: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MA: [
    "H",
    "h",
    "hB",
    "hb"
  ],
  MC: [
    "H",
    "hB"
  ],
  MD: [
    "H",
    "hB"
  ],
  ME: [
    "H",
    "hB",
    "h"
  ],
  MF: [
    "H",
    "hB"
  ],
  MG: [
    "H",
    "h"
  ],
  MH: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MK: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  ML: [
    "H"
  ],
  MM: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  MN: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  MO: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MP: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MQ: [
    "H",
    "hB"
  ],
  MR: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  MS: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  MT: [
    "H",
    "h"
  ],
  MU: [
    "H",
    "h"
  ],
  MV: [
    "H",
    "h"
  ],
  MW: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  MX: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  MY: [
    "hb",
    "hB",
    "h",
    "H"
  ],
  MZ: [
    "H",
    "hB"
  ],
  NA: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  NC: [
    "H",
    "hB"
  ],
  NE: [
    "H"
  ],
  NF: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NG: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NI: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  NL: [
    "H",
    "hB"
  ],
  NO: [
    "H",
    "h"
  ],
  NP: [
    "H",
    "h",
    "hB"
  ],
  NR: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NU: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  NZ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  OM: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PA: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  PE: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  PF: [
    "H",
    "h",
    "hB"
  ],
  PG: [
    "h",
    "H"
  ],
  PH: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PK: [
    "h",
    "hB",
    "H"
  ],
  PL: [
    "H",
    "h"
  ],
  PM: [
    "H",
    "hB"
  ],
  PN: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  PR: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  PS: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  PT: [
    "H",
    "hB"
  ],
  PW: [
    "h",
    "H"
  ],
  PY: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  QA: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  RE: [
    "H",
    "hB"
  ],
  RO: [
    "H",
    "hB"
  ],
  RS: [
    "H",
    "hB",
    "h"
  ],
  RU: [
    "H"
  ],
  RW: [
    "H",
    "h"
  ],
  SA: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SB: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SC: [
    "H",
    "h",
    "hB"
  ],
  SD: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SE: [
    "H"
  ],
  SG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SH: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  SI: [
    "H",
    "hB"
  ],
  SJ: [
    "H"
  ],
  SK: [
    "H"
  ],
  SL: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  SM: [
    "H",
    "h",
    "hB"
  ],
  SN: [
    "H",
    "h",
    "hB"
  ],
  SO: [
    "h",
    "H"
  ],
  SR: [
    "H",
    "hB"
  ],
  SS: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  ST: [
    "H",
    "hB"
  ],
  SV: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  SX: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  SY: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  SZ: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TA: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  TC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TD: [
    "h",
    "H",
    "hB"
  ],
  TF: [
    "H",
    "h",
    "hB"
  ],
  TG: [
    "H",
    "hB"
  ],
  TH: [
    "H",
    "h"
  ],
  TJ: [
    "H",
    "h"
  ],
  TL: [
    "H",
    "hB",
    "hb",
    "h"
  ],
  TM: [
    "H",
    "h"
  ],
  TN: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  TO: [
    "h",
    "H"
  ],
  TR: [
    "H",
    "hB"
  ],
  TT: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  TW: [
    "hB",
    "hb",
    "h",
    "H"
  ],
  TZ: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  UA: [
    "H",
    "hB",
    "h"
  ],
  UG: [
    "hB",
    "hb",
    "H",
    "h"
  ],
  UM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  US: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  UY: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  UZ: [
    "H",
    "hB",
    "h"
  ],
  VA: [
    "H",
    "h",
    "hB"
  ],
  VC: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VE: [
    "h",
    "H",
    "hB",
    "hb"
  ],
  VG: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VI: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  VN: [
    "H",
    "h"
  ],
  VU: [
    "h",
    "H"
  ],
  WF: [
    "H",
    "hB"
  ],
  WS: [
    "h",
    "H"
  ],
  XK: [
    "H",
    "hB",
    "h"
  ],
  YE: [
    "h",
    "hB",
    "hb",
    "H"
  ],
  YT: [
    "H",
    "hB"
  ],
  ZA: [
    "H",
    "h",
    "hb",
    "hB"
  ],
  ZM: [
    "h",
    "hb",
    "H",
    "hB"
  ],
  ZW: [
    "H",
    "h"
  ],
  "af-ZA": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "ar-001": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "ca-ES": [
    "H",
    "h",
    "hB"
  ],
  "en-001": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "en-HK": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "en-IL": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "en-MY": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "es-BR": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-ES": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-GQ": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "fr-CA": [
    "H",
    "h",
    "hB"
  ],
  "gl-ES": [
    "H",
    "h",
    "hB"
  ],
  "gu-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "hi-IN": [
    "hB",
    "h",
    "H"
  ],
  "it-CH": [
    "H",
    "h",
    "hB"
  ],
  "it-IT": [
    "H",
    "h",
    "hB"
  ],
  "kn-IN": [
    "hB",
    "h",
    "H"
  ],
  "ml-IN": [
    "hB",
    "h",
    "H"
  ],
  "mr-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "pa-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "ta-IN": [
    "hB",
    "h",
    "hb",
    "H"
  ],
  "te-IN": [
    "hB",
    "h",
    "H"
  ],
  "zu-ZA": [
    "H",
    "hB",
    "hb",
    "h"
  ]
};
function tm(e, t) {
  for (var n = "", r = 0; r < e.length; r++) {
    var i = e.charAt(r);
    if (i === "j") {
      for (var o = 0; r + 1 < e.length && e.charAt(r + 1) === i; )
        o++, r++;
      var s = 1 + (o & 1), a = o < 2 ? 1 : 3 + (o >> 1), l = "a", c = nm(t);
      for ((c == "H" || c == "k") && (a = 0); a-- > 0; )
        n += l;
      for (; s-- > 0; )
        n = c + n;
    } else i === "J" ? n += "H" : n += i;
  }
  return n;
}
function nm(e) {
  var t = e.hourCycle;
  if (t === void 0 && // @ts-ignore hourCycle(s) is not identified yet
  e.hourCycles && // @ts-ignore
  e.hourCycles.length && (t = e.hourCycles[0]), t)
    switch (t) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
  var n = e.language, r;
  n !== "root" && (r = e.maximize().region);
  var i = $n[r || ""] || $n[n || ""] || $n["".concat(n, "-001")] || $n["001"];
  return i[0];
}
var li, rm = new RegExp("^".concat(Ou.source, "*")), im = new RegExp("".concat(Ou.source, "*$"));
function oe(e, t) {
  return { start: e, end: t };
}
var om = !!String.prototype.startsWith && "_a".startsWith("a", 1), sm = !!String.fromCodePoint, am = !!Object.fromEntries, um = !!String.prototype.codePointAt, lm = !!String.prototype.trimStart, cm = !!String.prototype.trimEnd, dm = !!Number.isSafeInteger, fm = dm ? Number.isSafeInteger : function(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e && Math.abs(e) <= 9007199254740991;
}, Pi = !0;
try {
  var hm = ku("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Pi = ((li = hm.exec("a")) === null || li === void 0 ? void 0 : li[0]) === "a";
} catch {
  Pi = !1;
}
var ua = om ? (
  // Native
  function(t, n, r) {
    return t.startsWith(n, r);
  }
) : (
  // For IE11
  function(t, n, r) {
    return t.slice(r, r + n.length) === n;
  }
), Di = sm ? String.fromCodePoint : (
  // IE11
  function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    for (var r = "", i = t.length, o = 0, s; i > o; ) {
      if (s = t[o++], s > 1114111)
        throw RangeError(s + " is not a valid code point");
      r += s < 65536 ? String.fromCharCode(s) : String.fromCharCode(((s -= 65536) >> 10) + 55296, s % 1024 + 56320);
    }
    return r;
  }
), la = (
  // native
  am ? Object.fromEntries : (
    // Ponyfill
    function(t) {
      for (var n = {}, r = 0, i = t; r < i.length; r++) {
        var o = i[r], s = o[0], a = o[1];
        n[s] = a;
      }
      return n;
    }
  )
), xu = um ? (
  // Native
  function(t, n) {
    return t.codePointAt(n);
  }
) : (
  // IE 11
  function(t, n) {
    var r = t.length;
    if (!(n < 0 || n >= r)) {
      var i = t.charCodeAt(n), o;
      return i < 55296 || i > 56319 || n + 1 === r || (o = t.charCodeAt(n + 1)) < 56320 || o > 57343 ? i : (i - 55296 << 10) + (o - 56320) + 65536;
    }
  }
), mm = lm ? (
  // Native
  function(t) {
    return t.trimStart();
  }
) : (
  // Ponyfill
  function(t) {
    return t.replace(rm, "");
  }
), pm = cm ? (
  // Native
  function(t) {
    return t.trimEnd();
  }
) : (
  // Ponyfill
  function(t) {
    return t.replace(im, "");
  }
);
function ku(e, t) {
  return new RegExp(e, t);
}
var Li;
if (Pi) {
  var ca = ku("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Li = function(t, n) {
    var r;
    ca.lastIndex = n;
    var i = ca.exec(t);
    return (r = i[1]) !== null && r !== void 0 ? r : "";
  };
} else
  Li = function(t, n) {
    for (var r = []; ; ) {
      var i = xu(t, n);
      if (i === void 0 || Mu(i) || ym(i))
        break;
      r.push(i), n += i >= 65536 ? 2 : 1;
    }
    return Di.apply(void 0, r);
  };
var gm = (
  /** @class */
  function() {
    function e(t, n) {
      n === void 0 && (n = {}), this.message = t, this.position = { offset: 0, line: 1, column: 1 }, this.ignoreTag = !!n.ignoreTag, this.locale = n.locale, this.requiresOtherClause = !!n.requiresOtherClause, this.shouldParseSkeletons = !!n.shouldParseSkeletons;
    }
    return e.prototype.parse = function() {
      if (this.offset() !== 0)
        throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }, e.prototype.parseMessage = function(t, n, r) {
      for (var i = []; !this.isEOF(); ) {
        var o = this.char();
        if (o === 123) {
          var s = this.parseArgument(t, r);
          if (s.err)
            return s;
          i.push(s.val);
        } else {
          if (o === 125 && t > 0)
            break;
          if (o === 35 && (n === "plural" || n === "selectordinal")) {
            var a = this.clonePosition();
            this.bump(), i.push({
              type: ge.pound,
              location: oe(a, this.clonePosition())
            });
          } else if (o === 60 && !this.ignoreTag && this.peek() === 47) {
            if (r)
              break;
            return this.error(re.UNMATCHED_CLOSING_TAG, oe(this.clonePosition(), this.clonePosition()));
          } else if (o === 60 && !this.ignoreTag && xi(this.peek() || 0)) {
            var s = this.parseTag(t, n);
            if (s.err)
              return s;
            i.push(s.val);
          } else {
            var s = this.parseLiteral(t, n);
            if (s.err)
              return s;
            i.push(s.val);
          }
        }
      }
      return { val: i, err: null };
    }, e.prototype.parseTag = function(t, n) {
      var r = this.clonePosition();
      this.bump();
      var i = this.parseTagName();
      if (this.bumpSpace(), this.bumpIf("/>"))
        return {
          val: {
            type: ge.literal,
            value: "<".concat(i, "/>"),
            location: oe(r, this.clonePosition())
          },
          err: null
        };
      if (this.bumpIf(">")) {
        var o = this.parseMessage(t + 1, n, !0);
        if (o.err)
          return o;
        var s = o.val, a = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !xi(this.char()))
            return this.error(re.INVALID_TAG, oe(a, this.clonePosition()));
          var l = this.clonePosition(), c = this.parseTagName();
          return i !== c ? this.error(re.UNMATCHED_CLOSING_TAG, oe(l, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: ge.tag,
              value: i,
              children: s,
              location: oe(r, this.clonePosition())
            },
            err: null
          } : this.error(re.INVALID_TAG, oe(a, this.clonePosition())));
        } else
          return this.error(re.UNCLOSED_TAG, oe(r, this.clonePosition()));
      } else
        return this.error(re.INVALID_TAG, oe(r, this.clonePosition()));
    }, e.prototype.parseTagName = function() {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && vm(this.char()); )
        this.bump();
      return this.message.slice(t, this.offset());
    }, e.prototype.parseLiteral = function(t, n) {
      for (var r = this.clonePosition(), i = ""; ; ) {
        var o = this.tryParseQuote(n);
        if (o) {
          i += o;
          continue;
        }
        var s = this.tryParseUnquoted(t, n);
        if (s) {
          i += s;
          continue;
        }
        var a = this.tryParseLeftAngleBracket();
        if (a) {
          i += a;
          continue;
        }
        break;
      }
      var l = oe(r, this.clonePosition());
      return {
        val: { type: ge.literal, value: i, location: l },
        err: null
      };
    }, e.prototype.tryParseLeftAngleBracket = function() {
      return !this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
      !_m(this.peek() || 0)) ? (this.bump(), "<") : null;
    }, e.prototype.tryParseQuote = function(t) {
      if (this.isEOF() || this.char() !== 39)
        return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        // '{', '<', '>', '}'
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (t === "plural" || t === "selectordinal")
            break;
          return null;
        default:
          return null;
      }
      this.bump();
      var n = [this.char()];
      for (this.bump(); !this.isEOF(); ) {
        var r = this.char();
        if (r === 39)
          if (this.peek() === 39)
            n.push(39), this.bump();
          else {
            this.bump();
            break;
          }
        else
          n.push(r);
        this.bump();
      }
      return Di.apply(void 0, n);
    }, e.prototype.tryParseUnquoted = function(t, n) {
      if (this.isEOF())
        return null;
      var r = this.char();
      return r === 60 || r === 123 || r === 35 && (n === "plural" || n === "selectordinal") || r === 125 && t > 0 ? null : (this.bump(), Di(r));
    }, e.prototype.parseArgument = function(t, n) {
      var r = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF())
        return this.error(re.EXPECT_ARGUMENT_CLOSING_BRACE, oe(r, this.clonePosition()));
      if (this.char() === 125)
        return this.bump(), this.error(re.EMPTY_ARGUMENT, oe(r, this.clonePosition()));
      var i = this.parseIdentifierIfPossible().value;
      if (!i)
        return this.error(re.MALFORMED_ARGUMENT, oe(r, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF())
        return this.error(re.EXPECT_ARGUMENT_CLOSING_BRACE, oe(r, this.clonePosition()));
      switch (this.char()) {
        // Simple argument: `{name}`
        case 125:
          return this.bump(), {
            val: {
              type: ge.argument,
              // value does not include the opening and closing braces.
              value: i,
              location: oe(r, this.clonePosition())
            },
            err: null
          };
        // Argument with options: `{name, format, ...}`
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(re.EXPECT_ARGUMENT_CLOSING_BRACE, oe(r, this.clonePosition())) : this.parseArgumentOptions(t, n, i, r);
        default:
          return this.error(re.MALFORMED_ARGUMENT, oe(r, this.clonePosition()));
      }
    }, e.prototype.parseIdentifierIfPossible = function() {
      var t = this.clonePosition(), n = this.offset(), r = Li(this.message, n), i = n + r.length;
      this.bumpTo(i);
      var o = this.clonePosition(), s = oe(t, o);
      return { value: r, location: s };
    }, e.prototype.parseArgumentOptions = function(t, n, r, i) {
      var o, s = this.clonePosition(), a = this.parseIdentifierIfPossible().value, l = this.clonePosition();
      switch (a) {
        case "":
          return this.error(re.EXPECT_ARGUMENT_TYPE, oe(s, l));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var c = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var u = this.clonePosition(), f = this.parseSimpleArgStyleIfPossible();
            if (f.err)
              return f;
            var p = pm(f.val);
            if (p.length === 0)
              return this.error(re.EXPECT_ARGUMENT_STYLE, oe(this.clonePosition(), this.clonePosition()));
            var g = oe(u, this.clonePosition());
            c = { style: p, styleLocation: g };
          }
          var m = this.tryParseArgumentClose(i);
          if (m.err)
            return m;
          var h = oe(i, this.clonePosition());
          if (c && ua(c == null ? void 0 : c.style, "::", 0)) {
            var v = mm(c.style.slice(2));
            if (a === "number") {
              var f = this.parseNumberSkeletonFromString(v, c.styleLocation);
              return f.err ? f : {
                val: { type: ge.number, value: r, location: h, style: f.val },
                err: null
              };
            } else {
              if (v.length === 0)
                return this.error(re.EXPECT_DATE_TIME_SKELETON, h);
              var w = v;
              this.locale && (w = tm(v, this.locale));
              var p = {
                type: Zt.dateTime,
                pattern: w,
                location: c.styleLocation,
                parsedOptions: this.shouldParseSkeletons ? Kh(w) : {}
              }, E = a === "date" ? ge.date : ge.time;
              return {
                val: { type: E, value: r, location: h, style: p },
                err: null
              };
            }
          }
          return {
            val: {
              type: a === "number" ? ge.number : a === "date" ? ge.date : ge.time,
              value: r,
              location: h,
              style: (o = c == null ? void 0 : c.style) !== null && o !== void 0 ? o : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var R = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(","))
            return this.error(re.EXPECT_SELECT_ARGUMENT_OPTIONS, oe(R, F({}, R)));
          this.bumpSpace();
          var M = this.parseIdentifierIfPossible(), b = 0;
          if (a !== "select" && M.value === "offset") {
            if (!this.bumpIf(":"))
              return this.error(re.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, oe(this.clonePosition(), this.clonePosition()));
            this.bumpSpace();
            var f = this.tryParseDecimalInteger(re.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, re.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
            if (f.err)
              return f;
            this.bumpSpace(), M = this.parseIdentifierIfPossible(), b = f.val;
          }
          var P = this.tryParsePluralOrSelectOptions(t, a, n, M);
          if (P.err)
            return P;
          var m = this.tryParseArgumentClose(i);
          if (m.err)
            return m;
          var U = oe(i, this.clonePosition());
          return a === "select" ? {
            val: {
              type: ge.select,
              value: r,
              options: la(P.val),
              location: U
            },
            err: null
          } : {
            val: {
              type: ge.plural,
              value: r,
              options: la(P.val),
              offset: b,
              pluralType: a === "plural" ? "cardinal" : "ordinal",
              location: U
            },
            err: null
          };
        }
        default:
          return this.error(re.INVALID_ARGUMENT_TYPE, oe(s, l));
      }
    }, e.prototype.tryParseArgumentClose = function(t) {
      return this.isEOF() || this.char() !== 125 ? this.error(re.EXPECT_ARGUMENT_CLOSING_BRACE, oe(t, this.clonePosition())) : (this.bump(), { val: !0, err: null });
    }, e.prototype.parseSimpleArgStyleIfPossible = function() {
      for (var t = 0, n = this.clonePosition(); !this.isEOF(); ) {
        var r = this.char();
        switch (r) {
          case 39: {
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'"))
              return this.error(re.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, oe(i, this.clonePosition()));
            this.bump();
            break;
          }
          case 123: {
            t += 1, this.bump();
            break;
          }
          case 125: {
            if (t > 0)
              t -= 1;
            else
              return {
                val: this.message.slice(n.offset, this.offset()),
                err: null
              };
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return {
        val: this.message.slice(n.offset, this.offset()),
        err: null
      };
    }, e.prototype.parseNumberSkeletonFromString = function(t, n) {
      var r = [];
      try {
        r = Xh(t);
      } catch {
        return this.error(re.INVALID_NUMBER_SKELETON, n);
      }
      return {
        val: {
          type: Zt.number,
          tokens: r,
          location: n,
          parsedOptions: this.shouldParseSkeletons ? em(r) : {}
        },
        err: null
      };
    }, e.prototype.tryParsePluralOrSelectOptions = function(t, n, r, i) {
      for (var o, s = !1, a = [], l = /* @__PURE__ */ new Set(), c = i.value, u = i.location; ; ) {
        if (c.length === 0) {
          var f = this.clonePosition();
          if (n !== "select" && this.bumpIf("=")) {
            var p = this.tryParseDecimalInteger(re.EXPECT_PLURAL_ARGUMENT_SELECTOR, re.INVALID_PLURAL_ARGUMENT_SELECTOR);
            if (p.err)
              return p;
            u = oe(f, this.clonePosition()), c = this.message.slice(f.offset, this.offset());
          } else
            break;
        }
        if (l.has(c))
          return this.error(n === "select" ? re.DUPLICATE_SELECT_ARGUMENT_SELECTOR : re.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, u);
        c === "other" && (s = !0), this.bumpSpace();
        var g = this.clonePosition();
        if (!this.bumpIf("{"))
          return this.error(n === "select" ? re.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : re.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, oe(this.clonePosition(), this.clonePosition()));
        var m = this.parseMessage(t + 1, n, r);
        if (m.err)
          return m;
        var h = this.tryParseArgumentClose(g);
        if (h.err)
          return h;
        a.push([
          c,
          {
            value: m.val,
            location: oe(g, this.clonePosition())
          }
        ]), l.add(c), this.bumpSpace(), o = this.parseIdentifierIfPossible(), c = o.value, u = o.location;
      }
      return a.length === 0 ? this.error(n === "select" ? re.EXPECT_SELECT_ARGUMENT_SELECTOR : re.EXPECT_PLURAL_ARGUMENT_SELECTOR, oe(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !s ? this.error(re.MISSING_OTHER_CLAUSE, oe(this.clonePosition(), this.clonePosition())) : { val: a, err: null };
    }, e.prototype.tryParseDecimalInteger = function(t, n) {
      var r = 1, i = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (r = -1);
      for (var o = !1, s = 0; !this.isEOF(); ) {
        var a = this.char();
        if (a >= 48 && a <= 57)
          o = !0, s = s * 10 + (a - 48), this.bump();
        else
          break;
      }
      var l = oe(i, this.clonePosition());
      return o ? (s *= r, fm(s) ? { val: s, err: null } : this.error(n, l)) : this.error(t, l);
    }, e.prototype.offset = function() {
      return this.position.offset;
    }, e.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    }, e.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }, e.prototype.char = function() {
      var t = this.position.offset;
      if (t >= this.message.length)
        throw Error("out of bound");
      var n = xu(this.message, t);
      if (n === void 0)
        throw Error("Offset ".concat(t, " is at invalid UTF-16 code unit boundary"));
      return n;
    }, e.prototype.error = function(t, n) {
      return {
        val: null,
        err: {
          kind: t,
          message: this.message,
          location: n
        }
      };
    }, e.prototype.bump = function() {
      if (!this.isEOF()) {
        var t = this.char();
        t === 10 ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += t < 65536 ? 1 : 2);
      }
    }, e.prototype.bumpIf = function(t) {
      if (ua(this.message, t, this.offset())) {
        for (var n = 0; n < t.length; n++)
          this.bump();
        return !0;
      }
      return !1;
    }, e.prototype.bumpUntil = function(t) {
      var n = this.offset(), r = this.message.indexOf(t, n);
      return r >= 0 ? (this.bumpTo(r), !0) : (this.bumpTo(this.message.length), !1);
    }, e.prototype.bumpTo = function(t) {
      if (this.offset() > t)
        throw Error("targetOffset ".concat(t, " must be greater than or equal to the current offset ").concat(this.offset()));
      for (t = Math.min(t, this.message.length); ; ) {
        var n = this.offset();
        if (n === t)
          break;
        if (n > t)
          throw Error("targetOffset ".concat(t, " is at invalid UTF-16 code unit boundary"));
        if (this.bump(), this.isEOF())
          break;
      }
    }, e.prototype.bumpSpace = function() {
      for (; !this.isEOF() && Mu(this.char()); )
        this.bump();
    }, e.prototype.peek = function() {
      if (this.isEOF())
        return null;
      var t = this.char(), n = this.offset(), r = this.message.charCodeAt(n + (t >= 65536 ? 2 : 1));
      return r ?? null;
    }, e;
  }()
);
function xi(e) {
  return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function _m(e) {
  return xi(e) || e === 47;
}
function vm(e) {
  return e === 45 || e === 46 || e >= 48 && e <= 57 || e === 95 || e >= 97 && e <= 122 || e >= 65 && e <= 90 || e == 183 || e >= 192 && e <= 214 || e >= 216 && e <= 246 || e >= 248 && e <= 893 || e >= 895 && e <= 8191 || e >= 8204 && e <= 8205 || e >= 8255 && e <= 8256 || e >= 8304 && e <= 8591 || e >= 11264 && e <= 12271 || e >= 12289 && e <= 55295 || e >= 63744 && e <= 64975 || e >= 65008 && e <= 65533 || e >= 65536 && e <= 983039;
}
function Mu(e) {
  return e >= 9 && e <= 13 || e === 32 || e === 133 || e >= 8206 && e <= 8207 || e === 8232 || e === 8233;
}
function ym(e) {
  return e >= 33 && e <= 35 || e === 36 || e >= 37 && e <= 39 || e === 40 || e === 41 || e === 42 || e === 43 || e === 44 || e === 45 || e >= 46 && e <= 47 || e >= 58 && e <= 59 || e >= 60 && e <= 62 || e >= 63 && e <= 64 || e === 91 || e === 92 || e === 93 || e === 94 || e === 96 || e === 123 || e === 124 || e === 125 || e === 126 || e === 161 || e >= 162 && e <= 165 || e === 166 || e === 167 || e === 169 || e === 171 || e === 172 || e === 174 || e === 176 || e === 177 || e === 182 || e === 187 || e === 191 || e === 215 || e === 247 || e >= 8208 && e <= 8213 || e >= 8214 && e <= 8215 || e === 8216 || e === 8217 || e === 8218 || e >= 8219 && e <= 8220 || e === 8221 || e === 8222 || e === 8223 || e >= 8224 && e <= 8231 || e >= 8240 && e <= 8248 || e === 8249 || e === 8250 || e >= 8251 && e <= 8254 || e >= 8257 && e <= 8259 || e === 8260 || e === 8261 || e === 8262 || e >= 8263 && e <= 8273 || e === 8274 || e === 8275 || e >= 8277 && e <= 8286 || e >= 8592 && e <= 8596 || e >= 8597 && e <= 8601 || e >= 8602 && e <= 8603 || e >= 8604 && e <= 8607 || e === 8608 || e >= 8609 && e <= 8610 || e === 8611 || e >= 8612 && e <= 8613 || e === 8614 || e >= 8615 && e <= 8621 || e === 8622 || e >= 8623 && e <= 8653 || e >= 8654 && e <= 8655 || e >= 8656 && e <= 8657 || e === 8658 || e === 8659 || e === 8660 || e >= 8661 && e <= 8691 || e >= 8692 && e <= 8959 || e >= 8960 && e <= 8967 || e === 8968 || e === 8969 || e === 8970 || e === 8971 || e >= 8972 && e <= 8991 || e >= 8992 && e <= 8993 || e >= 8994 && e <= 9e3 || e === 9001 || e === 9002 || e >= 9003 && e <= 9083 || e === 9084 || e >= 9085 && e <= 9114 || e >= 9115 && e <= 9139 || e >= 9140 && e <= 9179 || e >= 9180 && e <= 9185 || e >= 9186 && e <= 9254 || e >= 9255 && e <= 9279 || e >= 9280 && e <= 9290 || e >= 9291 && e <= 9311 || e >= 9472 && e <= 9654 || e === 9655 || e >= 9656 && e <= 9664 || e === 9665 || e >= 9666 && e <= 9719 || e >= 9720 && e <= 9727 || e >= 9728 && e <= 9838 || e === 9839 || e >= 9840 && e <= 10087 || e === 10088 || e === 10089 || e === 10090 || e === 10091 || e === 10092 || e === 10093 || e === 10094 || e === 10095 || e === 10096 || e === 10097 || e === 10098 || e === 10099 || e === 10100 || e === 10101 || e >= 10132 && e <= 10175 || e >= 10176 && e <= 10180 || e === 10181 || e === 10182 || e >= 10183 && e <= 10213 || e === 10214 || e === 10215 || e === 10216 || e === 10217 || e === 10218 || e === 10219 || e === 10220 || e === 10221 || e === 10222 || e === 10223 || e >= 10224 && e <= 10239 || e >= 10240 && e <= 10495 || e >= 10496 && e <= 10626 || e === 10627 || e === 10628 || e === 10629 || e === 10630 || e === 10631 || e === 10632 || e === 10633 || e === 10634 || e === 10635 || e === 10636 || e === 10637 || e === 10638 || e === 10639 || e === 10640 || e === 10641 || e === 10642 || e === 10643 || e === 10644 || e === 10645 || e === 10646 || e === 10647 || e === 10648 || e >= 10649 && e <= 10711 || e === 10712 || e === 10713 || e === 10714 || e === 10715 || e >= 10716 && e <= 10747 || e === 10748 || e === 10749 || e >= 10750 && e <= 11007 || e >= 11008 && e <= 11055 || e >= 11056 && e <= 11076 || e >= 11077 && e <= 11078 || e >= 11079 && e <= 11084 || e >= 11085 && e <= 11123 || e >= 11124 && e <= 11125 || e >= 11126 && e <= 11157 || e === 11158 || e >= 11159 && e <= 11263 || e >= 11776 && e <= 11777 || e === 11778 || e === 11779 || e === 11780 || e === 11781 || e >= 11782 && e <= 11784 || e === 11785 || e === 11786 || e === 11787 || e === 11788 || e === 11789 || e >= 11790 && e <= 11798 || e === 11799 || e >= 11800 && e <= 11801 || e === 11802 || e === 11803 || e === 11804 || e === 11805 || e >= 11806 && e <= 11807 || e === 11808 || e === 11809 || e === 11810 || e === 11811 || e === 11812 || e === 11813 || e === 11814 || e === 11815 || e === 11816 || e === 11817 || e >= 11818 && e <= 11822 || e === 11823 || e >= 11824 && e <= 11833 || e >= 11834 && e <= 11835 || e >= 11836 && e <= 11839 || e === 11840 || e === 11841 || e === 11842 || e >= 11843 && e <= 11855 || e >= 11856 && e <= 11857 || e === 11858 || e >= 11859 && e <= 11903 || e >= 12289 && e <= 12291 || e === 12296 || e === 12297 || e === 12298 || e === 12299 || e === 12300 || e === 12301 || e === 12302 || e === 12303 || e === 12304 || e === 12305 || e >= 12306 && e <= 12307 || e === 12308 || e === 12309 || e === 12310 || e === 12311 || e === 12312 || e === 12313 || e === 12314 || e === 12315 || e === 12316 || e === 12317 || e >= 12318 && e <= 12319 || e === 12320 || e === 12336 || e === 64830 || e === 64831 || e >= 65093 && e <= 65094;
}
function ki(e) {
  e.forEach(function(t) {
    if (delete t.location, Cu(t) || Iu(t))
      for (var n in t.options)
        delete t.options[n].location, ki(t.options[n].value);
    else wu(t) && Au(t.style) || (Su(t) || Tu(t)) && Oi(t.style) ? delete t.style.location : Ru(t) && ki(t.children);
  });
}
function bm(e, t) {
  t === void 0 && (t = {}), t = F({ shouldParseSkeletons: !0, requiresOtherClause: !0 }, t);
  var n = new gm(e, t).parse();
  if (n.err) {
    var r = SyntaxError(re[n.err.kind]);
    throw r.location = n.err.location, r.originalMessage = n.err.message, r;
  }
  return t != null && t.captureLocation || ki(n.val), n.val;
}
var tt;
(function(e) {
  e.MISSING_VALUE = "MISSING_VALUE", e.INVALID_VALUE = "INVALID_VALUE", e.MISSING_INTL_API = "MISSING_INTL_API";
})(tt || (tt = {}));
var gt = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i) {
      var o = e.call(this, n) || this;
      return o.code = r, o.originalMessage = i, o;
    }
    return t.prototype.toString = function() {
      return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
    }, t;
  }(Error)
), da = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i, o) {
      return e.call(this, 'Invalid values for "'.concat(n, '": "').concat(r, '". Options are "').concat(Object.keys(i).join('", "'), '"'), tt.INVALID_VALUE, o) || this;
    }
    return t;
  }(gt)
), Em = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i) {
      return e.call(this, 'Value for "'.concat(n, '" must be of type ').concat(r), tt.INVALID_VALUE, i) || this;
    }
    return t;
  }(gt)
), wm = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      return e.call(this, 'The intl string context variable "'.concat(n, '" was not provided to the string "').concat(r, '"'), tt.MISSING_VALUE, r) || this;
    }
    return t;
  }(gt)
), Pe;
(function(e) {
  e[e.literal = 0] = "literal", e[e.object = 1] = "object";
})(Pe || (Pe = {}));
function Sm(e) {
  return e.length < 2 ? e : e.reduce(function(t, n) {
    var r = t[t.length - 1];
    return !r || r.type !== Pe.literal || n.type !== Pe.literal ? t.push(n) : r.value += n.value, t;
  }, []);
}
function Nu(e) {
  return typeof e == "function";
}
function Zn(e, t, n, r, i, o, s) {
  if (e.length === 1 && ia(e[0]))
    return [
      {
        type: Pe.literal,
        value: e[0].value
      }
    ];
  for (var a = [], l = 0, c = e; l < c.length; l++) {
    var u = c[l];
    if (ia(u)) {
      a.push({
        type: Pe.literal,
        value: u.value
      });
      continue;
    }
    if (Vh(u)) {
      typeof o == "number" && a.push({
        type: Pe.literal,
        value: n.getNumberFormat(t).format(o)
      });
      continue;
    }
    var f = u.value;
    if (!(i && f in i))
      throw new wm(f, s);
    var p = i[f];
    if (qh(u)) {
      (!p || typeof p == "string" || typeof p == "number") && (p = typeof p == "string" || typeof p == "number" ? String(p) : ""), a.push({
        type: typeof p == "string" ? Pe.literal : Pe.object,
        value: p
      });
      continue;
    }
    if (Su(u)) {
      var g = typeof u.style == "string" ? r.date[u.style] : Oi(u.style) ? u.style.parsedOptions : void 0;
      a.push({
        type: Pe.literal,
        value: n.getDateTimeFormat(t, g).format(p)
      });
      continue;
    }
    if (Tu(u)) {
      var g = typeof u.style == "string" ? r.time[u.style] : Oi(u.style) ? u.style.parsedOptions : r.time.medium;
      a.push({
        type: Pe.literal,
        value: n.getDateTimeFormat(t, g).format(p)
      });
      continue;
    }
    if (wu(u)) {
      var g = typeof u.style == "string" ? r.number[u.style] : Au(u.style) ? u.style.parsedOptions : void 0;
      g && g.scale && (p = p * (g.scale || 1)), a.push({
        type: Pe.literal,
        value: n.getNumberFormat(t, g).format(p)
      });
      continue;
    }
    if (Ru(u)) {
      var m = u.children, h = u.value, v = i[h];
      if (!Nu(v))
        throw new Em(h, "function", s);
      var w = Zn(m, t, n, r, i, o), E = v(w.map(function(b) {
        return b.value;
      }));
      Array.isArray(E) || (E = [E]), a.push.apply(a, E.map(function(b) {
        return {
          type: typeof b == "string" ? Pe.literal : Pe.object,
          value: b
        };
      }));
    }
    if (Cu(u)) {
      var R = u.options[p] || u.options.other;
      if (!R)
        throw new da(u.value, p, Object.keys(u.options), s);
      a.push.apply(a, Zn(R.value, t, n, r, i));
      continue;
    }
    if (Iu(u)) {
      var R = u.options["=".concat(p)];
      if (!R) {
        if (!Intl.PluralRules)
          throw new gt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, tt.MISSING_INTL_API, s);
        var M = n.getPluralRules(t, { type: u.pluralType }).select(p - (u.offset || 0));
        R = u.options[M] || u.options.other;
      }
      if (!R)
        throw new da(u.value, p, Object.keys(u.options), s);
      a.push.apply(a, Zn(R.value, t, n, r, i, p - (u.offset || 0)));
      continue;
    }
  }
  return Sm(a);
}
function Tm(e, t) {
  return t ? F(F(F({}, e || {}), t || {}), Object.keys(e).reduce(function(n, r) {
    return n[r] = F(F({}, e[r]), t[r] || {}), n;
  }, {})) : e;
}
function Cm(e, t) {
  return t ? Object.keys(e).reduce(function(n, r) {
    return n[r] = Tm(e[r], t[r]), n;
  }, F({}, e)) : e;
}
function ci(e) {
  return {
    create: function() {
      return {
        get: function(t) {
          return e[t];
        },
        set: function(t, n) {
          e[t] = n;
        }
      };
    }
  };
}
function Im(e) {
  return e === void 0 && (e = {
    number: {},
    dateTime: {},
    pluralRules: {}
  }), {
    getNumberFormat: Ye(function() {
      for (var t, n = [], r = 0; r < arguments.length; r++)
        n[r] = arguments[r];
      return new ((t = Intl.NumberFormat).bind.apply(t, Ue([void 0], n, !1)))();
    }, {
      cache: ci(e.number),
      strategy: Ze.variadic
    }),
    getDateTimeFormat: Ye(function() {
      for (var t, n = [], r = 0; r < arguments.length; r++)
        n[r] = arguments[r];
      return new ((t = Intl.DateTimeFormat).bind.apply(t, Ue([void 0], n, !1)))();
    }, {
      cache: ci(e.dateTime),
      strategy: Ze.variadic
    }),
    getPluralRules: Ye(function() {
      for (var t, n = [], r = 0; r < arguments.length; r++)
        n[r] = arguments[r];
      return new ((t = Intl.PluralRules).bind.apply(t, Ue([void 0], n, !1)))();
    }, {
      cache: ci(e.pluralRules),
      strategy: Ze.variadic
    })
  };
}
var Uu = (
  /** @class */
  function() {
    function e(t, n, r, i) {
      n === void 0 && (n = e.defaultLocale);
      var o = this;
      if (this.formatterCache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      }, this.format = function(l) {
        var c = o.formatToParts(l);
        if (c.length === 1)
          return c[0].value;
        var u = c.reduce(function(f, p) {
          return !f.length || p.type !== Pe.literal || typeof f[f.length - 1] != "string" ? f.push(p.value) : f[f.length - 1] += p.value, f;
        }, []);
        return u.length <= 1 ? u[0] || "" : u;
      }, this.formatToParts = function(l) {
        return Zn(o.ast, o.locales, o.formatters, o.formats, l, void 0, o.message);
      }, this.resolvedOptions = function() {
        var l;
        return {
          locale: ((l = o.resolvedLocale) === null || l === void 0 ? void 0 : l.toString()) || Intl.NumberFormat.supportedLocalesOf(o.locales)[0]
        };
      }, this.getAst = function() {
        return o.ast;
      }, this.locales = n, this.resolvedLocale = e.resolveLocale(n), typeof t == "string") {
        if (this.message = t, !e.__parse)
          throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
        var s = i || {};
        s.formatters;
        var a = Cn(s, ["formatters"]);
        this.ast = e.__parse(t, F(F({}, a), { locale: this.resolvedLocale }));
      } else
        this.ast = t;
      if (!Array.isArray(this.ast))
        throw new TypeError("A message must be provided as a String or AST.");
      this.formats = Cm(e.formats, r), this.formatters = i && i.formatters || Im(this.formatterCache);
    }
    return Object.defineProperty(e, "defaultLocale", {
      get: function() {
        return e.memoizedDefaultLocale || (e.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale), e.memoizedDefaultLocale;
      },
      enumerable: !1,
      configurable: !0
    }), e.memoizedDefaultLocale = null, e.resolveLocale = function(t) {
      if (!(typeof Intl.Locale > "u")) {
        var n = Intl.NumberFormat.supportedLocalesOf(t);
        return n.length > 0 ? new Intl.Locale(n[0]) : new Intl.Locale(typeof t == "string" ? t : t[0]);
      }
    }, e.__parse = bm, e.formats = {
      number: {
        integer: {
          maximumFractionDigits: 0
        },
        currency: {
          style: "currency"
        },
        percent: {
          style: "percent"
        }
      },
      date: {
        short: {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        },
        medium: {
          month: "short",
          day: "numeric",
          year: "numeric"
        },
        long: {
          month: "long",
          day: "numeric",
          year: "numeric"
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: {
          hour: "numeric",
          minute: "numeric"
        },
        medium: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    }, e;
  }()
), Ft;
(function(e) {
  e.FORMAT_ERROR = "FORMAT_ERROR", e.UNSUPPORTED_FORMATTER = "UNSUPPORTED_FORMATTER", e.INVALID_CONFIG = "INVALID_CONFIG", e.MISSING_DATA = "MISSING_DATA", e.MISSING_TRANSLATION = "MISSING_TRANSLATION";
})(Ft || (Ft = {}));
var An = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i) {
      var o = this, s = i ? i instanceof Error ? i : new Error(String(i)) : void 0;
      return o = e.call(this, "[@formatjs/intl Error ".concat(n, "] ").concat(r, `
`).concat(s ? `
`.concat(s.message, `
`).concat(s.stack) : "")) || this, o.code = n, typeof Error.captureStackTrace == "function" && Error.captureStackTrace(o, t), o;
    }
    return t;
  }(Error)
), Rm = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      return e.call(this, Ft.UNSUPPORTED_FORMATTER, n, r) || this;
    }
    return t;
  }(An)
), Am = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      return e.call(this, Ft.INVALID_CONFIG, n, r) || this;
    }
    return t;
  }(An)
), fa = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      return e.call(this, Ft.MISSING_DATA, n, r) || this;
    }
    return t;
  }(An)
), je = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i) {
      var o = e.call(this, Ft.FORMAT_ERROR, "".concat(n, `
Locale: `).concat(r, `
`), i) || this;
      return o.locale = r, o;
    }
    return t;
  }(An)
), di = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r, i, o) {
      var s = e.call(this, "".concat(n, `
MessageID: `).concat(i == null ? void 0 : i.id, `
Default Message: `).concat(i == null ? void 0 : i.defaultMessage, `
Description: `).concat(i == null ? void 0 : i.description, `
`), r, o) || this;
      return s.descriptor = i, s.locale = r, s;
    }
    return t;
  }(je)
), Om = (
  /** @class */
  function(e) {
    Le(t, e);
    function t(n, r) {
      var i = e.call(this, Ft.MISSING_TRANSLATION, 'Missing message: "'.concat(n.id, '" for locale "').concat(r, '", using ').concat(n.defaultMessage ? "default message (".concat(typeof n.defaultMessage == "string" ? n.defaultMessage : n.defaultMessage.map(function(o) {
        var s;
        return (s = o.value) !== null && s !== void 0 ? s : JSON.stringify(o);
      }).join(), ")") : "id", " as fallback.")) || this;
      return i.descriptor = n, i;
    }
    return t;
  }(An)
);
function Pm(e, t, n) {
  if (n === void 0 && (n = Error), !e)
    throw new n(t);
}
function tn(e, t, n) {
  return n === void 0 && (n = {}), t.reduce(function(r, i) {
    return i in e ? r[i] = e[i] : i in n && (r[i] = n[i]), r;
  }, {});
}
var Dm = function(e) {
  process.env.NODE_ENV !== "production" && console.error(e);
}, Lm = function(e) {
  process.env.NODE_ENV !== "production" && console.warn(e);
}, Fu = {
  formats: {},
  messages: {},
  timeZone: void 0,
  defaultLocale: "en",
  defaultFormats: {},
  fallbackOnEmptyString: !0,
  onError: Dm,
  onWarn: Lm
};
function ju() {
  return {
    dateTime: {},
    number: {},
    message: {},
    relativeTime: {},
    pluralRules: {},
    list: {},
    displayNames: {}
  };
}
function Nt(e) {
  return {
    create: function() {
      return {
        get: function(t) {
          return e[t];
        },
        set: function(t, n) {
          e[t] = n;
        }
      };
    }
  };
}
function xm(e) {
  e === void 0 && (e = ju());
  var t = Intl.RelativeTimeFormat, n = Intl.ListFormat, r = Intl.DisplayNames, i = Ye(function() {
    for (var a, l = [], c = 0; c < arguments.length; c++)
      l[c] = arguments[c];
    return new ((a = Intl.DateTimeFormat).bind.apply(a, Ue([void 0], l, !1)))();
  }, {
    cache: Nt(e.dateTime),
    strategy: Ze.variadic
  }), o = Ye(function() {
    for (var a, l = [], c = 0; c < arguments.length; c++)
      l[c] = arguments[c];
    return new ((a = Intl.NumberFormat).bind.apply(a, Ue([void 0], l, !1)))();
  }, {
    cache: Nt(e.number),
    strategy: Ze.variadic
  }), s = Ye(function() {
    for (var a, l = [], c = 0; c < arguments.length; c++)
      l[c] = arguments[c];
    return new ((a = Intl.PluralRules).bind.apply(a, Ue([void 0], l, !1)))();
  }, {
    cache: Nt(e.pluralRules),
    strategy: Ze.variadic
  });
  return {
    getDateTimeFormat: i,
    getNumberFormat: o,
    getMessageFormat: Ye(function(a, l, c, u) {
      return new Uu(a, l, c, F({ formatters: {
        getNumberFormat: o,
        getDateTimeFormat: i,
        getPluralRules: s
      } }, u || {}));
    }, {
      cache: Nt(e.message),
      strategy: Ze.variadic
    }),
    getRelativeTimeFormat: Ye(function() {
      for (var a = [], l = 0; l < arguments.length; l++)
        a[l] = arguments[l];
      return new (t.bind.apply(t, Ue([void 0], a, !1)))();
    }, {
      cache: Nt(e.relativeTime),
      strategy: Ze.variadic
    }),
    getPluralRules: s,
    getListFormat: Ye(function() {
      for (var a = [], l = 0; l < arguments.length; l++)
        a[l] = arguments[l];
      return new (n.bind.apply(n, Ue([void 0], a, !1)))();
    }, {
      cache: Nt(e.list),
      strategy: Ze.variadic
    }),
    getDisplayNames: Ye(function() {
      for (var a = [], l = 0; l < arguments.length; l++)
        a[l] = arguments[l];
      return new (r.bind.apply(r, Ue([void 0], a, !1)))();
    }, {
      cache: Nt(e.displayNames),
      strategy: Ze.variadic
    })
  };
}
function oo(e, t, n, r) {
  var i = e && e[t], o;
  if (i && (o = i[n]), o)
    return o;
  r(new Rm("No ".concat(t, " format named: ").concat(n)));
}
var ha;
(function(e) {
  e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(ha || (ha = {}));
var Mi;
(function(e) {
  e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
})(Mi || (Mi = {}));
var ma;
(function(e) {
  e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
})(ma || (ma = {}));
var fi, pa = !0;
try {
  var km = Mm("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  pa = ((fi = km.exec("a")) === null || fi === void 0 ? void 0 : fi[0]) === "a";
} catch {
  pa = !1;
}
function Mm(e, t) {
  return new RegExp(e, t);
}
function qn(e, t) {
  return Object.keys(e).reduce(function(n, r) {
    return n[r] = F({ timeZone: t }, e[r]), n;
  }, {});
}
function ga(e, t) {
  var n = Object.keys(F(F({}, e), t));
  return n.reduce(function(r, i) {
    return r[i] = F(F({}, e[i] || {}), t[i] || {}), r;
  }, {});
}
function _a(e, t) {
  if (!t)
    return e;
  var n = Uu.formats;
  return F(F(F({}, n), e), { date: ga(qn(n.date, t), qn(e.date || {}, t)), time: ga(qn(n.time, t), qn(e.time || {}, t)) });
}
var Ni = function(e, t, n, r, i) {
  var o = e.locale, s = e.formats, a = e.messages, l = e.defaultLocale, c = e.defaultFormats, u = e.fallbackOnEmptyString, f = e.onError, p = e.timeZone, g = e.defaultRichTextElements;
  n === void 0 && (n = { id: "" });
  var m = n.id, h = n.defaultMessage;
  Pm(!!m, "[@formatjs/intl] An `id` must be provided to format a message. You can either:\n1. Configure your build toolchain with [babel-plugin-formatjs](https://formatjs.github.io/docs/tooling/babel-plugin)\nor [@formatjs/ts-transformer](https://formatjs.github.io/docs/tooling/ts-transformer) OR\n2. Configure your `eslint` config to include [eslint-plugin-formatjs](https://formatjs.github.io/docs/tooling/linter#enforce-id)\nto autofix this issue");
  var v = String(m), w = (
    // In case messages is Object.create(null)
    // e.g import('foo.json') from webpack)
    // See https://github.com/formatjs/formatjs/issues/1914
    a && Object.prototype.hasOwnProperty.call(a, v) && a[v]
  );
  if (Array.isArray(w) && w.length === 1 && w[0].type === Mi.literal)
    return w[0].value;
  if (!r && w && typeof w == "string" && !g)
    return w.replace(/'\{(.*?)\}'/gi, "{$1}");
  if (r = F(F({}, g), r || {}), s = _a(s, p), c = _a(c, p), !w) {
    if (u === !1 && w === "")
      return w;
    if ((!h || o && o.toLowerCase() !== l.toLowerCase()) && f(new Om(n, o)), h)
      try {
        var E = t.getMessageFormat(h, l, c, i);
        return E.format(r);
      } catch (R) {
        return f(new di('Error formatting default message for: "'.concat(v, '", rendering default message verbatim'), o, n, R)), typeof h == "string" ? h : v;
      }
    return v;
  }
  try {
    var E = t.getMessageFormat(w, o, s, F({ formatters: t }, i || {}));
    return E.format(r);
  } catch (R) {
    f(new di('Error formatting message: "'.concat(v, '", using ').concat(h ? "default message" : "id", " as fallback."), o, n, R));
  }
  if (h)
    try {
      var E = t.getMessageFormat(h, l, c, i);
      return E.format(r);
    } catch (R) {
      f(new di('Error formatting the default message for: "'.concat(v, '", rendering message verbatim'), o, n, R));
    }
  return typeof w == "string" ? w : typeof h == "string" ? h : v;
}, Nm = [
  "formatMatcher",
  "timeZone",
  "hour12",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "hourCycle",
  "dateStyle",
  "timeStyle",
  "calendar",
  // 'dayPeriod',
  "numberingSystem",
  "fractionalSecondDigits"
];
function On(e, t, n, r) {
  var i = e.locale, o = e.formats, s = e.onError, a = e.timeZone;
  r === void 0 && (r = {});
  var l = r.format, c = F(F({}, a && { timeZone: a }), l && oo(o, t, l, s)), u = tn(r, Nm, c);
  return t === "time" && !u.hour && !u.minute && !u.second && !u.timeStyle && !u.dateStyle && (u = F(F({}, u), { hour: "numeric", minute: "numeric" })), n(i, u);
}
function Um(e, t) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var i = n[0], o = n[1], s = o === void 0 ? {} : o, a = typeof i == "string" ? new Date(i || 0) : i;
  try {
    return On(e, "date", t, s).format(a);
  } catch (l) {
    e.onError(new je("Error formatting date.", e.locale, l));
  }
  return String(a);
}
function Fm(e, t) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var i = n[0], o = n[1], s = o === void 0 ? {} : o, a = typeof i == "string" ? new Date(i || 0) : i;
  try {
    return On(e, "time", t, s).format(a);
  } catch (l) {
    e.onError(new je("Error formatting time.", e.locale, l));
  }
  return String(a);
}
function jm(e, t) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var i = n[0], o = n[1], s = n[2], a = s === void 0 ? {} : s, l = typeof i == "string" ? new Date(i || 0) : i, c = typeof o == "string" ? new Date(o || 0) : o;
  try {
    return On(e, "dateTimeRange", t, a).formatRange(l, c);
  } catch (u) {
    e.onError(new je("Error formatting date time range.", e.locale, u));
  }
  return String(l);
}
function Wm(e, t) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var i = n[0], o = n[1], s = o === void 0 ? {} : o, a = typeof i == "string" ? new Date(i || 0) : i;
  try {
    return On(e, "date", t, s).formatToParts(a);
  } catch (l) {
    e.onError(new je("Error formatting date.", e.locale, l));
  }
  return [];
}
function Bm(e, t) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var i = n[0], o = n[1], s = o === void 0 ? {} : o, a = typeof i == "string" ? new Date(i || 0) : i;
  try {
    return On(e, "time", t, s).formatToParts(a);
  } catch (l) {
    e.onError(new je("Error formatting time.", e.locale, l));
  }
  return [];
}
var Hm = [
  "style",
  "type",
  "fallback",
  "languageDisplay"
];
function Gm(e, t, n, r) {
  var i = e.locale, o = e.onError, s = Intl.DisplayNames;
  s || o(new gt(`Intl.DisplayNames is not available in this environment.
Try polyfilling it using "@formatjs/intl-displaynames"
`, tt.MISSING_INTL_API));
  var a = tn(r, Hm);
  try {
    return t(i, a).of(n);
  } catch (l) {
    o(new je("Error formatting display name.", i, l));
  }
}
var $m = [
  "type",
  "style"
], va = Date.now();
function qm(e) {
  return "".concat(va, "_").concat(e, "_").concat(va);
}
function Vm(e, t, n, r) {
  r === void 0 && (r = {});
  var i = Wu(e, t, n, r).reduce(function(o, s) {
    var a = s.value;
    return typeof a != "string" ? o.push(a) : typeof o[o.length - 1] == "string" ? o[o.length - 1] += a : o.push(a), o;
  }, []);
  return i.length === 1 ? i[0] : i.length === 0 ? "" : i;
}
function Wu(e, t, n, r) {
  var i = e.locale, o = e.onError;
  r === void 0 && (r = {});
  var s = Intl.ListFormat;
  s || o(new gt(`Intl.ListFormat is not available in this environment.
Try polyfilling it using "@formatjs/intl-listformat"
`, tt.MISSING_INTL_API));
  var a = tn(r, $m);
  try {
    var l = {}, c = n.map(function(u, f) {
      if (typeof u == "object") {
        var p = qm(f);
        return l[p] = u, p;
      }
      return String(u);
    });
    return t(i, a).formatToParts(c).map(function(u) {
      return u.type === "literal" ? u : F(F({}, u), { value: l[u.value] || u.value });
    });
  } catch (u) {
    o(new je("Error formatting list.", i, u));
  }
  return n;
}
var zm = ["type"];
function Km(e, t, n, r) {
  var i = e.locale, o = e.onError;
  r === void 0 && (r = {}), Intl.PluralRules || o(new gt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, tt.MISSING_INTL_API));
  var s = tn(r, zm);
  try {
    return t(i, s).select(n);
  } catch (a) {
    o(new je("Error formatting plural.", i, a));
  }
  return "other";
}
var Jm = ["numeric", "style"];
function Xm(e, t, n) {
  var r = e.locale, i = e.formats, o = e.onError;
  n === void 0 && (n = {});
  var s = n.format, a = !!s && oo(i, "relative", s, o) || {}, l = tn(n, Jm, a);
  return t(r, l);
}
function Ym(e, t, n, r, i) {
  i === void 0 && (i = {}), r || (r = "second");
  var o = Intl.RelativeTimeFormat;
  o || e.onError(new gt(`Intl.RelativeTimeFormat is not available in this environment.
Try polyfilling it using "@formatjs/intl-relativetimeformat"
`, tt.MISSING_INTL_API));
  try {
    return Xm(e, t, i).format(n, r);
  } catch (s) {
    e.onError(new je("Error formatting relative time.", e.locale, s));
  }
  return String(n);
}
var Zm = [
  "style",
  "currency",
  "unit",
  "unitDisplay",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  // ES2020 NumberFormat
  "compactDisplay",
  "currencyDisplay",
  "currencySign",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "numberingSystem",
  // ES2023 NumberFormat
  "trailingZeroDisplay",
  "roundingPriority",
  "roundingIncrement",
  "roundingMode"
];
function Bu(e, t, n) {
  var r = e.locale, i = e.formats, o = e.onError;
  n === void 0 && (n = {});
  var s = n.format, a = s && oo(i, "number", s, o) || {}, l = tn(n, Zm, a);
  return t(r, l);
}
function Qm(e, t, n, r) {
  r === void 0 && (r = {});
  try {
    return Bu(e, t, r).format(n);
  } catch (i) {
    e.onError(new je("Error formatting number.", e.locale, i));
  }
  return String(n);
}
function ep(e, t, n, r) {
  r === void 0 && (r = {});
  try {
    return Bu(e, t, r).formatToParts(n);
  } catch (i) {
    e.onError(new je("Error formatting number.", e.locale, i));
  }
  return [];
}
function tp(e) {
  var t = e ? e[Object.keys(e)[0]] : void 0;
  return typeof t == "string";
}
function np(e) {
  e.onWarn && e.defaultRichTextElements && tp(e.messages || {}) && e.onWarn(`[@formatjs/intl] "defaultRichTextElements" was specified but "message" was not pre-compiled. 
Please consider using "@formatjs/cli" to pre-compile your messages for performance.
For more details see https://formatjs.github.io/docs/getting-started/message-distribution`);
}
function rp(e, t) {
  var n = xm(t), r = F(F({}, Fu), e), i = r.locale, o = r.defaultLocale, s = r.onError;
  return i ? !Intl.NumberFormat.supportedLocalesOf(i).length && s ? s(new fa('Missing locale data for locale: "'.concat(i, '" in Intl.NumberFormat. Using default locale: "').concat(o, '" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details'))) : !Intl.DateTimeFormat.supportedLocalesOf(i).length && s && s(new fa('Missing locale data for locale: "'.concat(i, '" in Intl.DateTimeFormat. Using default locale: "').concat(o, '" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details'))) : (s && s(new Am('"locale" was not configured, using "'.concat(o, '" as fallback. See https://formatjs.github.io/docs/react-intl/api#intlshape for more details'))), r.locale = r.defaultLocale || "en"), np(r), F(F({}, r), { formatters: n, formatNumber: Qm.bind(null, r, n.getNumberFormat), formatNumberToParts: ep.bind(null, r, n.getNumberFormat), formatRelativeTime: Ym.bind(null, r, n.getRelativeTimeFormat), formatDate: Um.bind(null, r, n.getDateTimeFormat), formatDateToParts: Wm.bind(null, r, n.getDateTimeFormat), formatTime: Fm.bind(null, r, n.getDateTimeFormat), formatDateTimeRange: jm.bind(null, r, n.getDateTimeFormat), formatTimeToParts: Bm.bind(null, r, n.getDateTimeFormat), formatPlural: Km.bind(null, r, n.getPluralRules), formatMessage: Ni.bind(null, r, n), $t: Ni.bind(null, r, n), formatList: Vm.bind(null, r, n.getListFormat), formatListToParts: Wu.bind(null, r, n.getListFormat), formatDisplayName: Gm.bind(null, r, n.getDisplayNames) });
}
function ip(e, t, n) {
  if (n === void 0 && (n = Error), !e)
    throw new n(t);
}
function op(e) {
  ip(e, "[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.");
}
var sp = F(F({}, Fu), { textComponent: qe.Fragment }), ap = { key: 42 }, up = function(e) {
  return qe.isValidElement(e) ? qe.createElement(qe.Fragment, ap, e) : e;
}, lp = function(e) {
  var t;
  return (t = qe.Children.map(e, up)) !== null && t !== void 0 ? t : [];
};
function cp(e) {
  return function(t) {
    return e(qe.Children.toArray(t));
  };
}
var Vn = { exports: {} }, le = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ya;
function dp() {
  if (ya) return le;
  ya = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, u = e ? Symbol.for("react.forward_ref") : 60112, f = e ? Symbol.for("react.suspense") : 60113, p = e ? Symbol.for("react.suspense_list") : 60120, g = e ? Symbol.for("react.memo") : 60115, m = e ? Symbol.for("react.lazy") : 60116, h = e ? Symbol.for("react.block") : 60121, v = e ? Symbol.for("react.fundamental") : 60117, w = e ? Symbol.for("react.responder") : 60118, E = e ? Symbol.for("react.scope") : 60119;
  function R(b) {
    if (typeof b == "object" && b !== null) {
      var P = b.$$typeof;
      switch (P) {
        case t:
          switch (b = b.type, b) {
            case l:
            case c:
            case r:
            case o:
            case i:
            case f:
              return b;
            default:
              switch (b = b && b.$$typeof, b) {
                case a:
                case u:
                case m:
                case g:
                case s:
                  return b;
                default:
                  return P;
              }
          }
        case n:
          return P;
      }
    }
  }
  function M(b) {
    return R(b) === c;
  }
  return le.AsyncMode = l, le.ConcurrentMode = c, le.ContextConsumer = a, le.ContextProvider = s, le.Element = t, le.ForwardRef = u, le.Fragment = r, le.Lazy = m, le.Memo = g, le.Portal = n, le.Profiler = o, le.StrictMode = i, le.Suspense = f, le.isAsyncMode = function(b) {
    return M(b) || R(b) === l;
  }, le.isConcurrentMode = M, le.isContextConsumer = function(b) {
    return R(b) === a;
  }, le.isContextProvider = function(b) {
    return R(b) === s;
  }, le.isElement = function(b) {
    return typeof b == "object" && b !== null && b.$$typeof === t;
  }, le.isForwardRef = function(b) {
    return R(b) === u;
  }, le.isFragment = function(b) {
    return R(b) === r;
  }, le.isLazy = function(b) {
    return R(b) === m;
  }, le.isMemo = function(b) {
    return R(b) === g;
  }, le.isPortal = function(b) {
    return R(b) === n;
  }, le.isProfiler = function(b) {
    return R(b) === o;
  }, le.isStrictMode = function(b) {
    return R(b) === i;
  }, le.isSuspense = function(b) {
    return R(b) === f;
  }, le.isValidElementType = function(b) {
    return typeof b == "string" || typeof b == "function" || b === r || b === c || b === o || b === i || b === f || b === p || typeof b == "object" && b !== null && (b.$$typeof === m || b.$$typeof === g || b.$$typeof === s || b.$$typeof === a || b.$$typeof === u || b.$$typeof === v || b.$$typeof === w || b.$$typeof === E || b.$$typeof === h);
  }, le.typeOf = R, le;
}
var ce = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ba;
function fp() {
  return ba || (ba = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, u = e ? Symbol.for("react.forward_ref") : 60112, f = e ? Symbol.for("react.suspense") : 60113, p = e ? Symbol.for("react.suspense_list") : 60120, g = e ? Symbol.for("react.memo") : 60115, m = e ? Symbol.for("react.lazy") : 60116, h = e ? Symbol.for("react.block") : 60121, v = e ? Symbol.for("react.fundamental") : 60117, w = e ? Symbol.for("react.responder") : 60118, E = e ? Symbol.for("react.scope") : 60119;
    function R(B) {
      return typeof B == "string" || typeof B == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      B === r || B === c || B === o || B === i || B === f || B === p || typeof B == "object" && B !== null && (B.$$typeof === m || B.$$typeof === g || B.$$typeof === s || B.$$typeof === a || B.$$typeof === u || B.$$typeof === v || B.$$typeof === w || B.$$typeof === E || B.$$typeof === h);
    }
    function M(B) {
      if (typeof B == "object" && B !== null) {
        var ae = B.$$typeof;
        switch (ae) {
          case t:
            var Re = B.type;
            switch (Re) {
              case l:
              case c:
              case r:
              case o:
              case i:
              case f:
                return Re;
              default:
                var se = Re && Re.$$typeof;
                switch (se) {
                  case a:
                  case u:
                  case m:
                  case g:
                  case s:
                    return se;
                  default:
                    return ae;
                }
            }
          case n:
            return ae;
        }
      }
    }
    var b = l, P = c, U = a, H = s, Y = t, ue = u, de = r, Ce = m, ye = g, ve = n, V = o, N = i, O = f, z = !1;
    function X(B) {
      return z || (z = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), ee(B) || M(B) === l;
    }
    function ee(B) {
      return M(B) === c;
    }
    function T(B) {
      return M(B) === a;
    }
    function _(B) {
      return M(B) === s;
    }
    function S(B) {
      return typeof B == "object" && B !== null && B.$$typeof === t;
    }
    function C(B) {
      return M(B) === u;
    }
    function I(B) {
      return M(B) === r;
    }
    function L(B) {
      return M(B) === m;
    }
    function k(B) {
      return M(B) === g;
    }
    function W(B) {
      return M(B) === n;
    }
    function q(B) {
      return M(B) === o;
    }
    function Z(B) {
      return M(B) === i;
    }
    function J(B) {
      return M(B) === f;
    }
    ce.AsyncMode = b, ce.ConcurrentMode = P, ce.ContextConsumer = U, ce.ContextProvider = H, ce.Element = Y, ce.ForwardRef = ue, ce.Fragment = de, ce.Lazy = Ce, ce.Memo = ye, ce.Portal = ve, ce.Profiler = V, ce.StrictMode = N, ce.Suspense = O, ce.isAsyncMode = X, ce.isConcurrentMode = ee, ce.isContextConsumer = T, ce.isContextProvider = _, ce.isElement = S, ce.isForwardRef = C, ce.isFragment = I, ce.isLazy = L, ce.isMemo = k, ce.isPortal = W, ce.isProfiler = q, ce.isStrictMode = Z, ce.isSuspense = J, ce.isValidElementType = R, ce.typeOf = M;
  }()), ce;
}
var Ea;
function hp() {
  return Ea || (Ea = 1, process.env.NODE_ENV === "production" ? Vn.exports = dp() : Vn.exports = fp()), Vn.exports;
}
var hi, wa;
function mp() {
  if (wa) return hi;
  wa = 1;
  var e = hp(), t = {
    childContextTypes: !0,
    contextType: !0,
    contextTypes: !0,
    defaultProps: !0,
    displayName: !0,
    getDefaultProps: !0,
    getDerivedStateFromError: !0,
    getDerivedStateFromProps: !0,
    mixins: !0,
    propTypes: !0,
    type: !0
  }, n = {
    name: !0,
    length: !0,
    prototype: !0,
    caller: !0,
    callee: !0,
    arguments: !0,
    arity: !0
  }, r = {
    $$typeof: !0,
    render: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0
  }, i = {
    $$typeof: !0,
    compare: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
    type: !0
  }, o = {};
  o[e.ForwardRef] = r, o[e.Memo] = i;
  function s(m) {
    return e.isMemo(m) ? i : o[m.$$typeof] || t;
  }
  var a = Object.defineProperty, l = Object.getOwnPropertyNames, c = Object.getOwnPropertySymbols, u = Object.getOwnPropertyDescriptor, f = Object.getPrototypeOf, p = Object.prototype;
  function g(m, h, v) {
    if (typeof h != "string") {
      if (p) {
        var w = f(h);
        w && w !== p && g(m, w, v);
      }
      var E = l(h);
      c && (E = E.concat(c(h)));
      for (var R = s(m), M = s(h), b = 0; b < E.length; ++b) {
        var P = E[b];
        if (!n[P] && !(v && v[P]) && !(M && M[P]) && !(R && R[P])) {
          var U = u(h, P);
          try {
            a(m, P, U);
          } catch {
          }
        }
      }
    }
    return m;
  }
  return hi = g, hi;
}
mp();
var so = typeof window < "u" && !window.__REACT_INTL_BYPASS_GLOBAL_CONTEXT__ ? window.__REACT_INTL_CONTEXT__ || (window.__REACT_INTL_CONTEXT__ = qe.createContext(null)) : qe.createContext(null);
so.Consumer;
so.Provider;
var pp = so;
function Hu() {
  var e = qe.useContext(pp);
  return op(e), e;
}
var Ui;
(function(e) {
  e.formatDate = "FormattedDate", e.formatTime = "FormattedTime", e.formatNumber = "FormattedNumber", e.formatList = "FormattedList", e.formatDisplayName = "FormattedDisplayName";
})(Ui || (Ui = {}));
var Fi;
(function(e) {
  e.formatDate = "FormattedDateParts", e.formatTime = "FormattedTimeParts", e.formatNumber = "FormattedNumberParts", e.formatList = "FormattedListParts";
})(Fi || (Fi = {}));
function Gu(e) {
  var t = function(n) {
    var r = Hu(), i = n.value, o = n.children, s = Cn(n, ["value", "children"]), a = typeof i == "string" ? new Date(i || 0) : i, l = e === "formatDate" ? r.formatDateToParts(a, s) : r.formatTimeToParts(a, s);
    return o(l);
  };
  return t.displayName = Fi[e], t;
}
function Pn(e) {
  var t = function(n) {
    var r = Hu(), i = n.value, o = n.children, s = Cn(
      n,
      ["value", "children"]
    ), a = r[e](i, s);
    if (typeof o == "function")
      return o(a);
    var l = r.textComponent || qe.Fragment;
    return qe.createElement(l, null, a);
  };
  return t.displayName = Ui[e], t;
}
function $u(e) {
  return e && Object.keys(e).reduce(function(t, n) {
    var r = e[n];
    return t[n] = Nu(r) ? cp(r) : r, t;
  }, {});
}
var Sa = function(e, t, n, r) {
  for (var i = [], o = 4; o < arguments.length; o++)
    i[o - 4] = arguments[o];
  var s = $u(r), a = Ni.apply(void 0, Ue([
    e,
    t,
    n,
    s
  ], i, !1));
  return Array.isArray(a) ? lp(a) : a;
}, gp = function(e, t) {
  var n = e.defaultRichTextElements, r = Cn(e, ["defaultRichTextElements"]), i = $u(n), o = rp(F(F(F({}, sp), r), { defaultRichTextElements: i }), t), s = {
    locale: o.locale,
    timeZone: o.timeZone,
    fallbackOnEmptyString: o.fallbackOnEmptyString,
    formats: o.formats,
    defaultLocale: o.defaultLocale,
    defaultFormats: o.defaultFormats,
    messages: o.messages,
    onError: o.onError,
    defaultRichTextElements: i
  };
  return F(F({}, o), { formatMessage: Sa.bind(null, s, o.formatters), $t: Sa.bind(null, s, o.formatters) });
};
Pn("formatDate");
Pn("formatTime");
Pn("formatNumber");
Pn("formatList");
Pn("formatDisplayName");
Gu("formatDate");
Gu("formatTime");
const jt = "en-US", br = "dev", zn = {
  dev: "dev",
  am: "am",
  ar: "ar",
  bg: "bg",
  "bg-bg": "bg",
  bn: "bn",
  "bn-bd": "bn",
  bs: "bs",
  "bs-ba": "bs",
  ca: "ca",
  "ca-es": "ca",
  cs: "cs",
  "cs-cz": "cs",
  da: "da",
  "da-dk": "da",
  de: "de",
  "de-de": "de",
  el: "el",
  "el-gr": "el",
  en: "en-US",
  "en-us": "en-US",
  // Spanish
  es: "es",
  "es-es": "es",
  "es-419": "es-419",
  "es-ar": "es-419",
  "es-bo": "es-419",
  "es-br": "es-419",
  "es-bz": "es-419",
  "es-cl": "es-419",
  "es-co": "es-419",
  "es-cr": "es-419",
  "es-cu": "es-419",
  "es-do": "es-419",
  "es-ec": "es-419",
  "es-gt": "es-419",
  "es-hn": "es-419",
  "es-jp": "es-419",
  "es-mx": "es-419",
  "es-ni": "es-419",
  "es-pa": "es-419",
  "es-pe": "es-419",
  "es-pr": "es-419",
  "es-py": "es-419",
  "es-sv": "es-419",
  "es-us": "es-419",
  "es-uy": "es-419",
  "es-ve": "es-419",
  et: "et",
  "et-ee": "et",
  fi: "fi",
  "fi-fi": "fi",
  // French
  fr: "fr",
  "fr-ca": "fr-CA",
  "fr-fr": "fr",
  gu: "gu",
  "gu-in": "gu",
  hi: "hi",
  "hi-in": "hi",
  hr: "hr",
  "hr-hr": "hr",
  hu: "hu",
  "hu-hu": "hu",
  hy: "hy",
  "hy-am": "hy",
  id: "id",
  "id-id": "id",
  is: "is",
  "is-is": "is",
  it: "it",
  "it-it": "it",
  ja: "ja",
  "ja-jp": "ja",
  ka: "ka",
  "ka-ge": "ka",
  kk: "kk",
  kn: "kn",
  "kn-in": "kn",
  ko: "ko",
  "ko-kr": "ko",
  lt: "lt",
  lv: "lv",
  "lv-lv": "lv",
  mk: "mk",
  "mk-mk": "mk",
  ml: "ml",
  mn: "mn",
  mr: "mr",
  "mr-in": "mr",
  ms: "ms",
  "ms-my": "ms",
  my: "my",
  "my-mm": "my",
  nb: "nb",
  "nb-no": "nb",
  nl: "nl",
  "nl-nl": "nl",
  pa: "pa",
  pl: "pl",
  "pl-pl": "pl",
  // Portuguese
  pt: "pt",
  "pt-br": "pt",
  "pt-pt": "pt-PT",
  "pt-ao": "pt-PT",
  "pt-ch": "pt-PT",
  "pt-cv": "pt-PT",
  "pt-fr": "pt-PT",
  "pt-gq": "pt-PT",
  "pt-gw": "pt-PT",
  "pt-lu": "pt-PT",
  "pt-mo": "pt-PT",
  "pt-mz": "pt-PT",
  "pt-st": "pt-PT",
  "pt-tl": "pt-PT",
  ro: "ro",
  "ro-ro": "ro",
  ru: "ru",
  "ru-ru": "ru",
  sk: "sk",
  "sk-sk": "sk",
  sl: "sl",
  "sl-si": "sl",
  so: "so",
  "so-so": "so",
  sq: "sq",
  "sq-al": "sq",
  sr: "sr",
  "sr-rs": "sr",
  sv: "sv",
  "sv-se": "sv",
  sw: "sw",
  "sw-tz": "sw",
  ta: "ta",
  "ta-in": "ta",
  te: "te",
  "te-in": "te",
  th: "th",
  "th-th": "th",
  tl: "tl",
  tr: "tr",
  "tr-tr": "tr",
  uk: "uk",
  "uk-ua": "uk",
  ur: "ur",
  vi: "vi",
  "vi-vn": "vi",
  // Chinese
  zh: "zh",
  "zh-cn": "zh",
  "zh-hans": "zh",
  "zh-hans-cn": "zh",
  "zh-tw": "zh-Hant",
  "zh-hant": "zh-Hant",
  "zh-hant-tw": "zh-Hant",
  "zh-hk": "zh-HK",
  "zh-hant-hk": "zh-HK"
}, _p = {
  a: "ȧ",
  A: "Ȧ",
  b: "ƀ",
  B: "Ɓ",
  c: "ƈ",
  C: "Ƈ",
  d: "ḓ",
  D: "Ḓ",
  e: "ḗ",
  E: "Ḗ",
  f: "ƒ",
  F: "Ƒ",
  g: "ɠ",
  G: "Ɠ",
  h: "ħ",
  H: "Ħ",
  i: "ī",
  I: "Ī",
  j: "ĵ",
  J: "Ĵ",
  k: "ķ",
  K: "Ķ",
  l: "ŀ",
  L: "Ŀ",
  m: "ḿ",
  M: "Ḿ",
  n: "ƞ",
  N: "Ƞ",
  o: "ǿ",
  O: "Ǿ",
  p: "ƥ",
  P: "Ƥ",
  q: "ɋ",
  Q: "Ɋ",
  r: "ř",
  R: "Ř",
  s: "ş",
  S: "Ş",
  t: "ŧ",
  T: "Ŧ",
  v: "ṽ",
  V: "Ṽ",
  u: "ŭ",
  U: "Ŭ",
  w: "ẇ",
  W: "Ẇ",
  x: "ẋ",
  X: "Ẋ",
  y: "ẏ",
  Y: "Ẏ",
  z: "ẑ",
  Z: "Ẑ"
};
function vp(e, t) {
  let n = "";
  const r = [];
  for (const i of e) {
    switch (i) {
      case "<":
        r.push(">");
        break;
      case "{":
        r.push("}");
        break;
      case ">":
      case "}":
        r.length > 0 && r[r.length - 1] === i && r.pop();
        break;
    }
    if (r.length > 0) {
      n += i;
      continue;
    }
    if (i in t.map) {
      const o = i, s = o.toLowerCase();
      s === "a" || s === "e" || s === "o" || s === "u" ? n += t.map[o] + t.map[o] : n += t.map[o];
    } else n += i;
  }
  return n.startsWith(t.prefix) && n.endsWith(t.postfix) ? n : t.prefix + n + t.postfix;
}
async function yp() {
  const e = await import("./en-VXjokk_Y.js");
  return Object.fromEntries(Object.entries(e.default).map(([t, n]) => [t, vp(n.defaultMessage, {
    prefix: "🌎",
    postfix: "🌎",
    map: _p
  })]));
}
function bp(e) {
  const t = e.replace("_", "-").toLowerCase();
  if (t in zn)
    return zn[t];
  const n = t.split("-");
  for (let r = n.length - 1; r >= 1; r--) {
    const i = n.slice(0, r).join("-");
    if (i in zn)
      return zn[i];
  }
  return jt;
}
const Ep = /* @__PURE__ */ Object.assign({
  "/src/common/locales/am.json": () => import("./am-BpBLs2Hk.js"),
  "/src/common/locales/ar.json": () => import("./ar-Dtpsanaf.js"),
  "/src/common/locales/bg.json": () => import("./bg-CHpRMTer.js"),
  "/src/common/locales/bn.json": () => import("./bn-X56PRxDN.js"),
  "/src/common/locales/bs.json": () => import("./bs-J-qzyeLC.js"),
  "/src/common/locales/ca.json": () => import("./ca-Bz0LEUjt.js"),
  "/src/common/locales/cs.json": () => import("./cs-CQN1zQte.js"),
  "/src/common/locales/da.json": () => import("./da-B59ZCRak.js"),
  "/src/common/locales/de.json": () => import("./de-BhJjz-g0.js"),
  "/src/common/locales/el.json": () => import("./el-DLJvj3Vs.js"),
  "/src/common/locales/es-419.json": () => import("./es-419-BtybgAyR.js"),
  "/src/common/locales/es.json": () => import("./es-DcW3Ttkv.js"),
  "/src/common/locales/et.json": () => import("./et-fOGBb9DR.js"),
  "/src/common/locales/fi.json": () => import("./fi-B3WsOZUB.js"),
  "/src/common/locales/fr-CA.json": () => import("./fr-CA-DvnMEYWw.js"),
  "/src/common/locales/fr.json": () => import("./fr-COXYpaHi.js"),
  "/src/common/locales/gu.json": () => import("./gu-D0NiKINR.js"),
  "/src/common/locales/hi.json": () => import("./hi-BphakLpe.js"),
  "/src/common/locales/hr.json": () => import("./hr-DrDprsp6.js"),
  "/src/common/locales/hu.json": () => import("./hu-WUMHI2F4.js"),
  "/src/common/locales/hy.json": () => import("./hy-B_HB4bIu.js"),
  "/src/common/locales/id.json": () => import("./id-Dks5BFDe.js"),
  "/src/common/locales/is.json": () => import("./is-CIqeW13l.js"),
  "/src/common/locales/it.json": () => import("./it-M-ZuPCWH.js"),
  "/src/common/locales/ja.json": () => import("./ja-SUW0qSmS.js"),
  "/src/common/locales/ka.json": () => import("./ka-C2YNnR-k.js"),
  "/src/common/locales/kk.json": () => import("./kk-B9zi9c4k.js"),
  "/src/common/locales/kn.json": () => import("./kn-BGJldfa6.js"),
  "/src/common/locales/ko.json": () => import("./ko-oyMFhImX.js"),
  "/src/common/locales/lt.json": () => import("./lt-DIqSEUWh.js"),
  "/src/common/locales/lv.json": () => import("./lv-Dh_TYizS.js"),
  "/src/common/locales/mk.json": () => import("./mk-R4jNwqFJ.js"),
  "/src/common/locales/ml.json": () => import("./ml-Bn14mUep.js"),
  "/src/common/locales/mn.json": () => import("./mn-CTf1d-Yv.js"),
  "/src/common/locales/mr.json": () => import("./mr-j1D0BB-y.js"),
  "/src/common/locales/ms.json": () => import("./ms-D_TrS2fm.js"),
  "/src/common/locales/my.json": () => import("./my-DZSyvhPp.js"),
  "/src/common/locales/nb.json": () => import("./nb-BOHtgwjY.js"),
  "/src/common/locales/nl.json": () => import("./nl-BqerwYXU.js"),
  "/src/common/locales/pa.json": () => import("./pa-BYxdgBhZ.js"),
  "/src/common/locales/pl.json": () => import("./pl-C7xvve7Z.js"),
  "/src/common/locales/pt-PT.json": () => import("./pt-PT-BqMcyV1b.js"),
  "/src/common/locales/pt.json": () => import("./pt-Chti4KY_.js"),
  "/src/common/locales/ro.json": () => import("./ro-CMD6BPqB.js"),
  "/src/common/locales/ru.json": () => import("./ru-CJWTIePj.js"),
  "/src/common/locales/sk.json": () => import("./sk-CgNwUrkG.js"),
  "/src/common/locales/sl.json": () => import("./sl-DrjPMgEQ.js"),
  "/src/common/locales/so.json": () => import("./so-toq-SxWw.js"),
  "/src/common/locales/sq.json": () => import("./sq-CVC7pHxr.js"),
  "/src/common/locales/sr.json": () => import("./sr-CYC9nQb_.js"),
  "/src/common/locales/sv.json": () => import("./sv-qiApf12I.js"),
  "/src/common/locales/sw.json": () => import("./sw-BbrRE69I.js"),
  "/src/common/locales/ta.json": () => import("./ta-CHK5aqLy.js"),
  "/src/common/locales/te.json": () => import("./te--JqvvPL1.js"),
  "/src/common/locales/th.json": () => import("./th-DPGn5Rnt.js"),
  "/src/common/locales/tl.json": () => import("./tl-CrocNGVR.js"),
  "/src/common/locales/tr.json": () => import("./tr-CdSDmR4e.js"),
  "/src/common/locales/uk.json": () => import("./uk-CZemHGL_.js"),
  "/src/common/locales/ur.json": () => import("./ur-BOCWjeHx.js"),
  "/src/common/locales/vi.json": () => import("./vi-Co54pRl_.js"),
  "/src/common/locales/zh-HK.json": () => import("./zh-HK-BaeNKWn6.js"),
  "/src/common/locales/zh-Hant.json": () => import("./zh-Hant-CgLeWZmx.js"),
  "/src/common/locales/zh.json": () => import("./zh-CffWBHfs.js")
}), qu = ju(), yn = {};
function Vu(e, t, n) {
  return gp({
    locale: e === br ? jt : e,
    // In dev locale case, it is English with some tweaks
    messages: t,
    onError: (r) => {
      if (r.code === "MISSING_TRANSLATION") {
        if (e === jt)
          return;
        ke.recordEvent(Qe.MissingTranslation, {
          message: r.message
        });
      } else
        G.error(r);
    }
  }, n);
}
const Ta = {
  locale: jt,
  intl: Vu(jt, {}, qu)
};
async function wp(e) {
  if (e === jt)
    return {};
  if (e === br)
    return await yp();
  const t = `/src/common/locales/${e}.json`;
  return (await Ep[t]()).default;
}
function Sp() {
  return yn[jt] = Ta.intl, cc()((e) => ({
    ...Ta,
    attemptSetLocale: async function(t) {
      const n = bp(t);
      if (n in yn)
        return e({
          locale: n,
          intl: yn[n]
        }), n;
      const r = await wp(n);
      return yn[n] = Vu(n, r, qu), e({
        locale: n,
        intl: yn[n]
      }), n;
    }
  }));
}
let mi;
const lt = () => (mi || (mi = Sp()), mi);
function Tp() {
  Ne && (zu() ? lt().getState().attemptSetLocale(he.getLocale()) : lt().getState().attemptSetLocale(br));
}
function zu() {
  return lt().getState().locale == br;
}
async function Cp() {
  return lt().getState().attemptSetLocale(he.getLocale());
}
function Ip(e, t) {
  const n = e.items.length, r = _i ? [{
    label: "Crash App via Windows Addon",
    click: () => {
      $t.generateTestNativeCrash();
    }
  }, {
    label: "Native exception via Windows Addon",
    click: () => {
      $t.generateTestNativeException();
    }
  }] : [], i = _i ? [{
    label: "Trigger Auto Update Check",
    click: () => {
      $t.checkForUpdatesAsync();
    }
  }, {
    label: "UI Automation Testing",
    submenu: [{
      label: "Get selected text from windows terminal",
      click: async () => {
        const s = await $t.getTextFromApp("WindowsTerminal", !0);
        console.log(`Selected text is:
${s}`);
      }
    }, {
      label: "Get all text from notepad",
      click: async () => {
        const s = await $t.getTextFromApp("notepad", !1);
        console.log(`Text is:
${s}`);
      }
    }, {
      label: "Get VS Code text",
      click: async () => {
        const s = await $t.getTextFromApp("code", !1);
        console.log(`Selected text is:
${s}`);
      }
    }]
  }] : [];
  $i.buildFromTemplate([{
    label: "🔐📋 Login via clipboard link",
    click: () => {
      kh(t.onAuthViaClipboard);
    }
  }, {
    label: "🔨 Toggle Developer Tools",
    click: () => {
      ft.getAllWindows().forEach((s) => {
        s.isVisible() && s.webContents.openDevTools();
      });
    }
  }, {
    label: "🔄 Logout and Reset App",
    click: async () => {
      (await lr()).getState().reset(), t.onReset();
    }
  }, {
    label: "⚠️ Error Reporting",
    submenu: [{
      label: "Crash App",
      click: () => {
        process.crash();
      }
    }, {
      label: "Throw Uncaught Exception",
      click: () => {
        throw new Error("Uncaught Exception Test");
      }
    }, {
      label: "Log 100 Exceptions as warning",
      click: () => {
        for (let s = 0; s < 100; s++)
          G.warn(new Error("Exception logged as warning"));
      }
    }, {
      label: "Log Exception as warning",
      click: () => {
        G.warn(new Error("Exception logged as warning"));
      }
    }, {
      label: "Hang UI to trigger ANR error",
      click: () => {
        const s = Date.now();
        let a = 1;
        for (; s + dc + 1e3 > Date.now(); )
          a++;
        G.info(`Triggered ANR while computing value ${a}`);
      }
    }, ...r]
  }, {
    label: `🌎 Toggle Pseudo Locale ${zu() ? "Off" : "On"}`,
    click: () => {
      Tp();
    }
  }, {
    label: "🔺 Show Error View",
    click: () => {
      t.onShowErrorView();
    }
  }, {
    label: "📷 Take Photo",
    click: async () => {
      G.info("Taking photo"), Ca(await we.takePhoto(ft.getAllWindows()[0].getNativeWindowHandle()));
    }
  }, {
    label: "📺 Take Screenshot",
    click: async () => {
      G.info("Taking Screenshot"), Ca(await we.takeScreenshot());
    }
  }, {
    label: "⌨️ Reserve protected hotkeys",
    click: async () => {
      G.info("Reserving protected hotkeys"), nu();
    }
  }, {
    label: " 🌍 Web Environment",
    submenu: xh()
  }, ...i]).items.forEach((s) => {
    e.insert(e.items.length - n, s);
  }), e.insert(e.items.length - n, new ec({
    type: "separator"
  }));
}
function Ca(e) {
  if (!e)
    return;
  const t = new ft({
    /* eng-disable CONTEXT_ISOLATION_JS_CHECK SANDBOX_JS_CHECK AUXCLICK_JS_CHECK */
    width: 800,
    height: 600
  });
  t.loadURL(`data:text/html,
    <html>
      <body style="margin:0;">
        <img id="image" style="width:100%;height:100%;object-fit:contain;" />
      </body>
    </html>`), t.webContents.once("did-finish-load", () => {
    const r = `
      (function() {
        const binaryString = atob("${Buffer.from(e.data).toString("base64")}");
        const length = binaryString.length;
        const uint8Array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: "${e.mimeType}" });
        const url = URL.createObjectURL(blob);
        document.getElementById('image').src = url;
      })();
    `;
    t.webContents.executeJavaScript(r);
  });
}
function Rp(e, t) {
  const n = ft.fromWebContents(e);
  e.on("context-menu", (r, i) => {
    Ap(r, i, n, t);
  });
}
async function Ap(e, t, n, r) {
  const {
    editFlags: i,
    hasImageContents: o,
    isEditable: s,
    linkURL: a,
    mediaType: l,
    selectionText: c,
    srcURL: u,
    dictionarySuggestions: f,
    misspelledWord: p
  } = t, g = c.length > 0, m = lt().getState().intl;
  let h;
  if (g && !s)
    h = Op(m);
  else if (s && l === "none")
    h = Pp(m, i, f, p, n.webContents);
  else if (a && zc(a))
    h = Dp(m, a);
  else if (o)
    h = Lp(m, n, u, t.x, t.y, r.onDownloadURL);
  else
    return;
  $i.buildFromTemplate(h).popup();
}
function Ku(e, t) {
  return {
    label: e.formatMessage({
      id: "webContextMenu.copyText",
      defaultMessage: "Copy"
    }),
    role: "copy",
    enabled: t
  };
}
function Op(e) {
  const t = [];
  return t.push(Ku(e, !0)), t;
}
function Pp(e, t, n, r, i) {
  const o = [];
  if (n && n.length > 0) {
    for (const s of n)
      o.push({
        label: s,
        click: () => i.replaceMisspelling(s)
      });
    o.push({
      type: "separator"
    });
  }
  return r && (o.push({
    label: e.formatMessage({
      id: "webContextMenu.addToDictionary",
      defaultMessage: "Add to dictionary"
    }),
    click: () => i.session.addWordToSpellCheckerDictionary(r)
  }), o.push({
    type: "separator"
  })), o.push({
    label: e.formatMessage({
      id: "webContextMenu.showEmoji",
      defaultMessage: "Emoji"
    }),
    click: () => he.showEmojiPanel()
  }), o.push({
    type: "separator"
  }), o.push({
    label: e.formatMessage({
      id: "webContextMenu.undoEdit",
      defaultMessage: "Undo"
    }),
    role: "undo",
    enabled: t.canUndo
  }), o.push({
    type: "separator"
  }), o.push({
    label: e.formatMessage({
      id: "webContextMenu.cutText",
      defaultMessage: "Cut"
    }),
    role: "cut",
    enabled: t.canCut
  }), o.push(Ku(e, t.canCopy)), o.push({
    label: e.formatMessage({
      id: "webContextMenu.pasteText",
      defaultMessage: "Paste"
    }),
    role: "paste",
    enabled: t.canPaste
  }), o.push({
    label: e.formatMessage({
      id: "webContextMenu.selectAll",
      defaultMessage: "Select all"
    }),
    role: "selectAll",
    enabled: t.canSelectAll
  }), o;
}
function Dp(e, t) {
  const n = [];
  return n.push({
    label: e.formatMessage({
      id: "webContextMenu.copyLink",
      defaultMessage: "Copy link"
    }),
    click: () => Qn.write({
      text: t,
      bookmark: t
    })
  }), n;
}
function Lp(e, t, n, r, i, o) {
  const s = [];
  return s.push({
    label: e.formatMessage({
      id: "webContextMenu.copyImage",
      defaultMessage: "Copy image"
    }),
    click: () => t.webContents.copyImageAt(r, i)
    // https://github.com/electron/electron/issues/37187
  }), s.push({
    label: e.formatMessage({
      id: "webContextMenu.saveImageAs",
      defaultMessage: "Save image as"
    }),
    click: () => o(n)
  }), s;
}
const xp = ["accessibility-events", "automatic-fullscreen", "background-sync", "camera", "clipboard-read", "clipboard-sanitized-write", "fullscreen", "geolocation", "media", "microphone", "notifications", "payment-handler", "persistent-storage", "screen-wake-lock", "sensors", "speaker-selection", "storage-access", "window-management", "keyboardLock", "midi", "midiSysex"], kp = ["accessibility-events", "background-sync", "geolocation", "media"];
function sr(e, t) {
  return t ? Qt(t) ? xp.includes(e) : Vi(t) ? kp.includes(e) : !1 : !1;
}
function Mp(e, t, n, r) {
  return sr(t, n) || sr(t, r.embeddingOrigin) ? !0 : ((Qt(n) || Vi(n)) && G.error(`Denied ${t} permission check for origin: ${n}, embedding origin: ${r.embeddingOrigin ?? "none"}`), !1);
}
function Np(e, t, n, r) {
  const i = e == null ? void 0 : e.getURL(), o = r.requestingUrl;
  if (sr(t, i) || sr(t, o)) {
    n(!0);
    return;
  }
  G.error(`Denied ${t} permission request for URL: ${i ?? "none"}, requesting URL: ${o ?? "none"}`), n(!1);
}
function Up(e) {
  e.session.setPermissionCheckHandler(Mp), e.session.setPermissionRequestHandler(Np);
}
const Fp = 0.5, jp = 5, Ia = 0.1;
function Wp(e, t, n, r, i) {
  Hp(e), Bp(e, t), Up(e), Rp(e, n), r && Vp(e, r), i && (e.zoomFactor = i), e.setWebRTCIPHandlingPolicy("disable_non_proxied_udp");
}
function Bp(e, t) {
  const n = (i) => Gp(i, t);
  e.setWindowOpenHandler(n), t.didCreateWindow && e.on("did-create-window", t.didCreateWindow);
  const r = (i, o) => {
    $p(i, o, e, t);
  };
  e.on("will-navigate", r), e.on("will-redirect", r);
}
function Hp(e) {
  e.userAgent = ur();
}
function ao(e) {
  if (!Jc(e)) {
    G.error(`web-contents.safeOpenExternal - Denied launching ${e} externally.`);
    return;
  }
  try {
    tc.openExternal(e);
  } catch (t) {
    const n = (() => {
      try {
        return new URL(e).protocol;
      } catch {
        return null;
      }
    })();
    G.error("web-contents.safeOpenExternal - Error launching url externally", {
      error: t,
      protocol: n,
      url: e
    });
  }
}
function Gp(e, t) {
  const n = Qt(e.url);
  return G.info("web-contents.handleWindowOpen", {
    url: e.url,
    isFirstParty: n
  }), n ? t.createWindow(e) : (ao(e.url), {
    action: "deny"
  });
}
function $p(e, t, n, r) {
  const i = n.getURL();
  if (G.info("web-contents.handleWillNavigate", {
    currentURL: i,
    nextURL: t
  }), r.handleWillNavigate && r.handleWillNavigate(t)) {
    e.preventDefault();
    return;
  }
  if ($c(t)) {
    G.info("web-contents.handleWillNavigate - Sending authURL to browser"), e.preventDefault(), qp(t, r);
    return;
  }
  if (Vi(t)) {
    G.info("web-contents.handleWillNavigate - Sending payment domain to browser"), e.preventDefault(), r.createPaymentWindow && r.createPaymentWindow(t);
    return;
  }
  if (!Qt(t)) {
    G.info("web-contents.handleWillNavigate - Sending third-party URL to browser"), e.preventDefault(), Kc(t) && G.warn("web-contents.handleWillNavigate - OAuthURL externally opened", {
      nextURL: t
    }), ao(t);
    return;
  }
}
function qp(e, t) {
  Se().getState().setAuthState(new URL(e).searchParams.get("state"));
  const n = Vc(e);
  t.onLaunchingBrowserForAuth(), ao(n);
}
function Vp(e, t) {
  Ge.subscribe(He.ZOOM, (n) => {
    switch (n.command) {
      case kr.ZOOM_IN:
        e.setZoomFactor(Math.min(e.zoomFactor + Ia, jp));
        break;
      case kr.ZOOM_OUT:
        e.setZoomFactor(Math.max(e.zoomFactor - Ia, Fp));
        break;
      case kr.ZOOM_RESET:
        e.setZoomFactor(1);
        break;
      default:
        throw new Error("web-contents.setupZoomHandler - Unknown zoom command", n.command);
    }
    t.zoomChanged();
  });
}
function zp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.split(",")) {
    const [, r, i] = /^([^=]*)(?:=(.*))?$/.exec(n), o = r.trim();
    o && t.set(o, i == null ? void 0 : i.trim());
  }
  return t;
}
function Ra(e) {
  return Math.round(e);
}
function Aa(e) {
  return Math.floor(e);
}
const Kp = /* @__PURE__ */ new WeakMap(), Jp = /* @__PURE__ */ new Set([
  -106,
  -21
  /* ERR_NETWORK_CHANGED */
]);
class uo {
  constructor(t, n) {
    x(this, "contentId");
    x(this, "webContents");
    x(this, "state");
    x(this, "loadId");
    x(this, "loadStartTime");
    this.contentId = t, this.webContents = n, this.state = "CREATED", this.loadId = null, this.loadStartTime = null, this.initWebContentsListeners(), this.recordStateTransition();
  }
  static attachToWebContents(t, n) {
    Kp.set(n, new uo(t, n));
  }
  get loadingState() {
    return this.state;
  }
  initWebContentsListeners() {
    this.webContents.on("did-start-navigation", (t) => this.onStartNavigation(t)), this.webContents.on("did-finish-load", () => this.transitionToLoadSuccess()), this.webContents.on("did-fail-load", (t, n, r, i, o) => this.transitionToLoadError(n, r, i, o)), this.webContents.on("did-fail-provisional-load", (t, n, r, i, o) => {
      o && this.transitionToLoadCanceled();
    });
  }
  generateNewLoadId() {
    this.loadId = ka();
  }
  onStartNavigation(t) {
    !t.isMainFrame || t.isSameDocument || (this.state === "LOADING" && this.transitionToLoadCanceled(), this.generateNewLoadId(), this.state = "LOADING", this.loadStartTime = Date.now(), this.recordStateTransition());
  }
  transitionToLoadSuccess() {
    if (this.state !== "LOAD_SUCCESS")
      if (this.state === "LOADING") {
        this.state = "LOAD_SUCCESS";
        const t = Date.now() - (this.loadStartTime || 0);
        this.recordStateTransition(), this.logLoadDuration(t), this.resetLoadState();
      } else this.state == "LOAD_CANCELED" ? ke.recordEvent(Qe.ContentLoadSuccessAfterCancellation) : G.error(`Unable to transition to load success state from ${this.state}`);
  }
  transitionToLoadCanceled() {
    [
      "LOADING",
      "LOAD_CANCELED"
      /* LOAD_CANCELED */
    ].includes(this.state) || G.warn(`Unexpected state ${this.state} when transitioning to load canceled state`), this.state = "LOAD_CANCELED", this.recordStateTransition(), this.resetLoadState();
  }
  transitionToLoadError(t, n, r, i) {
    if (i)
      if (this.state === "LOADING")
        this.state = "LOAD_ERROR", this.recordStateTransition({
          errorCode: t,
          errorDescription: n,
          url: r
        }), this.resetLoadState();
      else {
        const o = `Loading error '${n}' with code ${t} observed while web contents in state ${this.state}`;
        Jp.has(t) || this.state === "LOAD_CANCELED" ? G.info(o) : G.warn(o);
      }
  }
  resetLoadState() {
    this.loadStartTime = null, this.loadId = null;
  }
  recordStateTransition(t = {}) {
    const n = {
      content_id: this.contentId,
      load_id: this.loadId,
      state: this.state,
      ...t
    };
    ke.recordEvent(Qe.WebContentsStateTransition, n, `(-> ${this.state})`);
  }
  logLoadDuration(t, n = {}) {
    const r = {
      content_id: this.contentId,
      load_id: this.loadId,
      ...n
    };
    ke.recordAppPerformanceMetric("load_duration_ms", t, r);
  }
}
const Xp = ja.dirname(Ec(import.meta.url)), Tn = 12;
function ar(e) {
  return {
    useContentSize: !0,
    webPreferences: {
      preload: e ? ja.join(Xp, e) : void 0,
      backgroundThrottling: !1,
      devTools: Ne
    }
  };
}
function Kn(e, t, n, r, i, o, s, a, l, c, u) {
  we.applyBrowserWindowQuirks(e), t.applyStyle(e), Wp(e.webContents, s, a, c, u), uo.attachToWebContents(t.contentId, e.webContents), e.on("show", () => {
    const f = "shown";
    $e.track(Fe.AppWindowShown, {
      window_content_id: t.contentId
    }), $e.track(Fe.AppWindowStateChanged, {
      window_content_id: t.contentId,
      state: f
    }), l({
      windowType: t.contentId,
      state: f
    }), r(f);
  }), e.on("hide", () => {
    const f = "hidden";
    $e.track(Fe.AppWindowStateChanged, {
      window_content_id: t.contentId,
      state: f
    }), l({
      windowType: t.contentId,
      state: f
    }), r(f);
  }), e.on("close", (f) => {
    Se().getState().isQuitting || (f.preventDefault(), e.hide());
  }), e.on("closed", n), e.on("focus", () => i(!0)), e.on("blur", () => i(!1)), e.webContents.on("did-fail-load", o);
}
function at(e, t) {
  if (e) {
    if (e.isDestroyed()) {
      G.warn("Attempted to show a destroyed window", {
        id: e.id,
        url: t
      });
      return;
    }
    t && e.loadURL(t), e.isMinimized() && e.restore(), e.show(), e.focus();
  }
}
function Yp(e) {
  return e.isDestroyed() ? (G.warn("Attempted to check active state of destroyed window", {
    id: e.id
  }), !1) : e.isVisible() && e.isFocused();
}
function Zp(e, t, n) {
  const r = Er(e);
  if (r.id === t.id)
    return;
  const [i, o] = e.getPosition(), [s, a] = e.getSize(), l = t.workArea, [c, u] = Wi(s, a, l);
  e.setPosition(c, u), e.setSize(s, a), G.info(`Move window ${e.webContents.mainFrame.name} across displays:
    alignment: ${n},
    from: ${r.label}, scale: ${r.scaleFactor}, workArea: ${JSON.stringify(r.workArea)},
    to: ${t.label}, scale: ${t.scaleFactor}, workArea: ${JSON.stringify(l)},
    fromBounds: x:${i}, y:${o}, width:${s}, height:${a},
    toBounds: x:${c}, y:${u}, width:${s}, height:${a},
  `);
}
function Er(e) {
  const t = e.getBounds();
  return er.getDisplayMatching(t);
}
function Qp(e, t, n) {
  e.setMaximumSize(t, n);
  const [r, i] = e.getPosition();
  e.setPosition(r, i);
}
function ji() {
  const e = er.getCursorScreenPoint();
  return er.getDisplayNearestPoint(e);
}
function Wi(e, t, n, r) {
  const {
    x: i,
    y: o,
    width: s,
    height: a
  } = n, l = Aa(i + (s - e) / 2), c = Aa(o + a - t - Tn);
  return [l, c];
}
function Oa(e, t, n) {
  const {
    x: r,
    y: i
  } = e.getBounds(), [o, s] = e.getSize(), a = Math.round(r + (o - t) / 2), l = Math.round(i + (s - n) / 2);
  e == null || e.setBounds({
    x: a,
    y: l,
    width: t,
    height: n
  });
}
function Pa(e) {
  e.webContents.backgroundThrottling = !1, we.applyCompanionWindowStyle(e);
}
function eg(e, t, n) {
  const r = e.workArea;
  return {
    maxWidth: Ra(Math.max(r.width / 2 - Tn, t)),
    maxHeight: Ra(Math.max(r.height - 2 * Tn, n))
  };
}
function Bi(e, t) {
  const n = t ?? Er(e), [r, i] = e.getMinimumSize(), {
    maxWidth: o,
    maxHeight: s
  } = eg(n, r, i);
  G.info(`Update companion window max size for display:
    ${n.label},
    workAreaSize: ${JSON.stringify(n.workAreaSize)},
    maxWidth: ${o},
    maxHeight: ${s},`);
  const [a, l] = e.getMaximumSize();
  a === o && l === s || Qp(e, o, s);
}
var Ju = /* @__PURE__ */ ((e) => (e[e.Success = 0] = "Success", e[e.WindowUndefined = 1] = "WindowUndefined", e))(Ju || {});
class Be {
  constructor() {
    x(this, "internalWindow");
    x(this, "pendingVisibility");
  }
  /**
   * Clear all companion window state
   */
  reset() {
    var t, n;
    (t = this.internalWindow) != null && t.isDestroyed() || (n = this.internalWindow) == null || n.destroy(), this.internalWindow = void 0, this.pendingVisibility = void 0;
  }
  get window() {
    return this.internalWindow;
  }
  setWindow(t) {
    this.internalWindow = t, this.pendingVisibility !== void 0 && (this.setVisibility(this.pendingVisibility), this.pendingVisibility = void 0);
  }
  /**
   * Set companion visibility to desired state. Logs an error if window is not currently set.
   * This function expects window to exist and treats non-existence as an error.
   *
   * @param isVisible
   */
  setVisibility(t) {
    return this.internalWindow ? (t ? tg(this.internalWindow, "bottom") : this.internalWindow.hide(), 0) : (G.error(`Companion window visibility set before creating companion window. isVisible: ${t}`), 1);
  }
  /**
   * Request companion visibility state. If window is not currently set it remembers requested state to
   * be applied once window is set
   *
   * @param isVisible
   */
  requestVisibility(t) {
    this.internalWindow ? this.setVisibility(t) : this.pendingVisibility = t;
  }
  /**
   * Toggles companion window visibility from visible to hidden and vice versa.
   * This function treats non existence of window as a handled non-error condition.
   *
   * @returns Success if companion window existed and its visibility could be toggled. WindowUndefined otherwise.
   */
  toggleVisibility() {
    return this.internalWindow ? (this.setVisibility(!this.internalWindow.isVisible()), 0) : 1;
  }
  updateMaximumSize(t) {
    return this.internalWindow ? (Bi(this.internalWindow, t), 0) : 1;
  }
  handleMoved() {
    return this.internalWindow ? (Bi(this.internalWindow, Er(this.internalWindow)), 0) : 1;
  }
  static getConfig(t) {
    if (t != null && t.checkGate("chatgpt-sidetron-companion-arch")) {
      const n = ji().workArea;
      let i = {
        x: 0,
        y: Tn,
        width: 440,
        height: 540 + 32
      };
      const [o, s] = Wi(i.width, i.height, n);
      return i = {
        ...i,
        x: o,
        y: s
      }, {
        constructorOptions: {
          ...ar("preload.mjs"),
          useContentSize: !1,
          alwaysOnTop: !0,
          maximizable: !1,
          show: !1,
          x: i.x,
          y: i.y,
          width: i.width,
          height: i.height,
          minWidth: 360,
          minHeight: 280
        },
        contentId: "chatbar_view",
        applyStyle: Pa
      };
    } else {
      const n = ji().workArea;
      let r = {
        x: 0,
        y: Tn,
        width: 440,
        height: 540
      };
      const [i, o] = Wi(r.width, r.height, n);
      return r = {
        ...r,
        x: i,
        y: o
      }, {
        constructorOptions: {
          ...ar(),
          alwaysOnTop: !0,
          frame: !1,
          maximizable: !1,
          backgroundMaterial: "mica",
          // no-op on Mac
          show: !1,
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          minWidth: 360,
          minHeight: 280
        },
        contentId: "chatbar_view",
        applyStyle: Pa
      };
    }
  }
  /**
   * Raw feature check for companion window feature
   *
   * @returns true if companion window feature is enabled
   */
  static isEnabled() {
    return Se().getState().loggedInUser !== void 0;
  }
}
function tg(e, t) {
  const n = Er(e), r = ji();
  n.id !== r.id && (Bi(e, r), Zp(e, r, t)), e.show();
}
let xe = null;
function pi(e, t, n) {
  const r = rg(), i = e.intl, o = [{
    // TODO: This should become dev-only once we have proper app info shown in app settings
    label: i.formatMessage({
      id: "trayMenu.copyAppInfo",
      defaultMessage: "Copy app info: {summary}"
    }, {
      summary: r.summary
    }),
    click: () => {
      Qn.writeText(r.full);
    }
  }, {
    label: i.formatMessage({
      id: "trayMenu.reload",
      defaultMessage: "Reload"
    }),
    click: () => {
      n.onReload();
    }
  }, {
    label: i.formatMessage({
      id: "trayMenu.openMainWindow",
      defaultMessage: "Open ChatGPT window"
    }),
    click: () => {
      n.onShowMainWindow();
    }
  }], s = Be.isEnabled() ? [{
    label: i.formatMessage({
      id: "trayMenu.openCompanionWindow",
      defaultMessage: "Open companion window"
    }),
    click: () => {
      n.onShowCompanionWindow();
    }
  }] : [], a = [{
    label: i.formatMessage({
      id: "trayMenu.logout",
      defaultMessage: "Log out"
    }),
    click: () => {
      ke.recordEvent(Qe.LoggedOut, {
        source: "tray"
      }), n.onReset();
    },
    visible: t
  }, {
    label: i.formatMessage({
      id: "trayMenu.quit",
      defaultMessage: "Quit"
    }),
    click: () => {
      ke.recordEvent(Qe.QuitApp, {
        source: "tray"
      }), yr();
    }
  }], l = $i.buildFromTemplate(o.concat(...s, ...a));
  return Ne && Ip(l, n), l;
}
async function ng(e) {
  if (xe)
    return;
  xe = we.createTray(), xe.setToolTip(he.getName());
  const t = lt(), n = Se(), r = () => !!n.getState().loggedInUser;
  t.subscribe((o) => {
    const s = pi(o, r(), e);
    xe == null || xe.setContextMenu(s);
  }), Se().subscribe((o, s) => {
    if (s.loggedInUser !== o.loggedInUser) {
      const a = pi(t.getState(), !!o.loggedInUser, e);
      xe == null || xe.setContextMenu(a);
    }
  });
  const i = pi(t.getState(), r(), e);
  xe.setContextMenu(i), xe.on("click", e.onTrayButtonClick), he.on("before-quit", () => {
    xe && (xe.destroy(), xe = null);
  });
}
function rg() {
  return {
    summary: `${he.getName()} ${he.getVersion()}`,
    full: `name: ${he.getName()}
version: ${he.getVersion()}
locale: ${he.getLocale()}
device_id: ${we.getDeviceID()}
os_name: ${Nr.type()}
os_version: ${Nr.release()}
arch: ${Nr.machine()}
`
  };
}
const ig = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT</title>
    <style>
        /* Design tokens and styles are copied from the ChatGPT design system without importing tailwind for simplicity
            See monorepo/chatgpt/web/styles/global.css for ChatGPT tokens
            See monorepo/chatgpt/web/tailwind.config.ts for tailwind tokens
        */
        /* CSS Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --white: #FFF;
            --gray-50: #F9F9F9;
            --gray-100: #ECECEC;
            --gray-200: #E3E3E3;
            --gray-300: #CDCDCD;
            --gray-400: #B4B4B4;
            --gray-500: #9B9B9B;
            --gray-600: #676767;
            --gray-700: #424242;
            --gray-750: #2F2F2F;
            --gray-800: #212121;
            --gray-900: #171717;
            --gray-950: #0D0D0D;
            --border-medium: rgb(0 0 0 / 15%);
            --main-surface-primary: var(--white);
            --main-surface-secondary: var(--gray-50);
            --main-surface-tertiary: var(--gray-100);
            --text-primary: #000000;
            --text-secondary: #5D5D5D;
            --btn-padding-y: 0.5rem;
            --btn-padding-x: 1rem;
            --btn-border-radius: 9999px;
            --btn-min-height: 38px;
            font-family: 'Segoe UI Variable Text', 'Segoe UI', sans-serif;
            font-size: 14px;

            /* Font smoothing only for high-density displays.
            * Antialiased font smoothing
            * tends to look bad at 1:1 pixels per point where fonts use relatively few
            * pixels, and the default (usually subpixel-antialiasing) looks better.
            * However on higher density screens, subpixel-antialiasing causes fonts to
            * look overly thick, and standard antialiasing looks better.
            */
            @media (-webkit-min-device-pixel-ratio: 2),
            (min--moz-device-pixel-ratio: 2),
            (-o-min-device-pixel-ratio: 2/1),
            (min-device-pixel-ratio: 2),
            (min-resolution: 192dpi),
            (min-resolution: 2dppx) {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --border-medium: rgb(255 255 255 / 15%);
                --main-surface-primary: var(--gray-800);
                --main-surface-secondary: var(--gray-750);
                --main-surface-tertiary: var(--gray-700);
                --text-primary: var(--gray-100);
                --text-secondary: var(--gray-400);
            }
        }

        body {
            background-color: var(--main-surface-primary);
            color: var(--text-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        main {
            max-width: 600px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        svg {
            margin-bottom: 16px;
        }

        .summary {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .description {
            color: var(--text-secondary);
            font-weight: 400;
            margin-bottom: 16px;
        }

        button {
            height: 32px;
            padding: var(--btn-padding-y) var(--btn-padding-x);
            font-family: 'Segoe UI Variable Text', 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid var(--border-medium);
            background-color: var(--main-surface-primary);
            color: var(--text-primary);
            display: inline-block;
            align-items: center;
            justify-content: center;
            border-radius: var(--btn-border-radius);
            min-height: var(--btn-min-height);
            user-select: none;
        }

        button:hover {
            background-color: var(--main-surface-secondary);
        }

        button:active {
            background-color: var(--main-surface-tertiary);
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('reloadButton').addEventListener('click', function () {
                window.location.replace("{{reloadUrl}}"); // Reloads the page when the button is clicked
            });
        });
    <\/script>
</head>

<body>
    <main>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M12.8533 5.31449C12.4633 4.67642 11.5366 4.67642 11.1467 5.31449L3.71283 17.479C3.30561 18.1454 3.78518 19.0005 4.56611 19.0005H19.4339C20.2148 19.0005 20.6944 18.1454 20.2872 17.479L12.8533 5.31449ZM9.44015 4.27159C10.6099 2.35739 13.3901 2.35739 14.5598 4.27159L21.9937 16.4361C23.2154 18.4352 21.7767 21.0005 19.4339 21.0005H4.56611C2.22332 21.0005 0.784616 18.4352 2.00626 16.4361L9.44015 4.27159ZM12 9.00048C12.5523 9.00048 13 9.44819 13 10.0005V13.0005C13 13.5528 12.5523 14.0005 12 14.0005C11.4477 14.0005 11 13.5528 11 13.0005V10.0005C11 9.44819 11.4477 9.00048 12 9.00048ZM10.8516 16.5006C10.8516 15.8654 11.3664 15.3506 12.0016 15.3506C12.6367 15.3506 13.1516 15.8654 13.1516 16.5006C13.1516 17.1357 12.6367 17.6506 12.0016 17.6506C11.3664 17.6506 10.8516 17.1357 10.8516 16.5006Z"
                fill="var(--text-secondary)" />
        </svg>
        <p class="summary">{{summary}}</p>
        <p class="description">{{description}}</p>
        <button id="reloadButton">{{reloadButtonText}}</button>
    </main>
</body>

</html>`;
function Da(e) {
  let t = ig;
  const n = lt().getState().intl;
  return t = t.replace("{{summary}}", n.formatMessage({
    id: "loadError.summary",
    defaultMessage: "ChatGPT is unable to load"
  })), t = t.replace("{{description}}", n.formatMessage({
    id: "loadError.description",
    defaultMessage: "Check your network settings and try restarting ChatGPT."
  })), t = t.replace("{{reloadButtonText}}", n.formatMessage({
    id: "loadError.reloadButton",
    defaultMessage: "Restart ChatGPT"
  })), t = t.replace("{{reloadUrl}}", e), `data:text/html;charset=utf-8,${encodeURIComponent(t)}`;
}
const lo = 912, og = lo / 2, Hi = 596;
function La() {
  const e = Ne && process.env.SIDETRON_FRAMELESS ? {
    frame: !1,
    titleBarStyle: "hidden",
    titleBarOverlay: !0,
    trafficLightPosition: {
      x: 20,
      y: 20
    }
  } : {};
  return {
    constructorOptions: {
      ...ar("preload.mjs"),
      show: !1,
      width: lo,
      height: Hi,
      minWidth: 360,
      minHeight: 340,
      ...e
    },
    contentId: "main_view",
    applyStyle: we.applyMainWindowStyle
  };
}
function sg() {
  return {
    constructorOptions: {
      ...ar(void 0),
      show: !1,
      width: 976,
      // Wide enough so nothing is clipped
      height: 596,
      minWidth: 360,
      minHeight: 340
    },
    contentId: "payment_view",
    applyStyle: () => {
    }
  };
}
class ag {
  constructor(t) {
    x(this, "webContentsHost");
    this.webContentsHost = t;
  }
  publish(t, n) {
    const r = {
      eventName: t,
      payload: n
    };
    this.webContentsHost.sendMessageToWebApp(r);
  }
}
class ug {
  constructor(t) {
    x(this, "activeDownloads", []);
    x(this, "activeDownloadForTaskbarProgress");
    x(this, "window");
    x(this, "downloadURL", (t) => {
      gi.defaultSession.downloadURL(t);
    });
    x(this, "setProgressBar", (t, n) => {
      !this.window || this.window.isDestroyed() || this.window.setProgressBar(t, n);
    });
    x(this, "handleWillDownload", (t, n, r) => {
      this.activeDownloads.push(n), this.activeDownloadForTaskbarProgress = n, G.info("Download started");
      const o = lt().getState().intl.formatMessage({
        id: "downloadManager.saveAsDialogTitle",
        defaultMessage: "Save As"
      });
      n.setSaveDialogOptions({
        title: o
      }), n.on("updated", (s, a) => {
        if (this.activeDownloadForTaskbarProgress === n) {
          if (a === "interrupted")
            this.setProgressBar(-1);
          else if (a === "progressing") {
            const l = n.getPercentComplete() / 100;
            this.setProgressBar(l, {
              mode: n.isPaused() ? "paused" : "normal"
            });
          }
        }
      }), n.once("done", (s, a) => {
        this.activeDownloadForTaskbarProgress === n && this.setProgressBar(-1), a === "completed" ? G.info("Download completed") : G.info(`Download failed: state:${a}`), this.activeDownloads = this.activeDownloads.filter((l) => l !== n), this.activeDownloadForTaskbarProgress = this.activeDownloads.at(-1);
      });
    });
    this.window = t, gi.defaultSession.on("will-download", this.handleWillDownload);
  }
}
class lg {
  constructor(t) {
    x(this, "mainWindow");
    x(this, "companionWindow");
    x(this, "paymentWindow");
    x(this, "downloadManager");
    x(this, "statsigClient");
    x(this, "webDesktopObserverProxy");
    /**
     * Sends a message to the web application hosted in the main window.
     *
     * @param {HostEventData} eventData - The data to send with the message.
     */
    x(this, "sendMessageToWebApp", (t) => {
      var n;
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? (this.mainWindow.webContents.send(Mr, t), (n = this.companionWindow.window) == null || n.webContents.send(Mr, t)) : this.mainWindow.webContents.send(Mr, t);
    });
    x(this, "sendInputEventToWebApp", (t) => {
      var n;
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? (this.mainWindow.webContents.sendInputEvent(t), (n = this.companionWindow.window) == null || n.webContents.sendInputEvent(t)) : this.mainWindow.webContents.sendInputEvent(t);
    });
    /**
     * Shows the application window with the specified URL, falling back to the primary ChatGPT URL.
     *
     * @param {string} [url] - The URL to load in the main window.
     */
    x(this, "showApp", (t) => {
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? this.mainWindow ? at(this.mainWindow, dt("main_view", t)) : this.setupMainWindow(dt("main_view", t)) : this.mainWindow ? at(this.mainWindow, t) : this.setupMainWindow(t ?? rt());
    });
    /**
     * Toggles the visibility of the app.
     */
    x(this, "showHideApp", () => {
      this.isQuitting() || (this.mainWindow ? Yp(this.mainWindow) ? this.mainWindow.hide() : this.mainWindow.show() : this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? this.setupMainWindow(dt("main_view")) : this.setupMainWindow(rt()));
    });
    /**
     * Hides all app windows and executes the specified action, then shows them again. Initially added for the "Take Screenshot
     * feature to ensure ChatGPT isn't blocking the part of the screen the user wants to screenshot with Snipping Tool.
     *
     * @param {() => Promise<void>} action - The action that is executing
     */
    x(this, "hideAppDuringAction", async (t) => {
      const r = this.enumerateWindows().filter((o) => o.isVisible());
      if (r.length === 0)
        return;
      const i = ft.getFocusedWindow();
      r.forEach((o) => o.minimize());
      try {
        await t();
      } finally {
        r.forEach((o) => {
          o !== i && at(o);
        }), i && at(i);
      }
    });
    /**
     * Toggles the visibility of the companion window if it is enabled, falling back to toggling the visiblity of the app.
     */
    x(this, "showHideCompanionWindow", async (t) => {
      this.isQuitting() || (this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? ($e.track(Fe.CompanionWindowShortcutLaunch, {
        source: t
      }), Be.isEnabled() ? this.companionWindow.window ? this.companionWindow.toggleVisibility() : (this.setupCompanionWindow(this.createCompanionBrowserWindow()), at(this.companionWindow.window)) : this.showHideApp()) : ($e.track(Fe.CompanionWindowShortcutLaunch, {
        source: t
      }), (!Be.isEnabled() || this.companionWindow.toggleVisibility() == Ju.WindowUndefined) && this.showHideApp()));
    });
    x(this, "showCompanionWindow", async (t) => {
      this.isQuitting() || (this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? ($e.track(Fe.CompanionWindowShortcutLaunch, {
        source: t
      }), Be.isEnabled() && (this.companionWindow.window || this.setupCompanionWindow(this.createCompanionBrowserWindow()), at(this.companionWindow.window))) : ($e.track(Fe.CompanionWindowShortcutLaunch, {
        source: t
      }), Be.isEnabled() && at(this.companionWindow.window)));
    });
    x(this, "resetOnLogout", async () => {
      await Promise.allSettled(this.enumerateWindows().map((t) => t.webContents.session.clearData())), Lh();
    });
    x(this, "showErrorView", (t) => {
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? this.mainWindow.loadURL(Da(dt("main_view"))) : this.mainWindow.loadURL(Da(rt())), this.mainWindow.show(), ke.recordEvent(Qe.ErrorViewShown, {
        reason: t
      });
    });
    x(this, "onReload", () => {
      var t, n, r;
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? (n = (t = this.companionWindow) == null ? void 0 : t.window) == null || n.webContents.reloadIgnoringCache() : this.companionWindow.reset(), (r = this.paymentWindow) == null || r.destroy(), this.paymentWindow = void 0, this.mainWindow && !this.mainWindow.isDestroyed() && this.mainWindow.webContents.reloadIgnoringCache();
    });
    /////////////////////////////
    /// MAIN WINDOW
    /////////////////////////////
    x(this, "setupMainWindow", (t) => {
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") && (t = dt("main_view", t)), Qt(t) || (G.error("MainWindow ctor - Invalid URL, falling back to default", {
        url: t,
        default: rt()
      }), t = rt()), this.mainWindow.once("ready-to-show", () => {
        this.onMainWindowReadyToShow();
      }), Kn(this.mainWindow, La(), this.destroyMainWindow, this.handleWindowVisibilityStateChanged, (n) => this.handleWindowFocusChanged("main_view", n), this.handleDidFailLoad, {
        createWindow: this.handleMainWindowCreateWindow,
        didCreateWindow: this.handleMainWindowDidCreateWindow,
        createPaymentWindow: this.setupPaymentWindow,
        onLaunchingBrowserForAuth: this.handleLaunchingBrowserForAuth,
        handleWillNavigate: this.handleMainWindowWillNavigate
      }, {
        onDownloadURL: this.downloadManager.downloadURL
      }, this.onWindowStateChanged, {
        zoomChanged: () => {
          const n = this.mainWindow.webContents.getZoomFactor();
          for (const r of this.enumerateWindows())
            r !== this.mainWindow && r.webContents.setZoomFactor(n);
        }
      }), this.mainWindow.loadURL(t);
    });
    x(this, "onMainWindowReadyToShow", () => {
      Se().getState().mainWindowReady(), this.webDesktopObserverProxy = new ag(this);
    });
    x(this, "getMainWindowHandle", () => this.mainWindow.getNativeWindowHandle());
    x(this, "handleMainWindowCreateWindow", (t) => this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? {
      action: "deny"
    } : xa(t) ? Ne && process.env.SIDETRON_DISABLE_COMPANION_WINDOW ? {
      action: "deny"
    } : {
      action: "allow",
      overrideBrowserWindowOptions: Be.getConfig().constructorOptions
    } : {
      action: "deny"
    });
    x(this, "handleMainWindowDidCreateWindow", (t, n) => {
      xa(n) && this.setupCompanionWindow(t);
    });
    x(this, "destroyMainWindow", () => {
      var t;
      this.mainWindow.destroy(), this.companionWindow.reset(), (t = this.paymentWindow) == null || t.destroy(), this.paymentWindow = void 0;
    });
    x(this, "handleLaunchingBrowserForAuth", () => {
      var t;
      this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? (this.mainWindow.hide(), (t = this.companionWindow.window) == null || t.hide()) : this.mainWindow.hide();
    });
    x(this, "handleMainWindowWillNavigate", (t) => qc(t) ? (G.warn("MainWindow - Navigating to Cloudflare URL", {
      urlString: t,
      isAutoLaunch: we.isAutoLaunch()
    }), this.mainWindow.show(), this.mainWindow.loadURL(t), !0) : !t.startsWith(rt()) || !t.endsWith("/auth/logout") ? !1 : (this.mainWindow.hide(), this.mainWindow.loadURL(t), !0));
    /////////////////////////////
    /// COMPANION WINDOW
    /////////////////////////////
    x(this, "createCompanionBrowserWindow", () => new ft(Be.getConfig(this.statsigClient).constructorOptions));
    x(this, "setupCompanionWindow", (t) => {
      if (this.statsigClient.checkGate("chatgpt-sidetron-companion-arch")) {
        t.setSkipTaskbar(!0), this.companionWindow.setWindow(t), Kn(t, Be.getConfig(), () => {
          t.destroy(), t === this.companionWindow.window && this.companionWindow.reset();
        }, this.handleWindowVisibilityStateChanged, (r) => this.handleWindowFocusChanged("chatbar_view", r), this.handleDidFailLoad, {
          createWindow: () => ({
            action: "deny"
          }),
          createPaymentWindow: this.setupPaymentWindow,
          onLaunchingBrowserForAuth: this.handleLaunchingBrowserForAuth
        }, {
          onDownloadURL: this.downloadManager.downloadURL
        }, this.onWindowStateChanged, void 0, this.mainWindow.webContents.getZoomFactor()), this.companionWindow.window.on("moved", () => {
          this.companionWindow.handleMoved();
        }), this.companionWindow.updateMaximumSize();
        const n = dt("chatbar_view");
        G.info("Loading companion windw", n), t.loadURL(n);
      } else
        this.companionWindow.setWindow(t), Kn(t, Be.getConfig(), () => {
          t === this.companionWindow.window && this.companionWindow.reset();
        }, this.handleWindowVisibilityStateChanged, (n) => this.handleWindowFocusChanged("chatbar_view", n), this.handleDidFailLoad, {
          createWindow: () => ({
            action: "deny"
          }),
          onLaunchingBrowserForAuth: this.handleLaunchingBrowserForAuth
        }, {
          onDownloadURL: this.downloadManager.downloadURL
        }, this.onWindowStateChanged, void 0, this.mainWindow.webContents.getZoomFactor()), this.companionWindow.window.on("moved", () => {
          this.companionWindow.handleMoved();
        }), this.companionWindow.updateMaximumSize();
    });
    x(this, "handleSetCompanionWindowVisibility", (t) => {
      var n;
      this.companionWindow.requestVisibility(t.visible), (n = t.options) != null && n.focusMainWindow && (this.mainWindow.isVisible() ? this.mainWindow.focus() : at(this.mainWindow));
    });
    x(this, "displayMetricsChangedTimer");
    // Display metrics changed is noisy so debounce them to avoid unnecessary updates and potential hangs (ANR)
    x(this, "handleDisplayMetricsChanged", () => {
      clearTimeout(this.displayMetricsChangedTimer), this.displayMetricsChangedTimer = setTimeout(() => {
        this.companionWindow.updateMaximumSize();
      }, 100);
    });
    /////////////////////////////
    /// PAYMENT WINDOW
    /////////////////////////////
    x(this, "setupPaymentWindow", (t) => {
      this.paymentWindow && (this.paymentWindow.close(), this.paymentWindow = void 0);
      const n = sg();
      this.paymentWindow = new ft(
        /* eng-disable CONTEXT_ISOLATION_JS_CHECK SANDBOX_JS_CHECK AUXCLICK_JS_CHECK */
        n.constructorOptions
      ), Kn(this.paymentWindow, n, () => {
        var r;
        (r = this.paymentWindow) == null || r.destroy(), this.paymentWindow = void 0;
      }, this.handleWindowVisibilityStateChanged, (r) => this.handleWindowFocusChanged("payment_view", r), this.handleDidFailLoad, {
        createWindow: () => ({
          action: "deny"
        }),
        onLaunchingBrowserForAuth: this.handleLaunchingBrowserForAuth,
        createPaymentWindow: this.setupPaymentWindow,
        handleWillNavigate: this.handlePaymentWindowWillNavigate
      }, {
        onDownloadURL: this.downloadManager.downloadURL
      }, this.onWindowStateChanged, void 0, this.mainWindow.webContents.getZoomFactor()), this.paymentWindow.loadURL(t), this.paymentWindow.show();
    });
    x(this, "handlePaymentWindowWillNavigate", (t) => {
      var n, r;
      return t.startsWith(rt()) ? ((n = this.paymentWindow) == null || n.close(), this.paymentWindow = void 0, this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? (this.onReload(), !0) : ((r = this.companionWindow.window) == null || r.close(), this.companionWindow.reset(), at(this.mainWindow, t), !0)) : !1;
    });
    /////////////////////////////
    /// GENERAL HANDLERS
    /////////////////////////////
    x(this, "getWindowHandle", (t) => {
      var n, r;
      if (this.mainWindow.webContents.mainFrame.routingId === t)
        return this.mainWindow.getNativeWindowHandle();
      if (((r = (n = this.companionWindow) == null ? void 0 : n.window) == null ? void 0 : r.webContents.mainFrame.routingId) === t)
        return this.companionWindow.window.getNativeWindowHandle();
      throw new Error(`MainWindow getWindowHandle - invalid webFrameId: ${t}`);
    });
    x(this, "onWindowStateChanged", (t) => {
      var n;
      (n = this.webDesktopObserverProxy) == null || n.publish(Vo.WINDOW_VISIBILITY_STATE_CHANGED, t);
    });
    x(this, "handleErrorThrownFromWeb", (t) => {
      var n, r;
      G.error("window-manager: Error thrown from web", JSON.stringify({
        error: t.error,
        stack: t.error.stack
      })), (n = this.companionWindow.window) == null || n.close(), this.companionWindow.reset(), (r = this.paymentWindow) == null || r.close(), this.paymentWindow = void 0, this.showErrorView("web_client_error");
    });
    x(this, "handleDidFailLoad", (t, n, r, i, o) => {
      o && this.showErrorView("load_failure");
    });
    x(this, "reloadDebounceTimer", null);
    x(this, "RELOAD_DELAY_DEFAULT", 1e3 * 60 * 10);
    // 10 minutes
    x(this, "handleWindowVisibilityStateChanged", async (t) => {
      this.reloadDebounceTimer && (clearTimeout(this.reloadDebounceTimer), this.reloadDebounceTimer = null);
      const n = await or(_r);
      if (await n.getFeatureGate("chatgpt-sidetron-background-reload") && t !== "shown" && this.areAllWindowsHidden()) {
        const i = await n.getDynamicConfig("chatgpt-sidetron-reload-on-hidden");
        let o = this.RELOAD_DELAY_DEFAULT;
        typeof i.value.reloadDelay == "number" && (o = i.value.reloadDelay), this.reloadDebounceTimer = setTimeout(() => {
          if (this.reloadDebounceTimer = null, !this.areAllWindowsHidden()) {
            G.warn("WindowManager - Reload cancelled, a window is visible", {
              visibleWindowIDs: this.enumerateWindows().filter((s) => s.isVisible() && !s.isMinimized()).map((s) => s.id)
            });
            return;
          }
          G.info("WindowManager - Reloading main window after inactivity"), this.mainWindow.reload();
        }, o);
      }
    });
    x(this, "handleWindowFocusChanged", (t, n) => {
      var i;
      const r = {
        windowType: t,
        isFocused: n
      };
      G.info("WindowManager - Window focus changed", r), (i = this.webDesktopObserverProxy) == null || i.publish(Vo.WINDOW_FOCUS_CHANGED, r);
    });
    x(this, "areAllWindowsHidden", () => this.enumerateWindows().every((n) => this.isWindowHidden(n)));
    x(this, "handleUserLoggedIn", () => {
      Oa(this.mainWindow, lo, Hi);
    });
    x(this, "handleUserLoggedOut", async () => {
      var t;
      ke.recordEvent(Qe.LoggedOut, {
        source: "web"
      }), this.mainWindow.hide(), (t = this.companionWindow.window) == null || t.hide(), await this.resetOnLogout();
    });
    x(this, "handleLaunchedWhileLoggedOut", () => {
      Oa(this.mainWindow, og, Hi);
    });
    x(this, "enumerateWindows", () => {
      const t = [this.mainWindow];
      return this.companionWindow.window && t.push(this.companionWindow.window), this.paymentWindow && t.push(this.paymentWindow), t;
    });
    x(this, "routingIdToWindowType", (t) => {
      var n, r;
      if (t)
        return t === this.mainWindow.webContents.mainFrame.routingId ? "main_view" : t === ((n = this.companionWindow.window) == null ? void 0 : n.webContents.mainFrame.routingId) ? "chatbar_view" : t === ((r = this.paymentWindow) == null ? void 0 : r.webContents.mainFrame.routingId) ? "payment_view" : void 0;
    });
    x(this, "setupDefaultSession", () => {
      if (!this.statsigClient.checkGate("chatgpt-sidetron-companion-arch"))
        return;
      const n = {
        urls: [`${rt()}/*`],
        // Intercept only URLs matching our root URL
        types: ["mainFrame"]
      };
      gi.defaultSession.webRequest.onBeforeRequest(n, (r, i) => {
        var a;
        if (fc(r.url)) {
          i({});
          return;
        }
        const o = this.routingIdToWindowType((a = r.frame) == null ? void 0 : a.routingId);
        if (!o || o === "payment_view") {
          i({});
          return;
        }
        const s = dt(o, r.url);
        if (r.url === s) {
          i({});
          return;
        }
        G.info("WindowManager onBeforeRequest- Redirecting to", {
          windowType: o,
          url: r.url,
          newUrl: s
        }), i({
          redirectURL: s
        });
      });
    });
    x(this, "isQuitting", () => Se().getState().isQuitting);
    this.statsigClient = t, this.mainWindow = new ft(La().constructorOptions), this.downloadManager = new ug(this.mainWindow), this.companionWindow = new Be(), this.setupDefaultSession(), this.statsigClient.checkGate("chatgpt-sidetron-companion-arch") ? this.setupMainWindow(dt("main_view")) : this.setupMainWindow(rt()), Ge.subscribe(He.SET_COMPANION_WINDOW_VISIBILITY, this.handleSetCompanionWindowVisibility), Ge.subscribe(He.ERROR_THROWN, this.handleErrorThrownFromWeb), Se().subscribe(async (n, r) => {
      const i = r.loggedInUser && !n.loggedInUser, o = !r.loggedInUser && n.loggedInUser, s = !o && r.loggedOutUserId !== n.loggedOutUserId;
      i ? await this.handleUserLoggedOut() : o ? this.handleUserLoggedIn() : s && this.handleLaunchedWhileLoggedOut(), !we.isAutoLaunch() && (o ? n.startupWindow === Na.COMPANION && Be.isEnabled() ? this.companionWindow.requestVisibility(!0) : this.mainWindow.show() : s && this.mainWindow.show());
    }), Ma().subscribe((n, r) => {
      if (n.currentWebEnvironment.name !== r.currentWebEnvironment.name) {
        const i = n.currentWebEnvironment;
        this.mainWindow.webContents.loadURL(i.launchURL || i.url);
      }
    }), er.on("display-metrics-changed", this.handleDisplayMetricsChanged);
  }
  isWindowHidden(t) {
    return t.isDestroyed() ? !0 : !t.isVisible() && !t.isMinimized();
  }
}
function xa(e) {
  return "features" in e ? zp(e.features).get(hc) === zo.COMPANION : e.options.oaiType === zo.COMPANION;
}
async function cg(e) {
  const t = we.takeScreenshot();
  return e.hideAppDuringAction(async () => {
    await t;
  }), await t;
}
function dg() {
  Ge.subscribe(He.DESKTOP_SETTING_CHANGED, hg);
}
async function fg(e) {
  if (e === "autoLaunch")
    return await we.getAutoLaunchSettingValue();
  const t = Xu(e);
  if (t)
    return (await lr()).getState()[t];
}
function Xu(e) {
  switch (e) {
    case "companionWindowShortcut":
      return "companionWindowShortcut";
    default:
      G.warn(`SettingsStore: Unknown setting key: ${e}`);
      return;
  }
}
async function hg({
  setting: e,
  value: t
}) {
  const n = Xu(e);
  if (!n || t === void 0) return;
  const r = {
    [n]: t
  };
  (await lr()).setState((i) => ({
    ...i,
    ...r
  }));
}
let ne;
async function u_() {
  $e.initialize(), $e.track(Fe.AppBootStarted), Ah(), await Cp(), he.userAgentFallback = ur(), process.argv.includes(Jn.COMPANION) && Se().getState().setStartupWindow(Na.COMPANION), Ge.subscribe(He.LOGIN_CHANGED, (t) => {
    Se().getState().loggedIn(t);
  }), Ge.subscribe(He.LOGOUT, (t) => {
    Se().getState().loggedOut(t);
  }), Ge.subscribe(He.QUIT, () => {
    yr();
  }), Ge.subscribe(He.SET_WEB_RELEASE_PROPERTIES, ke.setWebReleaseProperties), Ge.subscribe(He.ADD_BREADCRUMB, (t) => ke.addBreadcrumbMessage(t.message, t.epochTimestamp)), he.whenReady().then(async () => {
    const t = [];
    mc(), we.isAutoLaunch() && await new Promise((c) => setTimeout(c, 1e3));
    const n = Date.now(), r = await or(_r), i = await or(vr), o = Date.now();
    ke.recordAppPerformanceMetric("StatsigClient_init_duration", o - n);
    const s = new lg(r);
    ne = s;
    const a = lt().getState().intl;
    we.initializeNativeAddon(ne.getMainWindowHandle(), a);
    const l = () => {
      const c = () => i.checkGate("chatgpt-sidetron-work-with-client"), u = we.getPairingHandlers();
      return {
        getApps: sn(c, u.getApps, Promise.resolve([])),
        getAppHeader: sn(c, u.getAppHeader, Promise.resolve(void 0)),
        getContentForPairedApps: sn(c, u.getContentForPairedApps, Promise.resolve("")),
        applyDesktopContextPatch: sn(c, u.applyDesktopContextPatch, Promise.resolve("")),
        getScreenshotForApp: sn(c, u.getScreenshotForApp, Promise.resolve(void 0))
      };
    };
    Yc({
      requestSystemPermission: we.requestSystemPermission,
      takePhoto: (c) => we.takePhoto(s.getWindowHandle(c)),
      takeScreenshot: async () => cg(s),
      getSettingValue: async (c) => fg(c),
      checkForUpdates: we.checkForUpdates,
      pairing: l()
    }), we.applyPlatformQuirks({
      showApp: ne == null ? void 0 : ne.showApp
    }), ng({
      onTrayButtonClick: () => ne == null ? void 0 : ne.showHideCompanionWindow("tray"),
      onAuthViaClipboard: Gi,
      onReset: ne.resetOnLogout,
      onShowErrorView: () => ne == null ? void 0 : ne.showErrorView("tray"),
      onReload: () => ne == null ? void 0 : ne.onReload(),
      onShowMainWindow: () => ne == null ? void 0 : ne.showApp(),
      onShowCompanionWindow: () => ne == null ? void 0 : ne.showCompanionWindow("tray")
    }), dg(), t.push(Nf({
      onShowHideCompanionWindow: () => ne == null ? void 0 : ne.showHideCompanionWindow("keyboard")
    }, () => s)), Lc(), await Promise.allSettled(t), Se().getState().appReady(), Ne && console.log(e);
  }), he.on("window-all-closed", () => {
  }), he.on("before-quit", () => {
    Se().getState().willQuit();
  }), he.on("will-quit", () => {
    pc();
  }), he.on("child-process-gone", (t, n) => {
    gc(n);
  }), he.on("open-url", (t, n) => {
    t.preventDefault(), Gi(n);
  });
  const e = `


            .d88888b.
          .8P"     "9bd888b.
          .8P     .d8P"   \`"988.
      .8888   .d8P"    ,     98.
    .8P" 88   8"    .d98b.    88
    .8P   88   8 .d8P"   "98b. 88
    88    88   8P"  \`"8b.    "98.
    88.   88   8       8"8b.    88
    88    "98.8       8   88   "88
      \`8b.    "98.,  .d8   88    88
      88 "98b.   .d8P" 8   88   d8"
      88    "98bP"    .8   88 .d8"
      "8b     \`    .d8P"   8888"
      "88b.,   .d8P"     d8"
        "9888P98b.     .d8"
                "988888P"


  `;
}
function l_(e) {
  if (e.includes(Jn.QUIT)) {
    yr();
    return;
  }
  if (e.includes(Jn.COMPANION)) {
    ne == null || ne.showCompanionWindow("jumplist");
    return;
  }
  if (e.includes(Jn.RELOAD)) {
    ne == null || ne.onReload();
    return;
  }
  const t = e.pop();
  Gi(t);
}
function Gi(e) {
  const t = xc(e);
  if (t) {
    const n = t.href;
    return G.info("Opening new window with URL: ", n), ne == null || ne.showApp(n), !0;
  } else
    return ne == null || ne.showApp(), !1;
}
export {
  u_ as bootstrapApplication,
  l_ as handleSecondInstance
};
