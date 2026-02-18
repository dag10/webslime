# WebSlime

WebGL2 ferrofluid simulation. Single-file app in `index.html`.

## Visual Testing

Run `bash test.sh` to capture screenshots of the simulation.

### Output files (in /tmp/)
- `webslime-idle.png` — simulation after 2s warmup, no interaction
- `webslime-dragging.png` — after dragging from center (360,480) to top edge (360,50) and holding 1s
- `webslime-console.log` — all browser console output

### Workflow
1. Make a code change to `index.html`
2. Run `bash test.sh`
3. Read the screenshots to evaluate the visual result
4. Iterate

### Adjusting drag parameters
Edit `test-visual.mjs`:
- **Start position**: `cx`, `cy` (default: canvas center 360, 480)
- **End position**: `targetX`, `targetY` (default: top edge 360, 50)
- **Drag speed**: `steps` in `mouse.move()` (fewer = faster)
- **Hold duration**: `waitForTimeout` after move (default: 1000ms)
