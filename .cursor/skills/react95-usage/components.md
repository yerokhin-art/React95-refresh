# `react95-refresh` Component Reference

All components are named exports from `'react95-refresh'`. Most accept native HTML attributes for their root element plus `as?: string | ComponentType<any>`.

---

## 1. Surfaces & Layout

### `Window`, `WindowHeader`, `WindowContent`
- **`WindowProps`**: `resizable?: boolean = false`, `resizeRef?: React.Ref<HTMLSpanElement>`, `shadow?: boolean = true`, `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>`.
- **`WindowHeaderProps`**: `active?: boolean = true`, `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>`. (`Button` inside `WindowHeader` auto-scales to 31×27px).
- **`WindowContentProps`**: `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>` (16px padding).

```tsx
<Window resizable style={{ width: 400 }}>
  <WindowHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>notepad.exe</span>
    <Button onClick={onClose}>✕</Button>
  </WindowHeader>
  <Toolbar>
    <Button variant='thin' size='sm'>File</Button>
    <Button variant='thin' size='sm'>Edit</Button>
  </Toolbar>
  <WindowContent>Content here</WindowContent>
</Window>
```

### `Frame`
Generic 3D bordered box container.
- **`FrameProps`**: `variant?: 'window' | 'button' | 'field' | 'status' = 'window'` (`'field'` uses `theme.canvas` background), `shadow?: boolean = false`, `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>`.

```tsx
<Frame variant='status' style={{ padding: '4px 8px' }}>Ready</Frame>
```

### `ScrollView`
Inset cutout container with custom Windows 95 scrollbars. Also exports `StyledScrollView`.
- **`ScrollViewProps`**: `shadow?: boolean = true`, `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>`.

```tsx
<ScrollView style={{ width: 300, height: 200 }}>{longContent}</ScrollView>
```

### `GroupBox`
Windows 95 `<fieldset>` with `<legend>`.
- **`GroupBoxProps`**: `label?: ReactNode`, `disabled?: boolean = false`, `variant?: 'default' | 'flat' = 'default'`, `children?: ReactNode` + `FieldsetHTMLAttributes<HTMLFieldSetElement>`.

```tsx
<GroupBox label='Settings' variant='default'>
  <Checkbox label='Enable sound' defaultChecked />
</GroupBox>
```

### `Separator`
Horizontal or vertical 2px bevel line.
- **`SeparatorProps`**: `orientation?: 'horizontal' | 'vertical' = 'horizontal'`, `size?: string | number = '100%'`.

### `Handle`
Vertical drag/toolbar grab handle bar (5px wide).
- **`HandleProps`**: `size?: string | number = '100%'` + `HTMLAttributes<HTMLDivElement>`.

### `Monitor`
CRT monitor frame (195×155px body + stand).
- **`MonitorProps`**: `backgroundStyles?: React.CSSProperties`, `children?: ReactNode`.

---

## 2. Navigation, Bars & Menus

### `AppBar` & `Toolbar`
- **`AppBarProps`**: `position?: CSSProperties['position'] = 'fixed'`, `children: ReactNode` + `HTMLAttributes<HTMLElement>`.
- **`ToolbarProps`**: `noPadding?: boolean = false`, `children?: ReactNode` + `HTMLAttributes<HTMLDivElement>`.

```tsx
<AppBar position='fixed'>
  <Toolbar style={{ justifyContent: 'space-between' }}>
    <Button style={{ fontWeight: 'bold' }}>Start</Button>
    <TextInput placeholder='Search...' width={150} />
  </Toolbar>
</AppBar>
```

### `MenuList` & `MenuListItem`
Also exports `StyledMenuListItem`.
- **`MenuListProps`**: `fullWidth?: boolean`, `shadow?: boolean`, `inline?: boolean` + `HTMLAttributes<HTMLUListElement>`.
- **`MenuListItemProps`**: `size?: 'sm' | 'md' | 'lg' = 'lg'`, `disabled?: boolean`, `square?: boolean`, `primary?: boolean` (bold text) + `HTMLAttributes<HTMLLIElement>`.

```tsx
<MenuList shadow>
  <MenuListItem primary onClick={handleOpen}>Open</MenuListItem>
  <Separator />
  <MenuListItem disabled>Delete</MenuListItem>
</MenuList>
```

### `Tabs`, `Tab`, `TabBody`
- **`TabsProps`**: `value?: any`, `onChange?: (value: any, event: React.MouseEvent<HTMLButtonElement>) => void`, `rows?: number = 1`, `children?: ReactNode`.
- **`TabProps`**: `value?: any`, `selected?: boolean` (injected by `Tabs`), `onClick?: (value: any, event: React.MouseEvent<HTMLButtonElement>) => void`, `children?: ReactNode`.
- **`TabBodyProps`**: `children: ReactNode` + `HTMLAttributes<HTMLDivElement>`.

```tsx
const [tab, setTab] = useState(0);
<Tabs value={tab} onChange={val => setTab(val)}>
  <Tab value={0}>General</Tab>
  <Tab value={1}>Display</Tab>
</Tabs>
<TabBody>{tab === 0 ? <GeneralPane /> : <DisplayPane />}</TabBody>
```

---

## 3. Inputs & Controls

### `Button`
Also exports `StyledButton`.
- **`ButtonProps`**: `variant?: 'default' | 'raised' | 'flat' | 'thin' = 'default'`, `size?: 'sm' | 'md' | 'lg' = 'md'`, `active?: boolean = false`, `disabled?: boolean = false`, `fullWidth?: boolean = false`, `primary?: boolean = false`, `square?: boolean = false`, `type?: 'button' | 'submit' | 'reset' = 'button'`, `onClick?`, `children?: ReactNode`.

### `TextInput`
Renders `<input>` by default or `<textarea>` when `multiline={true}`.
- **`TextInputProps`**: `variant?: 'default' | 'flat' = 'default'`, `multiline?: boolean`, `fullWidth?: boolean`, `shadow?: boolean = true`, `disabled?: boolean = false`, `value?`, `defaultValue?`, `onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>`, plus native input/textarea props (`placeholder`, `type`, `rows`, `readOnly`, etc.).

```tsx
<TextInput placeholder='Username' value={name} onChange={e => setName(e.target.value)} fullWidth />
<TextInput multiline rows={4} defaultValue='Notes...' fullWidth />
```

### `NumberInput`
Numeric input with step up/down buttons. Fires `onChange` with a `number` on button clicks and input blur.
- **`NumberInputProps`**: `value?: number`, `defaultValue?: number`, `onChange?: (value: number) => void`, `min?: number`, `max?: number`, `step?: number = 1`, `disabled?: boolean = false`, `readOnly?: boolean`, `variant?: 'default' | 'flat' = 'default'`, `width?: string | number`.

```tsx
<NumberInput value={count} min={0} max={100} step={5} onChange={val => setCount(val)} width={120} />
```

### `Select<T>` & `SelectNative`
 Also exports types `SelectOption<T>`, `SelectRef`, `SelectChangeEvent<T>`, `SelectVariants`.
- **`SelectOption<T>`**: `{ value: T; label?: string }`.
- **`SelectProps<T>`**: `options?: (SelectOption<T> | null | undefined)[]`, `value?: T`, `defaultValue?: T`, `onChange?: (selectedOption: SelectOption<T>, meta: { fromEvent: Event | React.SyntheticEvent }) => void`, `variant?: 'default' | 'flat' = 'default'`, `width?: CSSProperties['width'] = 'auto'`, `menuMaxHeight?: string | number`, `formatDisplay?: (opt: SelectOption<T>) => string`, `open?: boolean`, `onOpen?`, `onClose?`, `disabled?: boolean = false`, `readOnly?: boolean`, `shadow?: boolean = true`, `name?: string`, `aria-label?`, `aria-labelledby?`.
- **`SelectNativeProps`**: Same common props but `T` is `string` and renders a native `<select>` element (no `menuMaxHeight`/`formatDisplay`/`open`).

```tsx
const options = [{ value: 1, label: 'Windows 95' }, { value: 2, label: 'Windows 98' }];
<Select
  options={options}
  defaultValue={1}
  width={180}
  menuMaxHeight={160}
  onChange={opt => console.log(opt.value)}
/>
```

### `Checkbox`
Supports controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`).
- **`CheckboxProps`**: `label?: string | number`, `checked?: boolean`, `defaultChecked?: boolean = false`, `indeterminate?: boolean = false`, `disabled?: boolean = false`, `variant?: 'default' | 'flat' = 'default'`, `value?: string | number`, `name?: string`, `onChange?: ChangeEventHandler<HTMLInputElement>`.

### `Radio`
Controlled radio button.
- **`RadioProps`**: `label?: string | number`, `checked?: boolean`, `value?: string | number | boolean`, `name?: string`, `disabled?: boolean = false`, `variant?: 'default' | 'flat' = 'default'`, `onChange?: ChangeEventHandler<HTMLInputElement>`.

```tsx
<Radio checked={val === 'a'} onChange={() => setVal('a')} value='a' label='Option A' name='grp' />
```

### `Slider`
Supports horizontal/vertical orientation and step marks.
- **`SliderProps`**: `value?: number`, `defaultValue?: number`, `min?: number = 0`, `max?: number = 100`, `step?: number | null = 1`, `marks?: boolean | { label?: string; value: number }[] = false`, `orientation?: 'horizontal' | 'vertical' = 'horizontal'`, `size?: string | number = '100%'`, `variant?: 'default' | 'flat' = 'default'`, `disabled?: boolean = false`, `onChange?: (value: number) => void`, `onChangeCommitted?: (value: number) => void`.

```tsx
<Slider min={0} max={100} step={10} marks defaultValue={50} onChange={v => setVol(v)} />
```

### `ColorInput`
Color picker button wrapping `<input type='color'>`. Also exports `StyledColorInput`.
- **`ColorInputProps`**: `value?: string`, `defaultValue?: string = '#008080'`, `onChange?: ChangeEventHandler<HTMLInputElement>`, `disabled?: boolean = false`, `variant?: 'default' | 'flat' = 'default'`.

### `DatePicker__UNSTABLE`
Pre-built calendar `Window`. Exported as `DatePicker__UNSTABLE` (type `DatePickerProps`).
- **`DatePickerProps`**: `date?: string` (ISO/parseable date string, defaults to today), `onAccept?: (chosenDate: string) => void` (returns `'YYYY-MM-DD'`), `onCancel?: MouseEventHandler<HTMLButtonElement>`, `shadow?: boolean = true`, `className?: string`.

---

## 4. Data Display & Feedback

### `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeadCell`, `TableDataCell`
- **`TableHeadCellProps`**: `disabled?: boolean = false`, `sort?: 'asc' | 'desc' | null`, `onClick?`, `children?: ReactNode` + `TdHTMLAttributes<HTMLTableCellElement>`.
- **`TableProps`**, **`TableHeadProps`**, **`TableBodyProps`**, **`TableRowProps`**, **`TableDataCellProps`**: Standard semantic table wrappers.

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeadCell onClick={toggleSort} sort='asc'>Name</TableHeadCell>
      <TableHeadCell>Size</TableHeadCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableDataCell>autoexec.bat</TableDataCell>
      <TableDataCell>1 KB</TableDataCell>
    </TableRow>
  </TableBody>
</Table>
```

### `TreeView<T>`
Hierarchical tree view. Exports `TreeView`, `type TreeViewProps<T>`, `type TreeLeaf<T>`.
- **`TreeLeaf<T>`**: `{ id: T; label?: string; icon?: ReactNode; disabled?: boolean; items?: TreeLeaf<T>[] }`.
- **`TreeViewProps<T>`**: `tree: TreeLeaf<T>[]`, `selected?: T`, `defaultSelected?: T`, `expanded?: T[]`, `defaultExpanded?: T[] = []`, `onNodeSelect?: (event: React.MouseEvent<HTMLElement>, id: T) => void`, `onNodeToggle?: (event: React.MouseEvent<HTMLElement>, expandedIds: T[]) => void`, `disabled?: boolean = false`.

```tsx
const tree: TreeLeaf<string>[] = [
  { id: 'c', label: 'C:', icon: '💾', items: [{ id: 'win', label: 'WINDOWS', icon: '📁' }] }
];
<TreeView tree={tree} defaultExpanded={['c']} onNodeSelect={(_, id) => setSelected(id)} />
```

### `ProgressBar`
- **`ProgressBarProps`**: `value?: number` (0–100), `variant?: 'default' | 'tile' = 'default'`, `hideValue?: boolean = false`, `shadow?: boolean = true` + `HTMLAttributes<HTMLDivElement>`.

### `Counter`
7-segment LED counter (Minesweeper style).
- **`CounterProps`**: `value?: number = 0`, `minLength?: number = 3`, `size?: 'sm' | 'md' | 'lg' | 'xl' = 'md'` + `HTMLAttributes<HTMLDivElement>`.

### `Avatar`
- **`AvatarProps`**: `src?: string`, `alt?: string = ''`, `size?: string | number = 35`, `square?: boolean = false`, `noBorder?: boolean = false`, `children?: ReactNode` (fallback initials/icon when `src` is omitted).

### `Tooltip`
Wraps trigger element and displays tooltip popup on hover/focus.
- **`TooltipProps`**: `text: string`, `position?: 'top' | 'bottom' | 'left' | 'right' = 'top'`, `enterDelay?: number = 1000`, `leaveDelay?: number = 0`, `disableFocusListener?: boolean = false`, `disableMouseListener?: boolean = false`, `onOpen?`, `onClose?`, `children: ReactNode`.

```tsx
<Tooltip text='Save file' enterDelay={300} position='bottom'>
  <Button square>💾</Button>
</Tooltip>
```

### `Hourglass`
Animated pixel hourglass loading indicator.
- **`HourglassProps`**: `size?: string | number = 30` + `HTMLAttributes<HTMLDivElement>`.

### `Anchor`
Retro hyperlink (`<a>`).
- **`AnchorProps`**: `underline?: boolean = true`, `children: ReactNode` + `AnchorHTMLAttributes<HTMLAnchorElement>`.
