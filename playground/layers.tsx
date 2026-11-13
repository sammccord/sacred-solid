import "../src/styles/global-fonts.css";
import "../src/styles/global.css";

import { render } from "@solidjs/web";
import { Badge } from "../src/components/Badge.tsx";
import { Card } from "../src/components/Card.tsx";
import { Panel } from "../src/components/Panel.tsx";

render(
  () => (
    <main>
      <Badge class="caller probe-Badge">badge</Badge>
      <Panel class="caller callerBorder probe-Panel" title="PANEL">
        panel
      </Panel>
      <Card class="caller callerBorder probe-Card" title="CARD">
        card
      </Card>
    </main>
  ),
  document.body,
);
