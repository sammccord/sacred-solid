import "../src/styles/global-fonts.css";
import "../src/styles/global.css";

import { render } from "@solidjs/web";
import { Providers } from "../src/components/Providers.tsx";
import { App } from "./App.tsx";

render(
  () => (
    <Providers>
      <App />
    </Providers>
  ),
  document.body,
);
