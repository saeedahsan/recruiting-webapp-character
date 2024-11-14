import { useState, useEffect } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, SKILL_LIST, API_URL } from "./consts";
import { CharacterType, Attributes, Skill, AttributeName } from "./types";
import Character from "./Character";

const initializeAttributes = (): Attributes => {
  return ATTRIBUTE_LIST.reduce((acc, attribute) => {
    acc[attribute] = 10;
    return acc;
  }, {} as Attributes);
};

const initializeSkills = (): Skill[] => {
  return SKILL_LIST.map((skill) => ({
    name: skill.name,
    points: 0,
    attributeModifier: skill.attributeModifier,
  }));
};

function App() {
  const [characters, setCharacters] = useState<CharacterType[]>([]);

  const saveCharacters = async (characters: CharacterType[]) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characters),
      });

      if (!response.ok) {
        console.error("Failed to save characters: ", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while saving characters: ", error);
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message && data.message === "Item not found") {
          return;
        }
        setCharacters(data.body);
      } else {
        console.error("Failed to load characters:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while loading characters:", error);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const addCharacter = () => {
    const name = "Character " + (characters.length + 1);
    const attributes = initializeAttributes();
    const skills = initializeSkills();
    const character = {
      name,
      attributes,
      skills,
    };
    setCharacters([...characters, character]);
  };

  const handleAttributeChange = (
    characterName: string,
    attribute: AttributeName,
    newValue: number,
  ) => {
    setCharacters((prev) =>
      prev.map((character) =>
        character.name === characterName
          ? {
              ...character,
              attributes: { ...character.attributes, [attribute]: newValue },
            }
          : character,
      ),
    );
  };

  const handleSkillPointChange = (
    characterName: string,
    skillName: string,
    newPoints: number,
  ) => {
    setCharacters((prev) =>
      prev.map((character) =>
        character.name === characterName
          ? {
              ...character,
              skills: character.skills.map((skill) =>
                skill.name === skillName
                  ? { ...skill, points: newPoints }
                  : skill,
              ),
            }
          : character,
      ),
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          <button onClick={addCharacter}>Add New Character</button>
          <button onClick={() => setCharacters([])}>
            Delete All Characters
          </button>
          <button onClick={() => saveCharacters(characters)}>
            Save All Characters
          </button>
        </div>
        {characters.map((character) => (
          <Character
            character={character}
            onAttributeChange={handleAttributeChange}
            onSkillPointChange={handleSkillPointChange}
          />
        ))}
      </section>
    </div>
  );
}

export default App;
