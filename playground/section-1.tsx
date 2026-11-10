import { Accordion } from "../src/components/Accordion.tsx";
import { ActionBar } from "../src/components/ActionBar.tsx";
import { ActionButton } from "../src/components/ActionButton.tsx";
import { ActionListItem } from "../src/components/ActionListItem.tsx";
import { AlertBanner } from "../src/components/AlertBanner.tsx";
import { ASCIICanvas } from "../src/components/ASCIICanvas.tsx";
import { Avatar } from "../src/components/Avatar.tsx";
import { Badge } from "../src/components/Badge.tsx";
import { BarLoader } from "../src/components/BarLoader.tsx";
import { BlockLoader } from "../src/components/BlockLoader.tsx";
import { Card } from "../src/components/Card.tsx";
import { AS400 } from "../src/components/examples/AS400.tsx";
import { CLITemplate } from "../src/components/examples/CLITemplate.tsx";
import { InvoiceTemplate } from "../src/components/examples/InvoiceTemplate.tsx";
import { OneLineLoaders } from "../src/components/examples/OneLineLoaders.tsx";
import { ResultsList } from "../src/components/examples/ResultsList.tsx";
import { Indent } from "../src/components/Indent.tsx";

export function Section1() {
  return (
    <>
      <Accordion defaultValue={true} title="ACTION BAR">
        The action bar is a container for primary and secondary actions styled with a monospace
        font. Positioned at the top or bottom of an interface, it organizes elements like menu
        options, navigation buttons, titles, or search fields.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ActionBar
            items={[
              {
                hotkey: "⌘+1",
                body: "Example I",
              },
              {
                hotkey: "⌘+2",
                body: "Example II",
              },
              {
                hotkey: "⌘+3",
                body: "Example III",
              },
            ]}
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ACCORDION">
        Accordion components are vertically stacked, expandable panels designed for efficient use of
        space in monospace-driven layouts, often inspired by classic terminal interfaces. Each panel
        consists of a header and its corresponding content area, allowing users to toggle between a
        condensed summary and detailed information.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Accordion defaultValue={false} title="ACCORDION EXAMPLE">
            There are two visions of America a half century from now. One is of a society more
            divided between the haves and the have-nots, a country in which the rich live in gated
            communities, send their children to expensive schools, and have access to first-rate
            medical care. Meanwhile, the rest live in a world marked by insecurity, at best mediocre
            education, and in effect rationed health care―they hope and pray they don't get
            seriously sick. At the bottom are millions of young people alienated and without hope. I
            have seen that picture in many developing countries; economists have given it a name, a
            dual economy, two societies living side by side, but hardly knowing each other, hardly
            imagining what life is like for the other. Whether we will fall to the depths of some
            countries, where the gates grow higher and the societies split farther and farther
            apart, I do not know. It is, however, the nightmare towards which we are slowly
            marching.
          </Accordion>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ACTION BUTTONS">
        Action buttons let users perform actions. They are used for task-based options within a
        workflow and work well in interfaces where buttons need to stay understated.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ActionButton hotkey="⌘+S">Save</ActionButton>
          <br />
          <ActionButton>Loading</ActionButton>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ACTION LIST">
        Action lists are a vertical list of interactive actions or options. It displays items in a
        single-column format with space for icons, descriptions, side information, and other
        visuals. The monospace font ensures clarity and consistency.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ActionListItem icon={`⭡`}>Hide item example</ActionListItem>
          <ActionListItem icon={`⭢`}>Next item example</ActionListItem>
          <ActionListItem icon={`⭣`}>Show item example</ActionListItem>
          <ActionListItem icon={`⭠`} href="/">
            Return item example
          </ActionListItem>
          <ActionListItem icon={`⊹`}>Action item example</ActionListItem>
          <ActionListItem icon={`⊹`} href="https://internet.dev" target="_blank">
            Visit the studio website
          </ActionListItem>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ALERT BANNER">
        Alert banners display important messages across the user interface. It communicates
        system-wide issues, errors, warnings, or informational updates. Typically placed at the top
        of a page, it includes a clear message and may provide an action for the user. Alert Banners
        can be dismissed after being read, helping users stay informed about significant changes or
        information.
        <br />
        <br />
        <Card title="EXAMPLE">
          <AlertBanner>When things reach the extreme, they alternate to the opposite.</AlertBanner>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="APPLICATION SYSTEM/400 EXAMPLE">
        The Application System 400 (AS/400) is a line of servers and network adapters from IBM that
        was designed to help businesses manage their data, applications, and systems infrastructure.
        This usage example is a tribute to the interfaces those servers had.
        <br />
        <br />
        <AS400 />
        <br />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="CLI TEMPLATE EXAMPLE">
        This is a component we use to test porting to either another hostile/foreign React codebase
        or CLI implementation in either TypeScript or Python. You can use this component to test and
        make sure things look exactly the same between Terminal Land and React browser land.
        <br />
        <br />
        <CLITemplate />
        <br />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="INVOICE TEMPLATE EXAMPLE">
        This component is an example invoice you can use in both a terminal context and the React
        web context.
        <br />
        <br />
        <InvoiceTemplate />
        <br />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="RESULTS LIST EXAMPLE">
        This component is an example of a list you can use in both a terminal context and the React
        web context.
        <br />
        <br />
        <ResultsList />
        <br />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ONE LINE LOADERS EXAMPLE">
        These are examples of loaders we typically see in CLIs like claude-code. You can use these
        both in the React or CLI context.
        <br />
        <br />
        <OneLineLoaders />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="ASCII CANVAS">
        Animated ASCII art rendered in a pre element using per-cell span elements with DOM diffing.
        IntersectionObserver pauses animation when off-screen to save CPU. ResizeObserver
        recalculates column count on container resize.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ASCIICanvas rows={20} />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="AVATARS">
        Avatars identify users or entities in the interface. It can display an image, initials, or
        an icon, offering a visual connection to the user. Avatars appear in headers, comments,
        profiles, and messages. They provide quick recognition and add a personal touch to the
        digital experience.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Avatar
            src="https://pbs.twimg.com/profile_images/1958569334726668288/GFE8mhKI_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/1989080994687991809/CoUHUW0A_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/2111650312314638336/qsx-UDAb_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/1953144649725431808/fbHIGXnV_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/2090924616269414400/q7qc0FcP_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://osoi4zg5m42do5ig.public.blob.vercel-storage.com/rishav.avif"
            href="https://internet.dev"
            target="_blank"
          />
          <Avatar
            src="https://pbs.twimg.com/profile_images/2086911496098070528/eV9UzyBw_400x400.jpg"
            href="https://internet.dev"
            target="_blank"
          />
          <br />
          <br />
          <Avatar
            src="https://pbs.twimg.com/profile_images/1958569334726668288/GFE8mhKI_400x400.jpg"
            href="https://x.com/aalimbuyuguen"
            target="_blank"
          >
            <Indent>
              ANDREW ALIMBUYUGUEN
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg"
            href="https://x.com/elijaharita"
            target="_blank"
          >
            <Indent>
              ELIJAH SEED ARITA
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/1989080994687991809/CoUHUW0A_400x400.jpg"
            href="https://x.com/caidanwilliams"
            target="_blank"
          >
            <Indent>
              CAIDAN WILLIAMS
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/2111650312314638336/qsx-UDAb_400x400.jpg"
            href="https://x.com/hellohsuh"
            target="_blank"
          >
            <Indent>
              HANNAH SUH
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/1953144649725431808/fbHIGXnV_400x400.jpg"
            href="https://x.com/vaniagrwall"
            target="_blank"
          >
            <Indent>
              VANI AGARWAL
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/2090924616269414400/q7qc0FcP_400x400.jpg"
            href="https://x.com/solruck"
            target="_blank"
          >
            <Indent>
              SOL RUCK
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://osoi4zg5m42do5ig.public.blob.vercel-storage.com/rishav.avif"
            href="https://github.com/rishavkundu"
            target="_blank"
          >
            <Indent>
              RISHAV KUNDU
              <br />
              Webmaster
            </Indent>
          </Avatar>
          <Avatar
            src="https://pbs.twimg.com/profile_images/2086911496098070528/eV9UzyBw_400x400.jpg"
            href="https://x.com/wwwjim"
            target="_blank"
          >
            <Indent>
              JIMMY LEE
              <br />
              Staff Janitor
            </Indent>
          </Avatar>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BADGES">
        Badges communicate status, notification counts, or attribute labels. Typically circular or
        pill-shaped, they display a number or short text, often overlaid on an icon or element.
        Badges highlight updates, unread messages, or categorize items with status indicators. They
        provide critical information at a glance, improving navigation and user engagement.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Badge>Example</Badge>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BAR LOADER">
        A long loader is a visual element that signals ongoing activity or progress, reassuring
        users that a task is being processed. Commonly used during actions like data fetching or
        file uploads, it provides feedback to reduce uncertainty.
        <br />
        <br />
        <Card title="EXAMPLE">
          <BarLoader intervalRate={1000} />
          <BarLoader intervalRate={100} />
          <BarLoader progress={50} />
          <BarLoader progress={100} />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BLOCK LOADER">
        A block loader is a visual indicator that signals ongoing activity or progress while
        occupying only a single character of space. It reassures users that a task is being
        processed or that activity is occurring.
        <br />
        <br />
        <Card title="EXAMPLE">
          <BlockLoader mode={0} />
          <br />
          <BlockLoader mode={1} />
          <br />
          <BlockLoader mode={2} />
          <br />
          <BlockLoader mode={3} />
          <br />
          <BlockLoader mode={4} />
          <br />
          <BlockLoader mode={5} />
          <br />
          <BlockLoader mode={6} />
          <br />
          <BlockLoader mode={7} />
          <br />
          <BlockLoader mode={8} />
          <br />
          <BlockLoader mode={9} />
          <br />
          <BlockLoader mode={10} />
          <br />
          <BlockLoader mode={11} />
        </Card>
        <br />
      </Accordion>
    </>
  );
}
