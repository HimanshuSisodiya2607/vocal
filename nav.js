/* =========================================================
   VOCALFLUXSTUDIO — SHARED NAVIGATION BAR
   Edit the menu here once; every page picks it up.
   Include on a page with:  <script src="nav.js"></script>
   (place it as the first thing inside <body>)
========================================================= */

(function () {

    const LINKS = [
        { label: "Services",     href: "services.html" },
        { label: "How It Works", href: "how-it-works.html" },
        { label: "Our Work",     href: "our-work.html" },
        { label: "Security",     href: "index.html#security" },
        { label: "About",        href: "about-contact.html" },
        { label: "Contact",      href: "about-contact.html#contact" }
    ];

    const LOGIN_HREF = "index.html#login";
    const QUOTE_HREF = "index.html?quote=1";

    const CSS = `
html{scroll-padding-top:84px}

.vf-header{
    position:sticky;
    top:0;
    left:0;
    width:100%;
    z-index:1000;
    background:rgba(5,5,7,.82);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(255,255,255,.07);
    font-family:Inter,Arial,Helvetica,sans-serif;
}

.vf-bar{
    width:min(1200px,92%);
    margin:auto;
    height:72px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:20px;
}

.vf-logo{
    display:flex;
    align-items:center;
    gap:11px;
    text-decoration:none;
    color:#fff;
    font-size:20px;
    font-weight:800;
    letter-spacing:-.7px;
    white-space:nowrap;
}

.vf-logo-mark{
    width:38px;
    height:38px;
    border-radius:11px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg,#a855f7,#5b21b6);
    box-shadow:0 0 28px rgba(139,92,246,.35);
}

.vf-logo-mark span{
    height:17px;
    display:flex;
    align-items:center;
    gap:2px;
}

.vf-logo-mark i{
    display:block;
    width:3px;
    border-radius:5px;
    background:#fff;
}

.vf-logo-mark i:nth-child(1){height:7px}
.vf-logo-mark i:nth-child(2){height:14px}
.vf-logo-mark i:nth-child(3){height:9px}
.vf-logo-mark i:nth-child(4){height:17px}
.vf-logo-mark i:nth-child(5){height:8px}

.vf-links{
    display:flex;
    gap:26px;
    align-items:center;
}

.vf-links a{
    position:relative;
    color:#c6c3cc;
    text-decoration:none;
    font-size:14px;
    transition:.25s;
    white-space:nowrap;
}

.vf-links a::after{
    content:"";
    position:absolute;
    left:0;
    right:100%;
    bottom:-8px;
    height:1px;
    background:#a78bfa;
    transition:.25s ease;
}

.vf-links a:hover,
.vf-links a.vf-active{
    color:#fff;
}

.vf-links a:hover::after,
.vf-links a.vf-active::after{
    right:0;
}

.vf-actions{
    display:flex;
    align-items:center;
    gap:10px;
}

.vf-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    border:none;
    cursor:pointer;
    text-decoration:none;
    padding:12px 18px;
    border-radius:10px;
    font-family:inherit;
    font-weight:700;
    font-size:14px;
    line-height:1.2;
    transition:.25s;
    white-space:nowrap;
}

.vf-btn-primary{
    color:#fff;
    background:linear-gradient(135deg,#8b5cf6,#6d28d9);
    box-shadow:0 8px 30px rgba(109,40,217,.25);
}

.vf-btn-primary:hover{
    transform:translateY(-2px);
    box-shadow:0 12px 35px rgba(109,40,217,.4);
}

.vf-btn-outline{
    color:#fff;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.10);
}

.vf-btn-outline:hover{
    background:rgba(255,255,255,.08);
}

.vf-menu-btn{
    display:none;
    border:1px solid rgba(255,255,255,.10);
    background:rgba(255,255,255,.04);
    color:#fff;
    width:42px;
    height:42px;
    border-radius:10px;
    cursor:pointer;
    font-size:20px;
}

.vf-mobile{
    display:none;
}

@media(max-width:1050px){
    .vf-links{gap:18px}
    .vf-links a{font-size:13px}
}

@media(max-width:900px){

    .vf-links,
    .vf-actions{
        display:none;
    }

    .vf-menu-btn{
        display:block;
    }

    .vf-mobile{
        position:absolute;
        top:100%;
        left:0;
        width:100%;
        padding:12px 20px 20px;
        background:#09080d;
        border-bottom:1px solid rgba(255,255,255,.10);
    }

    .vf-mobile.vf-open{
        display:block;
    }

    .vf-mobile a{
        display:block;
        padding:13px 0;
        color:#aaa6b5;
        text-decoration:none;
        font-size:15px;
        border-bottom:1px solid rgba(255,255,255,.05);
    }

    .vf-mobile a.vf-active{
        color:#fff;
    }

    .vf-mobile .vf-btn{
        width:100%;
        margin-top:16px;
        padding:14px 18px;
        border-bottom:none;
        color:#fff;
    }
}

@media(max-width:600px){
    .vf-bar{height:68px}
    .vf-logo{font-size:17px}
    .vf-logo-mark{width:34px;height:34px}
}
`;

    /* Work out which link belongs to the current page */
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    /* A page link is active unless the URL points at one of its anchor links instead */
    function isActive(href, hash = location.hash) {
        const [file, anchor] = href.split("#");
        if (file.toLowerCase() !== page) return false;
        if (anchor) return hash === "#" + anchor;
        return !LINKS.some(l => l.href.startsWith(file + "#") && hash === "#" + l.href.split("#")[1]);
    }

    function linkHtml(l) {
        return `<a href="${l.href}"${isActive(l.href) ? ' class="vf-active" aria-current="page"' : ""}>${l.label}</a>`;
    }

    const links = LINKS.map(linkHtml).join("");

    const html = `
<header class="vf-header">
    <div class="vf-bar">
        <a href="index.html" class="vf-logo" aria-label="VocalFluxStudio home">
            <div class="vf-logo-mark"><span><i></i><i></i><i></i><i></i><i></i></span></div>
            VocalFluxStudio
        </a>

        <nav class="vf-links" aria-label="Main">${links}</nav>

        <div class="vf-actions">
            <a href="${LOGIN_HREF}" class="vf-btn vf-btn-outline">Client Login</a>
            <a href="${QUOTE_HREF}" class="vf-btn vf-btn-primary" data-vf-quote>Request a Quote</a>
        </div>

        <button class="vf-menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="vfMobileMenu">☰</button>
    </div>

    <div class="vf-mobile" id="vfMobileMenu">
        ${links}
        <a href="${LOGIN_HREF}">Client Login</a>
        <a href="${QUOTE_HREF}" class="vf-btn vf-btn-primary" data-vf-quote>Request a Quote</a>
    </div>
</header>`;

    /* Inject styles + markup right where the <script> tag sits */
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const me = document.currentScript;
    me.insertAdjacentHTML("beforebegin", html);

    const header = me.previousElementSibling;
    const menu = header.querySelector(".vf-mobile");
    const menuBtn = header.querySelector(".vf-menu-btn");

    function setMenu(open) {
        menu.classList.toggle("vf-open", open);
        menuBtn.setAttribute("aria-expanded", open);
        menuBtn.textContent = open ? "✕" : "☰";
    }

    menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("vf-open")));

    /* Close the mobile menu after picking a link */
    menu.addEventListener("click", e => {
        if (e.target.closest("a")) setMenu(false);
    });

    /* On pages that have the quote modal (home page), open it directly */
    header.querySelectorAll("[data-vf-quote]").forEach(btn => {
        btn.addEventListener("click", e => {
            if (typeof window.openQuote === "function") {
                e.preventDefault();
                window.openQuote();
            }
        });
    });

    /* Keep the active link in sync when jumping between anchors on the same page */
    window.addEventListener("hashchange", () => {
        header.querySelectorAll(".vf-links a, .vf-mobile a").forEach(a => {
            const href = a.getAttribute("href");
            if (!LINKS.some(l => l.href === href)) return;
            const active = isActive(href);
            a.classList.toggle("vf-active", active);
            if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
    });

})();
