import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { useAuth } from "../context/AuthContent";

export function Home() {
  const { user, streamChat } = useAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <ChannelList />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
