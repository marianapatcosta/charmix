const fs = require('fs');

const names = fs.readFileSync('names.txt', 'utf8');

const filterWords = words =>
  words.filter(
    word =>
    !names.includes(word) &&
   /*    !word.includes(" ") &&
    !/^[A-Z]/.test(word) &&*/
      !word.match(/\b(?:[a-z]*[A-Z][a-z]*){2,}/) && 
      word.length >= 4 &&
      word.length <= 10
  );

const groupWords = words =>
  words.reduce((groupedWords, currentWord) => {
    if (currentWord.length in groupedWords) {
      groupedWords[currentWord.length] = [...groupedWords[currentWord.length], currentWord];
    } else {
      groupedWords[currentWord.length] = [currentWord];
    }

    return groupedWords;
  }, {});

try {
  const data = fs.readFileSync('en-UK.txt', 'utf8');

  const filteredWords = filterWords(data.toString().split('\r\n'));
  const groupedWords = groupWords([...new Set(filteredWords)]);

  fs.writeFile('en-UK.json', JSON.stringify(groupedWords), err => {
    if (err) throw err;
    console.log('Data written to file');
  });
} catch (error) {
  console.log('Error:', error);
}
