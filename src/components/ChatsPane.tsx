import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Avatar, Box, Chip, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem } from '@mui/joy';
import List from '@mui/joy/List';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { ChatProps } from '../types';
import { toggleMessagesPane } from '../utils';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
type ChatsPaneProps = {
  chats: ChatProps[];
  setSelectedChat: (chat: ChatProps) => void;
  handleTabs: (tab: string) => void;
  selectedChatId: string;
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId, handleTabs, isTyping, userTyping ,room} = props;
  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '2px',  // Custom width for the scrollbar in WebKit-based browsers
        },
        scrollBehavior: "smooth",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
      >
        <Typography
          component="h1"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: 'span' } }}
            >
              4
            </Chip>
          }
          sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
        >
          Messages
        </Typography>
        <Stack spacing={1} direction='row' alignItems='center'>
          <Dropdown >
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
            >
              <FilterListIcon />
            </MenuButton>
            <Menu color="primary" sx={{ width: "150px" }}>
              <MenuItem onClick={() => handleTabs('unread')}>
                <Stack direction='row' alignItems='center' gap='10px'>
                  <MarkChatUnreadOutlinedIcon />
                  <Typography level='body-xs' fontSize='14px'>Unread</Typography>
                </Stack>
              </MenuItem>
              <MenuItem onClick={() => handleTabs('users')}>
                <Stack direction='row' alignItems='center' gap='10px'>
                  <PersonIcon />
                  <Typography level='body-xs' fontSize='14px'>Users</Typography>
                </Stack>
              </MenuItem>
              <MenuItem onClick={() => handleTabs('group')}>
                <Stack direction='row' alignItems='center' gap='10px'>
                  <GroupOutlinedIcon />
                  <Typography level='body-xs' fontSize='14px'>Groups</Typography>
                </Stack>
              </MenuItem>
            </Menu>
          </Dropdown>
          <Avatar alt="T" />

        </Stack>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
            userTyping={userTyping}
            isTyping={isTyping}
            room={room}
          />
        ))}
      </List>
    </Sheet>
  );
}