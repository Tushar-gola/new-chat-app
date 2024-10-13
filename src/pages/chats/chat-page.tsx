import { Box, GlobalStyles } from '@mui/joy'
import MyMessages from '../../components/MyMessages';
import { useEffect } from 'react';
import { socket } from '../../socket';
const ChatPage = () => {

    const authSocket = () => {
        const user = localStorage.getItem('user');
        if (user != null) {
          socket.connect();
          socket.auth.user = user;
        }
      };
      useEffect(() => {
        authSocket();
      }, []);
    return (
        <div>
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <GlobalStyles
                    styles={(theme) => ({
                        ':root': {
                            '--Header-height': '0px',
                            [theme.breakpoints.up('lg')]: {
                                '--Header-height': '0px',
                            },
                        },
                    })}
                />
                <Box component="main" className="MainContent" sx={{ flex: 1 }}>
                    <MyMessages />
                </Box>
            </Box>
        </div>
    )
}

export { ChatPage }
