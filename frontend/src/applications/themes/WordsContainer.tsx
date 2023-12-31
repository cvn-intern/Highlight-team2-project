import WordElement from "./WordElement";

type Props = {
  wordsList: WordType[];
  handleDeleteWord: (index: number) => void;
};

export default function WordsContainer({ wordsList, handleDeleteWord }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-6">
        {wordsList.map((word, index) => {
          return (
            <WordElement
              key={index}
              word={word}
              index={index}
              handleDeleteWord={handleDeleteWord}
            />
          );
        })}
      </div>
    </div>
  );
}
