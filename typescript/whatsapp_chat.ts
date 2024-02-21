import * as fs from 'fs';

// Load Whatsapp convo
const filePath = '../chats/cardiff_chat.txt';
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n').slice(1,);

// Load common words that we don't care about (and, of, the etc.)
const COMMONWORDS: string[] = fs.readFileSync("../commonwods.txt", 'utf-8').split(",\n");

// Amount of words to print out
const displayAmount = 10;

// Split by name or show total
const split = false;

// Object which will hold word counts and who said them. [name : [word : occurances]]
var wordCounts: Record<string, Record<string, number>> = {};



for (let line of lines) {
    let lineContent = line.split('-'); // Seperate date from text


    let date: string = lineContent[0];
    let message: string; // Content of message
    let name: string; // Name of sender

    // Lines start with name seperated by :. The message itself can contain : so any potential
    // splits after the first one are joined together
    if (lineContent.length === 1) {
        message = lineContent.slice(1,).join(" ").toLowerCase();
        name = '';
    } else {
        // Date is now removed but the name and/or message might themselves contain dashes, so join
        // them back togather.
        // The only way to seperate name and message is splitting by :.
        // The name might also contain a colon but then there is no helping you
        let nameAndMessage = lineContent.slice(1,).join(" ")
        if (split)
            name = nameAndMessage.split(":")[0];
        else
            name = "Total";
        message = nameAndMessage.toLowerCase().split(":").slice(1,).join(" ");
    }

    count_words(name, message);
};

for (let name of Object.keys(wordCounts)) {
    const topWords: string[] = getMostUsedWords(wordCounts[name], displayAmount);
    console.log(`----------${name}-------------`)
    for (let i = 0; i < displayAmount; i++) {
        console.log(`${i + 1}. ${topWords[i]} (used ${wordCounts[name][topWords[i]]} times)`);
    }
}


function remove_nonwords(s: string) {
    // Remove numbers, punctuation and the like
    return s.replace(/[^\w\s]/gi, '');
}

function count_words(name: string, line: string) {
    // Counts unique words and adds them and their counts to wordCounts
    for (let word of line.toLowerCase().split(' ')) {
        word = remove_nonwords(word);
        if (COMMONWORDS.indexOf(word) !== -1)
            continue;

        if (wordCounts[name] === undefined)
            wordCounts[name] = {};

        if (wordCounts[name][word] === undefined)
            wordCounts[name][word] = 1;
        else
            wordCounts[name][word]++;
    }
}

function getMostUsedWords(words: Record<string, number>, n: number) {
    // Finds top n most used words
    var keys = Object.keys(words);
    keys.sort((a, b) => {
        return words[b] - words[a];
    })
    return keys.slice(0, n);
}
