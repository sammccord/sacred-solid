import type { JSX } from "@solidjs/web";
import type { AugProps } from "../src/aug/index.ts";
import type { StyleProps, ThemeProps } from "../src/style/index.ts";
import { ModalStack } from "../src/components/ModalStack.tsx";
import { OutsideElementEvent } from "../src/components/detectors/OutsideElementEvent.tsx";
import { AS400 } from "../src/components/examples/AS400.tsx";
import { CLITemplate } from "../src/components/examples/CLITemplate.tsx";
import { DashboardRadar } from "../src/components/examples/DashboardRadar.tsx";
import { Denabase } from "../src/components/examples/Denabase.tsx";
import { InvoiceTemplate } from "../src/components/examples/InvoiceTemplate.tsx";
import { MessagesInterface } from "../src/components/examples/MessagesInterface.tsx";
import { OneLineLoaders } from "../src/components/examples/OneLineLoaders.tsx";
import { PageConceptOne } from "../src/components/examples/PageConceptOne.tsx";
import { PageConceptTwo } from "../src/components/examples/PageConceptTwo.tsx";
import { ResultsList } from "../src/components/examples/ResultsList.tsx";
import { UpdatingDataTable } from "../src/components/examples/UpdatingDataTable.tsx";
import { IntDevLogo } from "../src/components/svg/IntDevLogo.tsx";
import { MouseIcon } from "../src/components/svg/MouseIcon.tsx";
import { Sphere } from "../src/components/svg/Sphere.tsx";
import {
  ActionBar,
  ActionButton,
  ActionListItem,
  AlertBanner,
  Avatar,
  Badge,
  BarLoader,
  BarProgress,
  Block,
  BlockLoader,
  BreadCrumbs,
  Button,
  ButtonGroup,
  Card,
  CardDouble,
  Checkbox,
  Chessboard,
  CodeBlock,
  ContentFluid,
  DataTable,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  DropdownMenu,
  DropdownMenuTrigger,
  DOMSnake,
  Grid,
  HoverComponentTrigger,
  Indent,
  Input,
  ListItem,
  MatrixLoader,
  Message,
  MessageViewer,
  KeyHint,
  Navigation,
  NumberRangeSlider,
  Panel,
  Popover,
  RadioButton,
  Row,
  RowEllipsis,
  RowSpaceBetween,
  SidebarLayout,
  SimpleTable,
  Table,
  Tabs,
  TableColumn,
  TableRow,
  Text,
  TextArea,
  Tooltip,
  TreeView,
  Window,
  Accordion,
  ASCIICanvas,
  CanvasPlatformer,
  CanvasSnake,
  ComboBox,
  ModalTrigger,
  RadioButtonGroup,
  ScrollArea,
  Select,
  Surface,
} from "../src/index.ts";
import { DefaultActionBar } from "../src/components/page/DefaultActionBar.tsx";
import { DefaultLayout } from "../src/components/page/DefaultLayout.tsx";
import { ModalAlert } from "../src/components/modals/ModalAlert.tsx";
import { ModalCanvasPlatformer } from "../src/components/modals/ModalCanvasPlatformer.tsx";
import { ModalCanvasSnake } from "../src/components/modals/ModalCanvasSnake.tsx";
import { ModalChess } from "../src/components/modals/ModalChess.tsx";
import { ModalCreateAccount } from "../src/components/modals/ModalCreateAccount.tsx";
import { ModalDOMSnake } from "../src/components/modals/ModalDOMSnake.tsx";
import { ModalError } from "../src/components/modals/ModalError.tsx";
import { ModalMatrixModes } from "../src/components/modals/ModalMatrixModes.tsx";

export const AUG: AugProps = { tl: { mixin: "clip", size: "9px" }, border: "2px" };
export const THEME: ThemeProps = { line: "cyan", surfaceFloat: "rgb(0 0 0 / 0.5)" };
const TABLE = [
  ["A", "B"],
  ["1", "2"],
];
const BOARD = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ""));

export type Case = [string, (style: StyleProps & { class?: string }) => JSX.Element];

export const cases: Case[] = [
  [
    "Accordion",
    (s) => (
      <Accordion title="t" {...s}>
        x
      </Accordion>
    ),
  ],
  ["ActionBar", (s) => <ActionBar items={[{ body: "x" }]} {...s} />],
  ["ActionButton", (s) => <ActionButton {...s}>x</ActionButton>],
  ["ActionListItem div", (s) => <ActionListItem {...s}>x</ActionListItem>],
  [
    "ActionListItem a",
    (s) => (
      <ActionListItem href="/x" {...s}>
        x
      </ActionListItem>
    ),
  ],
  ["AlertBanner", (s) => <AlertBanner {...s}>x</AlertBanner>],
  ["Avatar placeholder", (s) => <Avatar {...s} />],
  ["Avatar image", (s) => <Avatar src="/a.png" {...s} />],
  ["Avatar link", (s) => <Avatar href="/a" {...s} />],
  ["Avatar with children", (s) => <Avatar {...s}>name</Avatar>],
  ["Badge", (s) => <Badge {...s}>x</Badge>],
  ["BarLoader", (s) => <BarLoader progress={10} {...s} />],
  ["BarProgress", (s) => <BarProgress progress={10} {...s} />],
  ["Block", (s) => <Block {...s}>x</Block>],
  ["BlockLoader", (s) => <BlockLoader {...s} />],
  ["BlockLoader fallback", (s) => <BlockLoader mode={99} {...s} />],
  ["BreadCrumbs", (s) => <BreadCrumbs items={[{ name: "a" }]} {...s} />],
  ["Button", (s) => <Button {...s}>x</Button>],
  [
    "Button disabled",
    (s) => (
      <Button isDisabled {...s}>
        x
      </Button>
    ),
  ],
  ["ButtonGroup", (s) => <ButtonGroup items={[{ body: "x" }]} {...s} />],
  ["Card", (s) => <Card {...s}>x</Card>],
  ["CardDouble", (s) => <CardDouble {...s}>x</CardDouble>],
  ["Checkbox", (s) => <Checkbox name="c" {...s} />],
  ["Chessboard", (s) => <Chessboard board={BOARD} {...s} />],
  ["CodeBlock", (s) => <CodeBlock {...s}>{"a\nb"}</CodeBlock>],
  ["ContentFluid", (s) => <ContentFluid {...s}>x</ContentFluid>],
  ["DataTable", (s) => <DataTable data={TABLE} {...s} />],
  ["DatePicker", (s) => <DatePicker {...s} />],
  ["Dialog", (s) => <Dialog {...s}>x</Dialog>],
  ["Divider", (s) => <Divider {...s} />],
  ["Divider gradient", (s) => <Divider type="GRADIENT" {...s} />],
  ["Divider double", (s) => <Divider type="DOUBLE" {...s} />],
  ["Drawer", (s) => <Drawer {...s}>x</Drawer>],
  ["DropdownMenu", (s) => <DropdownMenu {...s} />],
  [
    "DropdownMenuTrigger",
    (s) => (
      <DropdownMenuTrigger items={[]} {...s}>
        <button>t</button>
      </DropdownMenuTrigger>
    ),
  ],
  ["DOMSnake", (s) => <DOMSnake {...s} />],
  ["Grid", (s) => <Grid {...s}>x</Grid>],
  [
    "HoverComponentTrigger",
    (s) => (
      <HoverComponentTrigger text="t" component="tooltip" {...s}>
        <button>t</button>
      </HoverComponentTrigger>
    ),
  ],
  ["Indent", (s) => <Indent {...s}>x</Indent>],
  ["Input", (s) => <Input name="i" {...s} />],
  [
    "KeyHint",
    (s) => (
      <KeyHint keys={["A"]} {...s}>
        x
      </KeyHint>
    ),
  ],
  ["ListItem", (s) => <ListItem {...s}>x</ListItem>],
  ["MatrixLoader", (s) => <MatrixLoader {...s} />],
  ["Message", (s) => <Message {...s}>x</Message>],
  ["MessageViewer", (s) => <MessageViewer {...s}>x</MessageViewer>],
  ["Navigation", (s) => <Navigation {...s} />],
  ["NumberRangeSlider", (s) => <NumberRangeSlider {...s} />],
  [
    "Panel",
    (s) => (
      <Panel title="t" {...s}>
        x
      </Panel>
    ),
  ],
  ["Popover", (s) => <Popover {...s}>x</Popover>],
  ["RadioButton", (s) => <RadioButton name="r" value="v" {...s} />],
  ["Row", (s) => <Row {...s}>x</Row>],
  ["RowEllipsis", (s) => <RowEllipsis {...s}>x</RowEllipsis>],
  ["RowSpaceBetween", (s) => <RowSpaceBetween {...s}>x</RowSpaceBetween>],
  ["SidebarLayout", (s) => <SidebarLayout {...s}>x</SidebarLayout>],
  ["SimpleTable", (s) => <SimpleTable data={TABLE} {...s} />],
  ["Table", (s) => <Table {...s} />],
  [
    "TableColumn",
    (s) => (
      <table>
        <tbody>
          <tr>
            <TableColumn {...s}>x</TableColumn>
          </tr>
        </tbody>
      </table>
    ),
  ],
  [
    "TableRow",
    (s) => (
      <table>
        <tbody>
          <TableRow {...s} />
        </tbody>
      </table>
    ),
  ],
  ["ScrollArea", (s) => <ScrollArea {...s}>x</ScrollArea>],
  ["Tabs", (s) => <Tabs items={[{ id: "a", label: "A" }]} value="a" onChange={() => {}} {...s} />],
  ["Text", (s) => <Text {...s}>x</Text>],
  ["TextArea", (s) => <TextArea {...s} />],
  ["Tooltip", (s) => <Tooltip {...s}>x</Tooltip>],
  ["TreeView", (s) => <TreeView title="t" {...s} />],
  ["Window", (s) => <Window {...s}>x</Window>],
  ["DefaultActionBar", (s) => <DefaultActionBar {...s} />],
  ["DefaultLayout", (s) => <DefaultLayout previewPixelSRC="/p.png" {...s} />],
  ["ModalAlert", (s) => <ModalAlert message="m" {...s} />],
  ["ModalCanvasPlatformer", (s) => <ModalCanvasPlatformer {...s} />],
  ["ModalCanvasSnake", (s) => <ModalCanvasSnake {...s} />],
  ["ModalChess", (s) => <ModalChess board={BOARD} {...s} />],
  ["ModalCreateAccount", (s) => <ModalCreateAccount {...s} />],
  ["ModalDOMSnake", (s) => <ModalDOMSnake {...s} />],
  ["ModalError", (s) => <ModalError message="m" {...s} />],
  ["ModalMatrixModes", (s) => <ModalMatrixModes {...s} />],
];

type ClassCase = [string, (style: { class?: string }) => JSX.Element];

export const classOnlyCases: ClassCase[] = [
  ["ASCIICanvas", (s) => <ASCIICanvas {...s} />],
  ["CanvasPlatformer", (s) => <CanvasPlatformer {...s} />],
  ["CanvasSnake", (s) => <CanvasSnake {...s} />],
  ["ComboBox", (s) => <ComboBox data={TABLE} {...s} />],
  ["ModalStack", (s) => <ModalStack {...s} />],
  [
    "ModalTrigger",
    (s) => (
      <ModalTrigger modal={() => <i />} {...s}>
        <button>t</button>
      </ModalTrigger>
    ),
  ],
  [
    "OutsideElementEvent",
    (s) => (
      <OutsideElementEvent onOutsideEvent={() => {}} {...s}>
        x
      </OutsideElementEvent>
    ),
  ],
  ["RadioButtonGroup", (s) => <RadioButtonGroup options={[{ value: "a", label: "A" }]} {...s} />],
  ["Select", (s) => <Select name="s" options={["a"]} {...s} />],
  ["Surface", (s) => <Surface {...s}>x</Surface>],
  ["IntDevLogo", (s) => <IntDevLogo {...s} />],
  ["MouseIcon", (s) => <MouseIcon {...s} />],
  ["Sphere", (s) => <Sphere {...s} />],
  ["AS400", (s) => <AS400 {...s} />],
  ["CLITemplate", (s) => <CLITemplate {...s} />],
  ["DashboardRadar", (s) => <DashboardRadar {...s} />],
  ["Denabase", (s) => <Denabase {...s} />],
  ["InvoiceTemplate", (s) => <InvoiceTemplate {...s} />],
  ["MessagesInterface", (s) => <MessagesInterface {...s} />],
  ["OneLineLoaders", (s) => <OneLineLoaders {...s} />],
  ["PageConceptOne", (s) => <PageConceptOne {...s} />],
  ["PageConceptTwo", (s) => <PageConceptTwo {...s} />],
  ["ResultsList", (s) => <ResultsList {...s} />],
  ["UpdatingDataTable", (s) => <UpdatingDataTable data={TABLE} {...s} />],
];

export const classCases: ClassCase[] = [...cases, ...classOnlyCases];
