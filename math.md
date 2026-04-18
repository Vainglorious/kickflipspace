# kickflip.space — Scene Math

## Narrative
The skateboard is a small satellite in elliptical orbit around the meteor. At periapsis
(closest approach), onboard attitude thrusters fire — executing a 360° kickflip. Thrusters
cut off, the satellite coasts back out. Repeats every orbit.

---

## Keplerian Orbit

### Ellipse parameters
```
a  = semi-major axis        (controls orbit size)
e  = eccentricity 0–1       (0 = circle, →1 = very elongated comet-like)
b  = a * sqrt(1 - e²)       (semi-minor axis)

Periapsis distance:  r_p = a(1 - e)   ← closest, fastest, kickflip happens here
Apoapsis distance:   r_a = a(1 + e)   ← farthest, slowest
```

We'll use e ≈ 0.82 — elongated enough to give a dramatic slow-far / fast-close feel
without the board disappearing off screen for too long.

### Position vs time (Kepler's equation)
Time maps to position via **mean anomaly → eccentric anomaly → true anomaly**:

```
M = 2π * (t / T)              // mean anomaly, linear in time, 0→2π per orbit
M = E - e·sin(E)              // Kepler's equation — solve for E (eccentric anomaly)
```

Kepler's equation has no closed form. Solve with Newton's method (~5 iterations):
```
E₀ = M
Eₙ₊₁ = Eₙ - (Eₙ - e·sin(Eₙ) - M) / (1 - e·cos(Eₙ))
```

Then Cartesian position in orbital plane (meteor at origin, periapsis on +x axis):
```
x = a · (cos(E) - e)
y = a · sqrt(1 - e²) · sin(E)
```

Rotate the orbital plane in 3D for perspective (tilt ~15° out of screen plane so we
keep depth without losing the left→right read).

### Speed (vis-viva equation)
```
v = sqrt(GM · (2/r - 1/a))
```
Board moves fastest at periapsis, slowest at apoapsis. GM is a tunable constant
(not real units — just controls how "snappy" the periapsis pass feels).

---

## Kickflip (thruster fire window)

The flip only happens near periapsis. Define a window by true anomaly:
```
flip_window = |θ| < 30°   // ±30° around periapsis
```

Within the window, compute a normalized flip progress 0→1:
```
flipT    = 1 - (|θ| / 30°)            // 1 at periapsis, 0 at window edges
flipEase = smoothstep(flipT)           // ease in/out
board.rotation.x = flipEase · 2π      // exactly one 360° flip
```

Outside the window: `board.rotation.x = 0` (board is level, coasting).

### Thruster particle burst
- Triggered when board enters flip_window
- ~30 particles emitted from board underside
- Initial velocity: opposing the flip torque direction (reaction force)
- Fade out over ~0.4s
- Color: cyan-white (`0x88ffff`) with additive blending

---

## 3D orbital plane orientation

To preserve depth without flattening to 2D:
```
Orbital plane tilted:
  - ~10° rotation around X axis (slight top-down angle)
  - ~15° rotation around Y axis (slight left-right perspective)
```

Board Z position varies naturally from the ellipse's out-of-plane tilt, giving the
foreground/background parallax from the MVP.

---

## True anomaly from eccentric anomaly
```
θ = 2 · atan2(sqrt(1+e) · sin(E/2),  sqrt(1-e) · cos(E/2))
```
Used to determine flip window and board facing direction.

---

## Learnings from MVP

- Cosine arc looked decent but clearly fake — no speed variation
- Constant-spin kickflip was the main thing that broke believability
- 3D depth from the elliptical Z component is better than a flat orbit
- Meteor position at scene center works well visually — keep it
- Text at 65% viewport height reads cleanly below the meteor
