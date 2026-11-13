# sacred-solid

SolidJS port of [SRCL](https://github.com/internet-development/www-sacred), the Sacred Computer component library with terminal aesthetics. Same markup and behavior, with its own CSS and a role based theming vocabulary. A pixel diff against the React kitchen sink stays as the regression gate for refactors that must not change anything visible.

It targets Solid 2 and builds its interactive parts on [ui-sdk](https://ui-sdk.dev). Install `solid-js` and `@solidjs/web` 2.0.0-rc.21 or newer, and `@ui-sdk/solid` and `@ui-sdk/core`, next to it.

The library is client-only. Components build DOM templates at import time, so import it from browser code or a bundler that targets the client.

## Use it

```tsx
import "sacred-solid/global-fonts.css";
import "sacred-solid/global.css";
import "sacred-solid/style.css";

import { render } from "@solidjs/web";
import { Accordion, Card, DefaultActionBar, ModalStack, Providers } from "sacred-solid";

render(
  () => (
    <Providers>
      <DefaultActionBar />
      <ModalStack />
      <Accordion title="HELLO" defaultValue>
        <Card title="EXAMPLE">Terminal aesthetics.</Card>
      </Accordion>
    </Providers>
  ),
  document.body,
);
```

Every stylesheet sits in the `sacred` cascade layers, so your own plain CSS beats the library whatever the load order, see [Why CSS layers](docs/explanation/why-css-layers.md). `global.css` defines the `--theme-*` and `--ansi-*` tokens every component reads. Put `class="theme-light"` on `<body>`. `Providers` mounts the hotkey scopes and the modal stack state that `DropdownMenuTrigger`, `ModalTrigger` and `DefaultActionBar` need.

## What changed from React

| React                                    | Solid                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------- |
| default exports                          | named exports, `Foo` and `FooProps`                                   |
| `useHotkeys(keys, cb, options)`          | `createHotkeys(keys, cb, options)`, keys and options may be accessors |
| `useModals()` returns `modalStack` array | `useModals()` returns `modalStack` accessor, call it                  |
| `className`, camelCase `style` keys      | `class`, kebab-case `style` keys, units written out (`"8px"`)         |
| `onChange` on text inputs                | `onInput` fires per keystroke, `onChange` fires on commit             |
| `DefaultMetaTags`                        | not ported, put the tags in your `index.html`                         |
| `Button theme="SECONDARY"`               | `Button variant="SECONDARY"`, `theme` is the token override prop      |
| hand-written keyboard, focus and ARIA    | ui-sdk parts: menus, select, tabs, dialogs, tree, calendar and more   |

The unused helpers in `common/utilities.ts` and the `API`, `Users`, `Tiers` constants were dropped. The Next.js routes, the `/llm` doc routes and the Simulacrum CLI (`scripts/cli`, `scripts/python`) stay in the React repo.

## Styling

Most components take `aug`, a typed object that clips corners and draws a border or an inlay, and `theme`, an object of token overrides for the component and everything inside it. `Surface` adds a glow and a backdrop blur.

```tsx
import { Button, Card, Surface } from "sacred-solid";

<Button aug={{ tl: "clip", br: "clip" }}>Save</Button>;

<Card theme={{ lineStrong: "hotpink", ink: "white" }}>Pink edges.</Card>;

<Surface glow="cyan" blur="8px" theme={{ surfaceFloat: "rgb(0 20 40 / 0.2)" }}>
  Glass.
</Surface>;
```

`sacred-solid/themes/holo.css` adds a translucent `theme-holo`, `sacred-solid/themes/acid.css` adds a lime on black `theme-acid`, and `sacred-solid/themes/redline.css` adds a red on maroon-black `theme-redline`. Switch themes with `Utilities.onHandleAppearanceChange("theme-holo")`.

The [documentation](docs/README.md) has a tutorial, how-to guides, reference, and two explanations.

- [Build a futuristic panel](docs/tutorial/build-a-futuristic-panel.md)
- [Apply an aug shape](docs/how-to/apply-an-aug-shape.md)
- [Switch and write a theme](docs/how-to/switch-and-write-a-theme.md)
- [Theme tokens](docs/reference/theme-tokens.md)
- [Why role tokens](docs/explanation/why-role-tokens.md)
- [Why CSS layers](docs/explanation/why-css-layers.md)

## Develop

```sh
vp install
vp check        # format, lint, type check
vp test         # unit tests under tests/
vp pack         # build dist/ with declarations
vp dev          # kitchen sink playground at http://localhost:5173
vp run chrome-strip   # real browser check of the chrome strip, needs vp preview --port 4173
vp run check-layers   # real browser check that caller CSS beats lib CSS, needs vp pack, vp build and vp preview --port 4173
vpx scripts/gen-docs.ts   # rewrite the generated tables in docs/
vpx scripts/gen-aug.ts    # rebuild src/aug/mixins.generated.ts after upgrading augmented-ui
SHOOT_OUT=shot.png vpx scripts/shoot.ts hacking   # reference | ours PNG of /hacking/ or /journal/, needs vp dev
```

`playground/` is the Solid kitchen sink, a port of `app/page.tsx` plus the two concept pages. `/hacking/` is a `theme-acid` recreation of a game hacking screen built from `Panel`, `KeyHint`, `BarProgress` and `Table`, with a small playable code matrix. `?paused` stops its countdown.

## Release

Every push to `main` runs `.github/workflows/release.yml`. It runs `vp check`, `vp test` and `vp pack`, then `scripts/release.sh`. If changesets are pending, the script runs `changeset version`, commits the bump and changelog to `main`, and publishes to npm with provenance. It then pushes the git tag.

Publishing uses npm trusted publishing. The job gets a short-lived OIDC token from GitHub, so there is no npm token or secret to rotate. npm attaches the provenance attestation automatically.

- Describe a change with `npm run changeset` and commit the generated `.changeset/*.md` with the change.
- Every push also publishes any version in `package.json` that is not on npm yet, which finishes a release whose publish step failed after the version commit landed. Nothing is versioned twice.
- The package starts at `0.0.0`, which the script treats as never released. A push with no changeset does not publish it.
- The bot pushes the version commit to `main`. Branch protection must let `github-actions[bot]` push there.
- A push to `main` while a release job runs can make the version push fail. The job goes red, nothing is published, and the changesets stay for the next run.

### One-time setup

npm lets you configure a trusted publisher only for a package that already exists, so the first version is published by hand.

1. Publish the package once from your machine with `npm publish --access public`.
2. On npmjs.com, open the package settings, Trusted Publisher, GitHub Actions. Set owner `sammccord`, repository `sacred-solid`, workflow filename `release.yml`. Leave the environment empty.
3. Optionally set the package's publishing access to require 2FA and disallow tokens.

`package.json` carries the `repository` field provenance checks against. Keep it equal to the GitHub repo that runs the workflow.

`scripts/release.sh` takes `RELEASE_BRANCH` and `RELEASE_REMOTE`, so it runs against a local git remote and registry for a dry run.

## Stay in sync with React

`react-sync.json` pins the www-sacred commit this port has reviewed. The agent skill `skills/sync-from-react/SKILL.md` moves it forward: `vpx scripts/react-sync.ts status --fetch` shows how far behind the port is, and `apply` copies `public/` assets, lists the stylesheets that changed in React as diverged without writing them, and prints what needs a hand port. This port owns its CSS, so a React stylesheet change is read and carried over by hand in role tokens. `mark` advances the pin only after the parity run is clean.

## Visual parity

Pixel parity is the regression gate for refactors that must not change anything visible, such as the move to role tokens. A change that is meant to look different fails it by design, so recapture the affected baseline slices after reviewing the diff images. `scripts/parity.ts` drives Playwright against the React site and the Solid playground. Both sides get a paused fake clock, a seeded `Math.random`, and the same scripted interactions. Each accordion section, both concept pages and about 40 interactions (menus, modals, hotkeys, collapse) are compared pixel for pixel and by a canonical DOM dump.

```sh
cd <copy of www-sacred> && npm install && npx next build && npx next start -p 10000
vp build && vp preview --port 4173
vpx scripts/parity.ts baseline   # capture React, each scenario until two runs agree
vpx scripts/parity.ts check      # capture Solid and diff against the baseline
```

Output goes to `.parity/` (`baseline/`, `solid/`, `diff/`). A scenario whose React baseline never agrees with itself is reported as INCONCLUSIVE, not as a pass.

`tests/conventions.test.ts` greps `src/` for React leftovers and the silent Solid breakages: camelCase style keys and bare numeric pixel values. `tests/theme-roles.test.ts` pins the role vocabulary. `vpx scripts/computed-snapshot.ts snapshot <url> <out.json>` dumps computed colors and shadows for every element in several themes, and `diff <a.json> <b.json>` compares two dumps, which proves a token refactor kept every color.
