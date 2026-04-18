# Basic Skateboard Math

## Scene Setup
- Camera at (0, 3, 14) looking at origin
- Asteroid at (0, 0, 0), radius 2.2, spinning in place
- Skateboard scaled to 50% depth on Z axis

## Board Translation
- Moves from x=-40 to x=+40 over 7 seconds
- 3 second pause at x=+40, then snaps back to x=-40 and loops
- Total cycle: 10 seconds

## Arc Over Asteroid
- Board rises +5 units on Y between x=-15 and x=+15
- Uses sine curve: `y = 5 * sin(π * (x + 15) / 30)`
- Peaks at y=+5 at x=0 (directly over asteroid)

## Kickflip + Nose Tilt (x=-7.5 to x=+7.5)
- `flipT` = normalized progress from 0 to 1 across that range
- **Nose tilt (rotation.z):** arcs up to 40° and back down via `40 * sin(π * flipT)`
- **Kickflip (rotation.x):** full 360° spin via `2π * flipT`
- Both rotations are driven by the same `flipT` so they happen simultaneously

## What's Not Right Yet
- The kickflip timing and feel is still a rough approximation
- A real kickflip has the tail pop first, then the board flips under the rider
- The nose tilt + spin combination needs more tuning to look natural
