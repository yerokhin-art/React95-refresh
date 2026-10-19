import type { Meta } from '@storybook/react-vite';
import { ColorInput, ScrollView } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.material};
  padding: 5rem;
  & > span {
    margin-left: 1rem;
    margin-right: 0.5rem;
  }
  #cutout {
    background: ${({ theme }) => theme.canvas};
    display: inline-block;
  }
  .content {
    padding: 1rem;
    & > div {
      margin: 1rem 0;
    }

    & > div > span {
      margin-right: 0.5rem;
    }
  }
`;

export default {
  title: 'Controls/ColorInput',
  component: ColorInput,
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof ColorInput>;

export function Default() {
  return (
    <>
      <span>enabled: </span>
      <ColorInput defaultValue='#00f' />
      <span>disabled: </span>
      <ColorInput disabled defaultValue='#00f' />
    </>
  );
}

Default.story = {
  name: 'default'
};

export function Flat() {
  return (
    <ScrollView id='cutout'>
      <div className='content'>
        <div>
          <span>enabled: </span>
          <ColorInput variant='flat' defaultValue='#00f' />
        </div>
        <div>
          <span>disabled: </span>
          <ColorInput variant='flat' disabled defaultValue='#00f' />
        </div>
      </div>
    </ScrollView>
  );
}

Flat.story = {
  name: 'flat'
};
