# Build a futuristic panel

In this tutorial you build a translucent panel with clipped corners and a glowing edge. You start from a plain `Card` and end with a `Surface` that carries the holo theme, an `aug` shape, a `theme` override, a glow, and a backdrop blur.

You need a Solid and Vite app with `sacred-solid` installed. The code below is complete at every step, so replace the whole file each time.

## Render a Card

First, make sure the `<body>` tag in `index.html` carries a theme class.

```html
<body class="theme-light"></body>
```

Now replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Card } from "sacred-solid";

render(() => <Card title="STATUS">Systems nominal.</Card>, document.body);
```

Start the dev server with `npm run dev` and open the address it prints.

You see a black frame on a white page. The word STATUS sits in a gap in the top edge, and `Systems nominal.` sits inside the frame in a monospace font.

The three imports are the whole setup. See [Why role tokens](../explanation/why-role-tokens.md) for what `global.css` defines.

## Put the Card on a busy background

A translucent panel needs something behind it. Replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Card } from "sacred-solid";

const STRIPES = "repeating-linear-gradient(45deg, #ff2d95 0 12px, #2b2bff 12px 24px)";

render(
  () => (
    <div style={{ background: STRIPES, padding: "4ch", "min-height": "100vh" }}>
      <div style={{ "max-width": "56ch" }}>
        <Card title="STATUS">Systems nominal.</Card>
      </div>
    </div>
  ),
  document.body,
);
```

You see pink and blue diagonal stripes filling the window. The Card is narrower now and its frame is still black. The Card has no fill, so the stripes show through the text.

## Switch to the holo theme

Import `sacred-solid/themes/holo.css` after `global.css`, then switch the body class with `Utilities.onHandleAppearanceChange`. Replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/themes/holo.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Card, Utilities } from "sacred-solid";

const STRIPES = "repeating-linear-gradient(45deg, #ff2d95 0 12px, #2b2bff 12px 24px)";

Utilities.onHandleAppearanceChange("theme-holo");

render(
  () => (
    <div style={{ background: STRIPES, padding: "4ch", "min-height": "100vh" }}>
      <div style={{ "max-width": "56ch" }}>
        <Card title="STATUS">Systems nominal.</Card>
      </div>
    </div>
  ),
  document.body,
);
```

You see the stripes stay as they are, because the striped `div` is your own. The frame becomes a thin cyan line and the text turns pale cyan. STATUS is hard to read against the stripes, and the last step fixes that.

The function replaces `theme-light` with `theme-holo` on `<body>`. See [Switch and write a theme](../how-to/switch-and-write-a-theme.md).

## Cut the corners

Add an `aug` prop to the Card. Replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/themes/holo.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Card, Utilities } from "sacred-solid";

const STRIPES = "repeating-linear-gradient(45deg, #ff2d95 0 12px, #2b2bff 12px 24px)";

Utilities.onHandleAppearanceChange("theme-holo");

render(
  () => (
    <div style={{ background: STRIPES, padding: "4ch", "min-height": "100vh" }}>
      <div style={{ "max-width": "56ch" }}>
        <Card
          title="STATUS"
          aug={{
            tl: { mixin: "clip", size: "24px" },
            br: { mixin: "scoop", size: "16px" },
            border: { all: "2px", bg: "var(--theme-line-strong)" },
          }}
        >
          Systems nominal.
        </Card>
      </div>
    </div>
  ),
  document.body,
);
```

You see the top left corner cut off at 45 degrees and the bottom right corner scooped out. A 2px cyan border follows the new outline. The frame is now one continuous outline, and STATUS sits below its top edge instead of breaking it.

See [Apply an aug shape](../how-to/apply-an-aug-shape.md).

## Recolor the subtree with the theme prop

Add a `theme` prop that overrides two tokens. Replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/themes/holo.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Card, Utilities } from "sacred-solid";

const STRIPES = "repeating-linear-gradient(45deg, #ff2d95 0 12px, #2b2bff 12px 24px)";

Utilities.onHandleAppearanceChange("theme-holo");

render(
  () => (
    <div style={{ background: STRIPES, padding: "4ch", "min-height": "100vh" }}>
      <div style={{ "max-width": "56ch" }}>
        <Card
          title="STATUS"
          aug={{
            tl: { mixin: "clip", size: "24px" },
            br: { mixin: "scoop", size: "16px" },
            border: { all: "2px", bg: "var(--theme-line-strong)" },
          }}
          theme={{ lineStrong: "gold", ink: "white" }}
        >
          Systems nominal.
        </Card>
      </div>
    </div>
  ),
  document.body,
);
```

You see the border turn gold and the text turn white. Nothing outside the Card changes, because the override applies only to the Card and what it contains.

See [Retheme a subtree](../how-to/retheme-a-subtree.md).

## Move the shape onto a Surface with glow and blur

Replace the `Card` with a `Surface`. A `Surface` takes the same `aug` and `theme` props and adds `glow` and `blur`. This `theme` also sets `surfaceFloat`, the panel fill, to a mostly transparent blue. Replace `src/index.tsx` with this.

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/themes/holo.css";
import "sacred-solid/style.css";
import { render } from "solid-js/web";
import { Surface, Utilities } from "sacred-solid";

const STRIPES = "repeating-linear-gradient(45deg, #ff2d95 0 12px, #2b2bff 12px 24px)";

Utilities.onHandleAppearanceChange("theme-holo");

render(
  () => (
    <div style={{ background: STRIPES, padding: "4ch", "min-height": "100vh" }}>
      <div style={{ "max-width": "56ch" }}>
        <Surface
          glow="cyan"
          blur="6px"
          aug={{
            tl: { mixin: "clip", size: "24px" },
            br: { mixin: "scoop", size: "16px" },
            border: { all: "2px", bg: "var(--theme-line-strong)" },
          }}
          theme={{ lineStrong: "gold", surfaceFloat: "rgb(0 20 40 / 0.35)" }}
          style={{ padding: "2ch" }}
        >
          Systems nominal.
        </Surface>
      </div>
    </div>
  ),
  document.body,
);
```

You see a dark blue translucent panel with the same two cut corners and the gold border. A cyan glow follows the outline, including the cut corners. The stripes inside the panel are smeared by the blur, and the stripes around it stay sharp. The `Surface` has no title bar, so STATUS is gone.

You built the panel. See [Add glow and blur](../how-to/add-glow-and-blur.md) to change the glow, and [How aug and the chrome strip work](../explanation/how-aug-and-chrome-strip-work.md) for why the glow needs the `Surface` wrapper.
