"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React, {
  type ComponentProps,
  type ComponentType,
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react"
import { Model } from "../services/geminiService";

import clsx from "clsx"
import { Check, ChevronDown } from "lucide-react"

// Mocked dependencies based on the provided code snippet
// In a real application, these would be actual implementations or external libraries.
const useEscCloseStack = (open: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);
};
const useLatestValue = <T,>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};
const preventDefaultHandler = (e: Event) => e.preventDefault();
const toCssVariables = (obj: Record<string, string | number | undefined>) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[`--${key}`] = typeof value === 'number' ? `${value}px` : value;
    }
    return acc;
  }, {} as Record<string, string>);
};
const useLinkComponent = () => "a"; // Mocked

const Button = ({ children, onClick, className }: { children: ReactNode; onClick: (evt: MouseEvent) => void; className?: string }) => (
  <button onClick={onClick} className={className}>{children}</button>
);

const TransitionGroup = ({ children, disableAnimations }: { children: ReactNode; enterDuration: number; exitDuration: number; disableAnimations: boolean }) => (
  <>{children}</>
);

const s = {
  MenuItem: "relative flex items-center px-4 py-2 text-sm cursor-default select-none outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
  PressableInner: "flex-grow",
  ItemActions: "ml-auto pl-4 text-xs text-gray-500",
  MenuItemContent: "px-4 py-2 text-sm",
  Separator: "h-px bg-gray-200 dark:bg-[#272727] my-1",
  Menu: "z-50",
  MenuList: "min-w-[200px] p-1 rounded-2xl bg-white dark:bg-[#141414] shadow-lg border border-gray-200 dark:border-[#272727] z-50",
  SubMenuItem: "",
  SubTriggerIcon: "ml-2",
  RadioItem: "rounded-xl data-[state=checked]:bg-gray-100 data-[state=checked]:dark:bg-[#2a2a2a]",
  RadioIndicator: "absolute left-2 flex h-full items-center justify-center",
  RadioIndicatorActive: "", // Usunięto kropkę
  CheckboxItem: "",
  CheckboxIndicator: "absolute left-2 flex h-full items-center justify-center",
  CheckboxCircle: "w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center",
};

// Dodanie useEffect do mockowanych hooków


type MenuContextValue = {
  open: boolean
  setOpen: (next: boolean) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

const useMenuContext = () => {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error("Menu components must be wrapped in <Menu />")
  }

  return context
}

export type MenuProps = {

  selectedModel: Model;
  onModelChange: (model: Model) => void;
  isThinking: boolean;
  onThinkingChange: (thinking: boolean) => void;
  /** Force the menu to remain open or closed */
  forceOpen?: boolean;
  /** Callback triggered when the modal is opened */
  onOpen?: () => void;
  /** Callback triggered when the modal is closed */
  onClose?: () => void;
  /**
   * When set to `true`, interaction with outside elements will be disabled and only menu content will be visible to screen readers.
   * @default false
   */
  modal?: boolean;
}

export const Menu = ({ forceOpen, onOpen, onClose, modal = false, selectedModel, onModelChange, isThinking, onThinkingChange }: MenuProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const isOpen = forceOpen ?? open

  const latestOnOpen = useLatestValue(onOpen)
  const latestOnClose = useLatestValue(onClose)

  const handleOpenChange = useCallback(
    (nextState: boolean) => {
      setOpen(nextState)
      if (nextState) {
        latestOnOpen.current?.()
      } else {
        latestOnClose.current?.()
      }
    },
    [latestOnOpen, latestOnClose],
  )

  useEscCloseStack(isOpen, () => {
    handleOpenChange(false)
  })

  const store = useMemo<MenuContextValue>(
    () => ({
      open: isOpen,
      setOpen: handleOpenChange,
    }),
    [isOpen, handleOpenChange],
  )

  return (
    <MenuContext.Provider value={store}>
      <DropdownMenu.Root open={isOpen} onOpenChange={handleOpenChange} modal={modal}>
        <Trigger>
          <button className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
            {selectedModel === Model.DEEPSEEK_R1 ? 'DeepSeek R1' : selectedModel === Model.DEEPSEEK_V3_1 ? 'DeepSeek v3.1' : 'Mistral'}
            <ChevronDown className="h-4 w-4" />
          </button>
        </Trigger>
        <Content sideOffset={5} align="start">
          <RadioGroup value={selectedModel} onChange={onModelChange}>
            <RadioItem value={Model.DEEPSEEK_R1}>
              DeepSeek R1
            </RadioItem>
            <RadioItem value={Model.DEEPSEEK_V3_1}>
              DeepSeek v3.1
            </RadioItem>
            
          </RadioGroup>

        </Content>
      </DropdownMenu.Root>
    </MenuContext.Provider>
  )
}

export type MenuItemProps = {
  className?: string
  children: React.ReactNode
  /** Callback triggered when the item is pressed */
  onSelect?: DropdownMenu.DropdownMenuItemProps["onSelect"]
  /** Callback triggered when the item is clicked */
  onClick?: DropdownMenu.DropdownMenuItemProps["onClick"]
  /** Disables the menu item */
  disabled?: boolean
}

const Item = ({ className, children, disabled, onSelect, onClick }: MenuItemProps) => {
  const { open } = useMenuContext()

  // This handler patches over focus races with core Radix primitives
  // https://github.com/radix-ui/primitives/blob/main/packages/react/menu/src/Menu.tsx#L712-L734
  const handlePreventAfterClose = (evt: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default behavior when we're always known to be closing
    if (!open) {
      evt.preventDefault()
    }
  }

  // Custom click handlers
  if (onSelect) {
    return (
      <DropdownMenu.Item
        className={clsx(s.MenuItem, className)}
        onSelect={onSelect}
        onClick={onClick}
        disabled={disabled}
        onPointerMove={handlePreventAfterClose}
        onPointerLeave={handlePreventAfterClose}
      >
        <div className={s.PressableInner}>{children}</div>
      </DropdownMenu.Item>
    )
  }

  // Read-only content - will not appear interactive.
  return <div className={clsx(s.MenuItemContent, className)}>{children}</div>
}

const ItemActions = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={clsx(s.ItemActions, className)}>{children}</div>
}

const ItemAction = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: (evt: MouseEvent) => void
}) => {
  const { setOpen } = useMenuContext()

  return (
    <Button
      className="rounded-sm"
      // color="secondary"
      // size="xs"
      // uniform
      // iconSize="sm"
      // variant="ghost"
      onClick={(evt) => {
        evt.stopPropagation()
        setOpen(false)
        onClick(evt)
      }}
    >
      {children}
    </Button>
  )
}

type MenuLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  /** Content rendered inside the Link */
  children: React.ReactNode
  /** Disables the menu item */
  disabled?: boolean
}

type MenuLink = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ComponentType<any> | "a" = any,
>(
  props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
    MenuLinkProps & {
      /**
       * Override the default component used for the link. This is useful for
       * using a routing library, or SSR rendering.
       * purposes.
       * @default 'a'
       */
      as?: T
    } & ComponentProps<T>,
) => ReactNode

const Link = ((props: MenuLinkProps & { href?: string; to?: string; as?: any }) => {
  const { className, children, href, to, disabled, as: OverrideComponent, ...restProps } = props
  const { open } = useMenuContext()

  const propPath = href || to
  // When a path is not provided, default to an anchor
  const isExternal = propPath ? /^https?:\/\//.test(propPath) : true
  const DefaultComponent = useLinkComponent()
  const Component = OverrideComponent || (isExternal ? "a" : DefaultComponent)

  // This handler patches over focus races with core Radix primitives
  // https://github.com/radix-ui/primitives/blob/main/packages/react/menu/src/Menu.tsx#L712-L734
  const handlePreventAfterClose = (evt: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default behavior when we're always known to be closing
    if (!open) {
      evt.preventDefault()
    }
  }

  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer", href: href ?? to }
    : { href, to }

  return (
    <DropdownMenu.Item
      asChild
      className={clsx(s.MenuItem, className)}
      disabled={disabled}
      onPointerMove={isExternal ? undefined : handlePreventAfterClose}
      onPointerLeave={isExternal ? undefined : handlePreventAfterClose}
    >
      <Component {...linkProps} {...restProps}>
        <span className={s.PressableInner}>{children}</span>
      </Component>
    </DropdownMenu.Item>
  )
}) as MenuLink

const Separator = ({ className }: { className?: string }) => {
  return <DropdownMenu.Separator className={clsx(s.Separator, className)} role="separator" />
}

export type MenuContentProps = {
  children: React.ReactNode
  /**
   * The preferred side of the trigger to render against when open. Will be reversed when collisions occur.
   * @default bottom
   */
  side?: DropdownMenu.DropdownMenuContentProps["side"]
  /**
   * The distance in pixels from the trigger.
   * @default 5
   */
  sideOffset?: DropdownMenu.DropdownMenuContentProps["sideOffset"]
  /**
   * The preferred alignment against the trigger. May change when collisions occur.
   * @default center
   */
  align?: DropdownMenu.DropdownMenuContentProps["align"]
  /**
   * An offset in pixels from the "start" or "end" alignment options.
   * @default 0
   */
  alignOffset?: DropdownMenu.DropdownMenuContentProps["alignOffset"]
  /**
   * Defines the `width` property of the content
   * @default auto
   */
  width?: number | "auto"
  /**
   * Defines the `min-width` property of the content, in pixels.
   * @default 300
   */
  minWidth?: number | "auto"
  /**
   * Defines the `max-width` property of the content, in pixels.
   */
  maxHeight?: number
}

const Content = ({
  children,
  side,
  sideOffset = 5,
  align,
  alignOffset,
  width,
  minWidth,
  maxHeight,
}: MenuContentProps) => {
  const { open } = useMenuContext()

  return (
    <DropdownMenu.Portal forceMount>
      <TransitionGroup className={s.Menu} enterDuration={350} exitDuration={200} disableAnimations>
        {open && (
          <DropdownMenu.Content
            key="dropdown"
            forceMount
            className={s.MenuList}
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset ?? (align === "center" ? 0 : -5)}
            avoidCollisions
            collisionPadding={{ bottom: 30, top: 30, left: 12, right: 12 }}
            onEscapeKeyDown={preventDefaultHandler}
            style={toCssVariables({
              "menu-width": width,
              "menu-min-width": minWidth,
              "menu-max-height": maxHeight,
            })}
          >
            {children}
          </DropdownMenu.Content>
        )}
      </TransitionGroup>
    </DropdownMenu.Portal>
  )
}

const Trigger = ({ children, disabled }: DropdownMenu.DropdownMenuTriggerProps) => {
  return (
    <DropdownMenu.Trigger asChild disabled={disabled}>
      {children}
    </DropdownMenu.Trigger>
  )
}

type SubmenuContextValue = {
  open: boolean
  setOpen: (next: boolean) => void
  triggerRef: React.RefObject<HTMLDivElement | null>
}

const SubmenuContext = createContext<SubmenuContextValue | null>(null)

const useSubmenuContext = () => {
  const context = useContext(SubmenuContext)

  if (!context) {
    throw new Error("Submenu components must be wrapped in <Sub />")
  }

  return context
}

export type SubmenuProps = {
  children: React.ReactNode
  /** Force the menu to remain open or closed */
  forceOpen?: boolean
  /** Callback triggered when the modal is opened */
  onOpen?: () => void
  /** Callback triggered when the modal is closed */
  onClose?: () => void
}

const Sub = ({ children, forceOpen, onOpen, onClose }: SubmenuProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const isOpen = forceOpen ?? open

  const latestOnOpen = useLatestValue(onOpen)
  const latestOnClose = useLatestValue(onClose)

  const handleOpenChange = useCallback(
    (nextState: boolean) => {
      setOpen(nextState)
      if (nextState) {
        latestOnOpen.current?.()
      } else {
        latestOnClose.current?.()
      }
    },
    [latestOnOpen, latestOnClose],
  )

  useEscCloseStack(isOpen, () => {
    handleOpenChange(false)
    // Ensure trigger is focused
    triggerRef.current?.focus()
  })

  const store = useMemo<SubmenuContextValue>(
    () => ({
      open: isOpen,
      setOpen: handleOpenChange,
      triggerRef,
    }),
    [isOpen, handleOpenChange],
  )

  return (
    <SubmenuContext.Provider value={store}>
      <DropdownMenu.Sub open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </DropdownMenu.Sub>
    </SubmenuContext.Provider>
  )
}

const SubTrigger = ({
  className,
  children,
  disabled,
}: {
  className?: string
  children: ReactNode
  disabled?: boolean
}) => {
  const { open } = useMenuContext()
  const { triggerRef } = useSubmenuContext()

  // This handler patches over focus races with core Radix primitives
  // https://github.com/radix-ui/primitives/blob/main/packages/react/menu/src/Menu.tsx#L712-L734
  const handlePreventAfterClose = (evt: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default behavior when we know the outer menu is closing
    if (!open) {
      evt.preventDefault()
    }
  }

  return (
    <DropdownMenu.SubTrigger
      ref={triggerRef}
      className={clsx(s.MenuItem, s.SubMenuItem, className)}
      disabled={disabled}
      onPointerMove={handlePreventAfterClose}
      onPointerLeave={handlePreventAfterClose}
    >
      <div className={s.PressableInner}>
        {children}
        <ChevronDown width="16" height="16" className={clsx(s.SubTriggerIcon, "group-data-[state=open]:rotate-180")} />
      </div>
    </DropdownMenu.SubTrigger>
  )
}

type SubContentProps = {
  children: ReactNode
  sideOffset?: DropdownMenu.DropdownMenuSubContentProps["sideOffset"]
  alignOffset?: DropdownMenu.DropdownMenuSubContentProps["alignOffset"]
  width?: number | "auto"
  minWidth?: number | "auto"
  maxHeight?: number
}

const SubContent = ({
  children,
  sideOffset = 4,
  alignOffset = -6,
  width = "auto",
  minWidth = "auto",
  maxHeight,
}: SubContentProps) => {
  const { open } = useSubmenuContext()

  return (
    <DropdownMenu.Portal forceMount>
      <TransitionGroup className={s.Menu} enterDuration={350} exitDuration={200} disableAnimations>
        {open && (
          <DropdownMenu.SubContent
            key="submenu"
            className={s.MenuList}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            avoidCollisions
            collisionPadding={{ bottom: 30, top: 30, left: 12, right: 12 }}
            onEscapeKeyDown={preventDefaultHandler}
            style={toCssVariables({
              "menu-width": width,
              "menu-min-width": minWidth,
              "menu-max-height": maxHeight,
            })}
          >
            {children}
          </DropdownMenu.SubContent>
        )}
      </TransitionGroup>
    </DropdownMenu.Portal>
  )
}

export type MenuRadioGroupProps<T extends string> = {
  /** Controlled value */
  value: T
  /** Fired when selection changes */
  onChange: (value: T) => void
  children: ReactNode
  /**
   * The orientation of the indicator within the radio item.
   * @default end
   */
  indicatorPosition?: "start" | "end"
}

const RadioGroup = <T extends string>({
  children,
  value,
  onChange,
  indicatorPosition = "end",
  ...props
}: MenuRadioGroupProps<T>) => (
  <DropdownMenu.RadioGroup
    {...props}
    value={value}
    onValueChange={(v: string) => onChange(v as T)}
    data-indicator-position={indicatorPosition}
  >
    {children}
  </DropdownMenu.RadioGroup>
)

export type MenuRadioItemProps<T extends string> = {
  value: T
  /** Class applied to the radio item */
  className?: string
  children: React.ReactNode
  /** Callback triggered when the radio item is pressed */
  onSelect?: DropdownMenu.DropdownMenuItemProps["onSelect"]
  /** Disables the radio item */
  disabled?: boolean
}

const RadioItem = <T extends string>({ className, children, ...props }: MenuRadioItemProps<T>) => (
  <DropdownMenu.RadioItem className={clsx(s.MenuItem, s.RadioItem, className)} {...props}>
    <div className={s.PressableInner}>
      <div className={s.RadioIndicator}>
        <DropdownMenu.ItemIndicator className={s.RadioIndicatorActive} />
      </div>
      {children}
    </div>
  </DropdownMenu.RadioItem>
)

export type MenuCheckboxItemProps = {
  /** Controlled checked state of the checkbox item */
  checked?: DropdownMenu.DropdownMenuCheckboxItemProps["checked"]
  /** Event handler called when the checked state changes */
  onCheckedChange?: DropdownMenu.DropdownMenuCheckboxItemProps["onCheckedChange"]
  /** Class applied to the checkbox item */
  className?: string
  children: React.ReactNode
  /** Callback triggered when the checkbox item is pressed */
  onSelect?: DropdownMenu.DropdownMenuItemProps["onSelect"]
  /** Disables the checkbox item */
  disabled?: boolean
  /**
   * The orientation of the indicator within the checkbox item.
   * @default end
   */
  indicatorPosition?: "start" | "end"
  /**
   * Visual treatment for the checkbox indicator.
   * @default solid
   */
  indicatorVariant?: "solid" | "ghost"
}
const CheckboxItem = ({
  className,
  children,
  indicatorPosition = "end",
  indicatorVariant = "solid",
  ...props
}: MenuCheckboxItemProps) => (
  <DropdownMenu.CheckboxItem
    className={clsx(s.MenuItem, s.CheckboxItem, className)}
    {...props}
    data-indicator-position={indicatorPosition}
    data-indicator-variant={indicatorVariant}
  >
    <div className={s.PressableInner}>
      <div className={s.CheckboxIndicator}>
        <DropdownMenu.ItemIndicator>
          {indicatorVariant === "ghost" ? (
            <Check className="size-4" />
          ) : (
            <div className={s.CheckboxCircle}>
              <Check className="size-4" />
            </div>
          )}
        </DropdownMenu.ItemIndicator>
      </div>
      {children}
    </div>
  </DropdownMenu.CheckboxItem>
)

Menu.Content = Content
Menu.Item = Item
Menu.ItemActions = ItemActions
Menu.ItemAction = ItemAction
Menu.Link = Link
Menu.Separator = Separator
Menu.Trigger = Trigger
Menu.Sub = Sub
Menu.SubTrigger = SubTrigger
Menu.SubContent = SubContent
Menu.CheckboxItem = CheckboxItem
Menu.RadioGroup = RadioGroup
Menu.RadioItem = RadioItem
