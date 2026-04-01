import type { Achievement, Experience, FunctionTag } from '../../types';

interface Props {
  experience: Experience;
  targetFunction: FunctionTag;
  selectedAchievementIds: Set<string>;
  onToggle: (achievementId: string) => void;
}

export function getVariantText(achievement: Achievement, fn: FunctionTag): string {
  return (
    achievement.variants.find((v) => v.function === fn)?.text ||
    achievement.variants.find((v) => v.function === 'General')?.text ||
    achievement.variants[0]?.text ||
    achievement.coreDescription
  );
}

export default function BulletSelector({ experience, targetFunction, selectedAchievementIds, onToggle }: Props) {
  if (experience.achievements.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic pl-1 py-1">No achievements added yet.</p>
    );
  }

  return (
    <div className="space-y-1.5 pl-1 pt-1">
      {experience.achievements.map((ach) => {
        const bulletText = getVariantText(ach, targetFunction);
        const isSelected = selectedAchievementIds.has(ach.id);
        const hasTargetVariant = ach.variants.some((v) => v.function === targetFunction);

        return (
          <label
            key={ach.id}
            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer border transition-colors ${
              isSelected
                ? 'bg-indigo-50 border-indigo-200'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(ach.id)}
              className="mt-0.5 flex-shrink-0 h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1 min-w-0">
              {bulletText ? (
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                  {bulletText}
                </p>
              ) : (
                <p className="text-xs italic text-gray-400">No bullet text available</p>
              )}
              {!hasTargetVariant && isSelected && (
                <p className="text-xs text-amber-600 mt-0.5">
                  ⚠ No {targetFunction} variant — using {
                    ach.variants.find((v) => v.function === 'General') ? 'General' : 'first available'
                  }
                </p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
