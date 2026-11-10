import "../src/styles/global-fonts.css";
import "../src/styles/global.css";

import { render } from "solid-js/web";
import { DebugGrid } from "../src/components/DebugGrid.tsx";
import { PageConceptOne } from "../src/components/examples/PageConceptOne.tsx";
import { ModalStack } from "../src/components/ModalStack.tsx";
import { DefaultActionBar } from "../src/components/page/DefaultActionBar.tsx";
import { Providers } from "../src/components/Providers.tsx";

render(
  () => (
    <Providers>
      <DebugGrid />
      <DefaultActionBar />
      <ModalStack />
      <PageConceptOne />
    </Providers>
  ),
  document.body,
);
