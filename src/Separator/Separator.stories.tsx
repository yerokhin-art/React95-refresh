import type { Meta } from '@storybook/react-vite';
import { MenuList, MenuListItem, Separator } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
`;

export default {
  title: 'Layout/Separator',
  component: Separator,
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof Separator>;

export function Default() {
  return (
    <>
      <MenuList>
        <MenuListItem>Item 1</MenuListItem>
        <Separator />
        <MenuListItem>Item 2</MenuListItem>
        <Separator />
        <MenuListItem>Item 3</MenuListItem>
      </MenuList>
      <MenuList inline style={{ margin: 30 }}>
        <MenuListItem>Item 1</MenuListItem>
        <Separator orientation='vertical' size='43px' />
        <MenuListItem>Item 2</MenuListItem>
        <Separator orientation='vertical' size='43px' />
        <MenuListItem>Item 3</MenuListItem>
      </MenuList>
    </>
  );
}

Default.story = {
  name: 'default'
};
