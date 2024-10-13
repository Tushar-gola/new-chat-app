// import * as React from 'react';
// import Sheet from '@mui/joy/Sheet';

// import MessagesPane from './MessagesPane';
// import ChatsPane from './ChatsPane';
// import { ChatProps } from '../types';
// import { Box, Typography } from '@mui/joy';
// import { useTabs } from '../store';
// import { UsersTab } from '../pages';
// import { socket } from '../socket';
// import { useQuery } from '@tanstack/react-query';
// import { api } from '../AxiosInstants';
// import { openMessagesPane, } from '../utils';

// export default function MyProfile() {
//   const [selectedChat, setSelectedChat] = React.useState<ChatProps>(null);
//   const { handleTabs, tab } = useTabs((state) => state)
//   const [chats, setChats] = React.useState([])
//   const [room, setRoom] = React.useState('')
//   const [chatId, setChatId] = React.useState('')
//   const [isTyping, setIsTyping] = React.useState(false);
//   const [userTyping, setUserTyping] = React.useState('')
//   const userId = localStorage.getItem('user');
//   React.useEffect(() => {
//     socket.off('room id').on('room id', (roomId) => {
//       setRoom(roomId?.roomId)
//       setChatId(roomId?.chat_id)
//     })
//   }, [])
//   useQuery({
//     queryKey: ['user/chats'],
//     queryFn: async () => {
//       const { data } = await api.get('user/chats')
//       setChats(data?._payload || [])
//       return data?._payload
//     }
//   })

//   React.useEffect(() => {
//     const mediaQuery = window.matchMedia('(max-width: 768px)'); // Change the max-width to your mobile breakpoint
//     const handleMediaQueryChange = (e) => {
//       if (e.matches) {
//         openMessagesPane();
//       }
//     };

//     mediaQuery.addListener(handleMediaQueryChange);

//     // Check initial state
//     if (mediaQuery.matches) {
//       openMessagesPane();
//     }

//     return () => {
//       mediaQuery.removeListener(handleMediaQueryChange);
//     };
//   }, []);
//   socket.off('user status').on('user status', (data) => {
//     setChats((prev) => {
//       let update = [...prev];
//       update = update.map((it) => {
//         if (data?.userId?.includes(it.user_info._id)) {
//           return { ...it, online: data?.online };
//         }
//         return it;
//       });
//       return update;
//     });
//     if (selectedChat) {
//       setSelectedChat((prev) => {
//         return { ...prev, sender: { ...prev.sender, online: data?.online } }
//       })
//     }
//   })
//   socket.off('user typing').on('user typing', (data) => {    
//     if (userId != data?.userId) {
//       setIsTyping(true);
//       setUserTyping(data?.userId)
//     }

//   })
//   socket.off('user stopped typing').on('user stopped typing', (data) => {
//     if (userId != data?.userId) {
//       setIsTyping(false);
//       setUserTyping('')
//     }
//   })

//   return (
//     <Sheet
//       sx={{
//         flex: 1,
//         width: '100%',
//         mx: 'auto',
//         pt: { xs: 'var(--Header-height)', md: 0 },
//         display: 'grid',
//         gridTemplateColumns: {
//           xs: '1fr',
//           sm: 'minmax(min-content, min(30%, 400px)) 1fr',
//         },
//       }}
//     >
//       <Sheet
//         sx={{
//           position: { xs: 'fixed', sm: 'sticky' },
//           transform: {
//             xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
//             sm: 'none',
//           },
//           transition: 'transform 0.4s, width 0.4s',
//           zIndex: 100,
//           width: '100%',
//           top: 0,
//           height: '100vh',
//         }}
//       >
//         {tab == 'chat' ? <ChatsPane
//           chats={chats}
//           selectedChatId={selectedChat?.sender?._id}
//           setSelectedChat={setSelectedChat}
//           handleTabs={handleTabs}
//           userTyping={userTyping}
//           isTyping={isTyping}
//           room={room}

//         /> : tab == 'users' ? <UsersTab handleTabs={handleTabs} setSelectedChat={setSelectedChat} /> : null

//         }
//       </Sheet>
//       {
//         selectedChat ?
//           <MessagesPane chat={selectedChat} userTyping={userTyping} room={room} chatId={chatId} setChats={setChats} chats={chats} setIsTyping={setIsTyping} isTyping={isTyping} />
//           : <Sheet
//             sx={{
//               height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Box textAlign='center'>
//               <Typography level='h4' fontSize='26px' color='primary'>
//                 Welcome to the Chat App!
//               </Typography>
//               <Typography level='body-md' sx={{ mt: 2 }}>
//                 Select a chat from the list or start a new conversation to begin.
//               </Typography>
//             </Box>
//           </Sheet>

//       }


//     </Sheet>
//   );
// }


import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { ChatProps } from '../types';
import { Box, Typography } from '@mui/joy';
import { useTabs } from '../store';
import { UsersTab } from '../pages';
import { socket } from '../socket';
import { useQuery } from '@tanstack/react-query';
import { api } from '../AxiosInstants';
import { openMessagesPane } from '../utils';

const MyProfile = () => {
  const [selectedChat, setSelectedChat] = React.useState<ChatProps>(null);
  const { handleTabs, tab } = useTabs((state) => state);
  const [chats, setChats] = React.useState([]);
  const [room, setRoom] = React.useState('');
  const [chatId, setChatId] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [userTyping, setUserTyping] = React.useState('');
  const userId = localStorage.getItem('user');

  // Fetch chats
  useQuery({
    queryKey: ['user/chats'],
    queryFn: async () => {
      const { data } = await api.get('user/chats')
      setChats(data?._payload || [])
      return data?._payload
    }
  })

  // Effect for setting chats and room info
  React.useEffect(() => {
    setChats(chats);
  }, [chats]);

  // Effect for socket listeners
  React.useEffect(() => {
    const roomListener = (roomId) => {
      setRoom(roomId?.roomId);
      setChatId(roomId?.chat_id);
    };

    const userStatusListener = (data) => {
      setChats((prev) =>
        prev.map((chat) =>
          data?.userId?.includes(chat.user_info._id)
            ? { ...chat, online: data?.online }
            : chat
        )
      );

      if (selectedChat) {
        setSelectedChat((prev) => ({
          ...prev,
          sender: { ...prev.sender, online: data?.online },
        }));
      }
    };

    const typingListener = (data) => {
      if (userId !== data?.userId) {
        setIsTyping(true);
        setUserTyping(data?.userId);
      }
    };

    const stoppedTypingListener = (data) => {
      if (userId !== data?.userId) {
        setIsTyping(false);
        setUserTyping('');
        if (data?.lastMessage) {          
          setChats((prev) => {
            let update = [...prev];
            const index = update.findIndex((it) => it._id == data?.lastMessage?.chatId);

            if (index !== -1) {
              update[index] = { ...update[index], lastMessage: data?.lastMessage };
              const [chatWithNewMessage] = update.splice(index, 1);
              update = [chatWithNewMessage, ...update];
            }

            return update;
          });
        }
      }
    };

    socket.on('room id', roomListener);
    socket.on('user status', userStatusListener);
    socket.on('user typing', typingListener);
    socket.on('user stopped typing', stoppedTypingListener);

    // Clean up listeners on unmount
    return () => {
      socket.off('room id', roomListener);
      socket.off('user status', userStatusListener);
      socket.off('user typing', typingListener);
      socket.off('user stopped typing', stoppedTypingListener);
    };
  }, [selectedChat, userId]);

  // Effect for media query
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        openMessagesPane();
      }
    };

    mediaQuery.addListener(handleMediaQueryChange);

    // Check initial state
    if (mediaQuery.matches) {
      openMessagesPane();
    }

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', md: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'sticky' },
          transform: {
            xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
            sm: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
          zIndex: 100,
          width: '100%',
          top: 0,
          height: '100vh',
        }}
      >
        {tab === 'chat' ? (
          <ChatsPane
            chats={chats}
            selectedChatId={selectedChat?.sender?._id}
            setSelectedChat={setSelectedChat}
            handleTabs={handleTabs}
            userTyping={userTyping}
            isTyping={isTyping}
            room={room}
          />
        ) : tab === 'users' ? (
          <UsersTab handleTabs={handleTabs} setSelectedChat={setSelectedChat} />
        ) : null}
      </Sheet>
      {selectedChat ? (
        <MessagesPane
          chat={selectedChat}
          userTyping={userTyping}
          room={room}
          chatId={chatId}
          setChats={setChats}
          chats={chats}
          setIsTyping={setIsTyping}
          isTyping={isTyping}
        />
      ) : (
        <Sheet
          sx={{
            height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box textAlign="center">
            <Typography level="h4" fontSize="26px" color="primary">
              Welcome to the Chat App!
            </Typography>
            <Typography level="body-md" sx={{ mt: 2 }}>
              Select a chat from the list or start a new conversation to begin.
            </Typography>
          </Box>
        </Sheet>
      )}
    </Sheet>
  );
};

export default React.memo(MyProfile);
