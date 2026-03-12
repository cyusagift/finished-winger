import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

const SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange, className, children, ...props }, ref) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (next) => {
      const nextOpen = typeof next === "function" ? next(open) : next;
      if (onOpenChange) onOpenChange(nextOpen);
      else setUncontrolledOpen(nextOpen);
    },
    [open, onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => setOpen((v) => !v), [setOpen]);

  const value = React.useMemo(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      isMobile: false,
      openMobile: false,
      setOpenMobile: () => {},
      toggleSidebar,
    }),
    [open, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <aside ref={ref} data-sidebar="sidebar" className={cn("bg-sidebar text-sidebar-foreground", className)} {...props} />
));
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-sidebar="trigger"
      className={cn("inline-flex items-center justify-center", className)}
      onClick={(e) => {
        props.onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    />
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="rail" className={cn("w-1 bg-sidebar-border", className)} {...props} />
));
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="inset" className={cn("min-w-0 flex-1", className)} {...props} />
));
SidebarInset.displayName = "SidebarInset";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="header" className={cn("p-2", className)} {...props} />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="footer" className={cn("p-2", className)} {...props} />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="content" className={cn("p-2", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" data-sidebar="separator" className={cn("h-px bg-sidebar-border", className)} {...props} />
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarInput = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} data-sidebar="input" className={cn("w-full rounded-md border bg-background px-2 py-1 text-sm", className)} {...props} />
));
SidebarInput.displayName = "SidebarInput";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <section ref={ref} data-sidebar="group" className={cn("space-y-2", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="group-label" className={cn("px-2 text-xs font-medium text-sidebar-foreground/70", className)} {...props} />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="group-content" className={cn("space-y-1", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-sidebar="group-action"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("space-y-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-sidebar="menu-button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-sidebar="menu-action"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} data-sidebar="menu-badge" className={cn("ml-auto text-xs", className)} {...props} />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="menu-skeleton" className={cn("h-8 rounded-md bg-muted", className)} {...props} />
));
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu-sub" className={cn("ml-4 space-y-1 border-l border-sidebar-border pl-2", className)} {...props} />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-sub-item" className={cn("relative", className)} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
