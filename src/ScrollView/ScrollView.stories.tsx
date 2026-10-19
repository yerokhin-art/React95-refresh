import type { Meta } from '@storybook/react-vite';
import { ScrollView, Window, WindowContent } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
`;

export default {
  title: 'Layout/ScrollView',
  component: ScrollView,
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof ScrollView>;

export function Default() {
  return (
    <Window>
      <WindowContent>
        <ScrollView style={{ width: '300px', height: '200px' }}>
          <div>
            <p style={{ width: 400 }}>
              React95 is the best UI library ever created
            </p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
            <p>React95 is the best UI library ever created</p>
          </div>
        </ScrollView>
      </WindowContent>
    </Window>
  );
}

Default.story = {
  name: 'default'
};
