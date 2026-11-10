import { ActionButton } from "../src/components/ActionButton.tsx";
import { Accordion } from "../src/components/Accordion.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { Divider } from "../src/components/Divider.tsx";
import { HoverComponentTrigger } from "../src/components/HoverComponentTrigger.tsx";
import { RowSpaceBetween } from "../src/components/RowSpaceBetween.tsx";
import { Table } from "../src/components/Table.tsx";
import { TableColumn } from "../src/components/TableColumn.tsx";
import { TableRow } from "../src/components/TableRow.tsx";
import { TextArea } from "../src/components/TextArea.tsx";
import { TreeView } from "../src/components/TreeView.tsx";
import { Window } from "../src/components/Window.tsx";

export function Section5() {
  return (
    <>
      <Accordion defaultValue={true} title="TABLE">
        A simple, declarative table component designed to streamline the creation of tables in JSX.
        It provides greater control over the structure and layout while evoking the aesthetics of
        old terminal interfaces (like MS-DOS).
        <br />
        <br />
        <CardDouble title="STARTUPS">
          <Table>
            <TableRow>
              <TableColumn style={{ width: `16ch` }}>
                COMPANY
                <br />
                <Divider />
              </TableColumn>
              <TableColumn>
                DESCRIPTION
                <br />
                <Divider />
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Bluesky</TableColumn>
              <TableColumn>Building a social internet.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Coordination Network</TableColumn>
              <TableColumn>Collaborative tools for solving complex problems together.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Doola</TableColumn>
              <TableColumn>
                Tools to start your US business from anywhere and keep it compliant.
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ General Fabrication</TableColumn>
              <TableColumn>Machine tools to enable permanent industrial revolution.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Glif</TableColumn>
              <TableColumn>Building foundational tools for the Filecoin Ecosystem.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ LigandAI®</TableColumn>
              <TableColumn>
                Combines cutting-edge predictive interactomics® with predictive targeting & delivery
                technology to enable diagnostically-responsive therapeutics.
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Lightcell</TableColumn>
              <TableColumn>An engine that uses light to make electricity.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Orchid</TableColumn>
              <TableColumn>
                Mitigate risks with the world’s most advanced whole genome screening for embryos.
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Volantis Semiconductors</TableColumn>
              <TableColumn>Developing semiconductor chips for AI applications.</TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>
                ⍓{" "}
                <a href="https://whenere.world/" target="_blank">
                  Whenere
                </a>
              </TableColumn>
              <TableColumn>
                Enables fans of story worlds to come together, enjoy their favorite works, mod them,
                share them, and distribute them.
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn>⍓ Wilderness Labs</TableColumn>
              <TableColumn>
                Enables mainstream businesses and .NET developers to create sophisticated
                embedded-IoT solutions.
              </TableColumn>
            </TableRow>
          </Table>
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="TEXT AREA">
        Text areas are UI elements that allow users to input multiple lines of text, ideal for
        content like comments, reviews, or descriptions. Our text areas feature arrow key support,
        and a visible caret to track the cursor position. There is also an auto play feature for
        rendering text on the screen in sequence that you can interupt at anytime.
        <br />
        <br />
        <Card title="EXAMPLE">
          <TextArea />
        </Card>
        <Card title="BLINK">
          <TextArea isBlink />
        </Card>
        <Card title="PLACEHOLDER">
          <TextArea placeholder="There he took up again his great Ring in Barad-dur." />
        </Card>
        <Card title="AUTO PLAY">
          <TextArea
            autoPlay="The doom of the Elves is to be immortal, to love the beauty of the world, to bring it to full flower with their gifts of delicacy and perfection, to last while it lasts, never leaving it even when ‘slain’, but returning – and yet, when the Followers come, to teach them, and make way for them, to ‘fade’ as the Followers grow and absorb the life from which both proceed. The Doom (or the Gift) of Men is mortality, freedom from the circles of the world."
            autoPlaySpeedMS={50}
          />
        </Card>
        <Card title="AUTO PLAY SLOW">
          <TextArea
            autoPlay="All of us who do creative work, we get into it because we have good taste. But there is this gap. For the first couple years you make stuff, it’s just not that good. It’s trying to be good, it has potential, but it’s not. But your taste, the thing that got you into the game, is still killer. And your taste is why your work disappoints you."
            autoPlaySpeedMS={100}
            isBlink
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="TOOLTIP">
        Tooltips are text labels that provide additional context or explanations for user interface
        elements, appearing on hover, focus, or touch. They are used to communicate brief,
        supplementary information or clarify unlabeled controls.
        <br />
        <br />
        <Card title="EXAMPLE">
          <RowSpaceBetween>
            <HoverComponentTrigger
              component="tooltip"
              text="The future depends on what we do in the present."
            >
              <ActionButton>TOP LEFT</ActionButton>
            </HoverComponentTrigger>
            <HoverComponentTrigger
              component="tooltip"
              text="An eye for an eye only ends up making the whole world blind."
            >
              <ActionButton>TOP RIGHT</ActionButton>
            </HoverComponentTrigger>
          </RowSpaceBetween>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <RowSpaceBetween>
            <HoverComponentTrigger component="tooltip" text="Live as if you were to die tomorrow">
              <ActionButton>BOTTOM LEFT</ActionButton>
            </HoverComponentTrigger>
            <HoverComponentTrigger
              component="tooltip"
              text="The best way to find yourself is to lose yourself in the service of others."
            >
              <ActionButton>BOTTOM RIGHT</ActionButton>
            </HoverComponentTrigger>
          </RowSpaceBetween>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="TREEVIEW">
        Tree Views are hierarchical list structures that allow users to navigate nested information
        or functionalities, commonly used for parent-child relationships like file directories or
        menus.
        <br />
        <br />
        <Card title="FILE SYSTEM">
          <TreeView
            defaultValue={true}
            isRoot
            title="Animal Kingdom"
            style={{ "min-width": "71ch" }}
          >
            <TreeView defaultValue={true} title="Chordata">
              <TreeView defaultValue={true} title="Mammalia">
                <TreeView defaultValue={true} title="Primates">
                  <TreeView title="Hominidae.csv" isFile />
                  <TreeView title="Cercopithecidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Carnivora">
                  <TreeView title="Felidae.csv" isFile />
                  <TreeView title="Canidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Cetacea">
                  <TreeView title="Delphinidae.csv" isFile />
                  <TreeView title="Balaenidae.csv" isFile />
                </TreeView>
              </TreeView>
              <TreeView defaultValue={true} title="Mammalia Rejects"></TreeView>
              <TreeView defaultValue={true} title="Aves">
                <TreeView defaultValue={true} title="Passeriformes">
                  <TreeView title="Corvidae.csv" isFile />
                  <TreeView title="Fringillidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Accipitriformes">
                  <TreeView title="Accipitridae.csv" isFile />
                  <TreeView title="Pandionidae.csv" isFile />
                </TreeView>
              </TreeView>
              <TreeView defaultValue={true} title="Reptilia">
                <TreeView defaultValue={true} title="Squamata">
                  <TreeView title="Viperidae.csv" isFile />
                  <TreeView title="Iguanidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Testudines">
                  <TreeView title="Cheloniidae.csv" isFile />
                  <TreeView title="Testudinidae.csv" isFile />
                </TreeView>
              </TreeView>
            </TreeView>
            <TreeView defaultValue={true} title="Arthropoda">
              <TreeView defaultValue={true} title="Insecta">
                <TreeView defaultValue={true} title="Coleoptera">
                  <TreeView title="Coccinellidae.csv" isFile />
                  <TreeView title="Scarabaeidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Diptera">
                  <TreeView title="Culicidae.csv" isFile />
                  <TreeView title="Syrphidae.csv" isFile />
                </TreeView>
              </TreeView>
              <TreeView defaultValue={true} title="Arachnida">
                <TreeView defaultValue={true} title="Araneae">
                  <TreeView title="Salticidae.csv" isFile />
                  <TreeView title="Theraphosidae.csv" isFile />
                </TreeView>
                <TreeView defaultValue={true} title="Scorpiones">
                  <TreeView title="Buthidae.csv" isFile />
                  <TreeView title="Scorpionidae.csv" isFile />
                </TreeView>
              </TreeView>
            </TreeView>
          </TreeView>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="WINDOW">
        The Window component is the React peer of the sacred CLI framework's window primitive — a
        2ch horizontal margin, a slight off-background body fill, and a 1ch right + 1 row bottom
        drop shadow that is intentionally a step darker than the body so the panel reads as "lifted"
        from the page. Wrap any CLI port surface (CLITemplate, InvoiceTemplate, ResultsList) in
        &lt;Window&gt; to render the same dialog frame the alt-screen CLI shows.
        <br />
        <br />
        <Window>
          <Card title="WINDOW EXAMPLE" mode="left">
            This card sits inside a &lt;Window&gt;. The body uses --theme-surface-window and the
            drop shadow uses --theme-shadow-window-color — toggle the theme + tint switcher above to
            see the lift hold up across every palette.
          </Card>
        </Window>
        <br />
      </Accordion>
    </>
  );
}
