import "./App.css";
import data from "./eff_large_wordlist.json";
import { useEffect, useState } from "react";

const leastNumOfWords = 6;
const mostNumOfWords = 10;
const guessesPerSec = 1000000000000;
const wordSetTotal = Object.keys(data).length;

function App() {
  const [selectedWords, selectWords] = useState([]);
  const [wordCount, setWordCount] = useState(7);
  const [possiblePhrases, setPossiblePhrases] = useState();
  const [bitsOfEntropy, setBitsOfEntropy] = useState(
    Math.log2(possiblePhrases)
  );
  const [avgTimeinYears, setAvgTimeinYears] = useState();

  useEffect(() => {
    Generate();
    // number of combinations of phrases
    setPossiblePhrases(wordSetTotal ** wordCount);
    // eslint-disable-next-line
  }, [wordCount]);

  useEffect(() => {
    setBitsOfEntropy(Math.log2(possiblePhrases));
    // number of possible phrases / guesses per second / seconds / minutes / hours / days / average probability of guessing correctly (50% of all combinations)
    setAvgTimeinYears(possiblePhrases / guessesPerSec / 60 / 60 / 24 / 365 / 2);
  }, [possiblePhrases]);

  function getRandomIntInclusive() {
    // array of 32-bit unsigned integer, 5 integers per word
    let randomBuffer = new Uint32Array(5);
    // pseudorandom number generator
    crypto.getRandomValues(randomBuffer);
    let wordArr = randomBuffer.map((e) => {
      let randNum = e / (0xffffffff + 1);
      return Math.floor(randNum * 6) + 1;
    });
    return wordArr.join("");
  }

  function Generate() {
    let arr = [];
    for (let i = 0; i < wordCount; i++) {
      arr.push(getRandomIntInclusive());
    }
    // word lookup from word list
    let words = arr.map((x) => data[x]);
    selectWords(words);
  }

  return (
    <main>
      <div>
        <h1 className="mt-6 text-3xl font-bold">Passphrase Gen</h1>
      </div>
      <div className="mt-14 text-xl">{selectedWords.join(" ")}</div>
      <div className="mt-12 text-xl">{selectedWords.join("")}</div>
      <button className="mt-10 text-3xl" onClick={Generate}>
        &#x21BB;
      </button>
      <div className="mt-5 text-lg">
        <button
          className="disabled:opacity-0"
          disabled={wordCount === leastNumOfWords}
          onClick={() => setWordCount((currentCount) => currentCount - 1)}
        >
          -
        </button>
        <span>{wordCount} words</span>
        <button
          className="disabled:opacity-0"
          disabled={wordCount === mostNumOfWords}
          onClick={() => setWordCount((currentCount) => currentCount + 1)}
        >
          +
        </button>
      </div>
      <div className="mt-10 mb-3">
        <div className="font-bold text-sm">{bitsOfEntropy.toFixed(2)}</div>
        <div>bits of entropy</div>
      </div>
      <div className="font-bold text-sm">
        {Math.round(avgTimeinYears).toLocaleString()}
      </div>
      <div>
        years on average to guess correctly at 1 trillion guesses per second
      </div>
    </main>
  );
}

export default App;

