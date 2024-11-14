import { useState } from "react";
import { CLASS_LIST, SKILL_LIST } from "./consts";
import { CharacterType, AttributeName, Attributes } from "./types";
import { calculateModifier } from "./utils";

type CharacterProps = {
  character: CharacterType;
  onAttributeChange: (
    characterName: string,
    attribute: AttributeName,
    newValue: number,
  ) => void;
  onSkillPointChange: (
    characterName: string,
    skillName: string,
    newPoints: number,
  ) => void;
};

const Character: React.FC<CharacterProps> = ({
  character,
  onAttributeChange,
  onSkillPointChange,
}) => {
  const handleAttributeChange = (
    attribute: AttributeName,
    increment: boolean,
  ) => {
    const currentVal = character.attributes[attribute];
    const newValue = increment ? currentVal + 1 : currentVal - 1;
    const totalPoints = Object.values(character.attributes).reduce(
      (total, value) => total + value,
      0,
    );
    if (totalPoints + (increment ? 1 : -1) > 70) {
      return;
    }
    onAttributeChange(character.name, attribute, newValue);
  };
  const [selectedClass, setSelectedClass] = useState<string>("");
  const totalSkillPointsToSpend = Math.max(
    10 + 4 * calculateModifier(character.attributes.Intelligence),
    0,
  );
  const usedSkillPoints = character.skills.reduce(
    (total, skill) => total + skill.points,
    0,
  );
  const availableSkillPoints = totalSkillPointsToSpend - usedSkillPoints;

  const handleSkillPointChange = (skillName: string, increment: boolean) => {
    const skill = character.skills.find((s) => s.name === skillName);
    if (skill) {
      const newPoints = increment
        ? skill.points + 1
        : Math.max(0, skill.points - 1);
      onSkillPointChange(character.name, skillName, newPoints);
    }
  };

  const getClassColour = (attributes: Attributes) => {
    for (const [attribute, value] of Object.entries(attributes)) {
      if (character.attributes[attribute] < value) {
        return "";
      }
    }
    return "green";
  };

  const handleClassClick = (className: string) => {
    setSelectedClass(className);
  };

  return (
    <div>
      <h2>{character.name}</h2>

      <div>
        <h3>Attributes</h3>
        {Object.entries(character.attributes).map(([attribute, value]) => (
          <div key={attribute}>
            <span>
              {attribute}: {value} (Modifier: {calculateModifier(value)})
            </span>
            <button
              onClick={() =>
                handleAttributeChange(attribute as AttributeName, true)
              }
            >
              +
            </button>
            <button
              onClick={() =>
                handleAttributeChange(attribute as AttributeName, false)
              }
            >
              -
            </button>
          </div>
        ))}
      </div>

      <div>
        <h3>Classes</h3>
        {Object.entries(CLASS_LIST).map(([className, requirements]) => (
          <div
            key={className}
            style={{ color: getClassColour(requirements) }}
            onClick={() => handleClassClick(className)}
          >
            <span>{className}</span>
          </div>
        ))}
        {selectedClass && (
          <div>
            <h4>{selectedClass} Minimum Requirements</h4>
            {Object.entries(
              CLASS_LIST[selectedClass as keyof typeof CLASS_LIST],
            ).map(([attr, reqValue]) => (
              <div key={attr}>
                {attr}: {reqValue}
              </div>
            ))}
            <button onClick={() => setSelectedClass("")}>
              Close Requirements View
            </button>
          </div>
        )}
      </div>

      <div>
        <h3>Skills</h3>
        <p>Total skill points available: {totalSkillPointsToSpend}</p>
        <p>Available Skill Points: {availableSkillPoints}</p>
        {SKILL_LIST.map((skill) => {
          const skillObj = character.skills.find((s) => s.name === skill.name);
          const points = skillObj ? skillObj.points : 0;
          const attributeModifier = calculateModifier(
            character.attributes[skill.attributeModifier as AttributeName],
          );
          const totalSkillValue = points + attributeModifier;

          return (
            <div key={skill.name}>
              <span>
                {skill.name} - Points: {points}{" "}
              </span>
              <button
                onClick={() => handleSkillPointChange(skill.name, true)}
                disabled={availableSkillPoints <= 0}
              >
                +
              </button>
              <button
                onClick={() => handleSkillPointChange(skill.name, false)}
                disabled={points <= 0}
              >
                -
              </button>
              <span>
                Modifier ({skill.attributeModifier}): {attributeModifier}
              </span>
              <span> Total: {totalSkillValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Character;
