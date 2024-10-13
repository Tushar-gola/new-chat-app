import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from './AvatarWithStatus';
import { ChatProps, MessageProps, UserProps } from '../types';
import { toggleMessagesPane } from '../utils';
import { socket } from '../socket';
import { timeAgo } from '../functions';

type ChatListItemProps = ListItemButtonProps & {
  _id: string;
  unread?: boolean;
  sender: UserProps;
  lastMessage: MessageProps;
  selectedChatId?: string;
  setSelectedChat: (chat: ChatProps) => void;
};

const  ChatListItem= (props: ChatListItemProps)=> {
  const { _id, lastMessage, selectedChatId, setSelectedChat, user_info, online = false, room_id, isTyping, userTyping ,room} = props;
  const selected = selectedChatId === _id;
  const handleRoom = () => {
    if (room_id) {
      socket.emit('leave room', room)
    }
    socket.emit('join room', [user_info?._id, localStorage.getItem('user')])
    setSelectedChat({
      sender: {
        _id,
        full_name: user_info.full_name,
        profile: user_info.profile,
        online: online,
        userId: user_info?._id
      },
      messages: []
    })
  }
  console.log(isTyping, userTyping, "llllllllllllllllll");

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            handleRoom()
          }}
          selected={selected}
          color="neutral"
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus online={online} src={user_info?.profile} />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{user_info?.full_name}</Typography>
              <Typography level="body-sm">{user_info?.email}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
              {lastMessage?.isSeen && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >


                {timeAgo(new Date(lastMessage?.timestamp))}

              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {
              userTyping == user_info?._id ?
                '...typing' :
                lastMessage.content
            }
           
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}

export default React.memo(ChatListItem)