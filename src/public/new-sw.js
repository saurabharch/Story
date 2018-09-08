! function (e) {
    function t(r) {
        if (n[r]) return n[r].exports;
        var o = n[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
    }
    var n = {};
    var cacheName = "V3",
        cacheFiles = [
            '/',
            '/story-sw-.js',
            '/lib/sw-toolbox.js',
            '/?pageNo=1&size=6',
            '/offline.html',
            'lib/sw-toolbox.js',
            'app.js',
            'sticky.js',
            'css/style.css',
            'js/stripe.js',
            'manifest.json',
            'img/fevicon.ico',
            'img/footer.svg',
            'img/screen-rotate.png',
            'img/WelcomeSplash.svg',
            'img/1_sg-uLNm73whmdOgKlrQdZA.jpeg',
            'stories/?pageNo=1&size=6',
            'offline.html',
            'js/materialize.min.js',
            'css/materialize.min.css',
            'js/jquery.js',
            'fallback.json',
            'fingers.mp4',
            'css/fonts/MaterialIcons.woff2',
            'css/fonts/genericons-regular-webfont.woff',
            'css/all.css',
            'css/fonts/fa-solid-900.woff2',
            'js/standard/ckeditor.js',
            'js/classic/ckeditor.js',
            'js/stripe-main.js',
            'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/genericons-regular-webfont.woff',
            'https://use.fontawesome.com/releases/v5.0.8/css/all.css',
            'https://use.fontawesome.com/releases/v5.0.8/webfonts/fa-solid-900.woff2',
            'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js',
            'https://cdn.ckeditor.com/ckeditor5/11.0.1/classic/ckeditor.js',
            'https://js.stripe.com/v3/',
            'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js'
        ];
    t.m = e, t.c = n, t.i = function (e) {
        return e
    }, t.d = function (e, n, r) {
        t.o(e, n) || Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: r
        })
    }, t.n = function (e) {
        var n = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return t.d(n, "a", n), n
    }, t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, t.p = "", t(t.s = 18)
}([function (e, t, n) {
    "use strict";

    function r(e, t) {
        t = t || {}, (t.debug || d.debug) && console.log("[sw-toolbox] " + e)
    }

    function o(e) {
        var t;
        return e && e.cache && (t = e.cache.name), t = t || d.cache.name, caches.open(t)
    }

    function a(e, t) {
        t = t || {};
        var n = t.successResponses || d.successResponses;
        return fetch(e.clone()).then(function (r) {
            return "GET" === e.method && n.test(r.status) && o(t).then(function (n) {
                n.put(e, r).then(function () {
                    var r = t.cache || d.cache;
                    (r.maxEntries || r.maxAgeSeconds) && r.name && i(e, n, r)
                })
            }), r.clone()
        })
    }

    function i(e, t, n) {
        var r = c.bind(null, e, t, n);
        l = l ? l.then(r) : r()
    }

    function c(e, t, n) {
        var o = e.url,
            a = n.maxAgeSeconds,
            i = n.maxEntries,
            c = n.name,
            s = Date.now();
        return r("Updating LRU order for " + o + ". Max entries is " + i + ", max age is " + a), v.getDb(c).then(function (e) {
            return v.setTimestampForUrl(e, o, s)
        }).then(function (e) {
            return v.expireEntries(e, i, a, s)
        }).then(function (e) {
            r("Successfully updated IDB.");
            var n = e.map(function (e) {
                return t.delete(e)
            });
            return Promise.all(n).then(function () {
                r("Done with cache cleanup.")
            })
        }).catch(function (e) {
            r(e)
        })
    }

    function s(e, t, n) {
        return r("Renaming cache: [" + e + "] to [" + t + "]", n), caches.delete(t).then(function () {
            return Promise.all([caches.open(e), caches.open(t)]).then(function (t) {
                var n = t[0],
                    r = t[1];
                return n.keys().then(function (e) {
                    return Promise.all(e.map(function (e) {
                        return n.match(e).then(function (t) {
                            return r.put(e, t)
                        })
                    }))
                }).then(function () {
                    return caches.delete(e)
                })
            })
        })
    }

    function u(e, t) {
        return o(t).then(function (t) {
            return t.add(e)
        })
    }

    function f(e, t) {
        return o(t).then(function (t) {
            return t.delete(e)
        })
    }

    function p(e) {
        e instanceof Promise || h(e), d.preCacheItems = d.preCacheItems.concat(e)
    }

    function h(e) {
        var t = Array.isArray(e);
        if (t && e.forEach(function (e) {
                "string" == typeof e || e instanceof Request || (t = !1)
            }), !t) throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");
        return e
    }
    var l, d = n(4),
        v = n(64);
    e.exports = {
        debug: r,
        fetchAndCache: a,
        openCache: o,
        renameCache: s,
        cache: u,
        uncache: f,
        precache: p,
        validatePrecacheInput: h
    };
}, function (e, t, n) {
    function r(e, t) {
        for (var n = e.length; n--;)
            if (o(e[n][0], t)) return n;
        return -1
    }
    var o = n(57);
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        var n = e.__data__;
        return o(t) ? n["string" == typeof t ? "string" : "hash"] : n.map
    }
    var o = n(40);
    e.exports = r
}, function (e, t, n) {
    var r = n(10),
        o = r(Object, "create");
    e.exports = o
}, function (e, t, n) {
    "use strict";
    var r;
    r = self.registration ? self.registration.scope : self.scope || new URL("./", self.location).href, e.exports = {
        cache: {
            name: "$$$toolbox-cache$$$" + r + "$$$",
            maxAgeSeconds: null,
            maxEntries: null
        },
        debug: !1,
        networkTimeoutSeconds: null,
        preCacheItems: [],
        successResponses: /^0|([123]\d\d)|(40[14567])|410$/
    };
}, function (e, t, n) {
    var r = n(6),
        o = r.Symbol;
    e.exports = o;
}, function (e, t, n) {
    var r = n(31),
        o = "object" == typeof self && self && self.Object === Object && self,
        a = r || o || Function("return this")();
    e.exports = a;
}, function (e, t) {
    var n = Array.isArray;
    e.exports = n;
}, function (e, t, n) {
    function r(e) {
        return "symbol" == typeof e || a(e) && o(e) == i
    }
    var o = n(9),
        a = n(60),
        i = "[object Symbol]";
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        return null == e ? void 0 === e ? s : c : u && u in Object(e) ? a(e) : i(e)
    }
    var o = n(5),
        a = n(32),
        i = n(53),
        c = "[object Null]",
        s = "[object Undefined]",
        u = o ? o.toStringTag : void 0;
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        var n = a(e, t);
        return o(n) ? n : void 0
    }
    var o = n(27),
        a = n(33);
    e.exports = r
}, function (e, t) {
    function n(e) {
        var t = typeof e;
        return null != e && ("object" == t || "function" == t)
    }
    e.exports = n
}, function (e, t, n) {
    "use strict";

    function r(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }
    var o = n(66),
        a = n(0),
        i = function (e, t) {
            for (var n = e.entries(), r = n.next(), o = []; !r.done;) {
                new RegExp(r.value[0]).test(t) && o.push(r.value[1]), r = n.next()
            }
            return o
        },
        c = function () {
            this.routes = new Map, this.routes.set(RegExp, new Map), this.default = null
        };
    ["get", "post", "put", "delete", "head", "any"].forEach(function (e) {
        c.prototype[e] = function (t, n, r) {
            return this.add(e, t, n, r)
        }
    }), c.prototype.add = function (e, t, n, i) {
        i = i || {};
        var c;
        t instanceof RegExp ? c = RegExp : (c = i.origin || self.location.origin, c = c instanceof RegExp ? c.source : r(c)), e = e.toLowerCase();
        var s = new o(e, t, n, i);
        this.routes.has(c) || this.routes.set(c, new Map);
        var u = this.routes.get(c);
        u.has(e) || u.set(e, new Map);
        var f = u.get(e),
            p = s.regexp || s.fullUrlRegExp;
        f.has(p.source) && a.debug('"' + t + '" resolves to same regex as existing route.'), f.set(p.source, s)
    }, c.prototype.matchMethod = function (e, t) {
        var n = new URL(t),
            r = n.origin,
            o = n.pathname;
        return this._match(e, i(this.routes, r), o) || this._match(e, [this.routes.get(RegExp)], t)
    }, c.prototype._match = function (e, t, n) {
        if (0 === t.length) return null;
        for (var r = 0; r < t.length; r++) {
            var o = t[r],
                a = o && o.get(e.toLowerCase());
            if (a) {
                var c = i(a, n);
                if (c.length > 0) return c[0].makeHandler(n)
            }
        }
        return null
    }, c.prototype.match = function (e) {
        return this.matchMethod(e.method, e.url) || this.matchMethod("any", e.url)
    }, e.exports = new c
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: cache only [" + e.url + "]", n), o.openCache(n).then(function (t) {
            return t.match(e)
        })
    }
    var o = n(0);
    e.exports = r
}, function (e, t, n) {
    "use strict";
    var r = n(20),
        o = n.n(r),
        a = o.a.canUseDOM,
        i = "undefined" != typeof navigator ? navigator.userAgent : "StandardUA",
        c = {
            "X-user-agent": i,
            "Content-Type": "application/json"
        };
    a || Object.assign(c, {
        compress: !0,
        Connection: "keep-alive",
        "Keep-Alive": "timeout=600"
    });
    var s = a ? "https" : "http",
        u = Object.assign({}, {
            headers: c
        }, {
            protocol: s,
            hostname: "127.0.0.1:5500",
            credentials: "include",
            fk_api_timeout: a ? 3e4 : 4e3
        });
    t.a = u;
    var f = Object.assign({}, c, {
        "x-device-source": "web"
    });
    delete f["X-user-agent"];
    Object.assign({}, {
        headers: f
    }, {
        protocol: s,
        hostname: "localhost:5500",
        credentials: "include",
        fk_api_timeout: a ? 3e4 : 4e3
    })
}, function (e, t, n) {
    "use strict";
    var r = n(58),
        o = n.n(r);
    t.a = o.a
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function o(e, t, n) {
        var r = e.url.replace(/sqid=([^&]*)/, "").replace(/ssid=([^&]*)/, "");
        return h.a.openCache(n).then(function (t) {
            return s(r, t, n, "get", e)
        }).catch(function (e) {
            throw new Error(e)
        })
    }

    function a(e, t, n) {
        return c(e.clone()).then(function (t) {
            return h.a.openCache(n).then(function (r) {
                return s(t, r, n, "post", e)
            })
        }).catch(function (e) {
            throw new Error(e)
        })
    }

    function i(e) {
        return c(e.clone()).then(function (t) {
            return fetch(e).then(function (e) {
                return {
                    url: t,
                    response: e.clone()
                }
            })
        })
    }

    function c(e) {
        return e.json().then(function (t) {
            var r = JSON.stringify(t),
                o = r.replace(/"(ssid|sqid)":".*?"/g, ""),
                a = n.i(l.a)(e.url + o);
            return e.url + "?payload=" + a
        })
    }

    function s(e, t, n) {
        var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "get",
            a = arguments[4],
            c = 1e3 * n.cache.maxAgeSeconds,
            s = new Request(e + (e.indexOf("?") > -1 ? "&" : "?") + "$cached$timestamp$");
        return Promise.all([t.match(e), t.match(s)]).then(function (n) {
            var u = n[0],
                f = n[1];
            return u && f && Date.now() < parseInt(f.headers.get("created-time"), 10) + c ? u : "get" === o ? fetch(a).then(function (n) {
                return 200 === n.status && (t.put(e, n.clone()), t.put(s, new Response(null, {
                    headers: r({}, "created-time", Date.now())
                }))), n
            }) : i(a).then(function (n) {
                return n.response.ok && (t.put(s, new Response(null, {
                    headers: r({}, "created-time", Date.now())
                })), t.put(e, n.response.clone())), n.response
            })
        })
    }

    function u(e, t) {
        return function () {
            h.a.uncache(e, t)
        }
    }

    function f(e, t, n) {
        var r = {
                type: "PN",
                eventType: e,
                timestamp: (new Date).getTime(),
                messageId: t.messageId,
                contextId: t.contextId,
                cargo: n
            },
            o = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": ""
                },
                body: JSON.stringify(r)
            };
        return fetch("" + t.deviceId, o)
    }
    var p = n(0),
        h = n.n(p),
        l = n(19);
    t.a = {
        cacheFirst: o,
        cachePost: a,
        webpushCallBack: f,
        uncache: u
    }
}, function (e, t, n) {
    "use strict";
    var r = n(4),
        o = n(12),
        a = n(0),
        i = n(69),
        c = n(65);
    a.debug("Service Worker Toolbox is loading"), self.addEventListener("install", c.installListener), self.addEventListener("activate", c.activateListener), self.addEventListener("fetch", c.fetchListener), e.exports = {
        networkOnly: i.networkOnly,
        networkFirst: i.networkFirst,
        cacheOnly: i.cacheOnly,
        cacheFirst: i.cacheFirst,
        fastest: i.fastest,
        router: o,
        options: r,
        cache: a.cache,
        uncache: a.uncache,
        precache: a.precache
    }
}, function (e, t, n) {
    self.addEventListener('install', function (e) {
            e.waitUntil(self.skipWaiting())
            /* console.log("[ServiceWorker] Insatlled");
            e.waitUntil(
                caches.open(cacheName).then(function(cache){
                    console.log("[ServiceWorker] Caching CacheFiles");
                    return cache.addAll(cacheFiles);
                })
            ) */
        }), self.addEventListener('activate', function (e) {
            console.log("[ServiceWorker] Activated");
            e.waitUntil(self.clients.claim()), e.waitUntil(caches.keys().then(function (e) {

                return Promise.all(e.map(function (e) {
                    return -1 === t.indexOf(e) && -1 === e.indexOf("$$$inactive$$$") ? caches.delete(e) : Promise.resolve();
                }));
            })), self.addEventListener("push", function (e) {
                if (e.data) try {
                    var t = e.data.json(),
                        r = t.payload;
                    if (r) {
                        var o = n.i(c.a)(r, ["title"]),
                            a = {
                                body: r.body,
                                icon: r.icon,
                                image: r.image,
                                tag: "notification",
                                data: t
                            };
                        r.actions && r.actions.length > 0 && (a.actions = [], r.actions.forEach(function (e) {
                            a.actions.push({
                                icon: e.icon,
                                title: e.title,
                                action: e.action
                            });
                        })), e.waitUntil(Promise.all([self.registration.showNotification(o, a), i.a.webpushCallBack("RECEIVED", t)]))
                    }
                } catch (e) {}
            }), self.addEventListener("notificationclick", function (e) {
                e.notification.close();
                var t = void 0;
                if (e.action) {
                    var r = n.i(c.a)(e, ["notification", "data", "payload", "actions"]);
                    if (r && Array.isArray(r)) {
                        var o = r.filter(function (t) {
                            return e.action === t.action
                        });
                        1 == o.length && (t = n.i(c.a)(o, [0, "landingUrl"]))
                    }
                } else t = n.i(c.a)(e, ["notification", "data", "payload", "landingUrl"]);
                t ? e.waitUntil(Promise.all([clients.openWindow(t), i.a.webpushCallBack("READ", e.notification.data)])) : e.waitUntil(self.skipWaiting())
            }), self.addEventListener("notificationclose", function (e) {
                e.waitUntil(i.a.webpushCallBack("DISMISS", e.notification.data))
            }), navigator.userAgent.indexOf("Firefox/44.0") > -1 && self.addEventListener("fetch", function (e) {
                e.respondWith(fetch(e.request))
            })
        }),

        /*   popup() */
        /*     var f = {
                cache: {
                    maxEntries: 15
                },
                origin: "http://" + a.a.hostname
            };
            o.a.router.get("/lc/getData*", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.lc,
                    maxAgeSeconds: 1800
                }
            })), o.a.router.get("/api/3/layout/ppv3*", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.layouts,
                    maxAgeSeconds: 43200
                }
            })), o.a.router.post("/api/3/search/summary", i.a.cachePost, Object.assign({}, f, {
                cache: {
                    name: u.searchSummary,
                    maxAgeSeconds: 45
                }
            })), o.a.router.post("/api/1/product/smart-browse", i.a.cachePost, Object.assign({}, f, {
                cache: {
                    name: u.sherlock,
                    maxAgeSeconds: 45
                }
            })), o.a.router.get("/api/1/product/smart-browse/facets*", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.facets,
                    maxAgeSeconds: 45
                }
            })), o.a.router.get("/api/3/product/swatch", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.swatches,
                    maxAgeSeconds: 120
                }
            })), o.a.router.get("/api/2/discover/getAutoSuggest*", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.autosuggest,
                    maxAgeSeconds: 120
                }
            })), o.a.router.post("/api/3/page/dynamic/product-reviews", i.a.cachePost, Object.assign({}, f, {
                cache: {
                    name: u.reviews,
                    maxAgeSeconds: 120
                }
            })), o.a.router.get("/api/3/product/reviews", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.reviews,
                    maxAgeSeconds: 120
                }
            })), o.a.router.get("/api/3/product/aspect-reviews", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.reviews,
                    maxAgeSeconds: 120
                }
            })), o.a.router.post("/api/3/product/summary", i.a.cachePost, Object.assign({}, f, {
                cache: {
                    name: u.summary,
                    maxAgeSeconds: 45
                }
            })), o.a.router.post("/api/3/discover/discovery/content", i.a.cachePost, Object.assign({}, f, {
                cache: {
                    name: u.reco,
                    maxAgeSeconds: 45
                }
            })), o.a.router.get("/api/3/user/autosuggest/pincodes", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u.pincodes,
                    maxAgeSeconds: 86400
                }
            })), o.a.router.get("/api/1/self-serve/return/tnc/*", i.a.cacheFirst, Object.assign({}, f, {
                cache: {
                    name: u["self-serve"],
                    maxAgeSeconds: 86400
                }
            })), o.a.router.get("/(.*)", o.a.cacheFirst, {
                origin: "https://rukminim1.flixcart.com",
                cache: {
                    name: u.static,
                    maxEntries: 50
                }
            }), o.a.router.get("/fk-cp-zion/fonts/(.*)", o.a.fastest, {
                origin: "https://img1a.flixcart.com",
                cache: {
                    name: u.fonts,
                    maxEntries: 5
                } */
        self.addEventListener('fetch', function (e) {
            console.log("[ServiceWorker] fetching");
            // e.respondWidth Responds to the fetch event
            e.respondWith(

                // Check in cache for the request being made
                caches.match(e.request)


                .then(function (response) {

                    // If the request is in the cache
                    if (response) {
                        console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                        // Return the cached version
                        return response;
                    }

                    // If the request is NOT in the cache, fetch and cache

                    var requestClone = e.request.clone();
                    fetch(requestClone)
                        .then(function (response) {

                            if (!response) {
                                console.log("[ServiceWorker] No response from fetch ");
                                return response;
                            }

                            var responseClone = response.clone();

                            //  Open the cache
                            caches.open(e).then(function (cache) {

                                // Put the fetched response in the cache
                                cache.put(e.request, responseClone);
                                console.log('[ServiceWorker] New Data Cached', e.request.url);

                                // Return the response
                                return response;

                            }); // end caches.open

                        })
                        .catch(function (err) {
                            console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                        });


                }))
        })
    // end e.respondWith
}, 
function (e, t, n) {
    var news = 'Hello World'; //Client Guid or ID asssigne for Browser
    var title = 'Hello World'; // Tittle
    var bodymsg = 'Hello World'; //Message
    var image = ''; // Logo Image Link
    var url = 'http://localhost:5500/index.html'; //Page Url Redirect Link
    var tagsid = 'Hello World';
    var Status = 'Hello World';
    if ("Notification" in window) {
        let ask = Notification.requestPermission();
        ask.then(permission => {
            if (permission === "granted") {
                if (news === tagsid) {
                    let msg = new Notification(title, {
                        body: bodymsg,
                        icon: image,
                        tag: tagsid
                    });
                    msg.onshow = function () {
                        setTimeout(msg.close, 15000)
                    }
                    msg.addEventListener('click', event => {
                        window.location.replace(url);
                    });
                }
            }
        });
    };
}, 
function (e, t, n) {
    "use strict";

    function r(e) {
        var t = 0;
        if (0 === e.length) return t;
        for (var n = 0; n < e.length; n++) {
            t = (t << 5) - t + e.charCodeAt(n), t &= t
        }
        return t
    }
    t.a = r;
    ! function () {
        function e(e) {
            for (var n = void 0, r = void 0, o = void 0, a = void 0, i = [], c = unescape(encodeURI(e)), s = c.length, u = [n = 1732584193, r = -271733879, ~n, ~r], f = 0; f <= s;) i[f >> 2] |= (c.charCodeAt(f) || 128) << f++ % 4 * 8;
            for (i[e = 16 * (s + 8 >> 6) + 14] = 8 * s, f = 0; f < e; f += 16) {
                for (s = u, a = 0; a < 64;) s = [o = s[3], (n = 0 | s[1]) + ((o = s[0] + [n & (r = s[2]) | ~n & o, o & n | ~o & r, n ^ r ^ o, r ^ (n | ~o)][s = a >> 4] + (t[a] + (0 | i[[a, 5 * a + 1, 3 * a + 5, 7 * a][s] % 16 + f]))) << (s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * s + a++ % 4]) | o >>> 32 - s), n, r];
                for (a = 4; a;) u[--a] = u[a] + s[a]
            }
            for (e = ""; a < 32;) e += (u[a >> 3] >> 4 * (1 ^ 7 & a++) & 15).toString(16);
            return e;
        }
        for (var t = [], n = 0; n < 64;) t[n] = 0 | 4294967296 * Math.abs(Math.sin(++n))
    }()
}, function (e, t, n) {
    "use strict";
    var r = !("undefined" == typeof window || !window.document || !window.document.createElement),
        o = {
            canUseDOM: r,
            canUseWorkers: "undefined" != typeof Worker,
            canUseEventListeners: r && !(!window.addEventListener && !window.attachEvent),
            canUseViewport: r && !!window.screen,
            isInWorker: !r
        };
    e.exports = o
}, function (e, t, n) {
    function r(e) {
        var t = -1,
            n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n;) {
            var r = e[t];
            this.set(r[0], r[1])
        }
    }
    var o = n(34),
        a = n(35),
        i = n(36),
        c = n(37),
        s = n(38);
    r.prototype.clear = o, r.prototype.delete = a, r.prototype.get = i, r.prototype.has = c, r.prototype.set = s, e.exports = r
}, function (e, t, n) {
    function r(e) {
        var t = -1,
            n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n;) {
            var r = e[t];
            this.set(r[0], r[1])
        }
    }
    var o = n(42),
        a = n(43),
        i = n(44),
        c = n(45),
        s = n(46);
    r.prototype.clear = o, r.prototype.delete = a, r.prototype.get = i, r.prototype.has = c, r.prototype.set = s, e.exports = r
}, function (e, t, n) {
    var r = n(10),
        o = n(6),
        a = r(o, "Map");
    e.exports = a
}, function (e, t, n) {
    function r(e) {
        var t = -1,
            n = null == e ? 0 : e.length;
        for (this.clear(); ++t < n;) {
            var r = e[t];
            this.set(r[0], r[1])
        }
    }
    var o = n(47),
        a = n(48),
        i = n(49),
        c = n(50),
        s = n(51);
    r.prototype.clear = o, r.prototype.delete = a, r.prototype.get = i, r.prototype.has = c, r.prototype.set = s, e.exports = r
}, function (e, t) {
    function n(e, t) {
        for (var n = -1, r = null == e ? 0 : e.length, o = Array(r); ++n < r;) o[n] = t(e[n], n, e);
        return o
    }
    e.exports = n
}, function (e, t, n) {
    function r(e, t) {
        t = o(t, e);
        for (var n = 0, r = t.length; null != e && n < r;) e = e[a(t[n++])];
        return n && n == r ? e : void 0
    }
    var o = n(29),
        a = n(55);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        return !(!i(e) || a(e)) && (o(e) ? d : u).test(c(e))
    }
    var o = n(59),
        a = n(41),
        i = n(11),
        c = n(56),
        s = /[\\^$.*+?()[\]{}|]/g,
        u = /^\[object .+?Constructor\]$/,
        f = Function.prototype,
        p = Object.prototype,
        h = f.toString,
        l = p.hasOwnProperty,
        d = RegExp("^" + h.call(l).replace(s, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        if ("string" == typeof e) return e;
        if (i(e)) return a(e, r) + "";
        if (c(e)) return f ? f.call(e) : "";
        var t = e + "";
        return "0" == t && 1 / e == -s ? "-0" : t
    }
    var o = n(5),
        a = n(25),
        i = n(7),
        c = n(8),
        s = 1 / 0,
        u = o ? o.prototype : void 0,
        f = u ? u.toString : void 0;
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        return o(e) ? e : a(e, t) ? [e] : i(c(e))
    }
    var o = n(7),
        a = n(39),
        i = n(54),
        c = n(62);
    e.exports = r
}, function (e, t, n) {
    var r = n(6),
        o = r["__core-js_shared__"];
    e.exports = o
}, function (e, t, n) {
    (function (t) {
        var n = "object" == typeof t && t && t.Object === Object && t;
        e.exports = n
    }).call(t, n(74))
}, function (e, t, n) {
    function r(e) {
        var t = i.call(e, s),
            n = e[s];
        try {
            e[s] = void 0;
            var r = !0
        } catch (e) {}
        var o = c.call(e);
        return r && (t ? e[s] = n : delete e[s]), o
    }
    var o = n(5),
        a = Object.prototype,
        i = a.hasOwnProperty,
        c = a.toString,
        s = o ? o.toStringTag : void 0;
    e.exports = r
}, function (e, t) {
    function n(e, t) {
        return null == e ? void 0 : e[t]
    }
    e.exports = n
}, function (e, t, n) {
    function r() {
        this.__data__ = o ? o(null) : {}, this.size = 0
    }
    var o = n(3);
    e.exports = r
}, function (e, t) {
    function n(e) {
        var t = this.has(e) && delete this.__data__[e];
        return this.size -= t ? 1 : 0, t
    }
    e.exports = n
}, function (e, t, n) {
    function r(e) {
        var t = this.__data__;
        if (o) {
            var n = t[e];
            return n === a ? void 0 : n
        }
        return c.call(t, e) ? t[e] : void 0
    }
    var o = n(3),
        a = "__lodash_hash_undefined__",
        i = Object.prototype,
        c = i.hasOwnProperty;
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        var t = this.__data__;
        return o ? void 0 !== t[e] : i.call(t, e)
    }
    var o = n(3),
        a = Object.prototype,
        i = a.hasOwnProperty;
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        var n = this.__data__;
        return this.size += this.has(e) ? 0 : 1, n[e] = o && void 0 === t ? a : t, this
    }
    var o = n(3),
        a = "__lodash_hash_undefined__";
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        if (o(e)) return !1;
        var n = typeof e;
        return !("number" != n && "symbol" != n && "boolean" != n && null != e && !a(e)) || (c.test(e) || !i.test(e) || null != t && e in Object(t))
    }
    var o = n(7),
        a = n(8),
        i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        c = /^\w*$/;
    e.exports = r
}, function (e, t) {
    function n(e) {
        var t = typeof e;
        return "string" == t || "number" == t || "symbol" == t || "boolean" == t ? "__proto__" !== e : null === e
    }
    e.exports = n
}, function (e, t, n) {
    function r(e) {
        return !!a && a in e
    }
    var o = n(30),
        a = function () {
            var e = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "");
            return e ? "Symbol(src)_1." + e : ""
        }();
    e.exports = r
}, function (e, t) {
    function n() {
        this.__data__ = [], this.size = 0
    }
    e.exports = n
}, function (e, t, n) {
    function r(e) {
        var t = this.__data__,
            n = o(t, e);
        return !(n < 0) && (n == t.length - 1 ? t.pop() : i.call(t, n, 1), --this.size, !0)
    }
    var o = n(1),
        a = Array.prototype,
        i = a.splice;
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        var t = this.__data__,
            n = o(t, e);
        return n < 0 ? void 0 : t[n][1]
    }
    var o = n(1);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        return o(this.__data__, e) > -1
    }
    var o = n(1);
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        var n = this.__data__,
            r = o(n, e);
        return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this
    }
    var o = n(1);
    e.exports = r
}, function (e, t, n) {
    function r() {
        this.size = 0, this.__data__ = {
            hash: new o,
            map: new(i || a),
            string: new o
        }
    }
    var o = n(21),
        a = n(22),
        i = n(23);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        var t = o(this, e).delete(e);
        return this.size -= t ? 1 : 0, t
    }
    var o = n(2);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        return o(this, e).get(e)
    }
    var o = n(2);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        return o(this, e).has(e)
    }
    var o = n(2);
    e.exports = r
}, function (e, t, n) {
    function r(e, t) {
        var n = o(this, e),
            r = n.size;
        return n.set(e, t), this.size += n.size == r ? 0 : 1, this
    }
    var o = n(2);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        var t = o(e, function (e) {
                return n.size === a && n.clear(), e
            }),
            n = t.cache;
        return t
    }
    var o = n(61),
        a = 500;
    e.exports = r
}, function (e, t) {
    function n(e) {
        return o.call(e)
    }
    var r = Object.prototype,
        o = r.toString;
    e.exports = n
}, function (e, t, n) {
    var r = n(52),
        o = /^\./,
        a = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        i = /\\(\\)?/g,
        c = r(function (e) {
            var t = [];
            return o.test(e) && t.push(""), e.replace(a, function (e, n, r, o) {
                t.push(r ? o.replace(i, "$1") : n || e)
            }), t
        });
    e.exports = c
}, function (e, t, n) {
    function r(e) {
        if ("string" == typeof e || o(e)) return e;
        var t = e + "";
        return "0" == t && 1 / e == -a ? "-0" : t
    }
    var o = n(8),
        a = 1 / 0;
    e.exports = r
}, function (e, t) {
    function n(e) {
        if (null != e) {
            try {
                return o.call(e)
            } catch (e) {}
            try {
                return e + ""
            } catch (e) {}
        }
        return ""
    }
    var r = Function.prototype,
        o = r.toString;
    e.exports = n
}, function (e, t) {
    function n(e, t) {
        return e === t || e !== e && t !== t
    }
    e.exports = n
}, function (e, t, n) {
    function r(e, t, n) {
        var r = null == e ? void 0 : o(e, t);
        return void 0 === r ? n : r
    }
    var o = n(26);
    e.exports = r
}, function (e, t, n) {
    function r(e) {
        if (!a(e)) return !1;
        var t = o(e);
        return t == c || t == s || t == i || t == u
    }
    var o = n(9),
        a = n(11),
        i = "[object AsyncFunction]",
        c = "[object Function]",
        s = "[object GeneratorFunction]",
        u = "[object Proxy]";
    e.exports = r
}, function (e, t) {
    function n(e) {
        return null != e && "object" == typeof e
    }
    e.exports = n
}, function (e, t, n) {
    function r(e, t) {
        if ("function" != typeof e || null != t && "function" != typeof t) throw new TypeError(a);
        var n = function () {
            var r = arguments,
                o = t ? t.apply(this, r) : r[0],
                a = n.cache;
            if (a.has(o)) return a.get(o);
            var i = e.apply(this, r);
            return n.cache = a.set(o, i) || a, i
        };
        return n.cache = new(r.Cache || o), n
    }
    var o = n(24),
        a = "Expected a function";
    r.Cache = o, e.exports = r
}, function (e, t, n) {
    function r(e) {
        return null == e ? "" : o(e)
    }
    var o = n(28);
    e.exports = r
}, function (e, t) {
    ! function () {
        var e = Cache.prototype.addAll,
            t = navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);
        if (t) var n = t[1],
            r = parseInt(t[2]);
        e && (!t || "Firefox" === n && r >= 46 || "Chrome" === n && r >= 50) || (Cache.prototype.addAll = function (e) {
            function t(e) {
                this.name = "NetworkError", this.code = 19, this.message = e
            }
            var n = this;
            return t.prototype = Object.create(Error.prototype), Promise.resolve().then(function () {
                if (arguments.length < 1) throw new TypeError;
                return e = e.map(function (e) {
                    return e instanceof Request ? e : String(e)
                }), Promise.all(e.map(function (e) {
                    "string" == typeof e && (e = new Request(e));
                    var n = new URL(e.url).protocol;
                    if ("http:" !== n && "https:" !== n) throw new t("Invalid scheme");
                    return fetch(e.clone())
                }))
            }).then(function (r) {
                if (r.some(function (e) {
                        return !e.ok
                    })) throw new t("Incorrect response status");
                return Promise.all(r.map(function (t, r) {
                    return n.put(e[r], t)
                }))
            }).then(function () {})
        }, Cache.prototype.add = function (e) {
            return this.addAll([e])
        })
    }()
}, function (e, t, n) {
    "use strict";

    function r(e) {
        return new Promise(function (t, n) {
            var r = indexedDB.open(u + e, f);
            r.onupgradeneeded = function () {
                r.result.createObjectStore(p, {
                    keyPath: h
                }).createIndex(l, l, {
                    unique: !1
                })
            }, r.onsuccess = function () {
                t(r.result)
            }, r.onerror = function () {
                n(r.error)
            }
        })
    }

    function o(e) {
        return e in d || (d[e] = r(e)), d[e]
    }

    function a(e, t, n) {
        return new Promise(function (r, o) {
            var a = e.transaction(p, "readwrite");
            a.objectStore(p).put({
                url: t,
                timestamp: n
            }), a.oncomplete = function () {
                r(e)
            }, a.onabort = function () {
                o(a.error)
            }
        })
    }

    function i(e, t, n) {
        return t ? new Promise(function (r, o) {
            var a = 1e3 * t,
                i = [],
                c = e.transaction(p, "readwrite"),
                s = c.objectStore(p);
            s.index(l).openCursor().onsuccess = function (e) {
                var t = e.target.result;
                if (t && n - a > t.value[l]) {
                    var r = t.value[h];
                    i.push(r), s.delete(r), t.continue()
                }
            }, c.oncomplete = function () {
                r(i)
            }, c.onabort = o
        }) : Promise.resolve([])
    }

    function c(e, t) {
        return t ? new Promise(function (n, r) {
            var o = [],
                a = e.transaction(p, "readwrite"),
                i = a.objectStore(p),
                c = i.index(l),
                s = c.count();
            c.count().onsuccess = function () {
                var e = s.result;
                e > t && (c.openCursor().onsuccess = function (n) {
                    var r = n.target.result;
                    if (r) {
                        var a = r.value[h];
                        o.push(a), i.delete(a), e - o.length > t && r.continue()
                    }
                })
            }, a.oncomplete = function () {
                n(o)
            }, a.onabort = r
        }) : Promise.resolve([])
    }

    function s(e, t, n, r) {
        return i(e, n, r).then(function (n) {
            return c(e, t).then(function (e) {
                return n.concat(e)
            })
        })
    }
    var u = "sw-toolbox-",
        f = 1,
        p = "store",
        h = "url",
        l = "timestamp",
        d = {};
    e.exports = {
        getDb: o,
        setTimestampForUrl: a,
        expireEntries: s
    }
}, function (e, t, n) {
    "use strict";

    function r(e) {
        var t = s.match(e.request);
        t ? e.respondWith(t(e.request)) : s.default && "GET" === e.request.method && 0 === e.request.url.indexOf("http") && e.respondWith(s.default(e.request))
    }

    function o(e) {
        c.debug("activate event fired");
        var t = u.cache.name + "$$$inactive$$$";
        e.waitUntil(c.renameCache(t, u.cache.name))
    }

    function a(e) {
        return e.reduce(function (e, t) {
            return e.concat(t)
        }, [])
    }

    function i(e) {
        var t = u.cache.name + "$$$inactive$$$";
        c.debug("install event fired"), c.debug("creating cache [" + t + "]"), e.waitUntil(c.openCache({
            cache: {
                name: t
            }
        }).then(function (e) {
            return Promise.all(u.preCacheItems).then(a).then(c.validatePrecacheInput).then(function (t) {
                return c.debug("preCache list: " + (t.join(", ") || "(none)")), e.addAll(t)
            })
        }))
    }
    n(63);
    var c = n(0),
        s = n(12),
        u = n(4);
    e.exports = {
        fetchListener: r,
        activateListener: o,
        installListener: i
    }
}, function (e, t, n) {
    "use strict";
    var r = new URL("./", self.location),
        o = r.pathname,
        a = n(73),
        i = function (e, t, n, r) {
            t instanceof RegExp ? this.fullUrlRegExp = t : (0 !== t.indexOf("/") && (t = o + t), this.keys = [], this.regexp = a(t, this.keys)), this.method = e, this.options = r, this.handler = n
        };
    i.prototype.makeHandler = function (e) {
        var t;
        if (this.regexp) {
            var n = this.regexp.exec(e);
            t = {}, this.keys.forEach(function (e, r) {
                t[e.name] = n[r + 1]
            })
        }
        return function (e) {
            return this.handler(e, t, this.options)
        }.bind(this)
    }, e.exports = i
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: cache first [" + e.url + "]", n), o.openCache(n).then(function (t) {
            return t.match(e).then(function (t) {
                return t || o.fetchAndCache(e, n)
            })
        })
    }
    var o = n(0);
    e.exports = r
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: fastest [" + e.url + "]", n), new Promise(function (r, i) {
            var c = !1,
                s = [],
                u = function (e) {
                    s.push(e.toString()), c ? i(new Error('Both cache and network failed: "' + s.join('", "') + '"')) : c = !0
                },
                f = function (e) {
                    e instanceof Response ? r(e) : u("No result returned")
                };
            o.fetchAndCache(e.clone(), n).then(f, u), a(e, t, n).then(f, u)
        })
    }
    var o = n(0),
        a = n(13);
    e.exports = r
}, function (e, t, n) {
    e.exports = {
        networkOnly: n(71),
        networkFirst: n(70),
        cacheOnly: n(13),
        cacheFirst: n(67),
        fastest: n(68)
    }
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        n = n || {};
        var r = n.successResponses || o.successResponses,
            i = n.networkTimeoutSeconds || o.networkTimeoutSeconds;
        return a.debug("Strategy: network first [" + e.url + "]", n), a.openCache(n).then(function (t) {
            var o, c, s = [];
            if (i) {
                var u = new Promise(function (n) {
                    o = setTimeout(function () {
                        t.match(e).then(function (e) {
                            e && n(e)
                        })
                    }, 1e3 * i)
                });
                s.push(u)
            }
            var f = a.fetchAndCache(e, n).then(function (e) {
                if (o && clearTimeout(o), r.test(e.status)) return e;
                throw a.debug("Response was an HTTP error: " + e.statusText, n), c = e, new Error("Bad response")
            }).catch(function (r) {
                return a.debug("Network or response error, fallback to cache [" + e.url + "]", n), t.match(e).then(function (e) {
                    if (e) return e;
                    if (c) return c;
                    throw r
                })
            });
            return s.push(f), Promise.race(s)
        })
    }
    var o = n(4),
        a = n(0);
    e.exports = r
}, function (e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: network only [" + e.url + "]", n), fetch(e)
    }
    var o = n(0);
    e.exports = r
}, function (e, t) {
    e.exports = Array.isArray || function (e) {
        return "[object Array]" == Object.prototype.toString.call(e)
    }
}, function (e, t, n) {
    function r(e, t) {
        for (var n, r = [], o = 0, a = 0, i = "", c = t && t.delimiter || "/"; null != (n = x.exec(e));) {
            var f = n[0],
                p = n[1],
                h = n.index;
            if (i += e.slice(a, h), a = h + f.length, p) i += p[1];
            else {
                var l = e[a],
                    d = n[2],
                    v = n[3],
                    g = n[4],
                    m = n[5],
                    y = n[6],
                    w = n[7];
                i && (r.push(i), i = "");
                var b = null != d && null != l && l !== d,
                    _ = "+" === y || "*" === y,
                    E = "?" === y || "*" === y,
                    j = n[2] || c,
                    O = g || m;
                r.push({
                    name: v || o++,
                    prefix: d || "",
                    delimiter: j,
                    optional: E,
                    repeat: _,
                    partial: b,
                    asterisk: !!w,
                    pattern: O ? u(O) : w ? ".*" : "[^" + s(j) + "]+?"
                })
            }
        }
        return a < e.length && (i += e.substr(a)), i && r.push(i), r
    }

    function o(e, t) {
        return c(r(e, t))
    }

    function a(e) {
        return encodeURI(e).replace(/[\/?#]/g, function (e) {
            return "%" + e.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function i(e) {
        return encodeURI(e).replace(/[?#]/g, function (e) {
            return "%" + e.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function c(e) {
        for (var t = new Array(e.length), n = 0; n < e.length; n++) "object" == typeof e[n] && (t[n] = new RegExp("^(?:" + e[n].pattern + ")$"));
        return function (n, r) {
            for (var o = "", c = n || {}, s = r || {}, u = s.pretty ? a : encodeURIComponent, f = 0; f < e.length; f++) {
                var p = e[f];
                if ("string" != typeof p) {
                    var h, l = c[p.name];
                    if (null == l) {
                        if (p.optional) {
                            p.partial && (o += p.prefix);
                            continue
                        }
                        throw new TypeError('Expected "' + p.name + '" to be defined')
                    }
                    if (m(l)) {
                        if (!p.repeat) throw new TypeError('Expected "' + p.name + '" to not repeat, but received `' + JSON.stringify(l) + "`");
                        if (0 === l.length) {
                            if (p.optional) continue;
                            throw new TypeError('Expected "' + p.name + '" to not be empty')
                        }
                        for (var d = 0; d < l.length; d++) {
                            if (h = u(l[d]), !t[f].test(h)) throw new TypeError('Expected all "' + p.name + '" to match "' + p.pattern + '", but received `' + JSON.stringify(h) + "`");
                            o += (0 === d ? p.prefix : p.delimiter) + h
                        }
                    } else {
                        if (h = p.asterisk ? i(l) : u(l), !t[f].test(h)) throw new TypeError('Expected "' + p.name + '" to match "' + p.pattern + '", but received "' + h + '"');
                        o += p.prefix + h
                    }
                } else o += p
            }
            return o
        }
    }

    function s(e) {
        return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function u(e) {
        return e.replace(/([=!:$\/()])/g, "\\$1")
    }

    function f(e, t) {
        return e.keys = t, e
    }

    function p(e) {
        return e.sensitive ? "" : "i"
    }

    function h(e, t) {
        var n = e.source.match(/\((?!\?)/g);
        if (n)
            for (var r = 0; r < n.length; r++) t.push({
                name: r,
                prefix: null,
                delimiter: null,
                optional: !1,
                repeat: !1,
                partial: !1,
                asterisk: !1,
                pattern: null
            });
        return f(e, t)
    }

    function l(e, t, n) {
        for (var r = [], o = 0; o < e.length; o++) r.push(g(e[o], t, n).source);
        return f(new RegExp("(?:" + r.join("|") + ")", p(n)), t)
    }

    function d(e, t, n) {
        return v(r(e, n), t, n)
    }

    function v(e, t, n) {
        m(t) || (n = t || n, t = []), n = n || {};
        for (var r = n.strict, o = !1 !== n.end, a = "", i = 0; i < e.length; i++) {
            var c = e[i];
            if ("string" == typeof c) a += s(c);
            else {
                var u = s(c.prefix),
                    h = "(?:" + c.pattern + ")";
                t.push(c), c.repeat && (h += "(?:" + u + h + ")*"), h = c.optional ? c.partial ? u + "(" + h + ")?" : "(?:" + u + "(" + h + "))?" : u + "(" + h + ")", a += h
            }
        }
        var l = s(n.delimiter || "/"),
            d = a.slice(-l.length) === l;
        return r || (a = (d ? a.slice(0, -l.length) : a) + "(?:" + l + "(?=$))?"), a += o ? "$" : r && d ? "" : "(?=" + l + "|$)", f(new RegExp("^" + a, p(n)), t)
    }

    function g(e, t, n) {
        return m(t) || (n = t || n, t = []), n = n || {}, e instanceof RegExp ? h(e, t) : m(e) ? l(e, t, n) : d(e, t, n)
    }
    var m = n(72);
    e.exports = g, e.exports.parse = r, e.exports.compile = o, e.exports.tokensToFunction = c, e.exports.tokensToRegExp = v;
    var x = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"), "g")
}, function (e, t) {
    var n;
    n = function () {
        return this
    }();
    try {
        n = n || Function("return this")() || (0, eval)("this")
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}]);
