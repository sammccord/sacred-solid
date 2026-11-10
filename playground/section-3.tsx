import { Accordion } from "../src/components/Accordion.tsx";
import { ActionButton } from "../src/components/ActionButton.tsx";
import { ActionListItem } from "../src/components/ActionListItem.tsx";
import { BlockLoader } from "../src/components/BlockLoader.tsx";
import { Button } from "../src/components/Button.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { Checkbox } from "../src/components/Checkbox.tsx";
import { ContentFluid } from "../src/components/ContentFluid.tsx";
import { Dialog } from "../src/components/Dialog.tsx";
import { Divider } from "../src/components/Divider.tsx";
import { Drawer } from "../src/components/Drawer.tsx";
import { DropdownMenuTrigger } from "../src/components/DropdownMenuTrigger.tsx";
import { Grid } from "../src/components/Grid.tsx";
import { Input } from "../src/components/Input.tsx";
import { ListItem } from "../src/components/ListItem.tsx";
import { Message } from "../src/components/Message.tsx";
import { MessageViewer } from "../src/components/MessageViewer.tsx";
import { MessagesInterface } from "../src/components/examples/MessagesInterface.tsx";
import { RadioButtonGroup } from "../src/components/RadioButtonGroup.tsx";
import { RowSpaceBetween } from "../src/components/RowSpaceBetween.tsx";

export function Section3() {
  return (
    <>
      <Accordion defaultValue={true} title="DIALOG">
        Dialog components overlay the main content—reminiscent of early graphical interfaces—to
        capture a user’s focus for tasks requiring input, a choice, or confirmation without leaving
        the current context.
        <br />
        <br />
        <Card title="EXAMPLE">
          <br />
          <br />
          <Dialog title="FAREWELL">
            There are unsaved changes.
            <br />
            Are you sure you want to start the new year?
          </Dialog>
          <br />
          <br />
          <Dialog title="START OVER">
            The 2025 session is nearly out of time.
            <br />
            Delete progress and start over in 2026?
          </Dialog>
          <br />
          <br />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DIVIDER">
        A divider separates sections of content, creating clear distinctions between related groups.
        It is typically a line or space, oriented horizontally or vertically based on the layout.
        Divider helps organize information, improve readability, and enhance the interface’s clarity
        and structure.
        <br />
        <br />
        <CardDouble title="ENTROPY">
          Any sense of order or stability inevitably crumbles. The entire universe follows a dismal
          trek toward a dull state of ultimate turmoil.
          <br />
          <br />
          <Divider />
          <br />
          To keep track of this cosmic decay, physicists employ a concept called entropy. Entropy is
          a measure of disorderliness, and the declaration that entropy is always on the rise —
          known as the second law of thermodynamics — is among nature’s most inescapable
          commandments.
          <br />
          <br />
          <Divider type="DOUBLE" />
          <br />
          I have long felt haunted by the universal tendency toward messiness. Order is fragile. It
          takes months of careful planning and artistry to craft a vase but an instant to demolish
          it with a soccer ball. We spend our lives struggling to make sense of a chaotic and
          unpredictable world, where any attempt to establish control seems only to backfire.
          <br />
          <br />
          <Divider type="GRADIENT" />
          <br />
          The second law demands that machines can never be perfectly efficient, which implies that
          whenever structure arises in the universe, it ultimately serves only to dissipate energy
          further — be it a star that eventually explodes or a living organism converting food into
          heat. We are, despite our best intentions, agents of entropy.
          <br />
          <br />
          <Divider type="GRADIENT" />
          <br />
          “Nothing in life is certain except death, taxes and the second law of thermodynamics,”
          wrote Seth Lloyd, a physicist at the Massachusetts Institute of Technology. There’s no
          sidestepping this directive. The growth of entropy is deeply entwined with our most basic
          experiences, accounting for why time runs forward and why the world appears deterministic
          rather than quantum mechanically uncertain.
          <br />
          <br />
          <Divider type="GRADIENT" />
          <br />— Zack Savitzky
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DRAWER">
        A drawer is a panel that slides in from the screen edge, providing space for secondary
        content, actions, or navigation links while keeping the main content uninterrupted.
        <br />
        <br />
        <CardDouble title="INTRO(1)">
          <RowSpaceBetween>
            <Drawer>
              <ActionListItem icon={`⊹`}>User Commands</ActionListItem>
              <ActionListItem icon={`⊹`}>System Calls</ActionListItem>
              <ActionListItem icon={`⊹`}>C Library Functions</ActionListItem>
              <ActionListItem icon={`⊹`}>Devices and Special Files</ActionListItem>
              <ActionListItem icon={`⊹`}>File Formats and Conventions</ActionListItem>
              <ActionListItem icon={`⊹`}>Games et. Al.</ActionListItem>
              <ActionListItem icon={`⊹`}>Miscellanea</ActionListItem>
              <ActionListItem icon={`⊹`}>System Administration</ActionListItem>
              <ActionListItem icon={`⊹`}>Tools</ActionListItem>
              <ActionListItem icon={`⊹`}>Daemons</ActionListItem>
            </Drawer>
            <ContentFluid>
              INTRODUCTION
              <br />
              <br />
              Section 1 of the manual describes user commands and tools, for example, file
              manipulation tools, shells, compilers, web browsers, file and image viewers and
              editors, and so on. All commands yield a status value on termination. This value can
              be tested (e.g., in most shells the variable $? contains the status of the last
              executed command) to see whether the command completed successfully. A zero exit
              status is conventionally used to indicate success, and a nonzero status means that the
              command was unsuccessful. (Details of the exit status can be found in wait(2).) A
              nonzero exit status can be in the range 1 to 255, and some commands use different
              nonzero status values to indicate the reason why the command failed.
            </ContentFluid>
          </RowSpaceBetween>
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DROPDOWN MENU">
        A dropdown menu is an interactive element that lets users select an option from a
        collapsible menu, saving space by hiding options until needed.
        <br />
        <br />
        <Card title="EXAMPLE">
          <RowSpaceBetween>
            <DropdownMenuTrigger
              items={[
                { icon: "⊹", children: "F1 - Help" },
                { icon: "⊹", children: "F2 - Custom Help" },
                { icon: "⊹", children: "F3 - Directory" },
                { icon: "⊹", children: "F4 - Locate File" },
                { icon: "⊹", children: "F5 - Change Drive" },
                { icon: "⊹", children: "F6 - Change Directory" },
                { icon: "⊹", children: `F7 - DOS Command` },
                { icon: "⊹", children: "F8 - Set Time/Date" },
                { icon: "⊹", children: "F9 - Disk Space" },
                { icon: "⊹", children: "F10 - Copy Files" },
              ]}
            >
              <ActionButton>TOP LEFT</ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger
              items={[
                { icon: "⭡", children: "Restore from Time Machine" },
                { icon: "⭢", children: "Reinstall macOS Ventura" },
                { icon: "⭣", children: "Safari" },
                { icon: "⭠", children: "Disk Utility" },
                {
                  icon: "⊹",
                  children: "Visit Search System",
                  href: "https://searchsystem.co/",
                  target: "_blank",
                },
              ]}
            >
              <ActionButton>TOP RIGHT</ActionButton>
            </DropdownMenuTrigger>
          </RowSpaceBetween>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <RowSpaceBetween>
            <DropdownMenuTrigger
              items={[
                { icon: "⊹", children: "Safe mode" },
                { icon: "⊹", children: "Safe mode with Networking" },
                { icon: "⊹", children: "Safe Mode with Command Prompt" },
                { icon: "⊹", children: "Enable Boot Logging" },
                { icon: "⊹", children: "Enable low-resolution video (640x480)" },
                { icon: "⊹", children: "Last Known Good Configuration (advanced)" },
                { icon: "⊹", children: `Direcotry Services Restore Node` },
                { icon: "⊹", children: "Debugging Mode" },
                { icon: "⊹", children: "Disable automatic restart on system failure" },
                { icon: "⊹", children: "Disable Driver Signature Enforcement" },
              ]}
            >
              <ActionButton>BOTTOM LEFT</ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger
              items={[
                { icon: "⊹", children: "Create New Menu" },
                { icon: "⊹", children: "Edit a Menu" },
                { icon: "⊹", children: "Remove A Menu" },
                { icon: "⊹", children: "DOS Password" },
                { icon: "⊹", children: "Screen Saver" },
                { icon: "⊹", children: "Company Name" },
                { icon: "⊹", children: `Set Swap Drive` },
                { icon: "⊹", children: "Select Colors" },
                { icon: "⊹", children: "Sound On/Off" },
                { icon: "⊹", children: "Save all Menus" },
                { icon: "⊹", children: "Leave Setup" },
              ]}
            >
              <ActionButton>BOTTOM RIGHT</ActionButton>
            </DropdownMenuTrigger>
          </RowSpaceBetween>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="EMPTY STATE">
        An empty state informs users when no content is available, such as for first-time users,
        empty searches, or errors.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Grid>WORK IN PROGRESS</Grid>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="INPUT">
        An input field is a fundamental UI component that allows users to enter and edit text or
        numerical data. It is commonly used in forms, search bars, and other interfaces requiring
        user input.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Input
            label="MULTIPLE INPUTS"
            autocomplete="off"
            isBlink={false}
            name="input_test_empty"
          />
          <Input autocomplete="off" isBlink={false} name="input_test_empty" />
          <Input autocomplete="off" isBlink={false} name="input_test_empty" />
          <Input autocomplete="off" isBlink={false} label="EMPTY CASE" name="input_test_one" />
          <Input
            autocomplete="off"
            isBlink={false}
            placeholder="All the world is a stage"
            label="PLACEHOLDER"
            name="input_test_two"
          />
          <Input
            autocomplete="off"
            isBlink={false}
            label="PASSWORD"
            type="password"
            name="input_test_password"
          />
          <Input autocomplete="off" isBlink={true} label="CARET BLINK" name="input_test_blink" />
          <Input
            autocomplete="off"
            caretChars="(✿﹏●)"
            isBlink={true}
            label="CUSTOM CARET TEXT"
            name="input_test_caret"
          />
          <Input
            autocomplete="off"
            caretChars="⌫ ERROR"
            isBlink={false}
            label="CUSTOM CARET TEXT"
            name="input_test_single_caret"
          />
          <Input
            autocomplete="off"
            caretChars={<BlockLoader mode={6} />}
            isBlink={false}
            label="CUSTOM CARET LOADER"
            name="input_test_single_caret"
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="FORM">
        A form is a key interface element for collecting user inputs.
        <br />
        <br />
        <CardDouble title="NEW ACCOUNT">
          Create a new MakeBelieve™ account, where anything is possible at your command line in the
          browser.
          <br />
          <br />
          <RadioButtonGroup
            defaultValue="test_individual"
            options={[
              { value: "test_individual", label: "I’m using this for personal use." },
              { value: "test_developer", label: "I’m building or creating something for work." },
              { value: "test_company", label: "We’re using this as a team or organization." },
            ]}
          />
          <br />
          <Input
            autocomplete="off"
            label="USERNAME"
            placeholder="Choose a username (e.g., SurfGirl29)"
            name="test_username"
          />
          <Input
            autocomplete="off"
            label="PASSWORD"
            placeholder="Create a password (8+ characters)"
            type="password"
            name="test_password"
          />
          <Input
            autocomplete="off"
            label="CONFIRM"
            placeholder="Type it again"
            type="password"
            name="test_confirm"
          />
          <br />
          <Checkbox name="test_terms">
            I agree to the Terms of Service, Data Privacy Policy, and Acceptable Use Guidelines.
          </Checkbox>
          <Checkbox name="test_goodwill">
            I agree not to use this service for unlawful purposes.
          </Checkbox>
          <br />
          <Button>Create an account</Button>
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="LINK">
        Links are interactive elements that enable navigation within an application or to external
        resources, typically styled with underlining or distinct colors to indicate clickability.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ol>
            <ListItem>
              <a href="https://www.tumblr.com/tagged/hiroo%20isono" target="_blank">
                Hirō Isono
              </a>
            </ListItem>
            <ListItem>
              <a href="https://www.tumblr.com/tagged/rebecca%20guay" target="_blank">
                Rebecca Guay
              </a>
            </ListItem>
            <ListItem>
              <a href="https://www.tumblr.com/tagged/terese%20nielsen" target="_blank">
                Terese Nielsen
              </a>
            </ListItem>
            <ListItem>
              <a href="https://www.tumblr.com/tagged/pablo%20uchida" target="_blank">
                Pablo Uchida
              </a>
            </ListItem>
            <ListItem>
              <a href="https://www.tumblr.com/tagged/claude%20monet" target="_blank">
                Oscar-Claude Monet
              </a>
            </ListItem>
            <ol>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Impressionism" target="_blank">
                  Impressionism
                </a>
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/Modernism" target="_blank">
                  Modernism
                </a>
              </ListItem>
              <ListItem>
                <a href="https://en.wikipedia.org/wiki/En_plein_air" target="_blank">
                  Painting Outdoors
                </a>
              </ListItem>
            </ol>
          </ol>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="LIST">
        Lists are flexible interface elements used to display a series of items in an organized way.
        They are often used to present data, menu options, or search results and can be ordered or
        unordered, with interactive elements like checkboxes or buttons.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ol>
            <ListItem>Year of the Four Emperors</ListItem>
            <ListItem>Flavian dynasty</ListItem>
            <ListItem>Nerva–Antonine dynasty</ListItem>
            <ol>
              <ListItem>Marcus Cocceius Nerva</ListItem>
              <ListItem>Marcus Ulpius Traianus</ListItem>
              <ListItem>Publius Aelius Hadrianus</ListItem>
              <ListItem>Titus Aelius Hadrianus Antoninus Pius</ListItem>
              <ListItem>Marcus Aurelius Antoninus</ListItem>
              <ol>
                <ListItem>Hellenistic philosophy</ListItem>
                <ListItem>Western philosophy</ListItem>
                <ListItem>Stoicism</ListItem>
              </ol>
            </ol>
            <ListItem>Year of the Five Emperors</ListItem>
          </ol>
          <br />
          <ul>
            <ListItem>Book of Changes (The I Ching)</ListItem>
            <ListItem>The Analects</ListItem>
            <ListItem>Taoism</ListItem>
            <ListItem>Thirty-Six Stratagems</ListItem>
            <ul>
              <ListItem>Deceive the heavens to cross the sea</ListItem>
              <ListItem>Make a sound in the east, then strike in the west</ListItem>
              <ListItem>Create something from nothing</ListItem>
            </ul>
            <ListItem>The Art of War</ListItem>
            <ListItem>Wuzi</ListItem>
            <ListItem>Six Secret Teachings</ListItem>
          </ul>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="MESSAGES">
        Messages in this library present a modern messaging experience through an MS-DOS–inspired
        aesthetic. Instead of rounded speech bubbles, messages appear in simple rectangular boxes,
        evoking a nostalgic, classic PC feel.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Message>
            You create the world of the dream, you bring the subject into that dream, and they fill
            it with their subconscious.
          </Message>
          <MessageViewer>
            How could I ever acquire enough detail to make them think that its reality?
          </MessageViewer>
          <Message>
            Well dreams, they feel real while we're in them, right? It's only when we wake up that
            we realize how things are actually strange.
          </Message>
          <Message>
            Let me ask you a question, you, you never really remember the beginning of a dream do
            you? You always wind up right in the middle of what's going on.
          </Message>
          <MessageViewer>I guess, yeah.</MessageViewer>
          <Message>So how did we end up here?</Message>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="MESSAGES INTERFACE">
        This example combines the aesthetics of iMessage and IRSSI with a terminal-inspired design.
        It shows how easy it is to embed a simple web application into your website.
        <br />
        <br />
        <Card title="MESSAGES">
          <MessagesInterface />
          <br />
        </Card>
        <br />
        <br />
      </Accordion>
    </>
  );
}
