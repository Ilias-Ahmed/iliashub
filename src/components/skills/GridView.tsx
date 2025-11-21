import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Skill } from "./types";

interface GridViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
  setHoveredSkill: (skillId: string | null) => void;
  hoveredSkill: string | null;
  onCompareSkill: (skillId: string) => void;
}

interface SkillChipProps {
  skill: Skill;
  isActive: boolean;
  onActivate: () => void;
  onHover: () => void;
  onLeave: () => void;
  onCompare: (event: MouseEvent<HTMLButtonElement>) => void;
  isDark: boolean;
  accentColors: Record<string, string>;
}

const SkillChip = memo(
  ({
    skill,
    isActive,
    onActivate,
    onHover,
    onLeave,
    onCompare,
    isDark,
    accentColors,
  }: SkillChipProps) => {
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      },
      [onActivate]
    );

    return (
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
        onKeyDown={handleKeyDown}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex min-w-[12.5rem] cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          borderColor: isActive
            ? accentColors.primary
            : isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)",

          boxShadow: isActive
            ? `0 18px 38px ${skill.color}22`
            : "0 12px 24px rgba(15, 23, 42, 0.08)",
          transform: isActive ? "scale(1.03)" : undefined,
        }}
      >
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{
            backgroundColor: `${skill.color}20`,
            color: skill.color,
          }}
          animate={{ rotate: isActive ? 0 : -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {skill.icon}
        </motion.div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
            {skill.category}
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold">{skill.name}</span>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: `${skill.color}18`,
                color: skill.color,
              }}
            >
              {skill.level}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: skill.color }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onCompare}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-sm opacity-0 shadow-sm transition-opacity group-hover:opacity-95"
          style={{
            backgroundColor: `${accentColors.primary}18`,
            color: accentColors.primary,
            border: `1px solid ${accentColors.primary}33`,
          }}
          aria-label={`Compare ${skill.name}`}
        >
          ⚖️
        </button>

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0"
          animate={{ opacity: isActive ? 0.3 : 0 }}
        />
      </motion.div>
    );
  }
);

SkillChip.displayName = "SkillChip";

const ActiveSkillPanel = memo(
  ({
    skill,
    onCompare,
    onOpenDetail,
  }: {
    skill: Skill | null;
    isDark: boolean;
    onCompare: (skillId: string) => void;
    onOpenDetail: () => void;
  }) => {
    if (!skill) {
      return (
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/40 p-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">
            Hover a skill card to preview its journey.
          </p>
        </div>
      );
    }

    return (
      <motion.div
        layout
        key={skill.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border p-8 shadow-2xl"

      >
        <div
          className="absolute -top-24 right-12 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: `${skill.color}35` }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: `${skill.color}22`,
                color: skill.color,
              }}
            >
              {skill.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] opacity-70">
                {skill.category}
              </p>
              <h3 className="mt-1 text-2xl font-bold">{skill.name}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm opacity-70">
                <span>{skill.projects} projects shipped</span>
                <span className="h-1 w-1 rounded-full bg-current opacity-50" />
                <span>{skill.yearsExperience} years in practice</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.3em] opacity-60">
                Mastery
              </span>
              <span
                className="text-4xl font-black"
                style={{ color: skill.color }}
              >
                {skill.level}%
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {skill.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onCompare(skill.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              ⚖️ Add to comparison
            </button>
            <button
              type="button"
              onClick={onOpenDetail}
              className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              ℹ️ View full profile
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

ActiveSkillPanel.displayName = "ActiveSkillPanel";

const GridView = ({
  skills,
  setSelectedSkill,
  setHoveredSkill,
  hoveredSkill,
  onCompareSkill,
}: GridViewProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = useMemo(() => getAccentColors(), [getAccentColors]);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const skillsByCategory = useMemo(() => {
    const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([, aSkills], [, bSkills]) => {
      const average = (items: Skill[]) =>
        items.reduce((total, item) => total + item.level, 0) / items.length;
      return average(bSkills) - average(aSkills);
    });
  }, [skills]);

  useEffect(() => {
    if (!skills.length) {
      setActiveSkillId(null);
      return;
    }

    if (!skills.some((skill) => skill.id === activeSkillId)) {
      setActiveSkillId(skills[0].id);
    }
  }, [skills, activeSkillId]);

  const activeSkill = useMemo(
    () => skills.find((skill) => skill.id === activeSkillId) || null,
    [skills, activeSkillId]
  );

  const handleCompare = useCallback(
    (skillId: string) => {
      onCompareSkill(skillId);
    },
    [onCompareSkill]
  );

  const handleActivateSkill = useCallback((skill: Skill) => {
    setActiveSkillId(skill.id);
  }, []);

  if (!skillsByCategory.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border/40 p-10 text-center text-muted-foreground">
        <p className="text-sm font-medium">
          No skills match the selected filters in grid view.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)]">
      <div className="space-y-8">
        {skillsByCategory.map(([categoryName, categorySkills], index) => {
          const categoryColor =
            categorySkills[0]?.color || accentColors.primary;
          const averageLevel = Math.round(
            categorySkills.reduce((total, skill) => total + skill.level, 0) /
              categorySkills.length
          );

          return (
            <motion.section
              key={categoryName}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.45 }}
              className="rounded-3xl border px-5 py-6 shadow-sm"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <h4
                    className="text-lg font-semibold"
                    style={{ color: categoryColor }}
                  >
                    {categoryName}
                  </h4>
                  <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {categorySkills.length} skills
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] opacity-70">
                  <span>Avg mastery</span>
                  <span
                    className="rounded-full px-2 py-1 font-semibold"
                    style={{
                      backgroundColor: `${categoryColor}18`,
                      color: categoryColor,
                    }}
                  >
                    {averageLevel}%
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                {categorySkills.map((skill) => {
                  const isActive = activeSkillId === skill.id;

                  return (
                    <SkillChip
                      key={skill.id}
                      skill={skill}
                      isActive={isActive}
                      isDark={isDark}
                      accentColors={accentColors}
                      onActivate={() => handleActivateSkill(skill)}
                      onHover={() => {
                        setHoveredSkill(skill.id);
                        setActiveSkillId(skill.id);
                      }}
                      onLeave={() => {
                        if (hoveredSkill === skill.id) {
                          setHoveredSkill(null);
                        }
                      }}
                      onCompare={(event) => {
                        event.stopPropagation();
                        handleCompare(skill.id);
                      }}
                    />
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      <ActiveSkillPanel
        skill={activeSkill}
        isDark={isDark}
        onCompare={handleCompare}
        onOpenDetail={() => {
          if (activeSkill) {
            setSelectedSkill(activeSkill);
          }
        }}
      />
    </div>
  );
};

export default memo(GridView);
