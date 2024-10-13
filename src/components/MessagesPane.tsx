import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';
import { socket } from '../socket';
type MessagesPaneProps = {
  chat: ChatProps;
};

const MessagesPane = (props: MessagesPaneProps) => {
  const { chat, room, chatId, setChats, isTyping, setIsTyping, userTyping } = props;
  const [typingTimeout, setTypingTimeout] = React.useState(null);
  const userId = localStorage.getItem('user');
  const [chatMessages, setChatMessages] = React.useState([]);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  React.useEffect(() => {
    socket.emit('find chats', { chatId, room })
  }, [chatId])

  socket.off('get chats').on('get chats', (chats) => {
    setChatMessages(chats)
  })

  socket.off('new message').on('new message', (data) => {
    setChats((prev) => {
      let update = [...prev];
      const index = update.findIndex((it) => it._id === data?.chatId);

      if (index !== -1) {
        update[index] = { ...update[index], lastMessage: data };
        const [chatWithNewMessage] = update.splice(index, 1);
        update = [chatWithNewMessage, ...update];
      }

      return update;
    });
    setChatMessages((prev) => {
      return [...prev, {
        id: data?._id,
        sender: data?.sender,
        content: data?.content,
        timestamp: data?.timestamp,
      }]
    });
  })


  const handleTyping = React.useCallback((e) => {
    setTextAreaValue(e.target.value);
    if (!isTyping) {
      socket.emit('user typing start', { recieverId: chat?.sender?.userId, userId });
    }
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => {
      socket.emit('user hold typing', { recieverId: chat?.sender?.userId, userId });
    }, 2000));  //

  }, [])


  const handleSubmit = React.useCallback(() => {
    socket.emit('send message', {
      message: textAreaValue,
      user: userId,
      room,
      chatId,
      recieverId: chat?.sender?.userId
    });
    setTextAreaValue('');
    socket.emit('user hold typing', {
      message: textAreaValue,
      userId,
      room,
      chatId,
      recieverId: chat?.sender?.userId
    });
  }, [chatId, textAreaValue])



  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',

      }}
    >
      <MessagesPaneHeader sender={chat?.sender} room={room} isTyping={isTyping} userTyping={userTyping} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
          scrollbarWidth: "thin"
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = message.sender === localStorage.getItem('user');
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {message.sender !== localStorage.getItem('user') && (
                  <AvatarWithStatus
                    online={chat?.sender?.online}
                    src={message.sender.avatar}
                  />
                )}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        handleTyping={handleTyping}
        onSubmit={() => {
          handleSubmit()
        }}
      />
    </Sheet>
  );
}

export default React.memo(MessagesPane)