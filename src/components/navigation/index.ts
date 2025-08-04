import {
  NavigationProvider,
  useNavigation,
} from "@/contexts/NavigationContext";
import CommandPalette from "../ui/CommandPalette";
import DockNavigation from "./DockNavigation";
import DotsNavigation from "./DotsNavigation";
import { Dock, DockIcon, DockItem, DockLabel } from "./MacDock";
import MobileNavigationMenu from "./MobileNavigationMenu";
import Navigation from "./Navigation";
import NavigationMenu from "./NavigationMenu";
import VoiceNavigation from "./VoiceNavigation";

export {
  CommandPalette,
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
  DockNavigation,
  DotsNavigation,
  MobileNavigationMenu,
  Navigation,
  NavigationMenu,
  NavigationProvider,
  useNavigation,
  VoiceNavigation,
};
