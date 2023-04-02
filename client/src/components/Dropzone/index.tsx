import { useRef, useState } from 'react';
import { Text, Group, Overlay, Center, RingProgress } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { useStyles } from './styles';
import { postData } from '@/utils/helpers/postData';


interface DropzoneButtonProps {
  progress: number;
  handleUpload(textData: string): any;
}

export default function DropzoneButton({ progress, handleUpload }: DropzoneButtonProps) {
  const { classes, cx, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  const [uploading, setUploading] = useState(false);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        accept={[MIME_TYPES.pdf]}
        maxSize={30 * 1024 ** 2}
        disabled={uploading}
        className={cx({ [classes.disabled]: uploading === true })}
        onReject={(files) => console.log('rejected files', files)}
        onDrop={async (file) => {
          if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append("pdfFile", file[0]);

            const response = await postData(formData, '/extract', false);
            handleUpload(response.trim()).then(() => setUploading(false));
          }
        }}
      >
        {uploading &&
          <Overlay opacity={0}>
            <Center h={'100%'}>
              <RingProgress
                size={100}
                thickness={12}
                sections={[{ value: progress, color: theme.colors.blue[6] }]}
                roundCaps
                rootColor={theme.colors.gray[4]}
                label={
                  <Text color="blue" weight={800} align="center" size="xl">
                    {progress}%
                  </Text>
                }
              />
            </Center>
          </Overlay>
        }

        <Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconDownload
              size={50}
              color={theme.colors[theme.primaryColor][6]}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={50}
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconCloudUpload
              size={40}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag and drop here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach a <i>.pdf</i> file that is smaller than 30mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </div>
  );
}
