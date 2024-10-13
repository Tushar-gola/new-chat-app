import { Box, CircularProgress, IconButton, Input, List, ListDivider, ListItem, ListItemButton, ListItemButtonProps, Sheet, Stack, Typography } from "@mui/joy"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { debounce } from 'lodash'
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../AxiosInstants";
import { ChatProps, MessageProps, UserProps } from "../../../types";
import React, { useEffect, useState } from "react";
import AvatarWithStatus from "../../../components/AvatarWithStatus";
import CircleIcon from '@mui/icons-material/Circle';
import { usePagination } from "../../../hooks";
import { useInView } from "react-intersection-observer";
import { useChatLists, } from "../../../store";
import { socket } from "../../../socket";
const UsersTab = ({ handleTabs, setSelectedChat }) => {
    const { chats, handleStoreSingleChats } = useChatLists((state) => state)
    console.log(chats);

    const { ref, inView } = useInView({
        threshold: 0,
    });
    const [userData, setUserData] = useState([])
    const { page, page_size, setPage, limit, setLimit } = usePagination()
    const [search, setSearch] = useState('')
    const { isFetching } = useQuery({
        queryKey: ['user', search, page],
        queryFn: async () => {
            const { data } = await api.get('user', { params: { search, page, page_size } })
            setLimit(data?._payload?.users?.length || 0)
            setUserData((prev) => [...prev, ...(data?._payload?.users || [])])
            return data?._payload || []
        }
    })


    const handleSearch = debounce((e: string) => {
        setPage(0)
        setUserData([])
        setSearch(e)
    }, 1000)
    useEffect(() => {
        if (inView && limit) {
            setPage((prev) => prev + 1)
        }
    }, [inView])
    return (
        <div>
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
                    sx={{ alignItems: 'center', p: 2, pb: 1.5 }}
                >
                    <IconButton onClick={() => handleTabs('chat')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
                    >
                        Users
                    </Typography>

                </Stack>
                <Box sx={{ px: 2, pb: 1.5 }}>
                    <Input
                        size="sm"
                        startDecorator={<SearchRoundedIcon />}
                        endDecorator={isFetching && <CircularProgress size='sm' sx={{ margin: "5px 0" }} />}
                        placeholder="Search"
                        aria-label="Search"
                        onChange={(e) => handleSearch(e.target.value)
                        }
                    />
                </Box>
                <List
                    sx={{
                        py: 0,
                        '--ListItem-paddingY': '0.75rem',
                        '--ListItem-paddingX': '1rem',
                    }}
                >

                    {userData?.map((chat: ChatListItemProps) => (
                        <ChatListItem
                            key={chat.id}
                            {...chat}
                            handleStoreSingleChats={handleStoreSingleChats}
                            handleTabs={handleTabs}
                            setSelectedChat={setSelectedChat}

                        />
                    ))}

                    {(userData.length && limit) ? <ListItem ref={ref} >

                    </ListItem> : null}
                </List>

            </Sheet>

        </div>
    )
}

export { UsersTab }




type ChatListItemProps = ListItemButtonProps & {
    _id: string;
    full_name?: string;
    user_name: string;
    email: string;
    unread?: boolean;
    sender: UserProps;
    messages: MessageProps[];
    selectedChatId?: string;
    setSelectedChat: (chat: ChatProps) => void;
    handleStoreSingleChats: () => void;
    handleTabs: (tab: string) => void;
};

export const ChatListItem = (props: ChatListItemProps) => {
    const { _id, full_name, user_name, selectedChatId, messages = [], email, profile, handleStoreSingleChats, handleTabs, setSelectedChat } = props;
    const selected = selectedChatId === _id;
    const handleRoom = () => {
        socket.emit('join room', [_id, localStorage.getItem('user')])
        setSelectedChat({
            sender: {
                _id,
                full_name,
                profile,
                online: true
            },
            messages: []
        })
    }
    return (
        <React.Fragment>
            <ListItem onClick={() => { handleRoom() }}>
                <ListItemButton
                    selected={selected}
                    color="neutral"
                    sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
                >
                    <Stack direction="row" spacing={1.5}>
                        <AvatarWithStatus online={true} src={''} />
                        <Box sx={{ flex: 1 }}>
                            {/* <Typography level="title-sm">{full_name}</Typography> */}
                            <Typography level="title-sm">{user_name}</Typography>
                            <Typography level="body-sm">{email}</Typography>
                        </Box>
                        <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
                            {messages[0]?.unread && (
                                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
                            )}
                            <Typography
                                level="body-xs"
                                noWrap
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            >
                                5 mins ago
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
                        {messages[0]?.content}
                    </Typography>
                </ListItemButton>
            </ListItem>
            <ListDivider sx={{ margin: 0 }} />
        </React.Fragment>
    );
}