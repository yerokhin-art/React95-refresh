import type { Meta } from '@storybook/react-vite';
import { Handle, MenuList, MenuListItem, Separator } from 'react95';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
  display: flex;
  align-items: center;
  & > * {
    margin-right: 1rem;
  }
`;

export default {
  title: 'Controls/MenuList',
  component: MenuList,
  subcomponents: { MenuListItem },
  decorators: [story => <Wrapper>{story()}</Wrapper>]
} as Meta<typeof MenuList>;

export function Default() {
  return (
    <>
      <MenuList>
        <MenuListItem primary>Photos</MenuListItem>
        <MenuListItem
          as='a'
          // TODO: Come up with a more elegant way to allow props when `as` is used
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          href='https://expensive.toys'
          target='_blank'
        >
          Link
        </MenuListItem>
        <MenuListItem disabled>Other</MenuListItem>
      </MenuList>
      <MenuList inline>
        <MenuListItem square disabled>
          <span role='img' aria-label='🌿'>
            🌿
          </span>
        </MenuListItem>
        <Handle size={38} />
        <MenuListItem>Tackle</MenuListItem>
        <MenuListItem>Growl</MenuListItem>
        <MenuListItem disabled>Razor Leaf</MenuListItem>
      </MenuList>
      <MenuList>
        <MenuListItem primary size='sm'>
          View
        </MenuListItem>
        <Separator />
        <MenuListItem size='sm'>Paste</MenuListItem>
        <MenuListItem size='sm'>Paste Shortcut</MenuListItem>
        <MenuListItem size='sm'>Undo Copy</MenuListItem>
        <Separator />
        <MenuListItem size='sm'>Properties</MenuListItem>
      </MenuList>
      <MenuList>
        <MenuListItem square>
          <span role='img' aria-label='😎'>
            😎
          </span>
        </MenuListItem>
        <MenuListItem square>
          <span role='img' aria-label='🤖'>
            🤖
          </span>
        </MenuListItem>
        <MenuListItem square>
          <span role='img' aria-label='🎁'>
            🎁
          </span>
        </MenuListItem>
      </MenuList>
    </>
  );
}

Default.story = {
  name: 'default'
};
