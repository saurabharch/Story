'use strict';
var h = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    },
    k = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

function l() {
    l = function () {};
    k.Symbol || (k.Symbol = n)
}
var n = function () {
    var a = 0;
    return function (b) {
        return "jscomp_symbol_" + (b || "") + a++
    }
}();

function r() {
    l();
    var a = k.Symbol.iterator;
    a || (a = k.Symbol.iterator = k.Symbol("iterator"));
    "function" != typeof Array.prototype[a] && h(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
            return t(this)
        }
    });
    r = function () {}
}

function t(a) {
    var b = 0;
    return u(function () {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    })
}

function u(a) {
    r();
    a = {
        next: a
    };
    a[k.Symbol.iterator] = function () {
        return this
    };
    return a
}

function v(a) {
    r();
    var b = a[Symbol.iterator];
    return b ? b.call(a) : t(a)
}

function w(a, b) {
    if (b) {
        var c = k;
        a = a.split(".");
        for (var e = 0; e < a.length - 1; e++) {
            var d = a[e];
            d in c || (c[d] = {});
            c = c[d]
        }
        a = a[a.length - 1];
        e = c[a];
        b = b(e);
        b != e && null != b && h(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
w("Promise", function (a) {
    function b(a) {
        this.c = 0;
        this.i = void 0;
        this.a = [];
        var b = this.f();
        try {
            a(b.resolve, b.reject)
        } catch (p) {
            b.reject(p)
        }
    }

    function c() {
        this.a = null
    }

    function e(a) {
        return a instanceof b ? a : new b(function (b) {
            b(a)
        })
    }
    if (a) return a;
    c.prototype.c = function (a) {
        null == this.a && (this.a = [], this.h());
        this.a.push(a)
    };
    c.prototype.h = function () {
        var a = this;
        this.f(function () {
            a.k()
        })
    };
    var d = k.setTimeout;
    c.prototype.f = function (a) {
        d(a, 0)
    };
    c.prototype.k = function () {
        for (; this.a && this.a.length;) {
            var a = this.a;
            this.a = [];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                a[b] = null;
                try {
                    c()
                } catch (q) {
                    this.i(q)
                }
            }
        }
        this.a = null
    };
    c.prototype.i = function (a) {
        this.f(function () {
            throw a;
        })
    };
    b.prototype.f = function () {
        function a(a) {
            return function (f) {
                c || (c = !0, a.call(b, f))
            }
        }
        var b = this,
            c = !1;
        return {
            resolve: a(this.p),
            reject: a(this.h)
        }
    };
    b.prototype.p = function (a) {
        if (a === this) this.h(new TypeError("A Promise cannot resolve to itself"));
        else if (a instanceof b) this.q(a);
        else {
            a: switch (typeof a) {
                case "object":
                    var f = null != a;
                    break a;
                case "function":
                    f = !0;
                    break a;
                default:
                    f = !1
            }
            f ? this.o(a) : this.k(a)
        }
    };
    b.prototype.o = function (a) {
        var b = void 0;
        try {
            b = a.then
        } catch (p) {
            this.h(p);
            return
        }
        "function" == typeof b ? this.r(b, a) : this.k(a)
    };
    b.prototype.h = function (a) {
        this.m(2, a)
    };
    b.prototype.k = function (a) {
        this.m(1, a)
    };
    b.prototype.m = function (a, b) {
        if (0 != this.c) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.c);
        this.c = a;
        this.i = b;
        this.n()
    };
    b.prototype.n = function () {
        if (null != this.a) {
            for (var a = 0; a < this.a.length; ++a) g.c(this.a[a]);
            this.a = null
        }
    };
    var g = new c;
    b.prototype.q = function (a) {
        var b = this.f();
        a.j(b.resolve, b.reject)
    };
    b.prototype.r = function (a, b) {
        var c = this.f();
        try {
            a.call(b, c.resolve, c.reject)
        } catch (q) {
            c.reject(q)
        }
    };
    b.prototype.then = function (a, c) {
        function f(a, b) {
            return "function" == typeof a ? function (b) {
                try {
                    d(a(b))
                } catch (K) {
                    e(K)
                }
            } : b
        }
        var d, e, m = new b(function (a, b) {
            d = a;
            e = b
        });
        this.j(f(a, d), f(c, e));
        return m
    };
    b.prototype.catch = function (a) {
        return this.then(void 0, a)
    };
    b.prototype.j = function (a, b) {
        function c() {
            switch (f.c) {
                case 1:
                    a(f.i);
                    break;
                case 2:
                    b(f.i);
                    break;
                default:
                    throw Error("Unexpected state: " + f.c);
            }
        }
        var f = this;
        null == this.a ? g.c(c) : this.a.push(c)
    };
    b.resolve = e;
    b.reject = function (a) {
        return new b(function (b, c) {
            c(a)
        })
    };
    b.race = function (a) {
        return new b(function (b, c) {
            for (var f = v(a), d = f.next(); !d.done; d = f.next()) e(d.value).j(b, c)
        })
    };
    b.all = function (a) {
        var c = v(a),
            d = c.next();
        return d.done ? e([]) : new b(function (a, b) {
            function f(b) {
                return function (c) {
                    p[b] = c;
                    q--;
                    0 == q && a(p)
                }
            }
            var p = [],
                q = 0;
            do p.push(void 0), q++, e(d.value).j(f(p.length - 1), b), d = c.next(); while (!d.done)
        })
    };
    return b
});

function x(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
}
w("WeakMap", function (a) {
    function b(a) {
        this.a = (g += Math.random() + 1).toString();
        if (a) {
            l();
            r();
            a = v(a);
            for (var b; !(b = a.next()).done;) b = b.value, this.set(b[0], b[1])
        }
    }

    function c(a) {
        x(a, d) || h(a, d, {
            value: {}
        })
    }

    function e(a) {
        var b = Object[a];
        b && (Object[a] = function (a) {
            c(a);
            return b(a)
        })
    }
    if (function () {
            if (!a || !Object.seal) return !1;
            try {
                var b = Object.seal({}),
                    c = Object.seal({}),
                    d = new a([
                        [b, 2],
                        [c, 3]
                    ]);
                if (2 != d.get(b) || 3 != d.get(c)) return !1;
                d.delete(b);
                d.set(c, 4);
                return !d.has(b) && 4 == d.get(c)
            } catch (q) {
                return !1
            }
        }()) return a;
    var d = "$jscomp_hidden_" + Math.random();
    e("freeze");
    e("preventExtensions");
    e("seal");
    var g = 0;
    b.prototype.set = function (a, b) {
        c(a);
        if (!x(a, d)) throw Error("WeakMap key fail: " + a);
        a[d][this.a] = b;
        return this
    };
    b.prototype.get = function (a) {
        return x(a, d) ? a[d][this.a] : void 0
    };
    b.prototype.has = function (a) {
        return x(a, d) && x(a[d], this.a)
    };
    b.prototype.delete = function (a) {
        return x(a, d) && x(a[d], this.a) ? delete a[d][this.a] : !1
    };
    return b
});
w("Map", function (a) {
    function b() {
        var a = {};
        return a.d = a.next = a.l = a
    }

    function c(a, b) {
        var c = a.a;
        return u(function () {
            if (c) {
                for (; c.l != a.a;) c = c.d;
                for (; c.next != c.l;) return c = c.next, {
                    done: !1,
                    value: b(c)
                };
                c = null
            }
            return {
                done: !0,
                value: void 0
            }
        })
    }

    function e(a, b) {
        var c = b && typeof b;
        "object" == c || "function" == c ? g.has(b) ? c = g.get(b) : (c = "" + ++m, g.set(b, c)) : c = "p_" + b;
        var d = a.c[c];
        if (d && x(a.c, c))
            for (a = 0; a < d.length; a++) {
                var f = d[a];
                if (b !== b && f.key !== f.key || b === f.key) return {
                    id: c,
                    e: d,
                    index: a,
                    b: f
                }
            }
        return {
            id: c,
            e: d,
            index: -1,
            b: void 0
        }
    }

    function d(a) {
        this.c = {};
        this.a = b();
        this.size = 0;
        if (a) {
            a = v(a);
            for (var c; !(c = a.next()).done;) c = c.value, this.set(c[0], c[1])
        }
    }
    if (function () {
            if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var b = Object.seal({
                        g: 4
                    }),
                    c = new a(v([
                        [b, "s"]
                    ]));
                if ("s" != c.get(b) || 1 != c.size || c.get({
                        g: 4
                    }) || c.set({
                        g: 4
                    }, "t") != c || 2 != c.size) return !1;
                var d = c.entries(),
                    e = d.next();
                if (e.done || e.value[0] != b || "s" != e.value[1]) return !1;
                e = d.next();
                return e.done || 4 != e.value[0].g || "t" != e.value[1] || !d.next().done ? !1 : !0
            } catch (ca) {
                return !1
            }
        }()) return a;
    l();
    r();
    var g = new WeakMap;
    d.prototype.set = function (a, b) {
        a = 0 === a ? 0 : a;
        var c = e(this, a);
        c.e || (c.e = this.c[c.id] = []);
        c.b ? c.b.value = b : (c.b = {
            next: this.a,
            d: this.a.d,
            l: this.a,
            key: a,
            value: b
        }, c.e.push(c.b), this.a.d.next = c.b, this.a.d = c.b, this.size++);
        return this
    };
    d.prototype.delete = function (a) {
        a = e(this, a);
        return a.b && a.e ? (a.e.splice(a.index, 1), a.e.length || delete this.c[a.id], a.b.d.next = a.b.next, a.b.next.d = a.b.d, a.b.l = null, this.size--, !0) : !1
    };
    d.prototype.clear = function () {
        this.c = {};
        this.a = this.a.d = b();
        this.size = 0
    };
    d.prototype.has = function (a) {
        return !!e(this, a).b
    };
    d.prototype.get = function (a) {
        return (a = e(this, a).b) && a.value
    };
    d.prototype.entries = function () {
        return c(this, function (a) {
            return [a.key, a.value]
        })
    };
    d.prototype.keys = function () {
        return c(this, function (a) {
            return a.key
        })
    };
    d.prototype.values = function () {
        return c(this, function (a) {
            return a.value
        })
    };
    d.prototype.forEach = function (a, b) {
        for (var c = this.entries(), d; !(d = c.next()).done;) d = d.value, a.call(b, d[1], d[0], this)
    };
    d.prototype[Symbol.iterator] = d.prototype.entries;
    var m = 0;
    return d
});
w("Set", function (a) {
    function b(a) {
        this.a = new Map;
        if (a) {
            a = v(a);
            for (var b; !(b = a.next()).done;) this.add(b.value)
        }
        this.size = this.a.size
    }
    if (function () {
            if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var b = Object.seal({
                        g: 4
                    }),
                    e = new a(v([b]));
                if (!e.has(b) || 1 != e.size || e.add(b) != e || 1 != e.size || e.add({
                        g: 4
                    }) != e || 2 != e.size) return !1;
                var d = e.entries(),
                    g = d.next();
                if (g.done || g.value[0] != b || g.value[1] != b) return !1;
                g = d.next();
                return g.done || g.value[0] == b || 4 != g.value[0].g || g.value[1] != g.value[0] ? !1 : d.next().done
            } catch (m) {
                return !1
            }
        }()) return a;
    l();
    r();
    b.prototype.add = function (a) {
        a = 0 === a ? 0 : a;
        this.a.set(a, a);
        this.size = this.a.size;
        return this
    };
    b.prototype.delete = function (a) {
        a = this.a.delete(a);
        this.size = this.a.size;
        return a
    };
    b.prototype.clear = function () {
        this.a.clear();
        this.size = 0
    };
    b.prototype.has = function (a) {
        return this.a.has(a)
    };
    b.prototype.entries = function () {
        return this.a.entries()
    };
    b.prototype.values = function () {
        return this.a.values()
    };
    b.prototype.keys = b.prototype.values;
    b.prototype[Symbol.iterator] = b.prototype.values;
    b.prototype.forEach = function (a, b) {
        var c = this;
        this.a.forEach(function (d) {
            return a.call(b, d, d, c)
        })
    };
    return b
});
var y = Date.now || function () {
    return +new Date
};

function z(a) {
    return new Promise(function (b, c) {
        var e = a.length,
            d = null;
        if (e)
            for (var g = function (a, g) {
                    a || d || (d = g);
                    e--;
                    e || (d ? c(d) : b())
                }, m = v(a), f = m.next(); !f.done; f = m.next()) f.value.then(g.bind(null, !0), g.bind(null, !1));
        else b()
    })
}

function A(a) {
    return self.btoa(String.fromCharCode.apply(null, new Uint8Array(a))).replace(/\+/g, "-").replace(/\//g, "_")
};
var B = null;

function C(a, b) {
    var c = {};
    c.key = a;
    c.value = b;
    return D().then(function (a) {
        return new Promise(function (b, e) {
            var d = a.transaction("swpushnotificationsstore", "readwrite").objectStore("swpushnotificationsstore").put(c);
            d.onsuccess = b;
            d.onerror = e
        })
    })
}

function E() {
    return C("IndexedDBCheck", "testing IndexedDB").then(function () {
        return F("IndexedDBCheck")
    }).then(function (a) {
        return "testing IndexedDB" == a ? Promise.resolve() : Promise.reject()
    }).then(function () {
        return !0
    }).catch(function () {
        return !1
    })
}

function F(a) {
    return D().then(function (b) {
        return new Promise(function (c, e) {
            var d = b.transaction("swpushnotificationsstore").objectStore("swpushnotificationsstore").get(a);
            d.onsuccess = function () {
                var a = d.result;
                c(a ? a.value : null)
            };
            d.onerror = function () {
                e('Unable to get key "' + a + '" from object store.')
            }
        })
    }).catch(function () {
        return Promise.reject("Unable to open IndexedDB.")
    })
}

function D() {
    return B ? Promise.resolve(B) : new Promise(function (a, b) {
        var c = self.indexedDB.open("swpushnotificationsdb");
        c.onerror = b;
        c.onsuccess = function () {
            var b = c.result;
            if (b.objectStoreNames.contains("swpushnotificationsstore")) B = b, a(B);
            else return self.indexedDB.deleteDatabase("swpushnotificationsdb"), D()
        };
        c.onupgradeneeded = G
    })
}

function G(a) {
    a = a.target.result;
    a.objectStoreNames.contains("swpushnotificationsstore") && a.deleteObjectStore("swpushnotificationsstore");
    a.createObjectStore("swpushnotificationsstore", {
        keyPath: "key"
    })
};

function H(a) {
    if (!(a.payload && a.payload.chrome && a.payload.chrome.endpoints)) return Promise.resolve();
    var b = new FormData;
    b.append("json_navigation_endpoints", JSON.stringify(a.payload.chrome.endpoints));
    var c = "[]";
    a.payload.chrome.extraUrlParams && (c = JSON.stringify(a.payload.chrome.extraUrlParams));
    b.append("extra_url_params", c);
    b.append("hashed_identifier", a.hashedIdentifier || "");
    b.append("identifier_salt", a.identifierSalt || "");
    return fetch("/notifications_ajax?action_convert_endpoint_to_url=1", {
        credentials: "include",
        method: "POST",
        body: b
    }).then(function (b) {
        return b.ok ? b.json().then(function (b) {
            return b.successful_conversion ? I(a, b.url) : Promise.resolve()
        }).catch(function () {
            return Promise.resolve()
        }) : Promise.resolve()
    })
}

function I(a, b) {
    a.deviceId && C("DeviceId", a.deviceId);
    a.timestampSec && J(a.timestampSec);
    var c = a.payload.chrome;
    return self.registration.showNotification(c.title, {
        body: c.body,
        icon: c.iconUrl,
        data: {
            nav: b,
            id: c.notificationId,
            attributionTag: c.attributionTag
        },
        tag: c.title + c.body + c.iconUrl,
        requireInteraction: !0
    }).then(function () {
        L(a.displayCap)
    }).catch(function () {})
}

function M(a) {
    return F("DeviceId").then(function (b) {
        b = N(null, b, null, a);
        return fetch("/notifications_ajax?action_notification_click=1", {
            credentials: "include",
            method: "POST",
            body: b
        })
    })
}

function O() {
    return Promise.all([F("TimestampLowerBound"), P(), F("DeviceId")]).then(function (a) {
        var b = v(a);
        a = b.next().value;
        var c = b.next().value;
        b = b.next().value;
        if (!a) return Promise.reject(null);
        a = N(c, b, a);
        return fetch("/notifications_ajax?action_get_notifications=1", {
            credentials: "include",
            method: "POST",
            body: a
        }).then(Q)
    })
}

function Q(a) {
    return a.ok ? a.json().then(R).catch(function () {}) : Promise.resolve()
}

function R(a) {
    if (a.errors) return Promise.reject(a.errors);
    a.device_id && C("DeviceId", a.device_id);
    a.ts && J(a.ts);
    if (a.notifications) {
        var b = [];
        a.notifications.forEach(function (a) {
            b.push(self.registration.showNotification(a.title, {
                body: a.message,
                icon: a.iconUrl,
                data: {
                    nav: a.nav,
                    id: a.id,
                    attributionTag: a.attributionTag
                },
                tag: a.title + a.message + a.iconUrl,
                requireInteraction: a.requireInteraction
            }))
        });
        return z(b).then(function () {
            L(a.display_cap)
        })
    }
    return Promise.resolve()
}

function L(a) {
    -1 != a && self.registration.getNotifications().then(function (b) {
        for (var c = 0; c < b.length - a; c++) b[c].close()
    })
}

function S(a) {
    var b = [T(a), F("RegistrationTimestamp").then(U), V(), W()];
    Promise.all(b).catch(function () {
        C("IDToken", a);
        X();
        return Promise.resolve()
    })
}

function U(a) {
    a = a || 0;
    return 9E7 >= y() - a ? Promise.resolve() : Promise.reject()
}

function T(a) {
    return F("IDToken").then(function (b) {
        return a == b ? Promise.resolve() : Promise.reject()
    })
}

function V() {
    return F("Permission").then(function (a) {
        return Notification.permission == a ? Promise.resolve() : Promise.reject()
    })
}

function W() {
    return F("Endpoint").then(function (a) {
        return P().then(function (b) {
            return a == b ? Promise.resolve() : Promise.reject()
        })
    })
}

function X() {
    C("RegistrationTimestamp", 0);
    Promise.all([P(), Y(), aa()]).then(function (a) {
        var b = v(a);
        a = b.next().value;
        var c = b.next().value;
        b = b.next().value;
        c && (c = A(c));
        b && (b = A(b));
        Z(a, c, b)
    }).catch(function () {
        Z()
    })
}

function Z(a, b, c) {
    a = void 0 === a ? null : a;
    b = void 0 === b ? null : b;
    c = void 0 === c ? null : c;
    E().then(function (e) {
        e && (C("Endpoint", a), C("P256dhKey", b), C("AuthKey", c), C("Permission", Notification.permission), Promise.all([F("DeviceId"), F("NotificationsDisabled")]).then(function (d) {
            var e = v(d);
            d = e.next().value;
            e = e.next().value;
            d = N(a, d, null, null, e, b, c);
            fetch("/notifications_ajax?action_register_device=1", {
                credentials: "include",
                method: "POST",
                body: d
            }).then(ba).catch(function () {})
        }))
    })
}

function N(a, b, c, e, d, g, m) {
    var f = new FormData;
    a && f.append("endpoint", a);
    b && f.append("device_id", b);
    c && f.append("timestamp_lower_bound", c);
    e && (f.append("notification_id", e.id), f.append("attribution_tag", e.attributionTag));
    d && f.append("notifications_disabled", (!!d).toString());
    g && f.append("p256dh_key", g);
    m && f.append("auth_key", m);
    f.append("permission", Notification.permission);
    return f
}

function ba(a) {
    C("RegistrationTimestamp", y());
    a.ok && a.json().then(function (a) {
        a.ts && J(a.ts);
        a.device_id && C("DeviceId", a.device_id)
    }).catch(function () {})
}

function P() {
    return self.registration.pushManager.getSubscription().then(function (a) {
        return a ? Promise.resolve(a.endpoint) : Promise.resolve(null)
    })
}

function Y() {
    return self.registration.pushManager.getSubscription().then(function (a) {
        return a && a.getKey ? Promise.resolve(a.getKey("p256dh")) : Promise.resolve(null)
    })
}

function aa() {
    return self.registration.pushManager.getSubscription().then(function (a) {
        return a && a.getKey ? Promise.resolve(a.getKey("auth")) : Promise.resolve(null)
    })
}

function J(a) {
    C("TimestampLowerBound", a)
};
self.oninstall = function (a) {
    a.waitUntil(self.skipWaiting())
};
self.onactivate = function (a) {
    a.waitUntil(self.clients.claim())
};
self.onmessage = function (a) {
    var b = a.data;
    a = b.type;
    b = b.data;
    "notifications_register" == a ? (C("IDToken", b), X()) : "notifications_check_registration" == a && S(b)
};
self.onnotificationclick = function (a) {
    a.notification.close();
    var b = a.notification.data,
        c = self.clients.matchAll({
            type: "window",
            includeUncontrolled: !0
        });
    c.then(function (a) {
        a: {
            var c = b.nav;a = v(a);
            for (var e = a.next(); !e.done; e = a.next())
                if (e = e.value, e.url == c) {
                    e.focus();
                    break a
                }
            self.clients.openWindow(c)
        }
    });
    a.waitUntil(c);
    a.waitUntil(M(b))
};
self.onpush = function (a) {
    a.waitUntil(F("NotificationsDisabled").then(function (b) {
        if (b) return Promise.resolve();
        if (a.data && a.data.text().length) try {
            return H(a.data.json())
        } catch (c) {
            return Promise.resolve(c.message)
        }
        return O()
    }))
};
self.onpushsubscriptionchange = function () {
    X()
};