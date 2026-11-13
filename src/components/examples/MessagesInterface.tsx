import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import { ActionButton } from "../ActionButton.tsx";
import { Avatar } from "../Avatar.tsx";
import { Divider } from "../Divider.tsx";
import { DropdownMenuTrigger } from "../DropdownMenuTrigger.tsx";
import { Indent } from "../Indent.tsx";
import { Input } from "../Input.tsx";
import { Message } from "../Message.tsx";
import { MessageViewer } from "../MessageViewer.tsx";
import { ModalError } from "../modals/ModalError.tsx";
import { Navigation } from "../Navigation.tsx";
import { RowEllipsis } from "../RowEllipsis.tsx";
import { SidebarLayout } from "../SidebarLayout.tsx";
import { Window } from "../Window.tsx";

export type MessagesInterfaceProps = JSX.HTMLAttributes<HTMLSpanElement>;

const FILE_ITEMS = [
  "Open",
  "New Message",
  "Quick Look",
  "Close Messages",
  "Open Conversation in New Window",
  "Print...",
];

const EDIT_ITEMS = [
  "Undo",
  "Redo",
  "Cut",
  "Copy",
  "Paste",
  "Paste and Match Style",
  "Delete",
  "Select All",
  "Find...",
  "Find Next",
  "Find Previous",
  "Spelling and Grammar",
  "Substitutions",
  "Speech",
  "Send Message",
  "Reply to Last Message",
  "Tapback Last Message",
  "Edit Last Message",
  "Autofill",
  "Start Dictation",
  "Emoji & Symbols",
];

const VIEW_ITEMS = [
  "Show Tab Bar",
  "Show All Tabs",
  "Make Text Bigger",
  "Make Text Normal Size",
  "Make Text Smaller",
  "All Messages",
  "Known Senders",
  "Unknown Senders",
  "Unread Messages",
  "Recently Delete",
  "Show Sidebar",
  "Enter Full Screen",
];

const HELP_ITEMS = ["Search", "Messages Help"];

const menuItems = (labels: string[]) =>
  labels.map((children) => ({
    icon: "⊹",
    children,
    modal: ModalError,
    modalProps: {
      message: "Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)",
      title: "MESSAGES",
    },
  }));

const CHATS = [
  ["Arthur", "No, it has to be more unique"],
  ["Ariadne", "No. Just you."],
  ["Eames", "dream a little bigger"],
  ["Yusef", "Depends on the dream."],
  ["Saito", "I bought the airline."],
] as const;

function ChatPreviewInline(props: { children?: JSX.Element }) {
  return (
    <RowEllipsis style={{ opacity: 0.5, "margin-bottom": "10px" }}>{props.children}</RowEllipsis>
  );
}

export function MessagesInterface(props: { class?: string }) {
  return (
    <Window class={props.class}>
      <div style={{ "min-width": "28ch" }}>
        <Navigation
          logo="✶"
          left={
            <>
              <DropdownMenuTrigger items={menuItems(FILE_ITEMS)}>
                <ActionButton>FILE</ActionButton>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger items={menuItems(EDIT_ITEMS)}>
                <ActionButton>EDIT</ActionButton>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger items={menuItems(VIEW_ITEMS)}>
                <ActionButton>VIEW</ActionButton>
              </DropdownMenuTrigger>
            </>
          }
          right={
            <DropdownMenuTrigger items={menuItems(HELP_ITEMS)}>
              <ActionButton>HELP</ActionButton>
            </DropdownMenuTrigger>
          }
        />
        <Divider type="DOUBLE" />
        <SidebarLayout
          defaultSidebarWidth={12}
          isShowingHandle={true}
          sidebar={
            <>
              <For each={CHATS}>
                {([name, preview]) => (
                  <Avatar>
                    <Indent>
                      {name}
                      <br />
                      <ChatPreviewInline>{preview}</ChatPreviewInline>
                    </Indent>
                  </Avatar>
                )}
              </For>
            </>
          }
        >
          <Message>Why are they all looking at me?</Message>
          <MessageViewer>
            Because my subconscious feels that someone else is creating this world. The more you
            change things, the quicker the projections start to converge on you.
          </MessageViewer>
          <Message>Converge?</Message>
          <MessageViewer>
            It's the foreign nature of the dreamer. They attack like white blood cells fighting an
            infection.
          </MessageViewer>
          <Message>They're going to attack us?</Message>
          <MessageViewer>No. Just you.</MessageViewer>
          <br />
          <br />
          <Input autocomplete="off" isBlink={true} label="Message" name="test_message_interface" />
        </SidebarLayout>
      </div>
    </Window>
  );
}
