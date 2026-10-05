/* =========================================================
   VOCALFLUXSTUDIO — SHARED FOOTER
   Edit the footer here once; every page picks it up.
   Include on a page with:  <script src="footer.js"></script>
   (place it as the last thing inside <body>, after nav.js has loaded)
========================================================= */

(function () {

    const EMAIL = "vocalfluxstudio@gmail.com";
    const QUOTE_HREF = "index.html?quote=1";

    const COLUMNS = [
        {
            title: "Explore",
            links: [
                { label: "Services",     href: "services.html" },
                { label: "How It Works", href: "how-it-works.html" },
                { label: "Our Work",     href: "our-work.html" },
                { label: "Security",     href: "index.html#security" }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About",        href: "about-contact.html" },
                { label: "Contact",      href: "about-contact.html#contact" },
                { label: "Client Login", href: "index.html#login" }
            ]
        }
    ];

    const CSS = `
.vf-footer{
    border-top:1px solid rgba(255,255,255,.08);
    padding:64px 0 30px;
    background:
        radial-gradient(circle at 80% 0%,rgba(109,40,217,.08),transparent 30%),
        #040406;
    font-family:Inter,Arial,Helvetica,sans-serif;
    color:#fff;
}

.vf-footer-inner{
    width:min(1200px,92%);
    margin:auto;
}

.vf-footer-grid{
    display:grid;
    grid-template-columns:1.4fr repeat(3,1fr);
    gap:40px;
}

.vf-footer-brand p{
    color:#8a8593;
    margin:16px 0 0;
    line-height:1.7;
    font-size:14px;
    max-width:330px;
}

.vf-footer-col h4{
    font-size:13px;
    font-weight:700;
    letter-spacing:.4px;
    margin:0 0 16px;
}

.vf-footer-col a{
    display:block;
    width:fit-content;
    color:#8a8593;
    text-decoration:none;
    font-size:14px;
    margin:11px 0;
    transition:.2s;
}

.vf-footer-col a:hover{
    color:#fff;
}

.vf-footer-bottom{
    margin-top:48px;
    padding-top:22px;
    border-top:1px solid rgba(255,255,255,.08);
    display:flex;
    justify-content:space-between;
    gap:8px;
    color:#5f5a66;
    font-size:12px;
}

@media(max-width:900px){
    .vf-footer-grid{grid-template-columns:1fr 1fr}
    .vf-footer-brand{grid-column:1 / -1}
}

@media(max-width:600px){
    .vf-footer{padding-top:48px}
    .vf-footer-grid{grid-template-columns:1fr;gap:28px}
    .vf-footer-bottom{flex-direction:column}
}
`;

    const cols = COLUMNS.map(c => `
            <div class="vf-footer-col">
                <h4>${c.title}</h4>
                ${c.links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
            </div>`).join("");

    const html = `
<footer class="vf-footer">
    <div class="vf-footer-inner">
        <div class="vf-footer-grid">
            <div class="vf-footer-brand">
                <a href="index.html" class="vf-logo" aria-label="VocalFluxStudio home">
                    <div class="vf-logo-mark"><span><i></i><i></i><i></i><i></i><i></i></span></div>
                    VocalFluxStudio
                </a>
                <p>Managed dubbing and post-production for entertainment, digital and commercial projects.</p>
            </div>
            ${cols}
            <div class="vf-footer-col">
                <h4>Get in Touch</h4>
                <a href="mailto:${EMAIL}">${EMAIL}</a>
                <a href="${QUOTE_HREF}" data-vf-quote>Request a Quote</a>
            </div>
        </div>

        <div class="vf-footer-bottom">
            <span>© ${new Date().getFullYear()} VocalFluxStudio. All rights reserved.</span>
            <span>Voice. Post. Production. Delivered.</span>
        </div>
    </div>
</footer>`;

    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const me = document.currentScript;
    me.insertAdjacentHTML("beforebegin", html);
    const footer = me.previousElementSibling;

    /* On the home page, open the quote modal instead of reloading */
    footer.querySelectorAll("[data-vf-quote]").forEach(link => {
        link.addEventListener("click", e => {
            if (typeof window.openQuote === "function") {
                e.preventDefault();
                window.openQuote();
            }
        });
    });

})();
