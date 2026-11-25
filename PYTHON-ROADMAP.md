# Python Handbook Roadmap

Only **finished** chapters are listed in `content/python/handbook.yml`, so the app never shows a chapter that is missing cards.
To add the next chapter: drop in its folder and add its name to the `chapters:` list.

Every topic follows the same rhythm: **concept** -> **predict / pitfall / compare** -> **practice problem** -> **interview question**.

Status: DONE = finished and in the app. NEXT = being written. PLANNED = not started.

## Part 1: Foundations

| #   | Chapter                   | What it covers                                                                     | Practice problems (examples)                      | Status  |
| --- | ------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- | ------- |
| 01  | Getting Started           | What Python is, running code, print, sep/end, comments, indentation, errors, input | Name card, greet the user, friendly reply         | DONE    |
| 02  | Variables and Basic Types | Variables, int, float, text, True/False, None, type(), converting types            | Swap two values, temperature converter, shop bill | DONE    |
| 03  | Operators and Decisions   | + - \* / // % \*\*, comparing, and/or/not, if/elif/else                            | Even or odd, grade calculator, leap year          | NEXT    |
| 04  | Strings                   | Indexing, slicing, string methods, f-strings, strings never change                 | Reverse a string, count vowels, palindrome        | PLANNED |
| 05  | Loops                     | for, range, while, break/continue, nested loops                                    | Sum 1 to n, FizzBuzz, times table, prime check    | PLANNED |

## Part 2: Collecting data

| #   | Chapter                    | What it covers                                                                | Practice problems (examples)                    | Status  |
| --- | -------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------- | ------- |
| 06  | Lists and Tuples           | Lists, methods, slicing, changing vs not changing, tuples, unpacking, copying | Max of a list, remove duplicates, rotate a list | PLANNED |
| 07  | Dictionaries and Sets      | Key/value pairs, counting, sets, membership                                   | Word counter, first unique letter, Two Sum      | PLANNED |
| 08  | Comprehensions and Sorting | List/dict/set comprehensions, sorted, key, enumerate, zip                     | Squares of evens, sort by length, group words   | PLANNED |

## Part 3: Writing real programs

| #   | Chapter                      | What it covers                                                        | Practice problems (examples)              | Status  |
| --- | ---------------------------- | --------------------------------------------------------------------- | ----------------------------------------- | ------- |
| 09  | Functions                    | def, return, arguments, defaults, \*args/\*\*kwargs, scope, recursion | Factorial, Fibonacci, safe divide         | PLANNED |
| 10  | Errors and Files             | try/except, raise, reading and writing files, with, JSON              | Count words in a file, safe number reader | PLANNED |
| 11  | Modules and Standard Library | import, collections, itertools, datetime, random, pip and venv        | Most common word, days until a date       | PLANNED |
| 12  | Object-Oriented Python       | Classes, self, methods, inheritance, dunder methods, dataclass        | Bank account, Stack class, Money class    | PLANNED |

## Part 4: Going deeper

| #   | Chapter                           | What it covers                                           | Practice problems (examples)      | Status  |
| --- | --------------------------------- | -------------------------------------------------------- | --------------------------------- | ------- |
| 13  | Iterators, Generators, Decorators | Iteration, yield, closures, decorators, context managers | Number generator, timer decorator | PLANNED |
| 14  | How Python Works Inside           | Names and objects, is vs ==, copying, memory, GIL        | Spot the bug, alias or copy       | PLANNED |
| 15  | Concurrency                       | Threads, processes, asyncio, which one to pick           | Parallel downloads (simulated)    | PLANNED |
| 16  | Testing, Typing, Clean Code       | pytest, type hints, debugging, PEP 8                     | Write tests for your own function | PLANNED |

## Part 5: Interview preparation

| #   | Chapter               | What it covers                                                                         | Status  |
| --- | --------------------- | -------------------------------------------------------------------------------------- | ------- |
| 17  | Interview Problem Set | Hash map, two pointers, sliding window, stack, binary search, BFS/DFS, heap, LRU, trie | PLANNED |

## Writing rules used for every card

- Simple words and short sentences. Explain every new term the first time it appears.
- One idea per card. Concept cards stay under about 130 words.
- Only use things that earlier cards already taught (or say clearly "you will learn this in chapter N").
- Every code example is run and its output is checked before the card is published.
