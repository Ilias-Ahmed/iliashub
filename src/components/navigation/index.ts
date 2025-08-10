import {
  NavigationProvider,
  useNavigation,
} from "@/contexts/NavigationContext";
import CommandPalette from "../ui/CommandPalette";
import DockNavigation from "./DockNavigation";
import { Dock, DockIcon, DockItem, DockLabel } from "./MacDock";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";
import VoiceNavigation from "./VoiceNavigation";

export {
  CommandPalette,
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
  DockNavigation,
  MobileNavigation,
  Navigation,
  NavigationProvider,
  useNavigation,
  VoiceNavigation,
};
