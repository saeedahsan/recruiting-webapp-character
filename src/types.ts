export type AttributeName =
  | "Strength"
  | "Dexterity"
  | "Constitution"
  | "Intelligence"
  | "Wisdom"
  | "Charisma";

export type Attributes = Record<AttributeName, number>;

export type Class = "Barbarian" | "Wizard" | "Bard";

export type Skill = {
  name: string;
  points: number;
  attributeModifier: string;
};

export type CharacterType = {
  name: string;
  attributes: Attributes;
  skills: Skill[];
};

