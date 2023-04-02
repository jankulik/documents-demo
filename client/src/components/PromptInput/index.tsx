import { useState } from 'react';
import { useStyles } from './styles';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { getHotkeyHandler } from '@mantine/hooks';

interface PromptInputProps {
  handleSubmit(promtptInput: string): any;
  disabled: boolean;
}

export default function PromptInput({ handleSubmit, disabled }: PromptInputProps) {
  const { classes, theme } = useStyles();

  const [textInput, setTextInput] = useState('');

  return (
    <div className={classes.horizontalContainer}>
      <div className={classes.textInput}>
        <TextInput
          value={textInput}
          onChange={(event) => setTextInput(event.currentTarget.value)}
          placeholder="What's your question?"
          onKeyDown={getHotkeyHandler([
            ['Enter', () => {
              if (!disabled) {
                handleSubmit(textInput);
                setTextInput('');
              }
            }],
          ])}
        />
      </div>

      <ActionIcon
        onClick={(event) => {
          handleSubmit(textInput);
          setTextInput('');
        }}
        variant='filled'
        color={theme.colors.blue[6]}
        size={36}
        disabled={disabled}
      >
        <IconSend size={20} />
      </ActionIcon>
    </div>
  );
}
