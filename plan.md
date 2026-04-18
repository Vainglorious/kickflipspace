# kickflip.space — Landing Page Plan

## Context
Building a visually impressive "just vibes" landing page for the domain **kickflip.space**. No conversion goal, no product — purely a stunning presence. Theme: skateboarding meets outer space.

**Narrative:** The skateboard is a small satellite — with hidden attitude thrusters — in a real elliptical orbit around the meteor. At periapsis (closest approach), the thrusters fire and execute a 360° kickflip. It coasts back out and repeats. The site showcases understanding of orbital dynamics and satellite trajectories. The kickflip is earned by physics, not faked.

---

## Stack
**Plain HTML + CSS + Three.js** (no build step, deploy anywhere — Netlify, GitHub Pages, Vercel static)

Rationale: this is a single-page vibe site. No routing, no backend, no framework overhead needed. Three.js via CDN is sufficient for an impressive 3D scene.

---

## Page Structure

Single `index.html` with one fullscreen canvas scene:

```
/
├── index.html
├── style.css
├── main.js           ← Three.js scene
└── assets/
    └── skateboard.glb  ← free GLTF model (source below)
```

---

## Visual Design

- **Background**: deep space black (`#050510`) with a subtle nebula gradient
- **Stars**: 2,000+ points randomly distributed using `THREE.Points` with a circular sprite texture
- **Typography**: "kickflip.space" centered in the viewport — large, white, with a slight purple/blue glow (`text-shadow`). Font: `Space Grotesk` or `Exo 2` from Google Fonts
- **Color accent**: electric purple + cyan (skate/neon energy meets cosmos)

---

## Animation — The Kickflip Scene

### Scene setup
- `THREE.WebGLRenderer` fullscreen canvas, `alpha: false`, dark clear color
- `PerspectiveCamera` positioned slightly above, looking at the action
- Ambient light (dim blue) + one directional "sun" light from off-screen left
- Stars rotate slowly in the background (constant, subtle)

### Meteor
- `THREE.IcosahedronGeometry` (radius ~2, detail 1) for a rocky silhouette
- Rocky gray material (`MeshStandardMaterial`) with slight roughness
- Slow rotation on Y axis, slow drift across scene

### Skateboard (satellite)
- Low-poly board built from Three.js primitives (deck, trucks, wheels)
- Follows a **Keplerian elliptical orbit** (e ≈ 0.82) around the meteor
- Position computed via Kepler's equation solved with Newton's method each frame
- Board faces direction of travel at all times
- At periapsis (±30° true anomaly): attitude thrusters fire → 360° kickflip (rotation.x)
- Outside flip window: board is level and coasting
- Thruster particle burst: ~30 cyan-white particles from board underside, additive blending, fade over 0.4s
- Orbital plane tilted ~10–15° for 3D depth without losing left→right readability

### Animation loop (`requestAnimationFrame`)
```
- stars.rotation.y drift (slow)
- meteor.rotation.y += 0.004
- board: solve Kepler's equation → position → flip window check → thruster particles
- board speed varies: fast at periapsis, slow at apoapsis (vis-viva)
```

See `math.md` for full derivation.

---

## Sections / Content

Minimal text — the animation is the content:

1. **Full-screen canvas** (Three.js scene, z-index 0)
2. **Overlay div** (z-index 1, centered, pointer-events none):
   - `kickflip.space` — large glowing wordmark
   - Optional: one-line tagline below (e.g. "the universe is your skatepark")

---

## Skateboard Model Source

Option A (preferred): Download a free CC0 skateboard GLTF from Sketchfab or [Kenney.nl](https://kenney.nl) and place in `assets/`

Option B (fallback): Build a low-poly stylized board from Three.js primitives — simpler, loads faster, no external dependency

---

## Files to Create

| File | Purpose |
|---|---|
| `index.html` | HTML shell, canvas mount, Google Fonts link |
| `style.css` | Full-page canvas, overlay positioning, font styles, glow effects |
| `main.js` | Three.js scene: stars, meteor, skateboard, animation loop |

---

## Verification

1. Open `index.html` directly in browser (or `npx serve .`)
2. Confirm fullscreen canvas with star field visible
3. Confirm meteor drifting and rotating
4. Confirm skateboard kickflip animation looping cleanly
5. Confirm "kickflip.space" wordmark legible with glow effect
6. Test on mobile viewport — canvas should scale correctly
7. Check performance: target 60fps, reduce star count if needed
