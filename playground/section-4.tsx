import { Accordion } from "../src/components/Accordion.tsx";
import { ActionButton } from "../src/components/ActionButton.tsx";
import { BarProgress } from "../src/components/BarProgress.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { HoverComponentTrigger } from "../src/components/HoverComponentTrigger.tsx";
import { ModalAlert } from "../src/components/modals/ModalAlert.tsx";
import { ModalCanvasPlatformer } from "../src/components/modals/ModalCanvasPlatformer.tsx";
import { ModalCanvasSnake } from "../src/components/modals/ModalCanvasSnake.tsx";
import { ModalChess } from "../src/components/modals/ModalChess.tsx";
import { ModalCreateAccount } from "../src/components/modals/ModalCreateAccount.tsx";
import { ModalDOMSnake } from "../src/components/modals/ModalDOMSnake.tsx";
import { ModalError } from "../src/components/modals/ModalError.tsx";
import { ModalMatrixModes } from "../src/components/modals/ModalMatrixModes.tsx";
import { ModalTrigger } from "../src/components/ModalTrigger.tsx";
import { Navigation } from "../src/components/Navigation.tsx";
import { NumberRangeSlider } from "../src/components/NumberRangeSlider.tsx";
import { RadioButtonGroup } from "../src/components/RadioButtonGroup.tsx";
import { RowSpaceBetween } from "../src/components/RowSpaceBetween.tsx";
import { Select } from "../src/components/Select.tsx";
import { SidebarLayout } from "../src/components/SidebarLayout.tsx";

export function Section4() {
  return (
    <>
      <Accordion defaultValue={true} title="MODAL">
        Modals are dialog boxes or popups that overlay the main content, requiring user interaction.
        They are used to capture inputs, display information, or focus on specific tasks without
        leaving the current context, often accompanied by an overlay to maintain focus
        <br />
        <br />
        <Card title="EXAMPLE">
          <ModalTrigger
            modal={ModalCanvasSnake}
            modalProps={{
              buttonText: "GAME OVER",
            }}
          >
            <ActionButton>Render Canvas Snake</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalDOMSnake}
            modalProps={{
              buttonText: "GAME OVER",
            }}
          >
            <ActionButton>Render DOM Snake</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalCanvasPlatformer}
            modalProps={{
              buttonText: "GAME OVER",
            }}
          >
            <ActionButton>Render Canvas Platformer</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalMatrixModes}
            modalProps={{
              buttonText: "CLOSE",
            }}
          >
            <ActionButton>Render Modal Matrix Modes</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalChess}
            modalProps={{
              board: [
                ["r", "", "", "q", "", "b", "", "r"],
                ["p", "p", "p", "b", "k", " ", " ", "p"],
                ["", "", "", "p", "", "", "B", ""],
                ["", "", "", "P", "p", "", "B", ""],
                ["", "", "P", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "P"],
                ["P", "P", " ", " ", " ", "P", "P", ""],
                ["R", " ", " ", " ", "K", "", "", "R"],
              ],
              buttonText: "CONCEDE",
              title: `CHECKMATE`,
            }}
          >
            <ActionButton>Render Modal Checkmate</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalAlert}
            modalProps={{
              message:
                'During the 1960s, Ritchie and Ken Thompson worked on the Multics operating system at Bell Labs. Thompson then found an old PDP-7 machine and developed his own application programs and operating system from scratch, aided by Ritchie and others. In 1970, Brian Kernighan suggested the name "Unix", a pun on the name "Multics". To supplement assembly language with a system-level programming language, Thompson created B. Later, B was replaced by C, created by Ritchie, who continued to contribute to the development of Unix and C for many years.',
              buttonText: "Sweet, thanks.",
            }}
          >
            <ActionButton>Render Alert Modal A</ActionButton>
          </ModalTrigger>
          <ModalTrigger
            modal={ModalAlert}
            modalProps={{
              message: `Dennis Ritchie and Ken Thompson's creation of the UNIX operating system and the C programming language were pivotal developments in the progress of computer science. Today, 50 years after its beginnings, UNIX and UNIX-like systems continue to run machinery from supercomputers to smartphones.`,
            }}
          >
            <ActionButton>Render Alert Modal B</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalAlert}
            modalProps={{
              message: `In short, no pattern is an isolated entity. Each pattern can exist in the world only to the extent that is supported by other patterns: the larger patterns in which it is embedded, the patterns of the same size that surround it, and the smaller patterns which are embedded in it.`,
            }}
          >
            <ActionButton>Render Alert Modal C</ActionButton>
          </ModalTrigger>

          <ModalTrigger modal={ModalCreateAccount}>
            <ActionButton>Render Create Account Modal</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalError}
            modalProps={{
              message: (
                <>
                  Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)
                </>
              ),
              title: `SETUP`,
            }}
          >
            <ActionButton>Error A</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalError}
            modalProps={{
              message: (
                <>
                  Boot Manager has experienced a problem.
                  <br />
                  <br />
                  Status: 0xc000000f
                  <br />
                  <br />
                  Info: An error occured transferring excecution.
                  <br />
                  <br />
                  You can try to recover the system with the Recovery Tools.
                  <br />
                  <br />
                  If the problem continues, please contact your system administrator or computer
                  manufacturer.
                </>
              ),
              title: `BOOT DRIVER`,
            }}
          >
            <ActionButton>Error B</ActionButton>
          </ModalTrigger>

          <ModalTrigger
            modal={ModalError}
            modalProps={{
              message: (
                <>
                  Although you can't use CTRL+ALT+DEL to quit an application that has stopped
                  responding in this context, there is no reason to in this state.
                  <br />
                  <br />
                  To quit this website, follow the options below or kill your browser, or choose to
                  give up and go do something else.
                </>
              ),
              title: `SACRED`,
            }}
          >
            <ActionButton>Error C</ActionButton>
          </ModalTrigger>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="NAVIGATION BAR">
        Navigation bars enable smooth transitions between top-level destinations in an app, using
        icons and text labels to represent sections.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Navigation
            logo="✶"
            left={
              <ModalTrigger
                modal={ModalError}
                modalProps={{
                  message: (
                    <>
                      Non-fatal error detected: error FOOLISH (Please contact Sacred Computer
                      support.)
                    </>
                  ),
                  title: `SETUP`,
                }}
              >
                <ActionButton>NAVIGATION ITEM A</ActionButton>
              </ModalTrigger>
            }
            right={
              <>
                <ModalTrigger modal={ModalCreateAccount}>
                  <ActionButton>SIGN IN</ActionButton>
                </ModalTrigger>
              </>
            }
          >
            <ModalTrigger
              modal={ModalError}
              modalProps={{
                message: (
                  <>
                    Boot Manager has experienced a problem.
                    <br />
                    <br />
                    Status: 0xc000000f
                    <br />
                    <br />
                    Info: An error occured transferring excecution.
                    <br />
                    <br />
                    You can try to recover the system with the Recovery Tools.
                    <br />
                    <br />
                    If the problem continues, please contact your system administrator or computer
                    manufacturer.
                  </>
                ),
                title: `BOOT DRIVER`,
              }}
            >
              <ActionButton>NAVIGATION ITEM B</ActionButton>
            </ModalTrigger>
          </Navigation>
          <Accordion defaultValue={true} title="KENYA HARA, WHITE">
            Colors do not exist separately and independently within nature; they are constantly
            shifting in response to subtle gradations of light. It is language that, magnificently,
            gives them clear shape.
          </Accordion>
          <Accordion defaultValue={true} title="KENYA HARA, WHITE">
            White can be attained by blending all the colors of the spectrum together, or through
            the substraction of ink and all other pigments. In short, it is "all colors" and "no
            color" at the same time.
          </Accordion>
          <Accordion defaultValue={true} title="KENYA HARA, WHITE">
            It is easy to think that beauty resides in the realm of creativity. Yet beauty hardly
            "appears" from nowhere. Recently, I have come to believe that we "discover" it through
            the cleaning and polishing we do to preserve things as they are. [...] The beauty of a
            temple garden rests not in the splendid features that were created by a talented
            designer; rather, its beauty is uncovered through the continual process of cleaning.
          </Accordion>
          <Accordion defaultValue={true} title="KENYA HARA, DESIGNING DESIGN">
            I used to believe that design was information architecture, and also that this
            architecture was built in the brain of an information recipient. Recently I've come to
            think that, although the materials of that architecture's construction are indeed the
            information brought from the outside by the sensory organs, at the same time some very
            important building blocks are also the recollected experiences, the memories, awakened
            by these external stimuli. People imagine the world and interpret it when outside
            stimuli awaken the mountain of their internally stored memories.
          </Accordion>
          <Accordion defaultValue={true} title="KENYA HARA, DESIGNING DESIGN">
            The human brain likes anything that entails a great amount of information. Its excessive
            capacity waits eagerly to perceive the world by completely exhausting its great
            receptive powers. That potential power, though, remains today in a state of extreme
            constriction and is a source of the information stress we're all under.
          </Accordion>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="POPOVER">
        Popovers are transient views that appear above content when users interact with an
        associated element, offering relevant information, details, or interactive content like
        actions or form elements.
        <br />
        <br />
        <Card title="EXAMPLE">
          <RowSpaceBetween>
            <HoverComponentTrigger component="popover" text="An old silent pond">
              <ActionButton>TOP LEFT</ActionButton>
            </HoverComponentTrigger>
            <HoverComponentTrigger component="popover" text="A world of dew">
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
            <HoverComponentTrigger component="popover" text="The light of a candle">
              <ActionButton>BOTTOM LEFT</ActionButton>
            </HoverComponentTrigger>
            <HoverComponentTrigger component="popover" text="I write, erase, rewrite">
              <ActionButton>BOTTOM RIGHT</ActionButton>
            </HoverComponentTrigger>
          </RowSpaceBetween>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="PROGRESS BARS">
        Progress bars are visual indicators that display the completion status of tasks or
        processes. Ours allow for custom fill characters.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Card mode="left" title="0%">
            <BarProgress progress={0} />
          </Card>

          <Card mode="left" title="25%">
            <BarProgress progress={25} />
          </Card>

          <Card mode="left" title="50%">
            <BarProgress progress={50} />
          </Card>

          <Card mode="left" title="75%">
            <BarProgress progress={75} fillChar={`(✿﹏●)`} />
          </Card>

          <Card mode="left" title="75%">
            <BarProgress progress={75} />
          </Card>

          <Card mode="left" title="100%">
            <BarProgress progress={100} />
          </Card>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="RADIO BUTTONS">
        Radio buttons are visual controls that let users make a single selection from a predefined
        set of mutually exclusive options. Represented as small circles that fill when selected,
        they are used when all options need to be visible and only one can be chosen.
        <br />
        <br />
        <CardDouble title="METHOD">
          You’re at the very beginning of designing your operating system. How do you choose to
          start?
          <br />
          <br />
          <RadioButtonGroup
            defaultValue="one"
            options={[
              {
                value: "one",
                label:
                  "Custom Linux Kernel Derivative: Start with a minimal Linux kernel (e.g., a stripped-down mainline LTS release), integrate essential device drivers, and build out a tailored init process.",
              },
              {
                value: "two",
                label:
                  "AOSP Base: Leverage an AOSP-derived HAL and system services, using BSP integration and existing frameworks as a foundation for rapid device bring-up.",
              },
              {
                value: "three",
                label:
                  "Microkernel Approach: Implement a microkernel (e.g., seL4) to strictly separate core services, relying on IPC mechanisms and user-space servers to manage drivers, file systems, and device I/O.",
              },
            ]}
          />
        </CardDouble>
        <CardDouble title="INTERFACE">
          How will you implement your interface layer?
          <br />
          <br />
          <RadioButtonGroup
            defaultValue="four"
            options={[
              {
                value: "four",
                label:
                  "Native GUI Shell + EGL/Wayland: Use a lean, native toolkit with hardware-accelerated rendering (EGL), compositing via Wayland, and minimal shell protocols.",
              },
              {
                value: "five",
                label:
                  "Adapted Android Framework: Employ the Android UI stack (SurfaceFlinger, View hierarchy), integrating Material Components as baseline UI elements, and build custom system apps via Jetpack.",
              },
              {
                value: "six",
                label:
                  "Custom-Compositor + Custom Widgets: Implement a dedicated compositor (e.g., custom Weston derivative) and write your own widget toolkit in C++/Rust, managing input events and layouts directly.",
              },
            ]}
          />
        </CardDouble>
        <CardDouble title="SECURITY">
          How will you handle security and lifecycle management?
          <br />
          <br />
          <RadioButtonGroup
            defaultValue="seven"
            options={[
              {
                value: "seven",
                label:
                  "Signed Kernel/OS Updates + Verified Boot: Use a secure bootloader chain (e.g., U-Boot with verified boot), sign OTA payloads, and apply delta updates with rollback support.",
              },
              {
                value: "eight",
                label:
                  "TEE Integration + SELinux Policies: Embed a Trusted Execution Environment (e.g., ARM TrustZone), enforce SELinux policies system-wide, and apply monthly patch-level updates from upstream code sources.",
              },
              {
                value: "nine",
                label:
                  "Containerized Services + Granular Permissions: Run system services and third-party apps in containerized sandboxes (LXC, cgroups, seccomp), enforce capability-based permissions, and manage rolling updates at a container or microservice level.",
              },
            ]}
          />
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="SELECT">
        Select components are user interface controls that let users choose an option from a
        dropdown list. They display a list of options and collapse to show the selected choice,
        making them ideal for scenarios with limited space and multiple options.
        <br />
        <br />
        <Card title="EXAMPLE">
          What is your favorite dinosaur?
          <br />
          <br />
          <Select
            name="favorite_dinosaur"
            options={[
              "T-Rex",
              "Triceratops",
              "Velociraptor",
              "Stegosaurus",
              "Brachiosaurus",
              "Diplodocus",
              "Spinosaurus",
              "Allosaurus",
              "Ankylosaurus",
              "Iguanodon",
              "Parasaurolophus",
              "Pachycephalosaurus",
              "Pteranodon",
              "Apatosaurus",
              "Archaeopteryx",
              "Oviraptor",
              "Gallimimus",
              "Ceratosaurus",
              "Deinonychus",
              "Megalosaurus",
            ]}
            defaultValue="T-Rex"
            placeholder="Select your favorite dinosaur..."
          />
          <br />
          What is your favorite deep sea animal?
          <br />
          <br />
          <Select
            name="favorite_deepsea_animal"
            options={[
              "Giant Squid",
              "Vampire Squid",
              "Anglerfish",
              "Goblin Shark",
              "Fangtooth Fish",
              "Dumbo Octopus",
              "Frilled Shark",
              "Blobfish",
              "Barreleye Fish",
              "Lanternfish",
              "Viperfish",
              "Gulper Eel",
              "Sea Spider",
              "Dragonfish",
              "Cookiecutter Shark",
              "Hagfish",
              "Chimaera",
              "Deep Sea Octopus",
              "Sea Pig",
              "Sea Cucumber",
            ]}
            defaultValue="Giant Squid"
            placeholder="Select your favorite deep sea creature..."
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="SIDEBAR LAYOUT">
        Sidebars are navigational panels that provide access to secondary actions or additional
        information. They can be static, collapsible, or resizable, adapting to design needs and
        screen sizes.
        <br />
        <br />
        <CardDouble title="QUOTES">
          <SidebarLayout
            isShowingHandle={true}
            sidebar={
              <>
                “I want each of you to go through life making the most of your individuality. Like
                it or not, you will go out into the real world and be treated as an adult. Adults
                show each other no mercy. If you fail to cultivate within yourself a fight-back
                mentality, society will end up controlling you.” <br />
                <br /> “Travel changes you. As you move through this life and this world you change
                things slightly, you leave marks behind, however small. And in return, life - and
                travel - leaves marks on you. Most of the time, those marks - on your body or on
                your heart - are beautiful. Often, though, they hurt.”
              </>
            }
          >
            “Never give up. Discover your own options, never count on others and have faith in the
            paths you discover for yourself. If someone else approves of this new way of life, all
            the better.”
            <br />
            <br />
            “I do think the idea that basic cooking skills are a virtue, that the ability to feed
            yourself and a few others with proficiency should be taught to every young man and woman
            as a fundamental skill, should become as vital to growing up as learning to wipe one’s
            own ass, cross the street by oneself, or be trusted with money.”
          </SidebarLayout>
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="SLIDER">
        Sliders are interactive UI elements that let users select a single value or range from a
        continuum. Designed as a horizontal track with a draggable handle, they are ideal for
        adjusting settings like volume, brightness, or color saturation.
        <br />
        <br />
        <Card title="EXAMPLE">
          <NumberRangeSlider defaultValue={0} min={0} max={5000} step={1} />
          <NumberRangeSlider defaultValue={0} min={0} max={10000} step={1} />
          <NumberRangeSlider defaultValue={0} min={0} max={15000} step={1} />
          <NumberRangeSlider defaultValue={0} min={0} max={20000} step={1} />
          <NumberRangeSlider defaultValue={0} min={0} max={100000} step={1} />
        </Card>
        <br />
      </Accordion>
    </>
  );
}
