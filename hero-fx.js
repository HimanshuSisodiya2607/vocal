/* =========================================================
   VOCALFLUXSTUDIO — HERO "SOUND FIELD" ANIMATION
   Glowing waveforms on a beat, particles that react to the
   mouse, click shockwaves and a pulsing equalizer floor.
   Needs: <canvas class="hero-fx"></canvas> inside .hero
========================================================= */

(function () {

    const canvas = document.querySelector(".hero-fx");
    if (!canvas) return;

    const hero = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const BPM = 120;
    const BEAT = 60 / BPM;

    /* Waveform ribbons: hue, vertical position, amplitude, frequency, speed */
    const WAVES = [
        { hue: 262, y: .50, amp: .16, freq: 1.6, speed: .55, width: 2.4 },
        { hue: 282, y: .54, amp: .12, freq: 2.3, speed: -.75, width: 1.8 },
        { hue: 305, y: .47, amp: .10, freq: 3.1, speed: .95, width: 1.4 },
        { hue: 200, y: .56, amp: .08, freq: 4.2, speed: -1.2, width: 1.1 },
        { hue: 250, y: .52, amp: .20, freq: 1.1, speed: .35, width: 1 }
    ];

    let W = 0, H = 0, dpr = 1, mobile = false;
    let particles = [];
    let shocks = [];
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
        const r = hero.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, r.width < 900 ? 1.5 : 2);
        W = r.width;
        H = r.height;
        mobile = W < 900;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round(Math.min(160, (W * H) / (mobile ? 9000 : 7000)));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - .5) * .3,
            vy: (Math.random() - .5) * .3,
            r: Math.random() * 1.8 + .4,
            hue: 250 + Math.random() * 70,
            phase: Math.random() * Math.PI * 2
        }));
    }

    /* Smooth "kick drum" envelope: spikes on the beat, decays fast */
    function beatPulse(t) {
        const p = (t % BEAT) / BEAT;
        return Math.exp(-p * 6);
    }

    function drawBackdrop(t, kick) {
        /* Slowly orbiting colour blobs */
        const blobs = [
            { x: .72 + Math.cos(t * .21) * .12, y: .38 + Math.sin(t * .17) * .14, r: .55, c: "124,58,237" },
            { x: .88 + Math.sin(t * .13) * .08, y: .78 + Math.cos(t * .19) * .1,  r: .40, c: "219,39,119" },
            { x: .55 + Math.cos(t * .11) * .15, y: .15 + Math.sin(t * .23) * .08, r: .35, c: "14,165,233" }
        ];
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
            const rad = Math.max(W, H) * b.r * (1 + kick * .06);
            const g = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, rad);
            g.addColorStop(0, `rgba(${b.c},${.16 + kick * .05})`);
            g.addColorStop(1, `rgba(${b.c},0)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function drawWaves(t, kick) {
        ctx.globalCompositeOperation = "lighter";
        const startX = mobile ? 0 : W * .25;

        for (const w of WAVES) {
            ctx.beginPath();
            for (let x = startX; x <= W + 10; x += 6) {
                const nx = x / W;
                /* taper the ends so the ribbon fades in and out */
                const env = Math.sin(Math.min(1, (x - startX) / (W - startX)) * Math.PI);
                let y = Math.sin(nx * w.freq * Math.PI * 2 + t * w.speed * 2) * .6
                      + Math.sin(nx * w.freq * 5.3 + t * w.speed * 3.1) * .25
                      + Math.sin(nx * 23 + t * 7) * .15 * kick;

                /* the mouse bends the waveform */
                const dx = x - mouse.x, dy = H * w.y - mouse.y;
                const pull = mouse.active ? Math.exp(-(dx * dx + dy * dy) / 40000) : 0;

                y = H * w.y + y * H * w.amp * env * (1 + kick * .55) + pull * 60 * Math.sin(t * 6 + nx * 9);
                x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            /* wide faint stroke = glow, thin bright stroke = core (cheaper than shadowBlur) */
            const hue = w.hue + Math.sin(t * .5) * 15;
            ctx.strokeStyle = `hsla(${hue},95%,60%,${.12 + kick * .1})`;
            ctx.lineWidth = w.width * (6 + kick * 5);
            ctx.stroke();
            ctx.strokeStyle = `hsla(${hue},95%,70%,${.55 + kick * .35})`;
            ctx.lineWidth = w.width * (1 + kick * .6);
            ctx.stroke();
        }
    }

    function drawParticles(t, kick) {
        ctx.globalCompositeOperation = "lighter";
        for (const p of particles) {
            /* flee the mouse */
            if (mouse.active) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 22000) {
                    const f = (1 - d2 / 22000) * .9;
                    const d = Math.sqrt(d2) || 1;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }
            }
            /* shockwave push */
            for (const s of shocks) {
                const dx = p.x - s.x, dy = p.y - s.y;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                if (Math.abs(d - s.r) < 40) {
                    p.vx += (dx / d) * 2.2 * s.life;
                    p.vy += (dy / d) * 2.2 * s.life;
                }
            }

            p.vx *= .95;
            p.vy *= .95;
            p.x += p.vx + Math.sin(t * .6 + p.phase) * .25;
            p.y += p.vy + Math.cos(t * .5 + p.phase) * .25 - .15;

            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
            if (p.y < -10) p.y = H + 10;
            if (p.y > H + 10) p.y = -10;

            const twinkle = .5 + Math.sin(t * 3 + p.phase) * .5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (1 + kick * .8), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},100%,75%,${.25 + twinkle * .55})`;
            ctx.fill();
        }

        /* connect close particles like a signal network */
        if (!mobile) {
            ctx.lineWidth = .6;
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 9000) {
                        ctx.strokeStyle = `rgba(167,139,250,${(1 - d2 / 9000) * .22})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function drawShocks() {
        ctx.globalCompositeOperation = "lighter";
        shocks = shocks.filter(s => s.life > 0);
        for (const s of shocks) {
            s.r += 9;
            s.life -= .018;
            for (let k = 0; k < 3; k++) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(0, s.r - k * 22), 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${270 + k * 25},100%,70%,${s.life * (.7 - k * .2)})`;
                ctx.lineWidth = 2.5 - k * .6;
                ctx.stroke();
            }
        }
    }

    function drawEqualizer(t, kick) {
        ctx.globalCompositeOperation = "lighter";
        const bars = mobile ? 28 : 64;
        const gap = 3;
        const bw = W / bars - gap;
        const g = ctx.createLinearGradient(0, H, 0, H - H * .14);
        g.addColorStop(0, "rgba(124,58,237,.55)");
        g.addColorStop(1, "rgba(219,39,119,.04)");
        ctx.fillStyle = g;
        for (let i = 0; i < bars; i++) {
            const n = i / bars;
            const level = (Math.sin(t * 3.1 + i * .45) * .5 + .5) * .6
                        + (Math.sin(t * 7.3 + i * 1.7) * .5 + .5) * .25
                        + kick * (1 - Math.abs(n - .5) * 1.6) * .6;
            const h = Math.max(4, level * H * .14);
            const x = i * (bw + gap) + gap / 2;
            ctx.fillRect(x, H - h, bw, h);
        }
    }

    function frame(ms) {
        const t = ms / 1000;
        const kick = reduceMotion ? 0 : beatPulse(t);

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, H);

        drawBackdrop(t, kick);
        drawEqualizer(t, kick);
        drawWaves(t, kick);
        drawParticles(t, kick);
        drawShocks();
    }

    /* Only animate while the hero is on screen and the tab is visible */
    let running = false, visible = true, rafId = 0;

    function loop(ms) {
        frame(ms);
        if (running) rafId = requestAnimationFrame(loop);
    }

    function setRunning(on) {
        on = on && visible && !document.hidden && !reduceMotion;
        if (on === running) return;
        running = on;
        if (on) rafId = requestAnimationFrame(loop);
        else cancelAnimationFrame(rafId);
    }

    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        setRunning(true);
    }).observe(hero);

    document.addEventListener("visibilitychange", () => setRunning(true));

    hero.addEventListener("pointermove", e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.active = true;
    });

    hero.addEventListener("pointerleave", () => { mouse.active = false; });

    hero.addEventListener("pointerdown", e => {
        if (e.target.closest("a, button, input, select, textarea")) return;
        const r = hero.getBoundingClientRect();
        shocks.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, life: 1 });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); if (!running) frame(performance.now()); }, 120);
    });

    resize();
    frame(performance.now());   /* draw a still frame immediately (also the reduced-motion view) */
    setRunning(true);

})();
