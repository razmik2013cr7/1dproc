import * as A from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createClient } from "@supabase/supabase-js";

const c = { jsx, jsxs, Fragment };
const g0 = createClient;

const Dt = [
  { name: "amber", grad: "nb-amber", base: "#f59e0b" },
  { name: "blue", grad: "nb-blue", base: "#3b82f6" },
  { name: "violet", grad: "nb-violet", base: "#8b5cf6" },
  { name: "green", grad: "nb-green", base: "#10b981" },
  { name: "rose", grad: "nb-rose", base: "#f43f5e" },
  { name: "cyan", grad: "nb-cyan", base: "#06b6d4" },
  { name: "orange", grad: "nb-orange", base: "#f97316" },
  { name: "teal", grad: "nb-teal", base: "#14b8a6" },
  { name: "indigo", grad: "nb-indigo", base: "#6366f1" },
  { name: "lime", grad: "nb-lime", base: "#84cc16" },
  { name: "fuchsia", grad: "nb-fuchsia", base: "#d946ef" },
  { name: "red", grad: "nb-red", base: "#ef4444" },
  { name: "pink", grad: "nb-pink", base: "#ec4899" },
  { name: "sky", grad: "nb-sky", base: "#0ea5e9" },
  { name: "emerald", grad: "nb-emerald", base: "#059669" },
  { name: "slate", grad: "nb-slate", base: "#64748b" },
];
function Hg(t) {
  const e = new Set((t || []).map((s) => Wg(s)).filter(Boolean)),
    r = Dt.filter((s) => !e.has(s.name)),
    n = r.length > 0 ? r : Dt;
  return n[Math.floor(Math.random() * n.length)];
}
function Ka(t, e) {
  const r = t && t.color ? Dt.find((i) => i.name === t.color) : null;
  if (r) return r;
  const n = t && t.color_grad ? Dt.find((i) => i.grad === t.color_grad) : null;
  if (n) return n;
  if (Number.isInteger(e) && e >= 0) return Dt[e % Dt.length];
  const s = String((t && t.name) || "?")
    .split("")
    .reduce((i, o) => (i * 31 + o.charCodeAt(0)) >>> 0, 7);
  return Dt[s % Dt.length];
}
function Tf(t, e) {
  return [...(t || [])]
    .sort((n, s) => String(n.name).localeCompare(String(s.name), "hy"))
    .findIndex((n) => n.id === (e && e.id));
}
function Wg(t) {
  if (!t) return null;
  if (t.color) return t.color;
  const e = t.color_grad ? Dt.find((r) => r.grad === t.color_grad) : null;
  return e ? e.name : null;
}
function Vg({ classes: t, onSelect: e, onEdit: r }) {
  return t.length === 0
    ? c.jsxs("div", {
        className: "empty",
        children: [
          c.jsx("p", { children: "Դեռ դասարաններ չկան։" }),
          c.jsx("p", {
            className: "empty-sub",
            children: "Օգտագործեք «+ Ստեղծել դասարան» կոճակը՝ ծածկագրով։",
          }),
        ],
      })
    : c.jsx("div", {
        className: "class-grid",
        children: t.map((n) => {
          const s = Ka(n, Tf(t, n));
          return c.jsxs(
            "div",
            {
              className: "nb-card-wrap",
              children: [
                c.jsxs("button", {
                  className: "class-card nb-card " + s.grad,
                  onClick: () => e(n.id),
                  children: [
                    c.jsx("span", {
                      className: "nb-tape",
                      "aria-hidden": "true",
                    }),
                    c.jsx("span", {
                      className: "nb-rings",
                      "aria-hidden": "true",
                      children: [0, 1, 2, 3].map((i) => c.jsx("i", {}, i)),
                    }),
                    c.jsxs("span", {
                      className: "nb-body",
                      children: [
                        c.jsx("span", {
                          className: "nb-name",
                          children: n.custom_name || n.name,
                        }),
                        n.custom_name &&
                          c.jsxs("span", {
                            className: "nb-code",
                            children: ["դասարան ", n.name],
                          }),
                        n.description &&
                          c.jsx("span", {
                            className: "nb-desc",
                            children: n.description,
                          }),
                        c.jsxs("span", {
                          className: "nb-count",
                          children: [n.projects.length, " նախագիծ"],
                        }),
                      ],
                    }),
                  ],
                }),
                c.jsx("button", {
                  type: "button",
                  className: "chip nb-edit",
                  title: "Խմբագրել",
                  onClick: () => (r == null ? void 0 : r(n.id)),
                  children: "✏️",
                }),
              ],
            },
            n.id,
          );
        }),
      });
}
const zi = "IM1dpRoc!!!",
  Kg = "RAF...1dp10",
  qg = {
    "10ա": "#space1",
    "10բ": "@10Bb2026",
    "10գ": "Smart22!",
    "10դ": "#Justitia10",
    "11ա": "@Lezuner11",
    "11բ": "#BnF11",
    "11գ": "2025Lg#",
    "11դ": "#Sus12",
    "12ա": "#Hovo2014",
    "12բ": "1D9N5T3",
    "12գ": "",
    "12դ": "Hovo2014!",
    "12ե": "1SchooL12#",
    "12զ": "#12Tntes",
  };
function Gg(t) {
  return (t && t.pin) || (t && qg[t.name]) || "" || zi;
}
function Jg() {
  return new Date().getDate() <= 5;
}
function Hi({ title: t, pin: e, onCancel: r, onSuccess: n }) {
  const [s, i] = A.useState(""),
    [o, a] = A.useState(""),
    l = typeof e == "string" ? e : Gg(e),
    u = (d) => {
      (d.preventDefault(),
        s === l || s === zi || s === Kg
          ? n()
          : (a("Սխալ ծածկագիր։ Փորձեք կրկին։"), i("")));
    };
  return c.jsx("div", {
    className: "modal-overlay",
    onClick: r,
    children: c.jsxs("div", {
      className: "modal",
      onClick: (d) => d.stopPropagation(),
      children: [
        c.jsx("h3", { className: "modal-title", children: t }),
        c.jsx("p", {
          className: "modal-sub",
          children: "Մուտքագրեք ծածկագիրը՝ շարունակելու համար։",
        }),
        c.jsxs("form", {
          onSubmit: u,
          children: [
            c.jsx("input", {
              type: "password",
              className: "input",
              value: s,
              placeholder: "Ծածկագիր",
              onChange: (d) => {
                (i(d.target.value), a(""));
              },
              autoFocus: !0,
            }),
            o && c.jsx("p", { className: "error", children: o }),
            c.jsxs("div", {
              className: "modal-actions",
              children: [
                c.jsx("button", {
                  type: "button",
                  className: "btn btn-ghost",
                  onClick: r,
                  children: "Չեղարկել",
                }),
                c.jsx("button", {
                  type: "submit",
                  className: "btn btn-primary",
                  children: "Հաստատել",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function Qg(t) {
  if (!t) return "";
  try {
    const e = new URL(t);
    if (e.hostname.includes("youtube.com") || e.hostname.includes("youtu.be")) {
      const r = e.hostname.includes("youtu.be")
        ? e.pathname.slice(1)
        : e.searchParams.get("v");
      return r ? `https://www.youtube.com/embed/${r}` : "";
    }
    if (e.hostname.includes("vimeo.com")) {
      const r = e.pathname.split("/").filter(Boolean)[0];
      return r ? `https://player.vimeo.com/video/${r}` : "";
    }
    return "";
  } catch {
    return "";
  }
}
function Yg(t) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(t);
}
function Xg({ project: t, onDelete: e, onEdit: r, busy: n }) {
  const [s, i] = A.useState(null),
    o = (t.photos || []).filter(Boolean),
    a = (t.videos || []).filter(Boolean),
    l = o[0] || null;
  return c.jsxs("article", {
    className: "project-card",
    children: [
      l &&
        c.jsx("img", {
          className: "project-cover",
          src: l,
          alt: t.title,
          loading: "lazy",
          onClick: () => i(o),
        }),
      c.jsx("h3", { className: "project-title", children: t.title }),
      t.description &&
        c.jsx("p", { className: "project-desc", children: t.description }),
      a.length > 0 &&
        c.jsx("div", {
          className: "video-embeds",
          children: a.map((u) => {
            const d = Qg(u);
            return d
              ? c.jsx(
                  "iframe",
                  {
                    src: d,
                    title: `Video: ${t.title}`,
                    allow:
                      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    allowFullScreen: !0,
                  },
                  u,
                )
              : Yg(u)
                ? c.jsx(
                    "video",
                    { src: u, controls: !0, preload: "metadata" },
                    u,
                  )
                : c.jsx(
                    "a",
                    {
                      href: u,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "project-link",
                      children: "▶ Դիտել տեսանյութը",
                    },
                    u,
                  );
          }),
        }),
      c.jsxs("div", {
        className: "project-footer",
        children: [
          o.length > 1 &&
            c.jsxs("button", {
              type: "button",
              className: "chip",
              onClick: () => i(o),
              children: ["📷 ", o.length, " լուսանկար"],
            }),
          a.length > 0 &&
            c.jsxs("span", {
              className: "chip",
              children: ["▶ ", a.length, " տեսանյութ"],
            }),
          t.link &&
            c.jsx("a", {
              className: "project-link",
              href: t.link,
              target: "_blank",
              rel: "noreferrer",
              children: "Բացել նախագիծը →",
            }),
          r &&
            c.jsx("button", {
              type: "button",
              className: "chip",
              onClick: r,
              disabled: n,
              children: "✏️ Խմբագրել",
            }),
          e &&
            c.jsx("button", {
              type: "button",
              className: "chip chip-danger",
              onClick: e,
              children: "🗑 Հեռացնել",
            }),
          s &&
            c.jsx("div", {
              className: "modal-overlay",
              onClick: () => i(null),
              children: c.jsxs("div", {
                className: "lightbox",
                onClick: (u) => u.stopPropagation(),
                children: [
                  c.jsx("button", {
                    type: "button",
                    className: "lightbox-close",
                    onClick: () => i(null),
                    children: "✕",
                  }),
                  s.map((u, d) =>
                    c.jsx("img", { src: u, alt: `${t.title} ${d + 1}` }, d),
                  ),
                ],
              }),
            }),
        ],
      }),
    ],
  });
}
function Zg({
  classItem: t,
  color: e,
  onBack: r,
  onAddProject: n,
  onDeleteProject: s,
  onRename: i,
  onEditProject: o,
  onPromote: a,
  busy: l,
}) {
  const [u, d] = A.useState(!1),
    [h, m] = A.useState(!1),
    [g, y] = A.useState(!1),
    [w, k] = A.useState(""),
    [f, p] = A.useState(null),
    [v, _] = A.useState(!1),
    [E, b] = A.useState(!1),
    [x, C] = A.useState(null),
    [U, H] = A.useState(null),
    [re, Ee] = A.useState(""),
    [xe, Te] = A.useState(""),
    [Ue, Be] = A.useState(""),
    [Fe, j] = A.useState([]),
    [B, F] = A.useState([]),
    [M, Q] = A.useState([]),
    [Pe, me] = A.useState({ bold: !1, italic: !1, underline: !1 }),
    ut = () => {
      (Ee(""),
        Te(""),
        Be(""),
        j([]),
        F([]),
        Q([]),
        C(null),
        H(null),
        me({ bold: !1, italic: !1, underline: !1 }));
    },
    Oe = async (L) => {
      L.preventDefault();
      const V = re.trim();
      if (!V) return;
      const Y = {
        title: V,
        description: xe.trim(),
        link: Ue.trim(),
        photos: Fe,
        videos: B.filter((tt) => tt.trim()),
      };
      (await n(t.id, Y), ut(), m(!1));
    },
    $ = (L) => {
      if ((L.preventDefault(), !x || !o)) return;
      const V = {
        title: re.trim() || U.title,
        description: xe.trim(),
        link: Ue.trim(),
        photos: Fe,
        videos: B.filter((Y) => Y.trim()),
      };
      (o(t.id, x, V), _(!1));
    };
  return c.jsxs("div", {
    className: "class-view",
    children: [
      c.jsxs("div", {
        className: "view-toolbar",
        children: [
          c.jsx("button", {
            className: "btn btn-ghost",
            onClick: r,
            children: "← Հետ դասարաններին",
          }),
          c.jsx("button", {
            className: "btn btn-primary",
            onClick: () => d(!0),
            children: "+ Ավելացնել",
          }),
        ],
      }),
      a &&
        c.jsx("div", {
          className: "promote-row",
          children: c.jsx("button", {
            className: "btn btn-outline",
            onClick: () => {
              (d(!0), b(!0));
            },
            children: "🎓 Տարբերակը հաջորդ մակարդակ",
          }),
        }),
      c.jsxs("h2", {
        className: "view-title",
        children: [
          c.jsx("span", {
            className: "nb-swatch",
            style: { background: e ? e.base : void 0 },
          }),
          t.custom_name || t.name,
        ],
      }),
      t.custom_name &&
        c.jsxs("p", { className: "view-code", children: ["դասարան ", t.name] }),
      t.description &&
        c.jsx("p", { className: "view-desc", children: t.description }),
      c.jsx("div", {
        className: "rename-row",
        children: c.jsx("button", {
          className: "btn btn-ghost btn-small",
          onClick: () => {
            (k(t.custom_name || ""), y(!0), d(!0));
          },
          children: "✏️ Անվանափոխել",
        }),
      }),
      t.projects.length === 0
        ? c.jsx("div", {
            className: "empty",
            children: c.jsx("p", {
              children: "Այս դասարանում դեռ նախագծեր չկան։",
            }),
          })
        : c.jsx("div", {
            className: "project-grid",
            children: t.projects.map((L) =>
              c.jsx(
                Xg,
                {
                  project: L,
                  onDelete: () => p(L.id),
                  onEdit: () => {
                    (C(L.id),
                      H(L),
                      Ee(L.title),
                      Te(L.description || ""),
                      Be(L.link || ""),
                      j(L.photos || []),
                      F(L.videos || []),
                      _(!0));
                  },
                  busy: l,
                },
                L.id,
              ),
            ),
          }),
      u &&
        c.jsx(Hi, {
          title: g
            ? `Անվանափոխել «${t.name}»`
            : E
              ? "Տարբերակը հաջորդ մակարդակ"
              : f
                ? `Հեռացնել նախագիծ «${t.name}»-ից`
                : `Նախագիծ ավելացնել «${t.name}»-ում`,
          pin: t,
          onCancel: () => {
            (d(!1), g && y(!1), E && b(!1));
          },
          onSuccess: () => {
            (d(!1),
              g
                ? (i(t.id, w.trim()), y(!1))
                : E && a
                  ? (a(t.id), b(!1))
                  : f
                    ? (s(t.id, f), p(null))
                    : m(!0));
          },
        }),
      g &&
        !u &&
        c.jsx("div", {
          className: "modal-overlay",
          onClick: () => y(!1),
          children: c.jsxs("div", {
            className: "modal",
            onClick: (L) => L.stopPropagation(),
            children: [
              c.jsx("h3", {
                className: "modal-title",
                children: "Անվանափոխել դասարանը",
              }),
              c.jsxs("p", {
                className: "modal-sub",
                children: [
                  "Դասարանի կոդը մնում է «",
                  t.name,
                  "» — փոխվում է միայն ցուցադրվող անունը։",
                ],
              }),
              c.jsxs("form", {
                onSubmit: (L) => {
                  (L.preventDefault(), i(t.id, w.trim()), y(!1));
                },
                children: [
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Դասարանի անուն",
                      c.jsx("input", {
                        type: "text",
                        className: "input",
                        value: w,
                        onChange: (L) => k(L.target.value),
                        placeholder: "օր.՝ Our Learning Space",
                        autoFocus: !0,
                      }),
                    ],
                  }),
                  c.jsxs("p", {
                    className: "field-hint",
                    children: [
                      "Դատարկ թողնելու դեպքում կցուցադրվի «",
                      t.name,
                      "»։",
                    ],
                  }),
                  c.jsxs("div", {
                    className: "modal-actions",
                    children: [
                      c.jsx("button", {
                        type: "button",
                        className: "btn btn-ghost",
                        onClick: () => y(!1),
                        children: "Չեղարկել",
                      }),
                      c.jsx("button", {
                        type: "submit",
                        className: "btn btn-primary",
                        disabled: l,
                        children: "Պահպանել",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      h &&
        c.jsx(yc, {
          dialogTitle: "Նախագիծ ավելացնել",
          documentTitle: re,
          onDocumentTitleChange: Ee,
          documentBody: xe,
          onDocumentBodyChange: Te,
          format: Pe,
          onFormatChange: me,
          linkValue: Ue,
          media: Fe,
          onRemoveMedia: (L) => j((V) => V.filter((Y, tt) => tt !== L)),
          videoCount: B.length,
          attachmentCount: M.length,
          canInsertVideo: !1,
          canInsertAttachment: !1,
          onInsertLink: (L) => {
            L.trim() && Be(L.trim());
          },
          onInsertMedia: (L) => {
            const V = new FileReader();
            ((V.onload = () => j((Y) => [...Y, V.result])), V.readAsDataURL(L));
          },
          onCancel: () => {
            (ut(), m(!1));
          },
          onSave: Oe,
          saveDisabled: l || !re.trim(),
          busy: l,
        }),
      v &&
        c.jsx(yc, {
          dialogTitle: "Նախագիծը խմբագրել",
          documentTitle: re,
          onDocumentTitleChange: Ee,
          documentBody: xe,
          onDocumentBodyChange: Te,
          format: Pe,
          onFormatChange: me,
          linkValue: Ue,
          media: Fe,
          onRemoveMedia: (L) => j((V) => V.filter((Y, tt) => tt !== L)),
          videoCount: B.length,
          attachmentCount: M.length,
          canInsertVideo: !0,
          canInsertAttachment: !0,
          onInsertLink: (L) => {
            L.trim() && Be(L.trim());
          },
          onInsertMedia: (L) => {
            const V = new FileReader();
            ((V.onload = () => j((Y) => [...Y, V.result])), V.readAsDataURL(L));
          },
          onInsertVideo: (L) => {
            const V = new FileReader();
            ((V.onload = () => F((Y) => [...Y, V.result])), V.readAsDataURL(L));
          },
          onInsertAttachment: (L) => {
            const V = [];
            for (const Y of L)
              V.push({
                id: `${Date.now()}-${Math.random()}`,
                name: Y.name,
                size: Y.size,
              });
            Q((Y) => [...Y, ...V]);
          },
          onRemoveAttachment: (L) => Q((V) => V.filter((Y) => Y.id !== L)),
          onCancel: () => {
            (ut(), _(!1));
          },
          onSave: $,
          saveDisabled: l || !re.trim(),
          busy: l,
        }),
    ],
  });
}
function yc({
  dialogTitle: t,
  documentTitle: e,
  onDocumentTitleChange: r,
  documentBody: n,
  onDocumentBodyChange: s,
  format: i,
  onFormatChange: o,
  linkValue: a,
  media: l,
  onRemoveMedia: u,
  videoCount: d,
  attachmentCount: h,
  canInsertVideo: m,
  canInsertAttachment: g,
  onInsertLink: y,
  onInsertMedia: w,
  onInsertVideo: k,
  onInsertAttachment: f,
  onRemoveAttachment: p,
  onCancel: v,
  onSave: _,
  saveDisabled: E,
  busy: b,
}) {
  const x = A.useRef(null),
    C = A.useRef(null),
    U = A.useRef(null),
    H = A.useRef(null),
    re = A.useRef(null),
    Ee = A.useRef(null),
    [xe, Te] = A.useState(!1),
    [Ue, Be] = A.useState(""),
    [Fe, j] = A.useState([]);
  (A.useEffect(() => {
    a && !xe && Be(a);
  }, [a]),
    A.useEffect(() => {
      var L;
      const $ = document.activeElement;
      $ &&
        $ !== x.current &&
        !((L = x.current) != null && L.contains($)) &&
        (re.current, Ee.current);
    }));
  const B = () => {
      var $;
      return ($ = C.current) == null ? void 0 : $.click();
    },
    F = () => {
      var $;
      return ($ = U.current) == null ? void 0 : $.click();
    },
    M = () => {
      var $;
      return ($ = H.current) == null ? void 0 : $.click();
    },
    Q = () => Te(!0),
    Pe = ($) => {
      var V;
      const L = (V = $.target.files) == null ? void 0 : V[0];
      L && (w(L), ($.target.value = ""));
    },
    me = ($) => {
      var V;
      const L = (V = $.target.files) == null ? void 0 : V[0];
      L && (k(L), ($.target.value = ""));
    },
    ut = ($) => {
      const L = Array.from($.target.files || []);
      (L.length && (f(L), j((V) => [...V, ...L.map((Y) => Y.name)])),
        ($.target.value = ""));
    },
    Oe = () => {
      Ue.trim() && (y(Ue.trim()), Be(""), Te(!1));
    };
  return (
    Fe.slice(-8).map(($, L) => ({ id: `attach-${L}`, name: $ })),
    c.jsxs("div", {
      className: "word-shell",
      onClick: ($) => {
        $.target === x.current && v();
      },
      children: [
        c.jsxs("div", {
          className: "word-app",
          ref: x,
          onClick: ($) => $.stopPropagation(),
          children: [
            c.jsxs("div", {
              className: "word-topbar",
              children: [
                c.jsxs("div", {
                  className: "word-menu",
                  children: [
                    c.jsx("button", {
                      className: "active",
                      children: "Փոխություն",
                    }),
                    c.jsx("button", { children: "Ներմուծել" }),
                    c.jsx("button", { children: "Գրառում" }),
                    c.jsx("button", { children: "Ա dyմանդամային" }),
                    c.jsx("span", { className: "word-menu-divider" }),
                    c.jsx("button", { children: "Տեսք" }),
                    c.jsx("button", { children: "Կապ" }),
                    c.jsx("button", { children: "Փռման" }),
                  ],
                }),
                c.jsxs("div", {
                  className: "word-global-actions",
                  children: [
                    c.jsx("button", {
                      className: "word-global-btn",
                      children: "Նկարագրություն",
                    }),
                    c.jsx("button", {
                      className: "word-global-btn primary",
                      children: "Ամպ",
                    }),
                  ],
                }),
              ],
            }),
            c.jsxs("div", {
              className: "word-ribbon-tabs",
              children: [
                c.jsx("button", {
                  className: "word-ribbon-tab active",
                  children: "Գլխավոր",
                }),
                c.jsx("button", {
                  className: "word-ribbon-tab",
                  children: "Ներմուծել",
                }),
                c.jsx("button", {
                  className: "word-ribbon-tab",
                  children: "Ա dyմանդամային",
                }),
                c.jsx("button", {
                  className: "word-ribbon-tab",
                  children: "Տեսք",
                }),
                c.jsx("button", {
                  className: "word-ribbon-tab",
                  children: "Հղում",
                }),
              ],
            }),
            c.jsxs("div", {
              className: "word-ribbon",
              children: [
                c.jsx("div", {
                  className: "word-ribbon-group",
                  children: c.jsxs("div", {
                    className: "word-ribbon-inner",
                    children: [
                      c.jsx("span", {
                        className: "word-ribbon-label",
                        children: "Փոփոխել",
                      }),
                      c.jsxs("div", {
                        className: "word-ribbon-row",
                        children: [
                          c.jsx("button", {
                            className: `word-btn icon${i.bold ? " active" : ""}`,
                            onClick: () => o(($) => ({ ...$, bold: !$.bold })),
                            title: "Bold",
                            children: "B",
                          }),
                          c.jsx("button", {
                            className: `word-btn icon${i.italic ? " active" : ""}`,
                            onClick: () =>
                              o(($) => ({ ...$, italic: !$.italic })),
                            title: "Italic",
                            children: "I",
                          }),
                          c.jsx("button", {
                            className: `word-btn icon${i.underline ? " active" : ""}`,
                            onClick: () =>
                              o(($) => ({ ...$, underline: !$.underline })),
                            title: "Underline",
                            children: "U",
                          }),
                          c.jsx("button", {
                            className: "word-btn icon",
                            onClick: () =>
                              o({ bold: !1, italic: !1, underline: !1 }),
                            title: "Ջնջել ձևաչափը",
                            children: "🧹",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                c.jsx("div", { className: "word-ribbon-separator" }),
                c.jsx("div", {
                  className: "word-ribbon-group",
                  children: c.jsxs("div", {
                    className: "word-ribbon-inner",
                    children: [
                      c.jsx("span", {
                        className: "word-ribbon-label",
                        children: "Ներմուծել",
                      }),
                      c.jsxs("div", {
                        className: "word-ribbon-row",
                        children: [
                          c.jsx("button", {
                            className: "word-btn icon",
                            onClick: Q,
                            title: "Հղում",
                            children: "🔗",
                          }),
                          c.jsx("button", {
                            className: "word-btn icon",
                            onClick: B,
                            title: "Նկար",
                            children: "🖼",
                          }),
                          m &&
                            c.jsx("button", {
                              className: "word-btn icon",
                              onClick: F,
                              title: "Տեսանյութ",
                              children: "▶",
                            }),
                          g &&
                            c.jsx("button", {
                              className: "word-btn icon",
                              onClick: M,
                              title: "Ֆայլ",
                              children: "📎",
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
                c.jsx("div", { className: "word-ribbon-separator" }),
                c.jsx("div", {
                  className: "word-ribbon-group",
                  children: c.jsxs("div", {
                    className: "word-ribbon-inner",
                    children: [
                      c.jsx("span", {
                        className: "word-ribbon-label",
                        children: "Տեքստ",
                      }),
                      c.jsxs("div", {
                        className: "word-ribbon-row",
                        children: [
                          c.jsxs("div", {
                            className: "word-btn-group",
                            children: [
                              c.jsx("button", {
                                className: "word-btn",
                                children: "Հիմնական",
                              }),
                              c.jsx("button", {
                                className: "word-btn",
                                children: "Համառոտ",
                              }),
                            ],
                          }),
                          c.jsx("div", {
                            className: "word-field",
                            children: c.jsxs("select", {
                              "aria-label": "Մակարդակ",
                              children: [
                                c.jsx("option", { value: "1", children: "1" }),
                                c.jsx("option", { value: "2", children: "2" }),
                                c.jsx("option", { value: "3", children: "3" }),
                                c.jsx("option", { value: "4", children: "4" }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
            c.jsxs("div", {
              className: "word-document",
              children: [
                c.jsxs("div", {
                  className: "word-canvas",
                  children: [
                    c.jsx("input", {
                      ref: re,
                      className: "word-document-title",
                      value: e,
                      onChange: ($) => r($.target.value),
                      placeholder: "Նախագիծի անունը...",
                      "aria-label": "Վերնագիր",
                    }),
                    c.jsx("textarea", {
                      ref: Ee,
                      className: `word-document-body${i.bold ? " bold" : ""}${i.italic ? " italic" : ""}${i.underline ? " underline" : ""}`,
                      value: n,
                      onChange: ($) => s($.target.value),
                      placeholder:
                        "Նկարագրությունը գրելու համար սեղմել B, I, U, կամ ջնջել ձևաչափը գործիքական մեջ...",
                      "aria-label": "Նկարագրություն",
                    }),
                  ],
                }),
                c.jsxs("div", {
                  className: "word-document-toolbar",
                  children: [
                    c.jsxs("span", {
                      className: "word-document-status",
                      children: [
                        e ? `"${e}"` : "Անվանական նախագիծ",
                        " · Փոփոխություններ: ",
                        " ",
                        l.length + d + h,
                      ],
                    }),
                    c.jsxs("div", {
                      className: "word-document-actions",
                      children: [
                        c.jsx("button", {
                          className: "word-global-btn",
                          onClick: v,
                          children: "Չեղարկել",
                        }),
                        c.jsx("button", {
                          className: "word-global-btn primary",
                          disabled: E || b,
                          onClick: ($) => {
                            ($.preventDefault(), _($));
                          },
                          children: b ? "Կատարվում է…" : "Պահպանել",
                        }),
                      ],
                    }),
                  ],
                }),
                a &&
                  c.jsx("div", {
                    style: {
                      padding: "6px 12px",
                      borderTop: "1px solid var(--word-border)",
                      background: "#101218",
                    },
                    children: c.jsxs("span", {
                      className: "word-link-chip",
                      children: [
                        "🔗 ",
                        c.jsx("a", {
                          href: a,
                          target: "_blank",
                          rel: "noreferrer",
                          children: a,
                        }),
                        c.jsx("button", {
                          onClick: () => {
                            y("");
                          },
                          children: "✕",
                        }),
                      ],
                    }),
                  }),
                l.length > 0 &&
                  c.jsx("div", {
                    className: "word-media-list",
                    children: l.map(($, L) =>
                      c.jsxs(
                        "div",
                        {
                          className: "word-media-item",
                          children: [
                            c.jsx("img", { src: $, alt: "Նկար" }),
                            c.jsx("button", {
                              onClick: () => u(L),
                              children: "✕",
                            }),
                          ],
                        },
                        L,
                      ),
                    ),
                  }),
                d > 0 &&
                  c.jsx("div", {
                    style: {
                      padding: "6px 12px",
                      borderTop: "1px solid var(--word-border)",
                      background: "#101218",
                    },
                    children: c.jsxs("span", {
                      className: "word-media-chip",
                      children: ["▶ ", d, " տեսանյութ"],
                    }),
                  }),
                h > 0 &&
                  c.jsx("div", {
                    style: {
                      padding: "6px 12px",
                      borderTop: "1px solid var(--word-border)",
                      background: "#101218",
                    },
                    children: c.jsxs("span", {
                      className: "word-attach-chip",
                      children: ["📎 ", h, " ֆայլ"],
                    }),
                  }),
              ],
            }),
          ],
        }),
        c.jsx("input", {
          ref: C,
          type: "file",
          accept: "image/*",
          style: { display: "none" },
          onChange: Pe,
        }),
        m &&
          c.jsx("input", {
            ref: U,
            type: "file",
            accept: "video/*",
            style: { display: "none" },
            onChange: me,
          }),
        g &&
          c.jsx("input", {
            ref: H,
            type: "file",
            multiple: !0,
            style: { display: "none" },
            onChange: ut,
          }),
        xe &&
          c.jsx("div", {
            className: "word-dialog-backdrop",
            onClick: ($) => {
              $.target === $.currentTarget && Te(!1);
            },
            children: c.jsxs("div", {
              className: "word-dialog",
              onClick: ($) => $.stopPropagation(),
              children: [
                c.jsxs("div", {
                  className: "word-dialog-header",
                  children: [
                    c.jsx("span", { children: "Հղում ներմուծել" }),
                    c.jsx("button", {
                      className: "word-dialog-close",
                      onClick: () => Te(!1),
                      children: "✕",
                    }),
                  ],
                }),
                c.jsx("div", {
                  className: "word-dialog-body",
                  children: c.jsx("input", {
                    className: "word-dialog-input",
                    value: Ue,
                    onChange: ($) => Be($.target.value),
                    placeholder: "https://example.com",
                    autoFocus: !0,
                  }),
                }),
                c.jsxs("div", {
                  className: "word-dialog-footer",
                  children: [
                    c.jsx("button", {
                      className: "word-global-btn",
                      onClick: () => Te(!1),
                      children: "Չեղարկել",
                    }),
                    c.jsx("button", {
                      className: "word-global-btn primary",
                      onClick: Oe,
                      disabled: !Ue.trim(),
                      children: "Ներմուծել",
                    }),
                  ],
                }),
              ],
            }),
          }),
      ],
    })
  );
}
function ev({
  section: t,
  items: e,
  onBack: r,
  onAdd: n,
  onRemove: s,
  onEdit: i,
  busy: o,
}) {
  const [a, l] = A.useState(!1),
    [u, d] = A.useState(!1),
    [h, m] = A.useState(!1),
    [g, y] = A.useState(null),
    [w, k] = A.useState(""),
    [f, p] = A.useState(""),
    [v, _] = A.useState(""),
    E = () => {
      (k(""), p(""), _(""));
    },
    b = async (C) => {
      C.preventDefault();
      const U = w.trim();
      U && (await n({ title: U, body: f.trim(), photo: v }), E(), d(!1));
    },
    x = async (C) => {
      C.preventDefault();
      const U = w.trim();
      !U ||
        !g ||
        (await i(g.id, { title: U, body: f.trim(), photo: v }),
        y(null),
        k(""),
        p(""),
        _(""));
    };
  return c.jsxs("div", {
    className: "section-view",
    children: [
      c.jsxs("div", {
        className: "view-toolbar",
        children: [
          c.jsx("button", {
            className: "btn btn-ghost",
            onClick: r,
            children: "← Հետ",
          }),
          c.jsx("button", {
            className: "btn btn-primary",
            onClick: () => l(!0),
            children: "+ Ավելացնել",
          }),
        ],
      }),
      c.jsx("h2", { className: "view-title", children: t.title }),
      t.subtitle &&
        c.jsx("p", { className: "view-desc", children: t.subtitle }),
      e.length === 0
        ? c.jsxs("div", {
            className: "empty",
            children: [
              c.jsx("p", { children: "Դեռ տվյալներ չկան։" }),
              c.jsx("p", {
                className: "empty-sub",
                children: "Օգտագործեք «+ Ավելացնել» կոճակը՝ ծածկագրով։",
              }),
            ],
          })
        : c.jsx("div", {
            className: "hero-grid",
            children: e.map((C) =>
              c.jsxs(
                "article",
                {
                  className: "hero-card",
                  children: [
                    C.photo
                      ? c.jsx("img", {
                          src: C.photo,
                          alt: C.title,
                          loading: "lazy",
                        })
                      : c.jsx("div", {
                          className: "hero-card-fallback " + t.grad,
                          children: c.jsx("span", { children: t.emoji }),
                        }),
                    c.jsxs("div", {
                      className: "hero-card-body",
                      children: [
                        c.jsx("h3", { children: C.title }),
                        C.body && c.jsx("p", { children: C.body }),
                      ],
                    }),
                    c.jsxs("div", {
                      className: "hero-actions",
                      children: [
                        i &&
                          c.jsx("button", {
                            type: "button",
                            className: "chip hero-edit",
                            onClick: () => {
                              (y(C), l(!0));
                            },
                            disabled: o,
                            children: "✏️ Խմբագրել",
                          }),
                        s &&
                          c.jsx("button", {
                            type: "button",
                            className: "chip chip-danger",
                            onClick: () => {
                              (y(C), l(!0));
                            },
                            disabled: o,
                            children: "🗑 Հեռացնել",
                          }),
                      ],
                    }),
                  ],
                },
                C.id,
              ),
            ),
          }),
      a &&
        c.jsx(Hi, {
          title: g ? `Խմբագրել — ${t.title}` : `Ավելացնել — ${t.title}`,
          pin: g || t,
          onCancel: () => {
            (l(!1), y(null));
          },
          onSuccess: () => {
            (l(!1),
              g
                ? (m(!0), k(g.title), p(g.body || ""), _(g.photo || ""))
                : d(!0),
              y(null));
          },
        }),
      h &&
        c.jsx(wc, {
          dialogTitle: `Խմբագրել — ${t.title}`,
          documentTitle: w,
          onDocumentTitleChange: k,
          documentBody: f,
          onDocumentBodyChange: p,
          media: v ? [{ kind: "image", src: v }] : [],
          onRemoveMedia: () => _(""),
          canInsertPhoto: !0,
          onInsertMedia: (C) => {
            const U = new FileReader();
            ((U.onload = () => _(U.result)), U.readAsDataURL(C));
          },
          onCancel: () => m(!1),
          onSave: x,
          saveDisabled: o || !w.trim(),
          busy: o,
        }),
      u &&
        c.jsx(wc, {
          dialogTitle: `Նոր գրառում — ${t.title}`,
          documentTitle: w,
          onDocumentTitleChange: k,
          documentBody: f,
          onDocumentBodyChange: p,
          media: v ? [{ kind: "image", src: v }] : [],
          onRemoveMedia: () => _(""),
          canInsertPhoto: !0,
          onInsertMedia: (C) => {
            const U = new FileReader();
            ((U.onload = () => _(U.result)), U.readAsDataURL(C));
          },
          onCancel: () => {
            (E(), d(!1));
          },
          onSave: b,
          saveDisabled: o || !w.trim(),
          busy: o,
        }),
    ],
  });
}
function wc({
  dialogTitle: t,
  documentTitle: e,
  onDocumentTitleChange: r,
  documentBody: n,
  onDocumentBodyChange: s,
  media: i,
  onRemoveMedia: o,
  canInsertPhoto: a,
  onInsertMedia: l,
  onCancel: u,
  onSave: d,
  saveDisabled: h,
  busy: m,
}) {
  const g = A.useRef(null),
    y = A.useRef(null),
    w = A.useRef(null);
  A.useRef(null);
  const [k, f] = A.useState({ bold: !1, italic: !1, underline: !1 }),
    p = () => {
      var _;
      return (_ = y.current) == null ? void 0 : _.click();
    },
    v = (_) => {
      var b;
      const E = (b = _.target.files) == null ? void 0 : b[0];
      E && (l(E), (_.target.value = ""));
    };
  return c.jsxs("div", {
    className: "word-shell compact",
    onClick: (_) => {
      _.target === g.current && u();
    },
    children: [
      c.jsxs("div", {
        className: "word-app",
        ref: g,
        onClick: (_) => _.stopPropagation(),
        children: [
          c.jsxs("div", {
            className: "word-topbar",
            children: [
              c.jsxs("div", {
                className: "word-menu",
                children: [
                  c.jsx("button", {
                    className: "active",
                    children: "Փոխություն",
                  }),
                  c.jsx("button", { children: "Ներմուծել" }),
                  c.jsx("button", { children: "Գրառում" }),
                  c.jsx("span", { className: "word-menu-divider" }),
                  c.jsx("button", { children: "Տեսք" }),
                ],
              }),
              c.jsx("div", {
                className: "word-global-actions",
                children: c.jsx("button", {
                  className: "word-global-btn primary",
                  children: t.startsWith("Նոր") ? "Ավելացնել" : "Խմբագրել",
                }),
              }),
            ],
          }),
          c.jsxs("div", {
            className: "word-ribbon-tabs",
            children: [
              c.jsx("button", {
                className: "word-ribbon-tab active",
                children: "Գլխավոր",
              }),
              c.jsx("button", {
                className: "word-ribbon-tab",
                children: "Ներմուծել",
              }),
              c.jsx("button", {
                className: "word-ribbon-tab",
                children: "Տեսք",
              }),
            ],
          }),
          c.jsxs("div", {
            className: "word-ribbon",
            children: [
              c.jsx("div", {
                className: "word-ribbon-group",
                children: c.jsxs("div", {
                  className: "word-ribbon-inner",
                  children: [
                    c.jsx("span", {
                      className: "word-ribbon-label",
                      children: "Փոփոխել",
                    }),
                    c.jsxs("div", {
                      className: "word-ribbon-row",
                      children: [
                        c.jsx("button", {
                          className: `word-btn icon${k.bold ? " active" : ""}`,
                          onClick: () => f((_) => ({ ..._, bold: !_.bold })),
                          title: "Bold",
                          children: "B",
                        }),
                        c.jsx("button", {
                          className: `word-btn icon${k.italic ? " active" : ""}`,
                          onClick: () =>
                            f((_) => ({ ..._, italic: !_.italic })),
                          title: "Italic",
                          children: "I",
                        }),
                        c.jsx("button", {
                          className: `word-btn icon${k.underline ? " active" : ""}`,
                          onClick: () =>
                            f((_) => ({ ..._, underline: !_.underline })),
                          title: "Underline",
                          children: "U",
                        }),
                        c.jsx("button", {
                          className: "word-btn icon",
                          onClick: () =>
                            f({ bold: !1, italic: !1, underline: !1 }),
                          title: "Ջնջել ձևաչափը",
                          children: "🧹",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              c.jsx("div", { className: "word-ribbon-separator" }),
              c.jsx("div", {
                className: "word-ribbon-group",
                children: c.jsxs("div", {
                  className: "word-ribbon-inner",
                  children: [
                    c.jsx("span", {
                      className: "word-ribbon-label",
                      children: "Ներմուծել",
                    }),
                    c.jsx("div", {
                      className: "word-ribbon-row",
                      children:
                        a &&
                        c.jsx("button", {
                          className: "word-btn icon",
                          onClick: p,
                          title: "Նկար",
                          children: "🖼",
                        }),
                    }),
                  ],
                }),
              }),
              c.jsx("div", { className: "word-ribbon-separator" }),
              c.jsx("div", {
                className: "word-ribbon-group",
                children: c.jsxs("div", {
                  className: "word-ribbon-inner",
                  children: [
                    c.jsx("span", {
                      className: "word-ribbon-label",
                      children: "Տեքստ",
                    }),
                    c.jsx("div", {
                      className: "word-ribbon-row",
                      children: c.jsxs("div", {
                        className: "word-btn-group",
                        children: [
                          c.jsx("button", {
                            className: "word-btn",
                            children: "Հիմնական",
                          }),
                          c.jsx("button", {
                            className: "word-btn",
                            children: "Համառոտ",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
          c.jsxs("div", {
            className: "word-document",
            children: [
              c.jsxs("div", {
                className: "word-canvas",
                children: [
                  c.jsx("input", {
                    ref: w,
                    className: "word-document-title",
                    value: e,
                    onChange: (_) => r(_.target.value),
                    placeholder: "Վերնագիր...",
                    "aria-label": "Վերնագիր",
                  }),
                  c.jsx("textarea", {
                    className: `word-document-body${k.bold ? " bold" : ""}${k.italic ? " italic" : ""}${k.underline ? " underline" : ""}`,
                    value: n,
                    onChange: (_) => s(_.target.value),
                    placeholder:
                      "Նկարագրությունը գրելու համար սեղմել B, I, U, կամ ջնջել ձևաչափը գործիքական մեջ...",
                    "aria-label": "Նկարագրություն",
                  }),
                ],
              }),
              c.jsxs("div", {
                className: "word-document-toolbar",
                children: [
                  c.jsxs("span", {
                    className: "word-document-status",
                    children: [
                      e ? `"${e}"` : "Անվանական գրառում",
                      " · Փոփոխություններ: ",
                      " ",
                      i.length,
                    ],
                  }),
                  c.jsxs("div", {
                    className: "word-document-actions",
                    children: [
                      c.jsx("button", {
                        className: "word-global-btn",
                        onClick: u,
                        children: "Չեղարկել",
                      }),
                      c.jsx("button", {
                        className: "word-global-btn primary",
                        disabled: h || m,
                        onClick: (_) => {
                          (_.preventDefault(), d(_));
                        },
                        children: m
                          ? "Կատարվում է…"
                          : t.startsWith("Նոր")
                            ? "Ավելացնել"
                            : "Պահպանել",
                      }),
                    ],
                  }),
                ],
              }),
              i.length > 0 &&
                c.jsx("div", {
                  className: "word-media-list",
                  children: i.map((_, E) =>
                    c.jsxs(
                      "div",
                      {
                        className: "word-media-item",
                        children: [
                          _.kind === "image" &&
                            c.jsx("img", { src: _.src, alt: "Նկար" }),
                          _.kind !== "image" &&
                            c.jsx("div", {
                              className: "word-empty-icon",
                              children: "📄",
                            }),
                          c.jsx("button", {
                            onClick: () => o(E),
                            children: "✕",
                          }),
                        ],
                      },
                      E,
                    ),
                  ),
                }),
            ],
          }),
        ],
      }),
      c.jsx("input", {
        ref: y,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: v,
      }),
    ],
  });
}
function _c({
  mode: t,
  onCancel: e,
  onSaveStudent: r,
  onSaveProject: n,
  existingStudent: s,
  existingProject: i,
  classes: o,
}) {
  const [a, l] = A.useState(
      (s == null ? void 0 : s.year) || (i == null ? void 0 : i.year) || "",
    ),
    [u, d] = A.useState((s == null ? void 0 : s.name) || ""),
    [h, m] = A.useState((s == null ? void 0 : s.photo) || ""),
    [g, y] = A.useState((i == null ? void 0 : i.projectId) || ""),
    w = (p) => {
      var E;
      const v = (E = p.target.files) == null ? void 0 : E[0];
      if (!v) return;
      const _ = new FileReader();
      ((_.onload = () => m(_.result)), _.readAsDataURL(v));
    },
    k = (p) => {
      (p.preventDefault(),
        !(!u.trim() || !a.trim()) && r(u.trim(), h, a.trim()));
    },
    f = (p) => {
      (p.preventDefault(), !(!g || !a.trim()) && n(g, a.trim()));
    };
  return c.jsx("div", {
    className: "modal-overlay",
    onClick: e,
    children: c.jsxs("div", {
      className: "modal",
      onClick: (p) => p.stopPropagation(),
      children: [
        t === "student" &&
          c.jsxs(c.Fragment, {
            children: [
              c.jsx("h3", {
                className: "modal-title",
                children: "Տարվա ամենալավ սովորող",
              }),
              c.jsx("p", {
                className: "modal-sub",
                children: "Ընտրեք տարվա ամենալավ սովորողը։",
              }),
              c.jsxs("form", {
                onSubmit: k,
                children: [
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Տարին",
                      c.jsx("input", {
                        type: "number",
                        className: "input",
                        value: a,
                        onChange: (p) => l(p.target.value),
                        placeholder: "օր.՝ 2026",
                        min: "2000",
                        max: "2099",
                        autoFocus: !0,
                        required: !0,
                      }),
                    ],
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Սովորողի անուն",
                      c.jsx("input", {
                        type: "text",
                        className: "input",
                        value: u,
                        onChange: (p) => d(p.target.value),
                        placeholder: "Անուն Հռմչակի",
                        required: !0,
                      }),
                    ],
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Փոքրիկ նկար",
                      c.jsx("input", {
                        type: "file",
                        accept: "image/*",
                        className: "input",
                        onChange: w,
                      }),
                    ],
                  }),
                  h &&
                    c.jsxs("div", {
                      className: "award-photo-preview",
                      children: [
                        c.jsx("img", { src: h, alt: "Նախնական" }),
                        c.jsx("button", {
                          type: "button",
                          className: "chip chip-danger",
                          onClick: () => m(""),
                          children: "✕ Հեռացնել",
                        }),
                      ],
                    }),
                  c.jsxs("div", {
                    className: "modal-actions",
                    children: [
                      c.jsx("button", {
                        type: "button",
                        className: "btn btn-ghost",
                        onClick: e,
                        children: "Չեղարկել",
                      }),
                      c.jsx("button", {
                        type: "submit",
                        className: "btn btn-primary",
                        children: "Պահպանել",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        t === "project" &&
          c.jsxs(c.Fragment, {
            children: [
              c.jsx("h3", {
                className: "modal-title",
                children: "Տարվա ամենալավ նախագիծ",
              }),
              c.jsx("p", {
                className: "modal-sub",
                children: "Ընտրեք տարվա ամենալավ նախագիծը։",
              }),
              c.jsxs("form", {
                onSubmit: f,
                children: [
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Տարին",
                      c.jsx("input", {
                        type: "number",
                        className: "input",
                        value: a,
                        onChange: (p) => l(p.target.value),
                        placeholder: "օր.՝ 2026",
                        min: "2000",
                        max: "2099",
                        autoFocus: !0,
                        required: !0,
                      }),
                    ],
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Նախագիծը",
                      c.jsxs("select", {
                        className: "input",
                        value: g,
                        onChange: (p) => y(p.target.value),
                        required: !0,
                        children: [
                          c.jsx("option", {
                            value: "",
                            disabled: !0,
                            children: "Ընտրեք նախագիծը…",
                          }),
                          o.map((p) =>
                            p.projects.map((v) =>
                              c.jsxs(
                                "option",
                                {
                                  value: v.id,
                                  children: ["[", p.name, "] ", v.title],
                                },
                                v.id,
                              ),
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  c.jsxs("div", {
                    className: "modal-actions",
                    children: [
                      c.jsx("button", {
                        type: "button",
                        className: "btn btn-ghost",
                        onClick: e,
                        children: "Չեղարկել",
                      }),
                      c.jsx("button", {
                        type: "submit",
                        className: "btn btn-primary",
                        children: "Պահպանել",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
      ],
    }),
  });
}
function tv({
  dialogTitle: t,
  grade: e,
  letter: r,
  customName: n,
  description: s,
  onGradeChange: i,
  onLetterChange: o,
  onCustomNameChange: a,
  onDescriptionChange: l,
  onCancel: u,
  onSave: d,
  saveDisabled: h,
  busy: m,
}) {
  const g = A.useRef(null),
    [y, w] = A.useState({ bold: !1, italic: !1, underline: !1 }),
    k = `${e}${r}`;
  return c.jsx("div", {
    className: "word-shell compact",
    onClick: (f) => {
      f.target === g.current && u();
    },
    children: c.jsxs("div", {
      className: "word-app",
      ref: g,
      onClick: (f) => f.stopPropagation(),
      children: [
        c.jsxs("div", {
          className: "word-topbar",
          children: [
            c.jsxs("div", {
              className: "word-menu",
              children: [
                c.jsx("button", {
                  className: "active",
                  children: "Փոխություն",
                }),
                c.jsx("button", { children: "Ներմուծել" }),
                c.jsx("button", { children: "Գրառում" }),
                c.jsx("span", { className: "word-menu-divider" }),
                c.jsx("button", { children: "Տեսք" }),
              ],
            }),
            c.jsx("div", {
              className: "word-global-actions",
              children: c.jsx("button", {
                className: "word-global-btn primary",
                children: t.startsWith("Նոր") ? "Ստեղծել" : "Պահպանել",
              }),
            }),
          ],
        }),
        c.jsxs("div", {
          className: "word-ribbon-tabs",
          children: [
            c.jsx("button", {
              className: "word-ribbon-tab active",
              children: "Գլխավոր",
            }),
            c.jsx("button", {
              className: "word-ribbon-tab",
              children: "Ներմուծել",
            }),
            c.jsx("button", { className: "word-ribbon-tab", children: "Տեսք" }),
          ],
        }),
        c.jsxs("div", {
          className: "word-ribbon",
          children: [
            c.jsx("div", {
              className: "word-ribbon-group",
              children: c.jsxs("div", {
                className: "word-ribbon-inner",
                children: [
                  c.jsx("span", {
                    className: "word-ribbon-label",
                    children: "Փոփոխել",
                  }),
                  c.jsxs("div", {
                    className: "word-ribbon-row",
                    children: [
                      c.jsx("button", {
                        className: `word-btn icon${y.bold ? " active" : ""}`,
                        onClick: () => w((f) => ({ ...f, bold: !f.bold })),
                        children: "B",
                      }),
                      c.jsx("button", {
                        className: `word-btn icon${y.italic ? " active" : ""}`,
                        onClick: () => w((f) => ({ ...f, italic: !f.italic })),
                        children: "I",
                      }),
                      c.jsx("button", {
                        className: `word-btn icon${y.underline ? " active" : ""}`,
                        onClick: () =>
                          w((f) => ({ ...f, underline: !f.underline })),
                        children: "U",
                      }),
                      c.jsx("button", {
                        className: "word-btn icon",
                        onClick: () =>
                          w({ bold: !1, italic: !1, underline: !1 }),
                        children: "🧹",
                      }),
                    ],
                  }),
                ],
              }),
            }),
            c.jsx("div", { className: "word-ribbon-separator" }),
            c.jsx("div", {
              className: "word-ribbon-group",
              children: c.jsxs("div", {
                className: "word-ribbon-inner",
                children: [
                  c.jsx("span", {
                    className: "word-ribbon-label",
                    children: "Տվյալներ",
                  }),
                  c.jsxs("div", {
                    className: "word-ribbon-row",
                    children: [
                      c.jsx("div", {
                        className: "word-field",
                        children: c.jsx("select", {
                          value: e,
                          onChange: (f) => i(f.target.value),
                          "aria-label": "Դասարան",
                          children: [
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                          ].map((f) =>
                            c.jsx("option", { value: f, children: f }, f),
                          ),
                        }),
                      }),
                      c.jsx("div", {
                        className: "word-field",
                        children: c.jsx("select", {
                          value: r,
                          onChange: (f) => o(f.target.value),
                          "aria-label": "Տառ",
                          children: ["ա", "բ", "գ", "դ", "ե", "զ"].map((f) =>
                            c.jsx("option", { value: f, children: f }, f),
                          ),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        c.jsxs("div", {
          className: "word-document",
          children: [
            c.jsxs("div", {
              className: "word-canvas",
              children: [
                c.jsx("input", {
                  className: "word-document-title",
                  value: n || k,
                  onChange: (f) => a(f.target.value),
                  placeholder: "Դասարանի անունը...",
                  "aria-label": "Վերնագիր",
                }),
                c.jsx("textarea", {
                  className: `word-document-body${y.bold ? " bold" : ""}${y.italic ? " italic" : ""}${y.underline ? " underline" : ""}`,
                  value: s,
                  onChange: (f) => l(f.target.value),
                  placeholder:
                    "Նկարագրությունը գրելու համար սեղմել B, I, U, կամ ջնջել ձևաչափը գործիքական մեջ...",
                  "aria-label": "Նկարագրություն",
                }),
              ],
            }),
            c.jsxs("div", {
              className: "word-document-toolbar",
              children: [
                c.jsxs("span", {
                  className: "word-document-status",
                  children: [
                    "Կոդը՝ ",
                    k,
                    " · Փոփոխություններ: ",
                    n || s ? "1" : "0",
                  ],
                }),
                c.jsxs("div", {
                  className: "word-document-actions",
                  children: [
                    c.jsx("button", {
                      className: "word-global-btn",
                      onClick: u,
                      children: "Չեղարկել",
                    }),
                    c.jsx("button", {
                      className: "word-global-btn primary",
                      disabled: h || m,
                      onClick: (f) => {
                        (f.preventDefault(), d(f));
                      },
                      children: m ? "Կատարվում է…" : "Պահպանել",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
const y0 = "https://nrvvexysitfnamxfxnsf.supabase.co",
  w0 =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnZleHlzaXRmbmFteGZ4bnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDg2MDYsImV4cCI6MjEwNTMyNDYwNn0._vskJQpTDtG3oCbz_rn50YJp0d9bW7KdQz2iOw0qDeM",
  ue = g0(y0, w0),
  _o = "project-media",
  bs =
    "https://nrvvexysitfnamxfxnsf.supabase.co/storage/v1/object/public/project-media/";
function eu(t) {
  return {
    id: String(t.id),
    title: t.title,
    description: t.description || "",
    link: t.link || "",
    photos: Array.isArray(t.photos) ? t.photos : [],
    videos: Array.isArray(t.videos) ? t.videos : [],
  };
}
function tu(t, e = []) {
  return {
    id: String(t.id),
    name: t.name,
    description: t.description || "",
    color: t.color || "",
    pin: t.pin || "",
    custom_name: t.custom_name || "",
    projects: e.filter((r) => String(r.class_id) === String(t.id)).map(eu),
  };
}
function ru(t) {
  return {
    id: String(t.id),
    title: t.title,
    body: t.body || "",
    photo: t.photo || "",
  };
}
const nu = (t) => typeof t == "string" && t.startsWith("data:");
function su(t) {
  return t === "image/png"
    ? "png"
    : t === "image/webp"
      ? "webp"
      : t === "image/gif"
        ? "gif"
        : "jpg";
}
async function _0(t, e) {
  const r = await (await fetch(e)).blob(),
    n = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${su(r.type)}`,
    s = `${t}/${n}`,
    { error: i } = await ue.storage
      .from(_o)
      .upload(s, r, { contentType: r.type || "image/jpeg", upsert: !1 });
  if (i) throw i;
  return bs + s;
}
async function k0() {
  const [{ data: t, error: e }, { data: r, error: n }] = await Promise.all([
    ue.from("classes").select("*").order("created_at"),
    ue.from("projects").select("*").order("created_at"),
  ]);
  if (e) throw e;
  if (n) throw n;
  return t.map((s) => tu(s, r));
}
async function S0(t) {
  const { data: e, error: r } = await ue
    .from("section_items")
    .select("*")
    .eq("section", t)
    .order("created_at");
  if (r) throw r;
  return e.map(ru);
}
async function b0(t) {
  const e = await Promise.all(t.map(async (r) => [r, await S0(r)]));
  return Object.fromEntries(e);
}
async function dd(t, e, r, n, s) {
  const { data: i, error: o } = await ue
    .from("classes")
    .insert([
      {
        name: t,
        description: e || "",
        color: r || "",
        pin: n || "",
        custom_name: s || "",
      },
    ])
    .select()
    .single();
  if (o) throw o;
  return tu(i);
}
async function E0(t) {
  await ue.from("projects").delete().eq("class_id", t);
  const { error: e } = await ue.from("classes").delete().eq("id", t);
  if (e) throw e;
}
async function x0(t, e) {
  const { error: r } = await ue
    .from("classes")
    .update({ color: e })
    .eq("id", t);
  if (r) throw r;
}
async function T0(t, e) {
  const { error: r } = await ue
    .from("classes")
    .update({ custom_name: e })
    .eq("id", t);
  if (r) throw r;
}
async function ep(t, e) {
  const r = [];
  for (const i of e.photos || [])
    nu(i) ? r.push(await _0(t, i)) : i && !i.startsWith("blob:") && r.push(i);
  const { data: n, error: s } = await ue
    .from("projects")
    .insert([
      {
        class_id: t,
        title: e.title,
        description: e.description || "",
        link: e.link || "",
        photos: r,
        videos: e.videos || [],
      },
    ])
    .select()
    .single();
  if (s) throw s;
  return eu(n);
}
async function C0(t, e) {
  const { data: r, error: n } = await ue
    .from("projects")
    .update({
      title: e.title,
      description: e.description || "",
      link: e.link || "",
      photos: e.photos || [],
      videos: e.videos || [],
    })
    .eq("id", t)
    .select()
    .single();
  if (n) throw n;
  return eu(r);
}
async function j0(t) {
  try {
    const { data: r } = await ue
        .from("projects")
        .select("photos")
        .eq("id", t)
        .single(),
      n = ((r == null ? void 0 : r.photos) || [])
        .filter((s) => typeof s == "string" && s.startsWith(bs))
        .map((s) => s.slice(bs.length));
    n.length > 0 && (await ue.storage.from(_o).remove(n));
  } catch {}
  const { error: e } = await ue.from("projects").delete().eq("id", t);
  if (e) throw e;
}
async function R0(t, e) {
  let r = "";
  if (e.photo)
    if (nu(e.photo)) {
      const i = await (await fetch(e.photo)).blob(),
        a = `sections/${`sec-${t}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${su(i.type)}`}`,
        { error: l } = await ue.storage
          .from(_o)
          .upload(a, i, { contentType: i.type || "image/jpeg", upsert: !1 });
      if (l) throw l;
      r = bs + a;
    } else e.photo.startsWith("blob:") || (r = e.photo);
  const { data: n, error: s } = await ue
    .from("section_items")
    .insert([{ section: t, title: e.title, body: e.body || "", photo: r }])
    .select()
    .single();
  if (s) throw s;
  return ru(n);
}
async function N0(t) {
  const { error: e } = await ue.from("section_items").delete().eq("id", t);
  if (e) throw e;
}
async function A0(t, e) {
  let r = e.photo || "";
  if (r && nu(r)) {
    const i = await (await fetch(r)).blob(),
      a = `sections/${`sec-edit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${su(i.type)}`}`,
      { error: l } = await ue.storage
        .from(_o)
        .upload(a, i, { contentType: i.type || "image/jpeg", upsert: !1 });
    if (l) throw l;
    r = bs + a;
  }
  const { data: n, error: s } = await ue
    .from("section_items")
    .update({ title: e.title, body: e.body || "", photo: r })
    .eq("id", t)
    .select()
    .single();
  if (s) throw s;
  return ru(n);
}
async function P0(t, e) {
  const r = {};
  (e.name !== void 0 && (r.name = e.name),
    e.description !== void 0 && (r.description = e.description),
    e.custom_name !== void 0 && (r.custom_name = e.custom_name));
  const { data: n, error: s } = await ue
    .from("classes")
    .update(r)
    .eq("id", t)
    .select()
    .single();
  if (s) throw s;
  return tu(n);
}
const Zo = [
    { key: "history", title: "Պատմություն", emoji: "📜", grad: "g-orange" },
    { key: "staff", title: "Անձնակազմ", emoji: "👥", grad: "g-orange" },
    {
      key: "administration",
      title: "Տնօրենություն",
      emoji: "🏛️",
      grad: "g-orange",
    },
    { key: "classes", title: "Դասարաններ", emoji: "📘", grad: "g-orange" },
    { key: "jobs", title: "Աշխատատեղեր", emoji: "💼", grad: "g-orange" },
    {
      key: "best-student",
      title: "Տարվա ամենալավ սովորող",
      emoji: "🏆",
      grad: "g-orange",
    },
    {
      key: "best-project",
      title: "Տարվա ամենալավ նախագիծ",
      emoji: "🥇",
      grad: "g-orange",
    },
  ],
  I0 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  $0 = ["ա", "բ", "գ", "դ", "ե", "զ"],
  tp = "imtivmek:best-student:v1",
  rp = "imtivmek:best-project:v1";
function L0() {
  try {
    const t = localStorage.getItem(tp);
    return t ? JSON.parse(t) : { name: "", photo: "", year: "" };
  } catch {
    return { name: "", photo: "", year: "" };
  }
}
function D0(t) {
  try {
    localStorage.setItem(tp, JSON.stringify(t));
  } catch {}
}
function U0() {
  try {
    const t = localStorage.getItem(rp);
    return t ? JSON.parse(t) : { projectId: "", year: "" };
  } catch {
    return { projectId: "", year: "" };
  }
}
function B0(t) {
  try {
    localStorage.setItem(rp, JSON.stringify(t));
  } catch {}
}
function F0() {
  const [t, e] = A.useState([]),
    [r, n] = A.useState({}),
    [s, i] = A.useState({ view: "home" }),
    [o, a] = A.useState(null),
    [l, u] = A.useState(!1),
    [d, h] = A.useState("10"),
    [m, g] = A.useState("ա"),
    [y, w] = A.useState(""),
    [k, f] = A.useState(""),
    [p, v] = A.useState(""),
    [_, E] = A.useState(null),
    [b, x] = A.useState(!1),
    [C, U] = A.useState("10"),
    [H, re] = A.useState("ա"),
    [Ee, xe] = A.useState(""),
    [Te, Ue] = A.useState(""),
    [Be, Fe] = A.useState(!1),
    [j, B] = A.useState(!1),
    [F, M] = A.useState(!1),
    [Q, Pe] = A.useState(""),
    [me, ut] = A.useState(L0),
    [Oe, $] = A.useState(U0),
    [L, V] = A.useState(null),
    Y = t.find((S) => S.id === s.id) || null,
    tt = (S) => e(S),
    xn = (S) => n(S);
  A.useEffect(() => {
    let S = !1;
    return (
      (async () => {
        try {
          const N = await k0();
          if (S) return;
          S || (e(N), B(!0), np(N, () => S));
          try {
            const z = await b0(
              Zo.filter((W) => W.key !== "classes").map((W) => W.key),
            );
            S || n((W) => ({ ...W, ...z }));
          } catch {}
        } catch {
          S || B(!1);
        }
      })(),
      () => {
        S = !0;
      }
    );
  }, []);
  const np = async (S, N) => {
      const O = S.filter((W) => !W.color);
      if (O.length === 0) return;
      const z = [...S].sort((W, K) =>
        String(W.name).localeCompare(String(K.name), "hy"),
      );
      for (const W of O) {
        if (N()) return;
        const K = z.findIndex((kt) => kt.id === W.id),
          we = Ka(W, K);
        try {
          (await x0(W.id, we.name),
            e((kt) =>
              kt.map((qt) => (qt.id === W.id ? { ...qt, color: we.name } : qt)),
            ));
        } catch {}
      }
    },
    sp = async (S) => {
      S.preventDefault();
      const N = `${d}${m}`;
      if (t.some((K) => K.name === N)) {
        alert("Այս դասարանն արդեն կա։");
        return;
      }
      const O = Hg(t),
        z = k.trim(),
        W = p.trim();
      M(!0);
      try {
        const K = await dd(N, y.trim(), O.name, z, W);
        (e((we) => [...we, K]), u(!1), w(""), f(""), v(""));
      } catch (K) {
        if (String(K == null ? void 0 : K.code) === "23505")
          alert("Այս դասարանն արդեն կա։");
        else if (
          String(K == null ? void 0 : K.code) === "42703" ||
          String((K == null ? void 0 : K.message) || "").includes("column")
        )
          try {
            const we = await dd(N, y.trim(), "", "", "");
            (e((kt) => [...kt, we]),
              u(!1),
              w(""),
              f(""),
              v(""),
              Pe("Ամպում չկան color/pin սյուները — թարմացրեք SQL-ը։"));
          } catch (we) {
            alert(
              "Չհաջողվեց ստեղծել դասարանը: " +
                ((we == null ? void 0 : we.message) || ""),
            );
          }
        else
          alert(
            "Չհաջողվեց ստեղծել դասարանը: " +
              ((K == null ? void 0 : K.message) || ""),
          );
      } finally {
        M(!1);
      }
    },
    iu = async (S) => {
      M(!0);
      try {
        (await E0(S),
          e((N) => N.filter((O) => O.id !== S)),
          s.id === S && i({ view: "classes" }));
      } catch (N) {
        alert(
          "Չհաջողվեց հեռացնել դասարանը: " +
            ((N == null ? void 0 : N.message) || ""),
        );
      } finally {
        M(!1);
      }
    },
    ip = async (S, N) => {
      M(!0);
      try {
        const O = await ep(S, N);
        Ns(S, (z) => [...z, O]);
      } catch (O) {
        alert(
          "Չհաջողվեց ավելացնել նախագիծը: " +
            ((O == null ? void 0 : O.message) || ""),
        );
      } finally {
        M(!1);
      }
    },
    op = async (S, N) => {
      M(!0);
      try {
        (await j0(N), Ns(S, (O) => O.filter((z) => z.id !== N)));
      } catch (O) {
        alert(
          "Չհաջողվեց հեռացնել նախագծը: " +
            ((O == null ? void 0 : O.message) || ""),
        );
      } finally {
        M(!1);
      }
    },
    ap = (S) => {
      S.preventDefault();
      const N = `${C}${H}`;
      if (t.some((O) => O.name === N && O.id !== _)) {
        alert("«" + N + "» կոդով դասարան արդեն կա։");
        return;
      }
      (ou(_, { name: N, custom_name: Ee.trim(), description: Te.trim() }),
        Fe(!1));
    },
    lp = async (S, N) => {
      const O = () =>
        tt((z) => z.map((W) => (W.id === S ? { ...W, custom_name: N } : W)));
      M(!0);
      try {
        (await T0(S, N), O());
      } catch {
        O();
      } finally {
        M(!1);
      }
    };
  function Ns(S, N) {
    e((O) =>
      O.map((z) => (z.id === S ? { ...z, projects: N(z.projects) } : z)),
    );
  }
  const up = async (S, N, O) => {
      const z = () =>
        Ns(S, (W) => W.map((K) => (K.id === N ? { ...K, ...O } : K)));
      M(!0);
      try {
        const W = await C0(N, O);
        Ns(S, (K) => K.map((we) => (we.id === N ? W : we)));
      } catch {
        z();
      } finally {
        M(!1);
      }
    },
    cp = async (S, N, O) => {
      const z = () =>
        xn((W) => ({
          ...W,
          [S]: (W[S] || []).map((K) => (K.id === N ? { ...K, ...O } : K)),
        }));
      M(!0);
      try {
        const W = await A0(N, O);
        xn((K) => ({
          ...K,
          [S]: (K[S] || []).map((we) => (we.id === N ? W : we)),
        }));
      } catch {
        z();
      } finally {
        M(!1);
      }
    },
    ou = async (S, N) => {
      const O = () =>
        tt((z) => z.map((W) => (W.id === S ? { ...W, ...N } : W)));
      M(!0);
      try {
        const z = await P0(S, N);
        e((W) => W.map((K) => (K.id === S ? z : K)));
      } catch {
        O();
      } finally {
        M(!1);
      }
    },
    dp = (S) => {
      const N = t.find((qt) => qt.id === S);
      if (!N) return;
      const z = (N.name || "").match(/^(\d+)(.*)$/);
      if (!z) return;
      const W = parseInt(z[1]),
        K = z[2];
      if (W >= 12) {
        (iu(S), Pe(`${N.name} դասարանը վերջանում է հիշատակներում 📚`));
        return;
      }
      const kt = `${String(W + 1)}${K}`;
      if (t.some((qt) => qt.name === kt && qt.id !== S)) {
        alert(`«${kt}» դասարանը արդեն կա։`);
        return;
      }
      (ou(S, { name: kt }), Pe(`${N.name} → ${kt} դասարան մտնում է 🎓`));
    },
    hp = (S, N, O) => {
      (D0({ name: S, photo: N, year: O }),
        ut({ name: S, photo: N, year: O }),
        V(null));
    },
    fp = (S, N) => {
      (B0({ projectId: S, year: N }), $({ projectId: S, year: N }), V(null));
    },
    pp = r[s.key] || [],
    mp = async (S) => {
      M(!0);
      try {
        const N = await R0(s.key, S);
        (xn((O) => ({ ...O, [s.key]: [...(O[s.key] || []), N] })), M(!1));
        return;
      } catch {}
      M(!1);
    },
    gp = async (S) => {
      M(!0);
      try {
        await N0(S);
      } catch {}
      M(!1);
      xn((N) => ({
        ...N,
        [s.key]: (N[s.key] || []).filter((O) => O.id !== S),
      }));
    },
    au = Zo.find((S) => S.key === s.key) || null,
    As = Y ? Ka(Y, Tf(t, Y)) : null;
  function lu({ emoji: S, title: N, subtitle: O, onEdit: z }) {
    return c.jsxs("div", {
      className: "award-card",
      children: [
        c.jsx("span", { className: "award-emoji", children: S }),
        c.jsx("h4", { className: "award-title", children: N }),
        c.jsx("p", { className: "award-subtitle", children: O }),
        c.jsx("button", {
          className: "btn btn-ghost btn-small",
          onClick: z,
          children: "Խմբագրել",
        }),
      ],
    });
  }
  return c.jsxs("div", {
    className: "app",
    children: [
      c.jsx("header", {
        className: "header",
        children: c.jsxs("div", {
          className: "container header-inner",
          children: [
            c.jsxs("button", {
              className: "brand",
              onClick: () => i({ view: "home" }),
              children: [
                c.jsx("span", { className: "brand-mark", children: "ԻՄ" }),
                c.jsx("span", {
                  className: "brand-title",
                  children: "ԻՄ ԹԻՎՄԵԿ",
                }),
              ],
            }),
            c.jsxs("div", {
              className: "header-badges",
              children: [
                c.jsx("span", {
                  className: "cloud-badge" + (j ? " online" : ""),
                  children: j ? "☁️ Ամպ" : "⚠ Տեղական",
                }),
                !Jg() &&
                  c.jsx("span", {
                    className: "lock-badge",
                    title:
                      "Փոփոխությունները թույլատրվում են միայն հնարավերջից մինչև 5-րդը",
                    children: "🔒 Փոփոխություններ պահանջվում է",
                  }),
              ],
            }),
          ],
        }),
      }),
      (Q || F) &&
        c.jsx("div", {
          className: "status-bar",
          role: "status",
          children: F ? "⏳ Բեռնում է…" : Q,
        }),
      c.jsxs("main", {
        className: "container main" + (As ? " class-tinted" : ""),
        style: As ? { "--nb": As.base } : void 0,
        children: [
          s.view === "home" &&
            c.jsxs(c.Fragment, {
              children: [
                c.jsxs("div", {
                  className: "page-head",
                  children: [
                    c.jsx("h2", {
                      className: "page-title",
                      children: "Բաժիններ",
                    }),
                    c.jsx("p", {
                      className: "page-sub",
                      children: "Ընտրեք բաժինը։",
                    }),
                  ],
                }),
                c.jsx("div", {
                  className: "menu-grid",
                  children: Zo.map((S) =>
                    c.jsxs(
                      "button",
                      {
                        className: "menu-card " + S.grad,
                        onClick: () =>
                          i(
                            S.key === "classes"
                              ? { view: "classes" }
                              : { view: "section", key: S.key },
                          ),
                        children: [
                          c.jsx("span", {
                            className: "menu-card-emoji",
                            children: S.emoji,
                          }),
                          c.jsx("span", {
                            className: "menu-card-title",
                            children: S.title,
                          }),
                        ],
                      },
                      S.key,
                    ),
                  ),
                }),
                c.jsxs("div", {
                  className: "awards-section",
                  children: [
                    c.jsx("h3", {
                      className: "awards-title",
                      children: "🏆 Տարվա հայտնիությունները",
                    }),
                    c.jsxs("div", {
                      className: "awards-grid",
                      children: [
                        c.jsx(lu, {
                          emoji: "🎓",
                          title: "Տարվա ամենալավ սովորող",
                          subtitle: me.name
                            ? `${me.name} — ${me.year}`
                            : "Տարվա սովորողը դեռ չեն ընտրվել",
                          onEdit: () => V("student"),
                        }),
                        c.jsx(lu, {
                          emoji: "🥇",
                          title: "Տարվա ամենալավ նախագիծ",
                          subtitle: Oe.projectId
                            ? `${Oe.year} թ.`
                            : "Տարվա նախագիծը դեռ չեն ընտրվել",
                          onEdit: () => V("project"),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          s.view === "classes" &&
            !Y &&
            c.jsxs(c.Fragment, {
              children: [
                c.jsxs("div", {
                  className: "page-head",
                  children: [
                    c.jsx("h2", {
                      className: "page-title",
                      children: "Դասարաններ",
                    }),
                    c.jsx("p", {
                      className: "page-sub",
                      children: "Ընտրեք դասարանը՝ տեսնելու դրա նախագծերը։",
                    }),
                  ],
                }),
                c.jsxs("div", {
                  className: "toolbar",
                  children: [
                    c.jsx("button", {
                      className: "btn btn-primary",
                      onClick: () => a("create"),
                      children: "+ Ստեղծել դասարան",
                    }),
                    t.length > 0 &&
                      c.jsxs("div", {
                        className: "remove-group",
                        children: [
                          c.jsxs("select", {
                            className: "input select",
                            defaultValue: "",
                            id: "remove-select",
                            children: [
                              c.jsx("option", {
                                value: "",
                                disabled: !0,
                                children: "Ընտրեք դասարանը…",
                              }),
                              t.map((S) =>
                                c.jsx(
                                  "option",
                                  { value: S.id, children: S.name },
                                  S.id,
                                ),
                              ),
                            ],
                          }),
                          c.jsx("button", {
                            className: "btn btn-danger",
                            onClick: () => {
                              const S =
                                document.getElementById("remove-select");
                              S &&
                                S.value &&
                                a({ type: "remove", id: S.value });
                            },
                            children: "− Հեռացնել",
                          }),
                        ],
                      }),
                  ],
                }),
                c.jsx(Vg, {
                  classes: t,
                  onSelect: (S) => i({ view: "classes", id: S }),
                  onEdit: (S) => {
                    (E(S), x(!0));
                  },
                }),
              ],
            }),
          s.view === "classes" &&
            Y &&
            c.jsx(Zg, {
              classItem: Y,
              color: As,
              onBack: () => i({ view: "classes" }),
              onAddProject: ip,
              onDeleteProject: op,
              onRename: lp,
              onEditProject: up,
              onPromote: dp,
              busy: F,
            }),
          s.view === "section" &&
            au &&
            c.jsx(ev, {
              section: au,
              items: pp,
              onBack: () => i({ view: "home" }),
              onAdd: mp,
              onRemove: gp,
              onEdit: cp,
              busy: F,
            }),
        ],
      }),
      c.jsx("footer", {
        className: "footer",
        children: c.jsx("div", {
          className: "container",
          children: c.jsx("span", { children: "ԻՄ ԹԻՎՄԵԿ" }),
        }),
      }),
      b &&
        c.jsx(Hi, {
          title: "Խմբագրել դասարանը",
          pin: zi,
          onCancel: () => x(!1),
          onSuccess: () => {
            const S = t.find((N) => N.id === _);
            if (S) {
              const O = (S.name || "").match(/^(\d+)(.*)$/);
              (U(O ? O[1] : "10"),
                re(O ? O[2] : "ա"),
                xe(S.custom_name || ""),
                Ue(S.description || ""));
            }
            (x(!1), Fe(!0));
          },
        }),
      Be &&
        _ &&
        c.jsx(tv, {
          dialogTitle: "Խմբագրել դասարանը",
          grade: C,
          letter: H,
          customName: Ee,
          description: Te,
          onGradeChange: (S) => U(S),
          onLetterChange: (S) => re(S),
          onCustomNameChange: (S) => xe(S),
          onDescriptionChange: (S) => Ue(S),
          onCancel: () => Fe(!1),
          onSave: ap,
          saveDisabled: F,
          busy: F,
        }),
      o &&
        c.jsx(Hi, {
          title: o === "create" ? "Ստեղծել դասարան" : "Հեռացնել դասարան",
          pin: zi,
          onCancel: () => a(null),
          onSuccess: () => {
            (o === "create" ? (w(""), f(""), v(""), u(!0)) : iu(o.id), a(null));
          },
        }),
      L === "student" &&
        c.jsx(_c, {
          mode: "student",
          onCancel: () => V(null),
          onSaveStudent: hp,
          existingStudent: me,
        }),
      L === "project" &&
        c.jsx(_c, {
          mode: "project",
          onCancel: () => V(null),
          onSaveProject: fp,
          existingProject: Oe,
          classes: t,
        }),
      l &&
        c.jsx("div", {
          className: "modal-overlay",
          onClick: () => u(!1),
          children: c.jsxs("div", {
            className: "modal",
            onClick: (S) => S.stopPropagation(),
            children: [
              c.jsx("h3", {
                className: "modal-title",
                children: "Նոր դասարան",
              }),
              c.jsxs("form", {
                onSubmit: sp,
                children: [
                  c.jsxs("div", {
                    className: "field-row",
                    children: [
                      c.jsxs("label", {
                        className: "field",
                        children: [
                          "Դասարան",
                          c.jsx("select", {
                            className: "input",
                            value: d,
                            onChange: (S) => h(S.target.value),
                            children: I0.map((S) =>
                              c.jsx("option", { value: S, children: S }, S),
                            ),
                          }),
                        ],
                      }),
                      c.jsxs("label", {
                        className: "field",
                        children: [
                          "Տառ",
                          c.jsx("select", {
                            className: "input",
                            value: m,
                            onChange: (S) => g(S.target.value),
                            children: $0.map((S) =>
                              c.jsx("option", { value: S, children: S }, S),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  c.jsxs("p", {
                    className: "name-preview",
                    children: [
                      "Դասարանը կկոչվի՝ ",
                      c.jsxs("strong", { children: [d, m] }),
                    ],
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Դասարանի ծածկագիր",
                      c.jsx("input", {
                        type: "text",
                        className: "input",
                        value: k,
                        onChange: (S) => f(S.target.value),
                        placeholder: "օր.՝ #space",
                      }),
                    ],
                  }),
                  c.jsx("p", {
                    className: "field-hint",
                    children:
                      "Այս ծածկագրով դասարանը կավելացնի իր նախագծերը։ Դատարկ թողնելու դեպքում կգործի գլխավոր ծածկագիրը։",
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Դասարանի անուն (ըստ ցանկության)",
                      c.jsx("input", {
                        type: "text",
                        className: "input",
                        value: p,
                        onChange: (S) => v(S.target.value),
                        placeholder: "օր.՝ Our Learning Space",
                      }),
                    ],
                  }),
                  c.jsxs("p", {
                    className: "field-hint",
                    children: [
                      "Եթե դատարկ թողնեք՝ կցուցադրվի պարզապես «",
                      d,
                      m,
                      "»։",
                    ],
                  }),
                  c.jsxs("label", {
                    className: "field",
                    children: [
                      "Նկարագրություն (ըստ ցանկության)",
                      c.jsx("input", {
                        type: "text",
                        className: "input",
                        value: y,
                        onChange: (S) => w(S.target.value),
                        placeholder: "օր.՝ Բնագիտության նախագծեր",
                      }),
                    ],
                  }),
                  c.jsxs("div", {
                    className: "modal-actions",
                    children: [
                      c.jsx("button", {
                        type: "button",
                        className: "btn btn-ghost",
                        onClick: () => u(!1),
                        children: "Չեղարկել",
                      }),
                      c.jsx("button", {
                        type: "submit",
                        className: "btn btn-primary",
                        disabled: F,
                        children: "Ստեղծել",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}

export default F0;
