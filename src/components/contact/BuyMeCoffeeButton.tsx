import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Coffee } from "lucide-react";

type Props = {
  size?: "sm" | "default" | "lg";
  className?: string;
};

const BuyMeCoffeeButton = ({ size = "lg", className }: Props) => {
  const { getAccentColors } = useTheme();
  const accent = getAccentColors();

  return (
    <a
      href="https://buymeacoffee.com/Ilias_Ahmed"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Support me on Buy Me a Coffee"
      className={className}
    >
      <Button
        size={size}
        className="group border transition-colors"
        style={{
          backgroundColor: accent.primary,
          color: "#fff",
          borderColor: `${accent.primary}99`,
        }}
      >
        <Coffee className="size-4" />
        <span>Buy me a coffee</span>
      </Button>
    </a>
  );
};

export default BuyMeCoffeeButton;
