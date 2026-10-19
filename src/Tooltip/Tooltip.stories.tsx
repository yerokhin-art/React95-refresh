import type { Meta } from '@storybook/react-vite';
import { Button, Tooltip } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
`;

export default {
  title: 'Controls/Tooltip',
  component: Tooltip,
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof Tooltip>;

export function Default() {
  return (
    <Tooltip text='I see you! 🤷‍' enterDelay={100} leaveDelay={500}>
      <Button>Hover me</Button>
    </Tooltip>
  );
}

Default.story = {
  name: 'default'
};
