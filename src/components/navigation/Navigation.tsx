import { useNavigation } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import BackToTop from "../ui/BackToTop";
import DockNavigation from "./DockNavigation";
import MobileNavigation from "./MobileNavigation";
import VoiceNavigation from "./VoiceNavigation";

interface NavigationProps {
  enableDots?: boolean; // accepted for compatibility; no dots UI in this setup
  enableVoice?: boolean;
  enableBackToTop?: boolean;
  enableDock?: boolean;
  enableMenu?: boolean;
  enableCommandPalette?: boolean; // accepted for compatibility
}

const Navigation: React.FC<NavigationProps> = ({
  enableDots: _enableDots = false,
  enableVoice = true,
  enableBackToTop = true,
  enableDock = true,
  enableMenu = true,
  enableCommandPalette: _enableCommandPalette = true,
}) => {
  const navigation = useNavigation();
  const isMobile = useIsMobile();
  // touch unused compatibility flags so linter/tsc don’t complain
  void _enableDots;
  void _enableCommandPalette;
  const {
    isMenuOpen = false,
    toggleMenu = () => {},
    closeMenu = () => {},
  } = navigation || {};

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Alt/Cmd+M toggle
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMenu();
        return;
      }
      // Escape closes
      if (e.key === "Escape") {
        closeMenu();
      }
    },
    [toggleMenu, closeMenu]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Hamburger toggle: mobile only */}
      {enableMenu && isMobile && (
        <button
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={toggleMenu}
          className="fixed right-4 top-4 z-50 rounded-md border border-border/60 bg-background/70 backdrop-blur-md p-2 shadow-sm hover:bg-background transition-colors"
          type="button"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Mobile Navigation Drawer */}
      {enableMenu && isMobile && <MobileNavigation />}

      {/* Desktop Dock */}
      {enableDock && !isMobile && <DockNavigation />}

      {/* Desktop Voice Navigation */}
      {enableVoice && !isMobile && <VoiceNavigation />}

      {/* Back to Top on all devices */}
      {enableBackToTop && <BackToTop position="bottom-right" threshold={300} />}
    </>
  );
};

export default Navigation;
