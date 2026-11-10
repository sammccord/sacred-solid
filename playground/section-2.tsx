import * as Constants from "../src/common/constants.ts";
import { Accordion } from "../src/components/Accordion.tsx";
import { Avatar } from "../src/components/Avatar.tsx";
import { BreadCrumbs } from "../src/components/BreadCrumbs.tsx";
import { Button } from "../src/components/Button.tsx";
import { ButtonGroup } from "../src/components/ButtonGroup.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { Checkbox } from "../src/components/Checkbox.tsx";
import { Chessboard } from "../src/components/Chessboard.tsx";
import { CodeBlock } from "../src/components/CodeBlock.tsx";
import { ComboBox } from "../src/components/ComboBox.tsx";
import { DashboardRadar } from "../src/components/examples/DashboardRadar.tsx";
import { Denabase } from "../src/components/examples/Denabase.tsx";
import { UpdatingDataTable } from "../src/components/examples/UpdatingDataTable.tsx";
import { DataTable } from "../src/components/DataTable.tsx";
import { DatePicker } from "../src/components/DatePicker.tsx";
import { Divider } from "../src/components/Divider.tsx";
import { Indent } from "../src/components/Indent.tsx";
import { Row } from "../src/components/Row.tsx";

export function Section2() {
  return (
    <>
      <Accordion defaultValue={true} title="BLOG POST">
        A blog post can be composed of various components from our component repository. Typically,
        blog posts include breadcrumbs, an avatar, the author’s name, the publication date, and the
        blog post content.
        <br />
        <br />
        <CardDouble title="POST">
          <BreadCrumbs
            items={[
              {
                name: `Christopher Alexander`,
                url: "https://www.youtube.com/watch?v=98LdFA-_zfA",
              },
              {
                name: `The Nature of Order`,
                url: "http://www.natureoforder.com/overview.htm",
              },
              {
                name: `Book 1: The Phenomenon of Life`,
              },
              {
                name: `A World Picture`,
              },
            ]}
          />
          <br />
          <br />
          <Avatar
            src="https://upload.wikimedia.org/wikipedia/commons/0/0f/ChristopherAlexander2012_cropped.jpg"
            href="https://internet.dev"
            target="_blank"
          >
            <Indent>
              CHRISTOPHER ALEXANDER
              <br />
              1-1-2002
            </Indent>
          </Avatar>
          <br />
          <Divider type="DOUBLE" />
          <br />
          <br />
          <br />
          <br />
          I believe that we have in us a residue of a world-picture which is essentially mechanical
          in nature – what we might call the mechanist-rationalist world picture ... Like an
          infection it has entered us, it affects our actions, it affects our morals, it affects our
          sense of beauty.
          <br />
          <br />
          This is a picture of a world made of atoms which whirl around in a mechanical fashion: a
          world in which it is assumed that all the universe is a blind mechanism, whirling on its
          way, under the impact of the ‘laws of nature.’ These laws are, essentially, those
          mechanistic laws which explain how the atoms and the structures made of these atoms
          proceed on their way ... Even though we would admit that the precise laws and mechanisms
          may not be known, we assume that underlying our ignorance there are some laws, not quite
          formulated, which do account for how things work ...
          <br />
          <br />
          I have reached the conclusion that the strange fantasies, the private in-house language
          about architecture, the strange nature of 20th-century gallery art, deconstructionism,
          postmodernism, modernism and a host of other ‘isms’, all of which affect our physical
          world hugely, are created because of an entanglement between the nature of architecture,
          the practice of architecture, and the mechanical conception of the universe.
          <br />
          <br />
          More precisely, I believe that the mistake and confusion in our picture of the the art of
          building has come from our conception of what matter is.
          <br />
          <br />
          The present conception of matter, and the opposing one which I shall try to put in its
          place, may both be summarized by the nature of order. Our idea of matter is essentially
          governed by our idea of order ... So it is the nature of order which lies at the root of
          the problem of architecture ...
          <br />
          <br />
          When we understand what order is, I believe we shall better understand what matter is and
          then what the universe itself is.
        </CardDouble>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BREADCRUMBS">
        Breadcrumbs display the current page or context within a website or application. They show
        the hierarchy and navigation path, helping users understand their location. Breadcrumbs
        allow users to navigate back through levels or categories and are especially useful for
        deeply nested pages.
        <br />
        <br />
        <Card title="EXAMPLE">
          <BreadCrumbs
            items={[
              {
                name: `Philosophical Taoism`,
                url: "https://en.wikipedia.org/wiki/Taoist_philosophy",
              },
              {
                name: `Ursula K. Le Guin`,
                url: "https://en.wikipedia.org/wiki/Ursula_K._Le_Guin",
              },
              {
                name: `The Lathe of Heaven`,
                url: "https://en.wikipedia.org/wiki/The_Lathe_of_Heaven",
              },
            ]}
          />
          <br />
          <br />
          <BreadCrumbs
            items={[
              {
                name: `161 AD`,
                url: "https://en.wikipedia.org/wiki/161",
              },
              {
                name: `Nerva–Antonine dynasty`,
                url: "https://en.wikipedia.org/wiki/Nerva–Antonine_dynasty",
              },
              {
                name: `Marcus Aurelius Antoninus`,
                url: "https://en.wikipedia.org/wiki/Marcus_Aurelius",
              },
              {
                name: `The Meditations`,
                url: "https://classics.mit.edu/Antoninus/meditations.html",
              },
            ]}
          />
          <br />
          <br />
          <BreadCrumbs
            items={[
              {
                name: `Orthos Logos`,
                url: "https://orthoslogos.fr/",
              },
              {
                name: `Littérature`,
                url: "https://orthoslogos.fr/litterature",
              },
              {
                name: `Discours`,
                url: "https://orthoslogos.fr/litterature/discours/",
              },
              {
                name: `Patrick Geddes`,
                url: "https://en.wikipedia.org/wiki/Patrick_Geddes",
              },
            ]}
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BUTTONS">
        Button components are essential interactive elements within SRCL, facilitating actions like
        navigation, form submission, and command execution.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Button>Primary Button</Button>
          <br />
          <Button variant="SECONDARY">Secondary Button</Button>
          <br />
          <Button isDisabled>Disabled Button</Button>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="BUTTON GROUP">
        Button groups organize related actions within a shared container, offering quick access to
        frequently used tasks. These buttons are visually connected to emphasize their relationship
        and can also indicate a selected state.
        <br />
        <br />
        <Card title="EXAMPLE">
          <ButtonGroup
            items={[{ body: "16 PX", selected: true }, { body: "32 PX" }, { body: "42 PX" }]}
          />
          <ButtonGroup
            isFull
            items={[{ body: "16 PX", selected: true }, { body: "32 PX" }, { body: "42 PX" }]}
          />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="CARDS">
        Cards are MS-DOS–inspired sections designed to group related content and actions. They can
        serve as standalone features or function as part of a larger application. Each card clearly
        outlines key information, making it easier for users to identify and interact with important
        details.
        <br />
        <br />
        <Card title="Left-A" mode="left">
          <Card title="Right-B" mode="right">
            <Card title="C">
              To seek the timeless way we must first know the quality without a name. There is a
              central quality which is the root criterion of life and spirit in a man, a town, a
              building, or a wilderness. This quality is objective and precise, but it cannot be
              named.
            </Card>
          </Card>
        </Card>
        <br />
        <CardDouble title="Left-A" mode="left">
          <CardDouble title="Right-B" mode="right">
            <CardDouble title="C">
              The structure of life I have described in buildings - the structure which I believe to
              be objective - is deeply and inextricably connected with the human person, and with
              the innermost nature of human feeling.
            </CardDouble>
          </CardDouble>
        </CardDouble>
        <br />
        <Card title="Left-A" mode="left">
          <CardDouble title="Right-B" mode="right">
            <Card title="C">
              We are searching for some kind of harmony between two intangibles: a form which we
              have not yet designed and a context which we cannot properly describe.
            </Card>
          </CardDouble>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="CHECKBOX">
        Checkboxes represent a binary choice, letting users toggle options on or off. Each Checkbox
        operates independently, allowing multiple selections without affecting others. Checkboxes
        are ideal for forms, surveys, or scenarios requiring multi-selection, providing a simple way
        for user input.
        <br />
        <br />
        <Card title="EXAMPLE">
          <Checkbox name="1">
            The past, though a tutor, is not a thing to lament, but a wellspring of wisdom from
            which we draw without regret.
          </Checkbox>
          <Checkbox name="2">
            A measure of obsession doth sharpen the will, for the long path, though beset with
            trials, leadeth ever toward glories.
          </Checkbox>
          <Checkbox name="3">
            Kindness and gratitude must light our way in all dealings, regardless of circumstance.
          </Checkbox>
          <Checkbox name="4">
            Stand firm beside thy fellow for shared triumph is the sweetest of all.
          </Checkbox>
          <Checkbox name="5">
            Let us strive that design be not a mere ornament to the world, but a worthy service to
            humanity itself.
          </Checkbox>
          <Checkbox name="6">
            Artifacts built with care do grant webmasters the power to shape their own fates, and to
            serve those thou dost cherish is an honor beyond measure.
          </Checkbox>
          <Checkbox name="7">
            Intensity, as fire contained, burneth most brightly when turned toward aims; thus, let
            us spurn the call of mediocrity and cast aside the seductions of decay.
          </Checkbox>
          <Checkbox name="8">
            Mistakes are not curses, but treasures wrapped in adversity, offered to those wise
            enough to seize their lessons.
          </Checkbox>
          <Checkbox name="9">
            Expect naught, but receive all with gratitude, and find a place of trust wherein thou
            mayest dwell for a time.
          </Checkbox>
          <Checkbox name="10">
            From thy master learn what thou canst, and from all others likewise, for wisdom hath
            many guises.
          </Checkbox>
          <Checkbox name="11">
            To follow with discipline is good; to follow oneself with discipline is better.
          </Checkbox>
          <Checkbox name="12">
            Work with fervor and take joy where it may be found, for the making is as sweet as the
            outcome.
          </Checkbox>
          <Checkbox name="13">
            Be mindful that there are ever more ways than two, and seek not merely to follow the
            trade but to alter its course, bringing value wherever it is given thee to do so.
          </Checkbox>
          <Checkbox name="14">
            Whether rewarded or not, let us ply our craft for the love of it, for therein lies
            mastery.
          </Checkbox>
          <Checkbox name="15">Assume nothing, and let no person escape thy regard.</Checkbox>
          <Checkbox name="16">
            A fine process doth honor the task, but let the result be no less fine.
          </Checkbox>
          <Checkbox name="17">
            Keep faith with those who make promises, and shouldst thou be called to push others,
            push thyself the harder.
          </Checkbox>
          <Checkbox name="18">
            Thy health is thy treasure, and building a company shall be no graceful dance, but a
            contest of strife.
          </Checkbox>
          <Checkbox name="19">
            Take always the first step, for even in failure doth wisdom grow.
          </Checkbox>
          <Checkbox name="20">
            Seek ever to broaden thy knowledge of art, software, music, letters, and all things
            ancient and new, for these are the treasures of the mind.
          </Checkbox>
          <Checkbox name="21">
            Thy fate lieth ever in thine own hands, and the soul readeth not only the landscape, but
            the heart that beats beneath it.
          </Checkbox>
          <Checkbox name="22">
            Let thy voice be thine own, unborrowed and unbowed, and make it heard without fear.
          </Checkbox>
          <Checkbox name="23">
            Rejoice in the victories of thy fellow webmasters, for in bearing witness to their
            triumphs is joy in its truest form.
          </Checkbox>
          <Checkbox name="24">
            Grow accustomed to the weight of pressure, for in such a forge is the finest steel
            tempered.
          </Checkbox>
          <Checkbox name="25">
            Thus do we press onward—undaunted and unyielding—in pursuit of a better physical and
            digital world.
          </Checkbox>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="CHESSBOARD">
        A minimal 8×8 component that maps alphanumeric piece identifiers to Unicode chess symbols,
        uses alternating squares, and includes labeled rows and columns. Simply provide an 8×8 array
        of piece codes or empty strings for blank squares. Perfect for rendering classic chess
        scenes.
        <br />
        <br />
        <Card title="DEFAULT">
          <Chessboard board={Constants.CHESSBOARD_DEFAULT_POSITIONS} />
        </Card>
        <br />
        <Accordion defaultValue={true} title="BAD BISHOP">
          The “Bad Bishop” describes a bishop locked on squares of its own color by its own pawns,
          stifling its mobility. In this example from chess.com, Black’s bishop on B-7 is hindered
          by its own pawns and cannot be freed easily. Coincidentally, Bad Bishop is also one of the
          best Seattle bars (704 1st Ave), it is known for its creative cocktails and lively
          atmosphere.
          <br />
          <br />
          <Card title="BAD BISHOP">
            <Chessboard board={Constants.CHESSBOARD_BAD_BISHOP} />
          </Card>
          <br />
        </Accordion>
        <Accordion defaultValue={true} title="CHECKMATE">
          In chess, the en passant rule allows a pawn to capture an enemy pawn that has just made a
          two-square advance, moving to the square it bypassed as if it had only advanced one
          square. This unique rule prevents a pawn from escaping capture by skipping past an
          opponent. In the scenario below, White uses en passant to deliver checkmate, leaving
          Black’s king with no legal moves.
          <br />
          <br />
          <Card title="EN PASSANT">
            <Row style={{ "white-space": "nowrap" }}>
              <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_ONE} />
              &nbsp;
              <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_TWO} />
              &nbsp;
              <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_THREE} />
            </Row>
          </Card>
        </Accordion>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="CODE BLOCKS">
        Code blocks display code examples clearly and concisely, making them easy to read, copy, and
        use. This version has line numbers that are not user selectable.
        <br />
        <br />
        <Card title="CODE">
          <CodeBlock>
            {`#include <iostream>
#include <string>
#include <thread>
#include <asio.hpp>

using asio::ip::tcp;

void handle_client(tcp::socket socket) {
    try {
        std::string message =
            "HTTP/1.1 200 OK\\r\\n"
            "Content-Type: text/plain\\r\\n"
            "Connection: close\\r\\n"
            "\\r\\n"
            "Hello, World!";
        asio::write(socket, asio::buffer(message));
    } catch (...) {}
}

int main() {
    asio::io_context context;

    tcp::acceptor acceptor(context,
        tcp::endpoint(tcp::v4(), 8080));

    std::cout << "Server running on port 8080...\\n";

    while (true) {
        tcp::socket socket(context);
        acceptor.accept(socket);
        std::thread(handle_client, std::move(socket)).detach();
    }

    return 0;
}`}
          </CodeBlock>
        </Card>
        <br />
        <br />
        Below is an example of a package.json that illustrates Internet Development Studio Company’s
        dedication to maintaining a low-dependency approach, which is one of the reasons our clients
        value our work.
        <br />
        <br />
        <Card title="PACKAGE.JSON">
          <CodeBlock>
            {`{
  "name": "www-intdev-example",
  "description": "www-intdev-example",
  "engines": {
    "node": ">=18"
  },
  "license": "MIT",
  "version": "0.0.1",
  "scripts": {
    "dev": "next -p 10000",
    "build": "next build",
    "start": "PORT=10000 next start"
  },
  "dependencies": {
    "next": "^16.0.7",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}`}
          </CodeBlock>
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="COMBOBOX">
        Comboboxes combine a list with an editable textbox, allowing users to select from a list or
        input data manually. It offers flexibility and autocomplete features, improving usability in
        scenarios where users may not know all options.
        <br />
        <br />
        <Card title="COMBOBOX">
          <ComboBox data={Constants.LANDSCAPES} label="SEARCH THE WORLD" />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DATA TABLE">
        Data tables are for organizing large datasets into rows and columns for clear visibility and
        easy interpretation. It is used in scenarios like reporting systems, dashboards, and list
        views where data needs comparison, analysis, or manipulation. Features like sorting,
        filtering, pagination, and inline editing make data handling more efficient. The entire
        table width is limited to 64ch to fit the grid precisely.
        <br />
        <br />
        <Card title="STATIC">
          <DataTable data={Constants.SAMPLE_TABLE_DATA_CHANGE_ME} />
        </Card>
        <Card title="UPDATING">
          <UpdatingDataTable data={Constants.SAMPLE_TABLE_DATA_CHANGE_ME} />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DATE PICKER">
        A date picker is a UI control for selecting dates, and sometimes time, through a visual
        calendar interface inspired by MS-DOS. It ensures accurate date input and avoids formatting
        errors. Commonly used in forms, scheduling, or date-related tasks.
        <br />
        <br />
        <Card title="EXAMPLE">
          <DatePicker year={2012} month={12} />
          <br />
          <br />
          <DatePicker year={2024} month={12} />
        </Card>
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DASHBOARD RADAR EXAMPLE">
        The Dashboard Radar Example is a visual homage to Brian Wyvill, the creator of the iconic
        Nostromo interface in Alien 1979. This example using SRCL components recreates the orbital
        simulations that brought a sense of realism to the movie’s early scenes.
        <br />
        <br /> The original AOS (Alien Orbit Simulator) was inspired by the moment when the
        Nostromo’s crew awakens to decipher a distress signal, this adapation depicts the kind of
        graphical representation that could chart complex trajectories around distant planets.
        <br />
        <br />
        <DashboardRadar />
        <br />
        <br />
      </Accordion>

      <Accordion defaultValue={true} title="DENABASE EXAMPLE">
        The Denabase component is a tribute to the work of Territory Studio in the movie Blade
        Runner 2049. It draws inspiration from a DNA database containing an archive of individual
        DNA cards. They explored various card systems to capture a sense of physicality.
        <br />
        <br />
        <Denabase />
        <br />
        <br />
      </Accordion>
    </>
  );
}
