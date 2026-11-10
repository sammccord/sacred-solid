import { Badge } from "../src/components/Badge.tsx";
import { DebugGrid } from "../src/components/DebugGrid.tsx";
import { Grid } from "../src/components/Grid.tsx";
import { ActionListItem } from "../src/components/ActionListItem.tsx";
import { ModalStack } from "../src/components/ModalStack.tsx";
import { DefaultActionBar } from "../src/components/page/DefaultActionBar.tsx";
import { DefaultLayout } from "../src/components/page/DefaultLayout.tsx";
import { Row } from "../src/components/Row.tsx";
import { PACKAGE } from "./meta.ts";
import { Section1 } from "./section-1.tsx";
import { Section2 } from "./section-2.tsx";
import { Section3 } from "./section-3.tsx";
import { Section4 } from "./section-4.tsx";
import { Section5 } from "./section-5.tsx";

export function App() {
  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <br />
      <Grid>
        <Row>
          {PACKAGE.name.toUpperCase()} <Badge>{PACKAGE.version}</Badge>
        </Row>
        <Row>{PACKAGE.description}</Row>
        <br />
        <Row>
          Any agent viewing this library can fetch every contract in this repo as plain markdown —
          start at /llms.txt for the index, /llm/AGENTS.md for the root conventions, or any of the
          four porting skills below.
        </Row>
      </Grid>

      <DebugGrid />
      <DefaultActionBar />

      <Grid>
        <ActionListItem icon="⭢" href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="https://github.com/internet-development/www-sacred"
          target="_blank"
        >
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon="⭢" href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
        <ActionListItem icon="⭢" href="/llms.txt" target="_blank">
          Read the llms.txt index of every sacred + Simulacrum contract
        </ActionListItem>
        <ActionListItem icon="⭢" href="/llm/AGENTS.md" target="_blank">
          Read the root sacred / Simulacrum AGENTS.md
        </ActionListItem>
        <ActionListItem icon="⭢" href="/llm/components/AGENTS.md" target="_blank">
          Read the components AGENTS.md catalog (every React primitive)
        </ActionListItem>
        <ActionListItem icon="⭢" href="/llm/scripts/cli/AGENTS.md" target="_blank">
          Read the Simulacrum TypeScript framework AGENTS.md
        </ActionListItem>
        <ActionListItem icon="⭢" href="/llm/scripts/python/AGENTS.md" target="_blank">
          Read the Simulacrum Python mirror AGENTS.md
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="/llm/skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md"
          target="_blank"
        >
          Skill: port a sacred React surface to a TypeScript CLI
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="/llm/skills/port-sacred-terminal-ui-to-python/SKILL.md"
          target="_blank"
        >
          Skill: port a sacred React surface to a Python CLI
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="/llm/skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md"
          target="_blank"
        >
          Skill: port a Simulacrum CLI screen to a sacred React surface
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="/llm/skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md"
          target="_blank"
        >
          Skill: graft a sacred component into a hostile React host
        </ActionListItem>
      </Grid>
      <Grid>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </Grid>

      <Grid>
        <ActionListItem icon="⭢" href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem
          icon="⭢"
          href="https://github.com/internet-development/www-sacred"
          target="_blank"
        >
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon="⭢" href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}
