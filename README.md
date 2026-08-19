# Rule 30 Renderer

An interactive TypeScript canvas renderer for exploring Wolfram's Rule 30 and the wider family of elementary cellular automata.

Rule 30 starts from a single live cell and repeatedly applies one tiny local rule to every three-cell neighborhood. From that minimal setup, it produces a jagged, surprisingly organic pattern that has become a classic example of complexity emerging from simple deterministic rules.

This app lets you watch that pattern grow, change the rule, alter the canvas resolution, swap in a random seed, and export the result as a PNG.

## Features

- Render Rule 30 from a centered single-cell seed.
- Try any elementary cellular automaton rule from `0` to `255`.
- Animate the automaton as each generation appears.
- Adjust columns, generations, and cell size.
- Reset to the centered seed or generate a random seed.
- Export the current render as a PNG.
- Pixel-crisp canvas output with responsive controls.

## Demo Locally

```bash
npm install
npm run dev
```

Vite will print a local URL, usually `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
```

The production build is emitted to `dist/`.

## Controls

| Control | What it does |
| --- | --- |
| Rule | Chooses the elementary cellular automaton rule. Rule 30 is the default, but all values from `0` to `255` are valid. |
| Columns | Sets the width of the automaton. The app keeps this odd so the centered seed has a true middle cell. |
| Generations | Sets how many rows are generated. |
| Cell Size | Changes the rendered pixel size of each cell. |
| Play/Pause | Toggles animated growth. |
| Reset | Restores the centered single-cell seed. |
| Random Seed | Starts from a random first row. |
| Export PNG | Draws the full automaton and downloads the canvas as an image. |

## How Rule 30 Works

Each new cell is calculated from the three cells directly above it: left, center, and right. There are eight possible three-cell neighborhoods:

```text
111 110 101 100 011 010 001 000
```

Rule 30 is the binary pattern `00011110` across those neighborhoods. A `1` creates a live cell in the next row; a `0` leaves it blank.

The implementation encodes that directly:

```ts
const neighborhood = (left << 2) | (center << 1) | right;
const next = (rule >> neighborhood) & 1;
```

Change the rule number and the same machinery produces a different automaton.

## Project Structure

```text
src/
  automaton.ts  Pure automaton helpers: rule clamping, next row generation, seeds.
  main.ts       UI state, canvas drawing, controls, animation, PNG export.
  styles.css    Layout and visual styling.
```

## Scripts

```bash
npm run dev      # Start the local Vite dev server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Tech Stack

- TypeScript
- Vite
- HTML Canvas

## License

No license has been selected yet. Add one before publishing this for reuse outside your own projects.
