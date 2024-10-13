import * as React from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { IconButton, Input } from '@mui/joy';

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

const MessageInput = (props: MessageInputProps) => {
  const { textAreaValue, setTextAreaValue, onSubmit, handleTyping } = props;
  const textAreaRef = React.useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== '') {
      onSubmit();
      setTextAreaValue('');
    }
  };
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <FormControl sx={{ width: "100%" }}>
        <Input
          placeholder="Type in here…"
          endDecorator={
            <IconButton>
              <SendOutlinedIcon fontSize='large' />
            </IconButton>
          }
          ref={textAreaRef}
          onChange={handleTyping}
          value={textAreaValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          autoFocus
          sx={{
            padding: "8px 25px 10px 10px",
            '&::before': {
              display: 'none',
            },
            '&:focus-within': {
              outline: '2px solid var(--Input-focusedHighlight)',
              outlineOffset: '2px',
            },
          }}
        />
      </FormControl>

    </Box>
  );
}

export default React.memo(MessageInput)