import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { useStyles } from './styles';
import { ThemeIcon, Loader } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';

interface ChatStripeProps {
  text: string;
  isUser: boolean;
  isLoading: boolean;
}

export default function ChatStripe({ text, isUser, isLoading }: ChatStripeProps) {
  const { classes, cx, theme } = useStyles();

  return (
    <div className={cx(classes.wrapper, { [classes.colored]: isUser === false })}>
      <div className={classes.chat}>
        <ThemeIcon
          size={35}
          color={isUser ? theme.colors.blue[6] : theme.colors.cyan[5]}
        >
          {isUser ?
            <IconUser
              size={25}
              stroke={2}
            />
            :
            <IconRobot
              size={25}
              stroke={2}
            />
          }
        </ThemeIcon>

        <div className={classes.message} style={{ marginTop: isLoading ? 4 : 5 }}>
          {isLoading ?
            <Loader
              variant="dots"
              size={28}
              color={theme.colors.cyan[4]}
            />
            :
            text
          }
        </div>
      </div>
    </div>
  );
}
