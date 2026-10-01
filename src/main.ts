import Lenis from 'lenis';
import './styles.css';

const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const smallViewport = window.matchMedia('(max-width: 860px)');
const isMobile = () => coarsePointer || smallViewport.matches;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Smooth scrolling. The film controller reads window.scrollY each frame, so it
// follows Lenis without a second timeline.
let lenis: Lenis | null = null;
if (!reduceMotion) {
  document.documentElement.classList.add('motion');
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

const scrollToY = (top: number) => {
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
};

// Hero headline builds word by word on load (transform only, never hidden).
document.querySelectorAll<HTMLElement>('.headline').forEach((el) => {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.setAttribute('aria-label', words.join(' '));
  el.innerHTML = words
    .map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`)
    .join(' ');
});

// ---------------------------------------------------------------------------
// Scroll-scrubbed studio film. Ported from the Higgsfield scroll-scrub engine:
// Blob-backed source for exact seeking, eased seek towards the scroll target,
// poster held until a real frame has painted, iOS priming on first gesture,
// mobile encode on small screens, and no video at all for reduced motion.
// ---------------------------------------------------------------------------
const journey = document.querySelector<HTMLElement>('.journey');
const media = document.querySelector<HTMLElement>('.stage-media');
const railButtons = [...document.querySelectorAll<HTMLButtonElement>('.rail button')];
const chapters = [...document.querySelectorAll<HTMLElement>('.chapter')];

if (journey && media) {
  let start = 0;
  let total = 1;
  let target = 0;
  let current = 0;
  let active = -1;
  let video: HTMLVideoElement | null = null;
  let ready = false;
  let inView = true;
  let frame = 0;

  const layout = () => {
    start = journey.getBoundingClientRect().top + window.scrollY;
    total = Math.max(journey.offsetHeight - window.innerHeight, 1);
  };

  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    railButtons.forEach((b, i) =>
      i === index ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'),
    );
  };

  const readScroll = () => {
    const y = window.scrollY - start;
    target = clamp(y / total);
    const mid = window.scrollY + window.innerHeight * 0.6;
    let idx = 0;
    chapters.forEach((c, i) => {
      if (c.getBoundingClientRect().top + window.scrollY <= mid) idx = i;
    });
    setActive(idx);
  };

  const tick = () => {
    frame = 0;
    readScroll();
    if (video && ready && !video.seeking) {
      current += (target - current) * 0.2;
      const time = clamp(current, 0, 0.999) * (video.duration || 1);
      const epsilon = isMobile() ? 0.02 : 0.008;
      if (Math.abs(video.currentTime - time) > epsilon) {
        try {
          video.currentTime = time;
        } catch {
          // Keep the last painted frame while the browser catches up.
        }
      }
    }
    if (inView) frame = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  railButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      const chapter = chapters[i];
      if (chapter) scrollToY(chapter.getBoundingClientRect().top + window.scrollY);
    });
  });

  if (reduceMotion) {
    // Reduced motion: no film is fetched; show the closing frame as a still.
    const still = media.dataset.still;
    const poster = media.querySelector<HTMLImageElement>('.stage-poster');
    media.querySelector('source')?.remove();
    if (still && poster) poster.src = still;
  } else {
    const source = isMobile() ? media.dataset.mobileClip : media.dataset.clip;
    if (source) {
      fetch(source)
        .then((r) => {
          if (!r.ok) throw new Error(`Clip failed: ${r.status}`);
          return r.blob();
        })
        .then((blob) => {
          const v = document.createElement('video');
          v.className = 'stage-video';
          v.muted = true;
          v.playsInline = true;
          v.preload = 'auto';
          v.setAttribute('muted', '');
          v.setAttribute('playsinline', '');
          v.src = URL.createObjectURL(blob);
          v.addEventListener('loadedmetadata', () => {
            ready = true;
            current = target;
            v.currentTime = clamp(current, 0, 0.999) * (v.duration || 1);
          }, { once: true });
          v.addEventListener('seeked', () => {
            media.dataset.painted = 'true';
          }, { once: true });
          media.append(v);
          video = v;
        })
        .catch(() => {
          // The poster stays; the page is fully readable without the film.
        });

      const prime = () => {
        if (!video || !isMobile()) return;
        video.play().then(() => video?.pause()).catch(() => {});
      };
      window.addEventListener('pointerdown', prime, { once: true, passive: true });
      window.addEventListener('touchstart', prime, { once: true, passive: true });
    }
  }

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) startLoop();
  }).observe(journey);

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
  startLoop();
}

// ---------------------------------------------------------------------------
// Transform-only reveals: content is always visible, it just settles in.
// ---------------------------------------------------------------------------
if (!reduceMotion && 'IntersectionObserver' in window) {
  const rise = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          rise.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.rise').forEach((el) => rise.observe(el));
} else {
  document.querySelectorAll('.rise').forEach((el) => el.classList.add('in'));
}

// ---------------------------------------------------------------------------
// What we do: accordion slices. Hover or focus opens a slice on desktop;
// on a phone every slice is open and stacked.
// ---------------------------------------------------------------------------
const accordion = document.querySelector<HTMLElement>('[data-accordion]');
if (accordion) {
  const slices = [...accordion.querySelectorAll<HTMLElement>('.slice')];
  const open = (target: HTMLElement) => {
    slices.forEach((s) => {
      const isOpen = s === target;
      s.dataset.open = String(isOpen);
      s.querySelector('button')?.setAttribute('aria-expanded', String(isOpen));
    });
  };
  const syncNarrow = () => {
    if (window.matchMedia('(max-width: 680px)').matches) {
      slices.forEach((s) => s.querySelector('button')?.setAttribute('aria-expanded', 'true'));
    } else {
      open(slices.find((s) => s.dataset.open === 'true') ?? slices[0]);
    }
  };
  slices.forEach((s) => {
    const button = s.querySelector('button');
    button?.addEventListener('click', () => open(s));
    button?.addEventListener('focus', () => open(s));
    s.addEventListener('pointerenter', (e) => {
      if ((e as PointerEvent).pointerType === 'mouse') open(s);
    });
  });
  window.matchMedia('(max-width: 680px)').addEventListener('change', syncNarrow);
  syncNarrow();
}

// ---------------------------------------------------------------------------
// Wren's clip: plays muted while on screen, never autoplays for
// reduced-motion visitors, and always has a visible Play/Pause control.
// ---------------------------------------------------------------------------
const clip = document.querySelector<HTMLVideoElement>('video.clip');
const toggle = document.querySelector<HTMLButtonElement>('.clip-toggle');
if (clip && toggle) {
  let userPaused = reduceMotion;
  const sync = () => {
    toggle.dataset.state = clip.paused ? 'paused' : 'playing';
    toggle.setAttribute('aria-label', clip.paused ? 'Play Wren Ashby video' : 'Pause Wren Ashby video');
  };
  clip.addEventListener('play', sync);
  clip.addEventListener('pause', sync);
  toggle.hidden = false;
  sync();
  toggle.addEventListener('click', () => {
    if (clip.paused) {
      userPaused = false;
      void clip.play();
    } else {
      userPaused = true;
      clip.pause();
    }
  });
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !userPaused) void clip.play().catch(() => {});
      else if (!entry.isIntersecting) clip.pause();
    },
    { threshold: 0.4 },
  ).observe(clip);
}

// ---------------------------------------------------------------------------
// Mark the nav link for the section in view.
// ---------------------------------------------------------------------------
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('.nav a').forEach((a) => {
  links.set(a.hash.slice(1), a);
});
const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const link = links.get(entry.target.id);
      if (link && entry.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      }
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
links.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) spy.observe(section);
});
