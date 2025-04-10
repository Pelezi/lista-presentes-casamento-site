(() => {
    var e = {
        20: e => {
            e.exports = class {
                constructor(e = {}) {
                    this.options = e, this.el = this.create(), this.styles = this.createStyles()
                }
                create() {
                    const e = document.createElement("button");
                    return e.setAttribute("type", "submit"), e.className = "mercadopago-button", e.textContent = this.options.label || "Pagar", e.setAttribute("formmethod", "post"), e
                }
                createStyles() {
                    let e = `\n      .mercadopago-button {\n        padding: 0 ${24 / 14}em;\n        font-family: "Helvetica Neue", Arial, sans-serif;\n        font-size: 0.875em;\n        line-height: ${38 / 14};\n        background: #009ee3;\n        border-radius: ${4 / 14}em;\n        color: #fff;\n        cursor: pointer;\n        border: 0;\n      }\n    `;
                    "wallet" === this.options.type && (e += `\n        .mercadopago-button {\n          position: relative;\n          padding-left: ${68 / 14}em;          \n          padding-right: ${32 / 14}em;          \n          white-space: nowrap;\n          height: ${38 / 14}em;\n        }\n\n        .mercadopago-button::before {\n          background-image: url("http://static.mlstatic.com/org-img/mercadopago/wallet_mp_icon.svg");\n          background-size: ${34 / 14}em ${34 / 14}em;\n          width: ${34 / 14}em;\n          height: ${34 / 14}em;\n          position: absolute;\n          top: ${2 / 14}em;\n          left: ${2 / 14}em;\n          content: "";\n        }\n      `);
                    const t = document.createElement("style");
                    return t.setAttribute("type", "text/css"), t.innerHTML = e, t
                }
                render(e) {
                    const t = e.childNodes;
                    0 === e.childNodes.length ? e.appendChild(this.el) : e.insertBefore(this.el, t[t.length - 1].nextSibling), document.head.appendChild(this.styles)
                }
            }
        },
        79: (e, t, n) => {
            const s = n(498),
                r = "2147483647";
            e.exports = class {
                constructor({
                    id: e,
                    src: t,
                    styles: n,
                    options: s,
                    render: r = !0,
                    container: i,
                    showLoader: o = !0,
                    hidden: a = !1,
                    bodyOverflow: p = !0,
                    closeButton: d = !1
                }) {
                    this.id = e, this.src = t, this.options = s, this.hidden = a, this.closeButton = d, this.styles = n || {}, this.bodyOverflow = p, this.showLoader = o, this.spinner = this.showLoader && this.createSpinner(), this.wrapper = this.createWrapper(), this.el = null, this.container = i, this.attachStylesAndWrapper(), r && (this.el = this.create(), this.render(i))
                }
                createWrapper() {
                    const e = document.createElement("div");
                    return e.classList.add(`mp-${this.id}-wrapper`), this.showLoader && (e.innerHTML = '\n        <svg class="mp-spinner" viewBox="25 25 50 50" >\n          <circle class="mp-spinner-path" cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10" />\n        </svg>\n      '), e.setAttribute("style", this.styles.wrapper), e
                }
                create() {
                    const e = document.createElement("iframe");
                    return e.id = this.id, e.src = `${this.src}?${s.toUrl(this.options)}`, e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), this.styles.iframe && e.setAttribute("style", this.styles.iframe), e.frameBorder = "0", e.allowtransparency = "true", e.setAttribute("transition", "height 2s ease"), e
                }
                createSpinner() {
                    const e = document.createElement("style");
                    return e.setAttribute("type", "text/css"), e.innerHTML = "\n  @keyframes loading-rotate {\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n\n  @keyframes loading-dash {\n    0% {\n      stroke-dasharray: 1, 200;\n      stroke-dashoffset: 0;\n    }\n    50% {\n      stroke-dasharray: 100, 200;\n      stroke-dashoffset: -20px;\n    }\n    100% {\n      stroke-dasharray: 89, 200;\n      stroke-dashoffset: -124px;\n    }\n  }\n\n  @keyframes loading-fade-in {\n    from {\n      opacity: 0;\n    }\n    to {\n      opacity: 1;\n    }\n  }\n\n  .mp-spinner {\n    position: absolute;\n    top: 100px;\n    left: 50%;\n    font-size: 70px;\n    margin-left: -35px;\n    animation: loading-rotate 2.5s linear infinite;\n    transform-origin: center center;\n    width: 1em;\n    height: 1em;\n  }\n\n  .mp-spinner-path {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n    animation: loading-dash 1.5s ease-in-out infinite;\n    stroke-linecap: round;\n    stroke-width: 2px;\n    stroke: #009ee3;\n  }\n", e
                }
                attachStylesAndWrapper() {
                    this.spinner && document.head.appendChild(this.spinner), this.container.appendChild(this.wrapper)
                }
                render() {
                    return this.el || (this.el = this.create()), this.wrapper.appendChild(this.el), this.open(), this
                }
                onLoad(e) {
                    return "function" == typeof e && (this.el.onload = e), this
                }
                open() {
                    if (this.wrapper.style["z-index"] = r, this.wrapper.style.visibility = "visible", this.wrapper.style.width = "100%", this.wrapper.style.height = "100%", this.wrapper.style.opacity = this.hidden ? "0" : "1", this.hidden = !1, this.bodyOverflow && (document.body.style.overflow = "hidden"), this.closeButton && !this.wrapper.querySelector("span") && !this.wrapper.querySelector("style")) {
                        const e = document.createElement("style"),
                            t = document.createElement("span");
                        e.setAttribute("type", "text/css"), t.addEventListener("click", (() => window.postMessage({
                            type: "close"
                        }, "*"))), e.innerHTML = '\n.close-button {\n  position: absolute;\n  right: 15px;\n  top: 15px;\n  width: 20px;\n  height: 20px;\n  opacity: 0.6;\n}\n.close-button:hover {\n  opacity: 1;\n}\n.close-button:before, .close-button:after {\n  position: absolute;\n  left: 15px;\n  content: " ";\n  height: 20px;\n  width: 2px;\n  background-color: #fff;\n}\n.close-button:before {\n  transform: rotate(45deg);\n}\n.close-button:after {\n  transform: rotate(-45deg);\n}\n', t.classList.add("close-button"), this.wrapper.appendChild(e), this.wrapper.appendChild(t)
                    }
                }
                slideUp() {
                    this.wrapper.style.opacity = 1, this.el.style.bottom = 0
                }
                remove(e) {
                    this.wrapper.style.opacity = "0", window.setTimeout((() => {
                        this.el.parentNode.removeChild(this.el), this.wrapper.style["z-index"] = `-${r}`, this.wrapper.style.visibility = "hidden", this.wrapper.style.width = "0", this.wrapper.style.height = "0", document.body.style.overflow = ""
                    }), 220), "function" == typeof e && e()
                }
                resize(e) {
                    const t = Math.min(e, .8 * document.documentElement.clientHeight);
                    this.el.style.maxHeight = `${t}px`, this.el.style.minHeight = `${t}px`
                }
            }
        },
        631: e => {
            e.exports = class {
                constructor({
                    name: e
                }) {
                    this.el = this.create(e)
                }
                create(e) {
                    const t = document.createElement("input");
                    return t.setAttribute("type", "hidden"), t.setAttribute("name", e), t
                }
                render(e) {
                    e.appendChild(this.el)
                }
                setValue(e) {
                    this.el.value = e
                }
            }
        },
        712: (e, t, n) => {
            const s = n(498),
                r = s.toCSS({
                    "z-index": "-2147483647",
                    display: "block",
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "0",
                    overflow: "hidden",
                    visibility: "hidden",
                    margin: "0",
                    padding: "0",
                    position: "fixed",
                    left: "0",
                    top: "0",
                    width: "0",
                    opacity: "0",
                    height: "0",
                    transition: "opacity 220ms ease-in"
                }),
                i = s.toCSS({
                    "z-index": "1",
                    display: "block",
                    position: "fixed",
                    left: "0",
                    top: "0"
                });
            e.exports = {
                wrapper: r,
                iframe: i
            }
        },
        498: e => {
            e.exports = {
                toUrl: e => Object.keys(e).map((t => `${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&"),
                toCSS: e => {
                    let t = "";
                    return void 0 !== e && "object" == typeof e && Object.keys(e).forEach((n => {
                        Object.prototype.hasOwnProperty.call(e, n) && (t += `${n}:${e[n]};`)
                    })), t
                }
            }
        },
        336: e => {
            e.exports = {
                bind: (e, t, n) => {
                    if (e) return e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent(`on${t}`, n)
                }
            }
        },
        65: e => {
            e.exports = document.currentScript || document.scripts[document.scripts.length - 1]
        },
        153: e => {
            const t = ["button-label", "open", "deeplink-prefix"];
            e.exports = e => {
                const n = {};
                return [].forEach.call(e.attributes, (e => {
                    const s = e.name.match(/^data-(.+)$/);
                    s && -1 === t.indexOf(s[1]) && (n[s[1]] = e.value)
                })), n
            }, e.exports.BLACKLIST_DATA = t
        }
    },
        t = {};

    function n(s) {
        var r = t[s];
        if (void 0 !== r) return r.exports;
        var i = t[s] = {
            exports: {}
        };
        return e[s](i, i.exports, n), i.exports
    } (() => {
        const e = n(65),
            t = n(153),
            s = n(336),
            r = n(20),
            i = n(79),
            o = n(631),
            a = n(712),
            p = e.parentNode && "form" === e.parentNode.tagName.toLowerCase(),
            d = e.parentNode,
            l = t(e);
        l["from-widget"] = !0;
        const c = new r({
            label: e.getAttribute("data-button-label"),
            type: e.getAttribute("data-button-type")
        }),
            h = new i({
                id: "mercadopago-checkout",
                src: "https://www.mercadopago.com.br/checkout/v1/modal/",
                options: l,
                render: "true" === e.getAttribute("data-open"),
                container: document.body,
                styles: a
            });
        s.bind(d, "submit", (e => ("function" == typeof e.preventDefault && e.preventDefault(), !1)));
        s.bind(c.el, "click", (() => {
            h.render()
        }));
        s.bind(window, "message", (e => {
            switch (e.data.type) {
                case "submit":
                    p && (e.data.value.forEach((e => {
                        const t = new o({
                            name: e.id
                        });
                        t.setValue(e.value), t.render(d)
                    })), d.submit()), h.remove();
                    break;
                case "close":
                    !p && e.data && e.data.value && Array.isArray(e.data.value) ? e.data.value.forEach((e => {
                        "back_url" === e.id ? window.location.href = e.value : h.remove()
                    })) : h.remove()
            }
        }));
        if (!"true" === e.getAttribute("data-open")) {
            c.render(d);
        }
    })()
})();