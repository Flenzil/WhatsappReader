from nltk.corpus import stopwords
from collections import Counter
import re

COMMONWORDS = stopwords.words("english")
COMMONWORDS += [
    "",
    "im",
    "media",
    "omitted",
    "thats",
    "oh",
    "get",
    "ill",
    "youre",
    "flenzil",
    "high",
    "calibre",
    "weapon",
]
print(COMMONWORDS)


# COMMONWORDS.remove("i")
# COMMONWORDS.remove("so")
def main(split=False):
    if split:
        wordCountsCal = {}
        wordCountsSam = {}
    else:
        wordCounts = {}

    displayAmount = 10
    with open("../chats/cardiff_chat.txt") as f:
        for line in f.readlines():
            # Remove dates from start of line
            try:
                line = line.split(" - ")[1]
            except IndexError:
                line = line

            # Remve names from start of line
            try:
                if split:
                    line = " ".join(line.split(": ")[0:])
                else:
                    line = " ".join(line.split(": ")[1:])

            except IndexError:
                line = line

            if split:
                if line[:7] == "Flenzil":
                    wordCountsSam = count_words(line, wordCountsSam)
                    # wordCountsSam = merge_dicts(wordCountsSam, newDict)
                if line[:5] == "High ":
                    wordCountsCal = count_words(line, wordCountsCal)
                    # wordCountsCal = merge_dicts(wordCountsCal, newDict)
            else:
                wordCounts = count_words(line, wordCounts)
    if split:
        sort_and_print(wordCountsSam, displayAmount, "Sam")
        sort_and_print(wordCountsCal, displayAmount, "Callie")
    else:
        sort_and_print(wordCounts, displayAmount, "Total")


def remove_nonwords(s):
    return re.sub(r"[\W_[0-9]]*", "", s)


def count_words(line, wordCounts):
    for word in line.lower().split(" "):
        word = remove_nonwords(word)
        if word in COMMONWORDS:
            continue

        if word in wordCounts.keys():
            wordCounts[word] += 1
        else:
            wordCounts[word] = 1
    return wordCounts


def merge_dicts(dict1, dict2):
    return {x: dict1.get(x, 0) + dict2.get(x, 0) for x in set(dict1).union(dict2)}


def sort_and_print(wordCounts, displayAmount, name):
    wordSort = {k: v for k, v in sorted(wordCounts.items(), key=lambda item: item[1])}
    topWords = list(wordSort.items())[-displayAmount:]
    # topWords = list(wordSort.items())[:displayAmount]
    rank = 1
    print(f"------- {name} -------")
    for word in topWords[::-1]:
        print(f"{rank}. {word[0]} (used {word[1]} times)")
        rank += 1


if __name__ == "__main__":
    main()
