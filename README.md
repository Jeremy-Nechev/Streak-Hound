# Streak Hound

A streak-based dog breed quiz. You're shown a breed and four candidate attributes —
origin, breed group, size class, coat type, adult weight, lifespan, or a signature trait.
One is correct; the other three are real attributes that belong to *different* breeds.
Get it right and your streak grows. Get it wrong and it resets to zero.

Difficulty scales with your streak. Early questions pair a breed with decoys drawn from
very different dogs (a Chihuahua against Giant); later ones pull decoys from breeds that
share the same group, size and region, so a Norfolk Terrier's drop ears sit next to a
Norwich Terrier's prick ears.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page shell and markup |
| `styles.css` | Styling, light and dark |
| `app.js` | Question generation, difficulty tiers, scoring |
| `data/breeds.js` | The breed dataset |

No build step, no dependencies, no tracking. Best streak is stored in `localStorage`.

## Run locally

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

## Deploy

`.github/workflows/pages.yml` publishes the repository root to GitHub Pages on every push
to `main`. In the repository settings, set **Settings → Pages → Build and deployment →
Source** to **GitHub Actions**.

## Adding breeds

Append an object to the array in `data/breeds.js`:

```js
{ n: "Breed Name", o: "Country", g: "Herding", s: "Medium",
  c: "Short & dense double", w: [30, 45], l: [12, 14],
  t: "One distinctive trait" }
```

Keep `g` to the seven AKC-style groups (Sporting, Hound, Working, Terrier, Toy,
Non-Sporting, Herding) and `s` to `Toy`/`Small`/`Medium`/`Large`/`Giant` — the difficulty
model reads both. `w` is pounds and `l` is years, each as `[min, max]`. Add the origin
country to the `REGION` map in `app.js` if it isn't there yet, so geographic proximity
still factors into hard questions.
