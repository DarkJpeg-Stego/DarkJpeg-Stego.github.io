"use strict";
var Exception = function(e, r) {
    this.name = e, this.message = r, this.prototype = new Error, this.prototype.constructor = this
};
this.onmessage = function(e) {
    try {
        switch (e.data.action) {
            case "encrypt":
                new Crypto(e.data.name, e.data.buffer, e.data.pass, 0);
                break;
            case "decrypt":
                new Crypto(null, null, e.data.pass, 1);
                break;
            case "encode":
                new JPEGEncoder(e.data.method, e.data.buffer, e.data.width, e.data.height);
                break;
            case "decode":
                new JPEGDecoder(e.data.method, e.data.buffer)
        }
    } catch (r) {
        postMessage({
            type: "error",
            name: r.name,
            msg: r.message
        })
    }
};
var Crypto = function(e, r, n, a) {
        if (0 == a) {
            var t, o = new Uint8Array(r),
                f = o.length,
                i = 10 + 2 * e.length + f,
                i = "" != n ? 16 * Math.ceil(i / 16) : i,
                c = new Uint8Array(i),
                s = 0;
            c[s++] = 3, c[s++] = 20, c[s++] = 21, c[s++] = 147, c[s++] = f >> 24, c[s++] = 255 & f >> 16, c[s++] = 255 & f >> 8, c[s++] = 255 & f, c[s++] = e.length >> 8, c[s++] = 255 & e.length;
            for (var p = 0; p < e.length; p++) t = e.charCodeAt(p), c[s++] = t >> 8, c[s++] = 255 & t;
            for (var p = 0; f > p; p++) c[s++] = o[p];
            Crypto.prototype.data = "" != n ? new AES256(c, n, a) : c, postMessage({
                type: "encrypt",
                size: i
            })
        } else {
            var u, v, e, c, o = "undefined" != typeof Crypto.prototype.data ? Crypto.prototype.data : [],
                f = o.length,
                s = 0;
            if (0 == f) throw new Exception("decrypt", "Nothing to decrypt");
            if (o = "" != n ? new AES256(o, n, a) : o, u = o[4] << 24 | o[5] << 16 | o[6] << 8 | o[7], v = o[8] << 8 | o[9], 3 != o[0] || 20 != o[1] || 21 != o[2] || 147 != o[3]) throw new Exception("decrypt", "Wrong password");
            if (0 == u || 0 == v) throw new Exception("decrypt", "Empty data");
            s = 10, e = new Array(v);
            for (var p = 0; v > p; p++) e[p] = o[s++] << 8, e[p] |= o[s++], e[p] = String.fromCharCode(e[p]);
            c = new Uint8Array(u);
            for (var p = 0; u > p; p++) c[p] = o[s++];
            postMessage({
                type: "decrypt",
                name: e.join(""),
                buffer: c.buffer
            }, [c.buffer])
        }
    },
    SHA3 = function() {
        var e, r, n, a, t, o;
        return e = [0, 10, 20, 5, 15, 16, 1, 11, 21, 6, 7, 17, 2, 12, 22, 23, 8, 18, 3, 13, 14, 24, 9, 19, 4], r = "1,8082,808a,80008000,808b,80000001,80008081,8009,8a,88,80008009,8000000a,8000808b,8b,8089,8003,8002,80,800a,8000000a,80008081,8080".split(",").map(function(e) {
                return parseInt(e, 16)
            }), n = [0, 1, 30, 28, 27, 4, 12, 6, 23, 20, 3, 10, 11, 25, 7, 9, 13, 15, 21, 8, 18, 2, 29, 24, 14], a = function(e, r) {
                return e << r | e >>> 32 - r
            }, t = function(e) {
                return ("00" + e.toString(16)).slice(-2)
            }, o = function(e) {
                return t(255 & e) + t(e >>> 8) + t(e >>> 16) + t(e >>> 24)
            },
            function(t) {
                var o, f, i, c, s, p, u, v, l, d;
                for (d = [], o = 0; 25 > o; o += 1) d[o] = 0;
                for (p = [], u = [], l = [], t += "Ġ"; 0 !== t.length % 16;) t += "\0";
                for (f = 0; f < t.length; f += 16) {
                    for (i = 0; 16 > i; i += 2) d[i / 2] ^= t.charCodeAt(f + i) + 65536 * t.charCodeAt(f + i + 1);
                    for (v = 0; 22 > v; v += 1) {
                        for (c = 0; 5 > c; c += 1) p[c] = d[c] ^ d[c + 5] ^ d[c + 10] ^ d[c + 15] ^ d[c + 20];
                        for (c = 0; 5 > c; c += 1) u[c] = p[(c + 4) % 5] ^ a(p[(c + 1) % 5], 1);
                        for (o = 0; 25 > o; o += 1) l[e[o]] = a(d[o] ^ u[o % 5], n[o]);
                        for (c = 0; 5 > c; c += 1)
                            for (s = 0; 25 > s; s += 5) d[s + c] = l[s + c] ^ ~l[s + (c + 1) % 5] & l[s + (c + 2) % 5];
                        d[0] ^= r[v]
                    }
                }
                return d.slice(0, 8)
            }
    }(),
    AES256 = function(e, r, n) {
        function a() {
            AES256.prototype.tables = [
                [
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                [
                    [],
                    [],
                    [],
                    [],
                    []
                ]
            ];
            var e, r, n, a, t, o, f, i, c, s = AES256.prototype.tables[0],
                p = AES256.prototype.tables[1],
                u = s[4],
                v = p[4],
                l = [],
                d = [];
            for (e = 0; 256 > e; e++) d[(l[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
            for (r = n = 0; !u[r]; r ^= a || 1, n = d[n] || 1)
                for (f = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4, f = 99 ^ (f >> 8 ^ 255 & f), u[r] = f, v[f] = r, o = l[t = l[a = l[r]]], c = 16843009 * o ^ 65537 * t ^ 257 * a ^ 16843008 * r, i = 257 * l[f] ^ 16843008 * f, e = 0; 4 > e; e++) s[e][r] = i = i << 24 ^ i >>> 8, p[e][f] = c = c << 24 ^ c >>> 8;
            for (e = 0; 5 > e; e++) s[e] = s[e].slice(0), p[e] = p[e].slice(0)
        }

        function t(e) {
            AES256.prototype.tables || a();
            var r, n, t, o, i, c = AES256.prototype.tables[0][4],
                s = (AES256.prototype.tables[0], AES256.prototype.tables[1]),
                p = e.length,
                u = 1;
            for (f = [o = e, i = []], r = p; 4 * p + 28 > r; r++) t = o[r - 1], (0 === r % p || 8 === p && 4 === r % p) && (t = c[t >>> 24] << 24 ^ c[255 & t >> 16] << 16 ^ c[255 & t >> 8] << 8 ^ c[255 & t], 0 === r % p && (t = t << 8 ^ t >>> 24 ^ u << 24, u = u << 1 ^ 283 * (u >> 7))), o[r] = o[r - p] ^ t;
            for (n = 0; r; n++, r--) t = o[3 & n ? r : r - 4], i[n] = 4 >= r || 4 > n ? t : s[0][c[t >>> 24]] ^ s[1][c[255 & t >> 16]] ^ s[2][c[255 & t >> 8]] ^ s[3][c[255 & t]]
        }

        function o(e, r) {
            var n, a, t, o, i = f[r],
                c = e[0] ^ i[0],
                s = e[r ? 3 : 1] ^ i[1],
                p = e[2] ^ i[2],
                u = e[r ? 1 : 3] ^ i[3],
                v = i.length / 4 - 2,
                l = 4,
                d = [0, 0, 0, 0],
                h = AES256.prototype.tables[r],
                y = h[0],
                w = h[1],
                m = h[2],
                b = h[3],
                g = h[4];
            for (o = 0; v > o; o++) n = y[c >>> 24] ^ w[255 & s >> 16] ^ m[255 & p >> 8] ^ b[255 & u] ^ i[l], a = y[s >>> 24] ^ w[255 & p >> 16] ^ m[255 & u >> 8] ^ b[255 & c] ^ i[l + 1], t = y[p >>> 24] ^ w[255 & u >> 16] ^ m[255 & c >> 8] ^ b[255 & s] ^ i[l + 2], u = y[u >>> 24] ^ w[255 & c >> 16] ^ m[255 & s >> 8] ^ b[255 & p] ^ i[l + 3], l += 4, c = n, s = a, p = t;
            for (o = 0; 4 > o; o++) d[r ? 3 & -o : o] = g[c >>> 24] << 24 ^ g[255 & s >> 16] << 16 ^ g[255 & p >> 8] << 8 ^ g[255 & u] ^ i[l++], n = c, c = s, s = p, p = u, u = n;
            return d
        }
        var f, i, c, s, p, u, v, l, d, h = 4,
            y = 0,
            w = new Uint8Array((e.length >> 4 << 4) + 4);
        if (0 == n ? (v = 0 | -Math.random() * (1 << 30), w[0] = v >> 24, w[1] = 255 & v >> 16, w[2] = 255 & v >> 8, w[3] = 255 & v) : v = e[0] << 24 | e[1] << 16 | e[2] << 8 | e[3], t(SHA3(r + v)), 1 == n && (h = 0, u = 4, i = e[u + 0] << 24 | e[u + 1] << 16 | e[u + 2] << 8 | e[u + 3], c = e[u + 4] << 24 | e[u + 5] << 16 | e[u + 6] << 8 | e[u + 7], s = e[u + 8] << 24 | e[u + 9] << 16 | e[u + 10] << 8 | e[u + 11], p = e[u + 12] << 24 | e[u + 13] << 16 | e[u + 14] << 8 | e[u + 15], l = o([i, c, s, p], n), 51647891 != l[0])) throw new Exception("decrypt", "Wrong password");
        for (u = 4 - h; u < w.length; u += 16) i = e[u + 0] << 24 | e[u + 1] << 16 | e[u + 2] << 8 | e[u + 3], c = e[u + 4] << 24 | e[u + 5] << 16 | e[u + 6] << 8 | e[u + 7], s = e[u + 8] << 24 | e[u + 9] << 16 | e[u + 10] << 8 | e[u + 11], p = e[u + 12] << 24 | e[u + 13] << 16 | e[u + 14] << 8 | e[u + 15], l = o([i, c, s, p], n), w[h++] = l[0] >> 24, w[h++] = 255 & l[0] >> 16, w[h++] = 255 & l[0] >> 8, w[h++] = 255 & l[0], w[h++] = l[1] >> 24, w[h++] = 255 & l[1] >> 16, w[h++] = 255 & l[1] >> 8, w[h++] = 255 & l[1], w[h++] = l[2] >> 24, w[h++] = 255 & l[2] >> 16, w[h++] = 255 & l[2] >> 8, w[h++] = 255 & l[2], w[h++] = l[3] >> 24, w[h++] = 255 & l[3] >> 16, w[h++] = 255 & l[3] >> 8, w[h++] = 255 & l[3], d = 0 | 100 * u / w.length, d > y + 9 && (y = d, postMessage({
            type: "progress",
            progress: d,
            name: (0 == n ? "en" : "de") + "crypt"
        }));
        return w
    },
    JPEGEncoder = function(e, r, n, a) {
        function t() {
            for (var r = 0 != e ? 34 : 0, n = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99], a = 0; 64 > a; a++) {
                var t = C((n[a] * r + 50) / 100);
                1 > t ? t = 1 : t > 255 && (t = 255), M[N[a]] = t
            }
            for (var o = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99], f = 0; 64 > f; f++) {
                var i = C((o[f] * r + 50) / 100);
                1 > i ? i = 1 : i > 255 && (i = 255), U[N[f]] = i
            }
            for (var c = [1, 1.387039845, 1.306562965, 1.175875602, 1, .785694958, .5411961, .275899379], s = 0, p = 0; 8 > p; p++)
                for (var u = 0; 8 > u; u++) I[s] = 1 / (8 * M[N[s]] * c[p] * c[u]), L[s] = 1 / (8 * U[N[s]] * c[p] * c[u]), s++
        }

        function o() {
            switch (e) {
                case "auto":
                    e = 1;
                    break;
                case "join":
                    e = 1;
                    break;
                case "steg":
                    e = 0;
                    break;
                default:
                    throw new Exception("encode", "Unknown method")
            }
        }

        function f(e, r) {
            for (var n = 0, a = 0, t = new Array, o = 1; 16 >= o; o++) {
                for (var f = 1; f <= e[o]; f++) t[r[a]] = [], t[r[a]][0] = n, t[r[a]][1] = o, a++, n++;
                n *= 2
            }
            return t
        }

        function i() {
            E = f(K, Q), k = f(Y, Z), x = f(R, X), P = f($, _)
        }

        function c() {
            for (var e = 1, r = 2, n = 1; 15 >= n; n++) {
                for (var a = e; r > a; a++) D[32767 + a] = n, S[32767 + a] = [], S[32767 + a][1] = n, S[32767 + a][0] = a;
                for (var t = -(r - 1); - e >= t; t++) D[32767 + t] = n, S[32767 + t] = [], S[32767 + t][1] = n, S[32767 + t][0] = r - 1 + t;
                e <<= 1, r <<= 1
            }
        }

        function s() {
            for (var e = 0; 256 > e; e++) F[e] = 19595 * e, F[e + 256 >> 0] = 38470 * e, F[e + 512 >> 0] = 7471 * e + 32768, F[e + 768 >> 0] = -11059 * e, F[e + 1024 >> 0] = -21709 * e, F[e + 1280 >> 0] = 32768 * e + 8421375, F[e + 1536 >> 0] = -27439 * e, F[e + 1792 >> 0] = -5329 * e
        }

        function p(e) {
            for (var r = e[0], n = e[1] - 1; n >= 0;) r & 1 << n && (j |= 1 << H), n--, H--, 0 > H && (255 == j ? (u(255), u(0)) : u(j), H = 7, j = 0)
        }

        function u(e) {
            W.push(e)
        }

        function v(e) {
            u(255 & e >> 8), u(255 & e)
        }

        function l(e, r) {
            var n, a, t, o, f, i, c, s, p, u = 0,
                v = 8;
            for (p = 0; v > p; ++p) {
                n = e[u], a = e[u + 1], t = e[u + 2], o = e[u + 3], f = e[u + 4], i = e[u + 5], c = e[u + 6], s = e[u + 7];
                var l = n + s,
                    d = n - s,
                    h = a + c,
                    y = a - c,
                    w = t + i,
                    m = t - i,
                    b = o + f,
                    g = o - f,
                    A = l + b,
                    E = l - b,
                    k = h + w,
                    x = h - w;
                e[u] = A + k, e[u + 4] = A - k;
                var P = .707106781 * (x + E);
                e[u + 2] = E + P, e[u + 6] = E - P, A = g + m, k = m + y, x = y + d;
                var C = .382683433 * (A - x),
                    M = .5411961 * A + C,
                    U = 1.306562965 * x + C,
                    I = .707106781 * k,
                    L = d + I,
                    S = d - I;
                e[u + 5] = S + M, e[u + 3] = S - M, e[u + 1] = L + U, e[u + 7] = L - U, u += 8
            }
            for (u = 0, p = 0; v > p; ++p) {
                n = e[u], a = e[u + 8], t = e[u + 16], o = e[u + 24], f = e[u + 32], i = e[u + 40], c = e[u + 48], s = e[u + 56];
                var D = n + s,
                    G = n - s,
                    J = a + c,
                    z = a - c,
                    O = t + i,
                    F = t - i,
                    W = o + f,
                    j = o - f,
                    H = D + W,
                    q = D - W,
                    V = J + O,
                    B = J - O;
                e[u] = H + V, e[u + 32] = H - V;
                var N = .707106781 * (B + q);
                e[u + 16] = q + N, e[u + 48] = q - N, H = j + F, V = F + z, B = z + G;
                var K = .382683433 * (H - B),
                    Q = .5411961 * H + K,
                    R = 1.306562965 * B + K,
                    X = .707106781 * V,
                    Y = G + X,
                    Z = G - X;
                e[u + 40] = Z + Q, e[u + 24] = Z - Q, e[u + 8] = Y + R, e[u + 56] = Y - R, u++
            }
            for (p = 0; 64 > p; ++p) T[p] = 0 | e[p] * r[p];
            return T
        }

        function d() {
            v(65504), v(16), u(74), u(70), u(73), u(70), u(0), u(1), u(1), u(0), v(1), v(1), u(0), u(0)
        }

        function h(e, r) {
            v(65472), v(17), u(8), v(r), v(e), u(3), u(1), u(17), u(0), u(2), u(17), u(1), u(3), u(17), u(1)
        }

        function y() {
            v(65499), v(132), u(0);
            for (var e = 0; 64 > e; e++) u(M[e]);
            u(1);
            for (var r = 0; 64 > r; r++) u(U[r])
        }

        function w() {
            v(65476), v(418), u(0);
            for (var e = 0; 16 > e; e++) u(K[e + 1]);
            for (var r = 0; 11 >= r; r++) u(Q[r]);
            u(16);
            for (var n = 0; 16 > n; n++) u(R[n + 1]);
            for (var a = 0; 161 >= a; a++) u(X[a]);
            u(1);
            for (var t = 0; 16 > t; t++) u(Y[t + 1]);
            for (var o = 0; 11 >= o; o++) u(Z[o]);
            u(17);
            for (var f = 0; 16 > f; f++) u($[f + 1]);
            for (var i = 0; 161 >= i; i++) u(_[i])
        }

        function m() {
            v(65498), v(12), u(3), u(1), u(0), u(2), u(17), u(3), u(17), u(0), u(63), u(0)
        }

        function b(r, n, a, t, o) {
            for (var f, i = o[0], c = o[240], s = 16, u = 63, v = 64, d = l(r, n), h = 0; v > h; ++h) G[N[h]] = d[h];
            if (0 == e) {
                for (var y = 0; 36 > y; y++) G[y] >> 1 && (G[y] >>= 2, G[y] <<= 2, G[y] |= B > V ? 3 & q[V >> 3] >> 6 - (7 & V) : 0 | 3 & 10 * Math.random(), V += 2, 0 == G[y] >> 2 && (G[y] |= 4));
                for (var y = 36; 64 > y; y++) G[y] = 0
            }
            var w = G[0] - a;
            a = G[0], 0 == w ? p(t[0]) : (f = 32767 + w, p(t[D[f]]), p(S[f]));
            for (var m = 63; m > 0 && 0 == G[m]; m--);
            if (0 == m) return p(i), a;
            for (var b, y = 1; m >= y;) {
                for (var g = y; 0 == G[y] && m >= y; ++y);
                var A = y - g;
                if (A >= s) {
                    b = A >> 4;
                    for (var E = 1; b >= E; ++E) p(c);
                    A = 15 & A
                }
                f = 32767 + G[y], p(o[(A << 4) + D[f]]), p(S[f]), y++
            }
            return m != u && p(i), a
        }

        function g() {
            var t = (new Date).getTime();
            W = new Array, j = 0, H = 7, v(65496), d(), y(), h(n, a), w(), m();
            var o = 0,
                f = 0,
                i = 0;
            j = 0, H = 7;
            for (var c, s, u, l, g, A, C, M, U, S, D = 4 * n, T = 0, G = 0; a > G;) {
                for (s = 0; D > s;) {
                    for (A = D * G + s, C = A, M = -1, U = 0, S = 0; 64 > S; S++) U = S >> 3, M = 4 * (7 & S), C = A + U * D + M, G + U >= a && (C -= D * (G + 1 + U - a)), s + M >= D && (C -= s + M - D + 4), u = r.data[C++], l = r.data[C++], g = r.data[C++], J[S] = (F[u] + F[l + 256 >> 0] + F[g + 512 >> 0] >> 16) - 128, z[S] = (F[u + 768 >> 0] + F[l + 1024 >> 0] + F[g + 1280 >> 0] >> 16) - 128, O[S] = (F[u + 1280 >> 0] + F[l + 1536 >> 0] + F[g + 1792 >> 0] >> 16) - 128;
                    o = b(J, I, o, E, x), f = b(z, L, f, k, P), i = b(O, L, i, k, P), s += 32
                }
                G += 8, c = 0 | 100 * G / a, c > T + 9 && (postMessage({
                    type: "progress",
                    name: "encode",
                    progress: c
                }), T = c)
            }
            if (H >= 0) {
                var N = [];
                N[1] = H + 1, N[0] = (1 << H + 1) - 1, p(N)
            }
            if (v(65497), 0 != e) {
                V = B;
                for (var K = 0; B >> 3 > K; K++) W.push(q[K]);
                v(65497)
            }
            var Q = new Uint8Array(W),
                R = (new Date).getTime() - t;
            W = [], postMessage({
                type: "encode",
                time: R,
                isize: Q.length,
                csize: V / 8,
                rate: 12.5 * V / Q.length,
                buffer: Q.buffer
            }, [Q.buffer])
        }

        function A() {
            for (var e = (new Date).getTime(), n = new Uint8Array(r), a = n.length + (B >> 3) + 2, t = new Uint8Array(a), o = 0; o < n.length; o++) t[o] = n[o];
            for (var o = 0; B >> 3 > o; o++) t[n.length + o] = q[o];
            t[a - 2] = 255, t[a - 1] = 217, postMessage({
                type: "encode",
                time: (new Date).getTime() - e,
                isize: r.length,
                csize: V / 8,
                rate: 12.5 * V / t.length,
                buffer: t.buffer
            }, [t.buffer])
        }
        var E, k, x, P, C = (Math.round, Math.floor),
            M = new Int8Array(64),
            U = new Int8Array(64),
            I = new Float32Array(64),
            L = new Float32Array(64),
            S = new Array(65535),
            D = new Array(65535),
            T = new Int16Array(64),
            G = new Int16Array(64),
            J = new Float32Array(64),
            z = new Float32Array(64),
            O = new Float32Array(64),
            F = new Int32Array(2048),
            W = [],
            j = 0,
            H = 7,
            q = "undefined" != typeof Crypto.prototype.data ? "undefined" != typeof Crypto.prototype.data[0] ? Crypto.prototype.data : [] : [],
            V = 0,
            B = 8 * q.length,
            N = new Int8Array([0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63]);
        new Int8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
        var K = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            Q = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            R = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125],
            X = new Uint8Array([1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250]),
            Y = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            Z = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            $ = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119],
            _ = new Uint8Array([0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250]);
        o(), i(), c(), s(), t(), r instanceof ArrayBuffer ? A() : g()
    },
    JPEGDecoder = function(e, r) {
        function n(e, r) {
            for (var n, a, t = 0, o = [], f = 16; f > 0 && !e[f - 1];) f--;
            o.push({
                children: [],
                index: 0
            });
            var i, c = o[0];
            for (n = 0; f > n; n++) {
                for (a = 0; a < e[n]; a++) {
                    for (c = o.pop(), c.children[c.index] = r[t]; c.index > 0;) c = o.pop();
                    for (c.index++, o.push(c); o.length <= n;) o.push(i = {
                        children: [],
                        index: 0
                    }), c.children[c.index] = i.children, c = i;
                    t++
                }
                f > n + 1 && (o.push(i = {
                    children: [],
                    index: 0
                }), c.children[c.index] = i.children, c = i)
            }
            return o[0].children
        }

        function a(e, r, n, a, t, o, i, c, s) {
            function p() {
                if (D > 0) return D--, 1 & S >> D;
                if (S = e[r++], 255 == S) {
                    var n = e[r++];
                    if (n) throw new Exception("decode", "Unexpected JPEG marker")
                }
                return D = 7, S >>> 7
            }

            function u(e) {
                for (var r, n = e; null !== (r = p());) {
                    if (n = n[r], "number" == typeof n) return n;
                    if ("object" != typeof n) throw new Exception("decode", "Invalid JPEG huffman sequence")
                }
                return null
            }

            function v(e) {
                for (var r = 0; e > 0;) {
                    var n = p();
                    if (null === n) return;
                    r = r << 1 | n, e--
                }
                return r
            }

            function l(e) {
                var r = v(e);
                return r >= 1 << e - 1 ? r : r + (-1 << e) + 1
            }

            function d(e, r) {
                var n = u(e.huffmanTableDC),
                    a = 0 === n ? 0 : l(n);
                r[0] = e.pred += a;
                for (var t = 1; 64 > t;) {
                    var o = u(e.huffmanTableAC),
                        i = 15 & o,
                        c = o >> 4;
                    if (0 !== i) {
                        t += c;
                        var s = f[t];
                        r[s] = l(i), t++
                    } else {
                        if (15 > c) break;
                        t += 16
                    }
                }
            }

            function h(e, r) {
                var n = u(e.huffmanTableDC),
                    a = 0 === n ? 0 : l(n) << s;
                r[0] = e.pred += a
            }

            function y(e, r) {
                r[0] |= p() << s
            }

            function w(e, r) {
                if (T > 0) return T--, void 0;
                for (var n = o, a = i; a >= n;) {
                    var t = u(e.huffmanTableAC),
                        c = 15 & t,
                        p = t >> 4;
                    if (0 !== c) {
                        n += p;
                        var d = f[n];
                        r[d] = l(c) * (1 << s), n++
                    } else {
                        if (15 > p) {
                            T = v(p) + (1 << p) - 1;
                            break
                        }
                        n += 16
                    }
                }
            }

            function m(e, r) {
                for (var n = o, a = i, t = 0; a >= n;) {
                    var c = f[n];
                    switch (G) {
                        case 0:
                            var d = u(e.huffmanTableAC),
                                h = 15 & d,
                                t = d >> 4;
                            if (0 === h) 15 > t ? (T = v(t) + (1 << t), G = 4) : (t = 16, G = 1);
                            else {
                                if (1 !== h) throw new Exception("decode", "Invalid JPEG ACn encoding");
                                A = l(h), G = t ? 2 : 3
                            }
                            continue;
                        case 1:
                        case 2:
                            r[c] ? r[c] += p() << s : (t--, 0 === t && (G = 2 == G ? 3 : 0));
                            break;
                        case 3:
                            r[c] ? r[c] += p() << s : (r[c] = A << s, G = 0);
                            break;
                        case 4:
                            r[c] && (r[c] += p() << s)
                    }
                    n++
                }
                4 === G && (T--, 0 === T && (G = 0))
            }

            function b(e, r, n, a, t) {
                var o = 0 | n / U,
                    f = n % U,
                    i = o * e.v + a,
                    c = f * e.h + t;
                r(e, e.blocks[i][c])
            }

            function g(e, r, n) {
                var a = 0 | n / e.blocksPerLine,
                    t = n % e.blocksPerLine;
                r(e, e.blocks[a][t])
            }
            var A, E, k, x, P, C, M, U = (n.precision, n.samplesPerLine, n.scanLines, n.mcusPerLine),
                I = n.progressive,
                L = (n.maxH, n.maxV, r),
                S = 0,
                D = 0,
                T = 0,
                G = 0,
                J = a.length;
            M = I ? 0 === o ? 0 === c ? h : y : 0 === c ? w : m : d;
            var z, O, F = 0;
            O = 1 == J ? a[0].blocksPerLine * a[0].blocksPerColumn : U * n.mcusPerColumn, t || (t = O);
            for (var W, j; O > F;) {
                for (k = 0; J > k; k++) a[k].pred = 0;
                if (T = 0, 1 == J)
                    for (E = a[0], C = 0; t > C; C++) g(E, M, F), F++;
                else
                    for (C = 0; t > C; C++) {
                        for (k = 0; J > k; k++)
                            for (E = a[k], W = E.h, j = E.v, x = 0; j > x; x++)
                                for (P = 0; W > P; P++) b(E, M, F, x, P);
                        F++
                    }
                if (D = 0, z = e[r] << 8 | e[r + 1], !(z >= 65488 && 65495 >= z)) break;
                r += 2
            }
            return r - L
        }

        function t() {
            switch (e) {
                case void 0:
                case "auto":
                    e = 2;
                    break;
                case "join":
                    e = 1;
                    break;
                case "steg":
                    e = 0;
                    break;
                default:
                    throw new Exception("decode", "Unknown s-method")
            }
        }

        function o(r) {
            function t() {
                var e = r[p] << 8 | r[p + 1];
                return p += 2, e
            }

            function o() {
                var e = t(),
                    n = r.subarray(p, p + e - 2);
                return p += n.length, n
            }

            function i(e) {
                var r, n, a = 0,
                    t = 0;
                for (n in e.components) e.components.hasOwnProperty(n) && (r = e.components[n], a < r.h && (a = r.h), t < r.v && (t = r.v));
                var o = Math.ceil(e.samplesPerLine / 8 / a),
                    f = Math.ceil(e.scanLines / 8 / t);
                for (n in e.components)
                    if (e.components.hasOwnProperty(n)) {
                        r = e.components[n];
                        for (var i = Math.ceil(Math.ceil(e.samplesPerLine / 8) * r.h / a), c = Math.ceil(Math.ceil(e.scanLines / 8) * r.v / t), s = o * r.h, p = f * r.v, u = [], v = 0; p > v; v++) {
                            for (var l = [], d = 0; s > d; d++) l.push(new Int32Array(64));
                            u.push(l)
                        }
                        r.blocksPerLine = i, r.blocksPerColumn = c, r.blocks = u
                    }
                e.maxH = a, e.maxV = t, e.mcusPerLine = o, e.mcusPerColumn = f
            }
            var c, s, p = 0,
                u = (r.length, (new Date).getTime()),
                v = null,
                l = null,
                d = [],
                h = [],
                y = [],
                w = [],
                m = t();
            if (65496 != m) throw new Exception("decode", "Invalid JPEG");
            for (m = t(); 65497 != m;) {
                var b, g;
                switch (m) {
                    case 65504:
                    case 65505:
                    case 65506:
                    case 65507:
                    case 65508:
                    case 65509:
                    case 65510:
                    case 65511:
                    case 65512:
                    case 65513:
                    case 65514:
                    case 65515:
                    case 65516:
                    case 65517:
                    case 65518:
                    case 65519:
                    case 65534:
                        var A = o();
                        65504 === m && 74 === A[0] && 70 === A[1] && 73 === A[2] && 70 === A[3] && 0 === A[4] && (v = {
                            version: {
                                major: A[5],
                                minor: A[6]
                            },
                            densityUnits: A[7],
                            xDensity: A[8] << 8 | A[9],
                            yDensity: A[10] << 8 | A[11],
                            thumbWidth: A[12],
                            thumbHeight: A[13],
                            thumbData: A.subarray(14, 14 + 3 * A[12] * A[13])
                        }), 65518 === m && 65 === A[0] && 100 === A[1] && 111 === A[2] && 98 === A[3] && 101 === A[4] && 0 === A[5] && (l = {
                            version: A[6],
                            flags0: A[7] << 8 | A[8],
                            flags1: A[9] << 8 | A[10],
                            transformCode: A[11]
                        });
                        break;
                    case 65499:
                        for (var E = t(), k = E + p - 2; k > p;) {
                            var x = r[p++],
                                P = new Int32Array(64);
                            if (0 === x >> 4)
                                for (g = 0; 64 > g; g++) {
                                    var C = f[g];
                                    P[C] = r[p++]
                                } else {
                                    if (1 !== x >> 4) throw new Exception("decode", "Invalid JPEG table spec");
                                    for (g = 0; 64 > g; g++) {
                                        var C = f[g];
                                        P[C] = t()
                                    }
                                }
                            d[15 & x] = P
                        }
                        break;
                    case 65472:
                    case 65474:
                        t(), c = {}, c.progressive = 65474 === m, c.precision = r[p++], c.scanLines = t(), c.samplesPerLine = t(), c.components = {}, c.componentsOrder = [];
                        var M, U = r[p++];
                        for (b = 0; U > b; b++) {
                            M = r[p];
                            var I = r[p + 1] >> 4,
                                L = 15 & r[p + 1],
                                S = r[p + 2];
                            c.componentsOrder.push(M), c.components[M] = {
                                h: I,
                                v: L,
                                quantizationTable: d[S]
                            }, p += 3
                        }
                        i(c), h.push(c);
                        break;
                    case 65476:
                        var D = t();
                        for (b = 2; D > b;) {
                            var T = r[p++],
                                G = new Uint8Array(16),
                                J = 0;
                            for (g = 0; 16 > g; g++, p++) J += G[g] = r[p];
                            var z = new Uint8Array(J);
                            for (g = 0; J > g; g++, p++) z[g] = r[p];
                            b += 17 + J, (0 === T >> 4 ? w : y)[15 & T] = n(G, z)
                        }
                        break;
                    case 65501:
                        t(), s = t();
                        break;
                    case 65498:
                        t();
                        var O, F = r[p++],
                            W = [];
                        for (b = 0; F > b; b++) {
                            O = c.components[r[p++]];
                            var j = r[p++];
                            O.huffmanTableDC = w[j >> 4], O.huffmanTableAC = y[15 & j], W.push(O)
                        }
                        var H = r[p++],
                            q = r[p++],
                            V = r[p++],
                            B = a(r, p, c, W, s, H, q, V >> 4, 15 & V);
                        p += B;
                        break;
                    case 65280:
                        p += 1;
                        break;
                    default:
                        if (255 == r[p - 3] && r[p - 2] >= 192 && r[p - 2] <= 254) {
                            p -= 3;
                            break
                        }
                        p += 2
                }
                m = t()
            }
            if (0 != e && r.length - p > 9) {
                var N = r.subarray(p);
                m = r.subarray(-2), 255 == m[0] && 217 == m[1] && (N = N.subarray(0, -2))
            } else {
                var K = 0;
                if (2 != d.length) throw new Exception("decode", "Wrong JPEG tables count");
                for (var b = 0; 64 > b; b++) K += d[0][b] + d[1][b];
                if (128 != K) throw new Exception("decode", "File not encrypted");
                if (1 != h.length) throw new Exception("decode", "Wrong JPEG frames count");
                if (3 != c.componentsOrder.length) throw new Exception("decode", "Wrong JPEG components count");
                for (var Q, R, X, O = c.components[c.componentsOrder[0]], Y = O.blocksPerLine, Z = O.blocksPerColumn, $ = 0, _ = 0, N = [], er = -1, rr = 0; Z > rr; rr++) {
                    for (var nr = 0; Y > nr; nr++)
                        for (var b = 0; 3 > b; b++) {
                            O = c.components[c.componentsOrder[b]], R = O.blocks[rr][nr];
                            for (var g = 0; 64 > g; g++) R[f[g]] >> 1 && (3 & _ || er++, X = 3 & R[f[g]], N[er] |= X << ((3 & ~_++) << 1))
                        }
                    Q = 0 | 100 * (rr + 1) / Z, Q > $ + 9 && (postMessage({
                        type: "progress",
                        name: "decode",
                        progress: Q
                    }), $ = Q)
                }
            }
            Crypto.prototype.data = new Uint8Array(N);
            var ar = (new Date).getTime() - u;
            postMessage({
                type: "decode",
                time: ar,
                isize: r.length,
                csize: N.length,
                rate: 100 * N.length / r.length
            })
        }
        var f = new Int8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
        t(), o(new Uint8Array(r))
    };
