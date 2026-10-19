import type { Meta } from '@storybook/react-vite';
import { Monitor } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
`;

export default {
  title: 'Other/Monitor',
  component: Monitor,
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof Monitor>;

export function Default() {
  return <Monitor backgroundStyles={{ background: 'blue' }} />;
}

Default.story = {
  name: 'default'
};
