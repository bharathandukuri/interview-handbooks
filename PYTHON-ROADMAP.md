# Python Handbook Roadmap

Only **finished** chapters are listed in `content/python/handbook.yml`, so the app never shows a chapter that is missing cards.
To add the next chapter: drop in its folder and add its name to the `chapters:` list.

Every topic follows the same rhythm: **concept** -> **predict / pitfall / compare** -> **practice problem** -> **interview question**.

Status: DONE = finished and in the app. NEXT = being written. PLANNED = not started.

## Part 1: Foundations

| #   | Chapter                   | What it covers                                                                     | Practice problems (examples)                      | Status |
| --- | ------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- | ------ |
| 01  | Getting Started           | What Python is, running code, print, sep/end, comments, indentation, errors, input | Name card, greet the user, friendly reply         | DONE   |
| 02  | Variables and Basic Types | Variables, int, float, text, True/False, None, type(), converting types            | Swap two values, temperature converter, shop bill | DONE   |
| 03  | Operators and Decisions   | + - \* / // % \*\*, comparing, and/or/not, if/elif/else                            | Even or odd, grade calculator, leap year          | DONE   |
| 04  | Strings                   | Indexing, slicing, string methods, f-strings, strings never change                 | Reverse a string, count vowels, palindrome        | DONE   |
| 05  | Loops                     | for, range, while, break/continue, nested loops                                    | Sum 1 to n, FizzBuzz, times table, prime check    | DONE   |

## Part 2: Collecting data

| #   | Chapter                    | What it covers                                                                | Practice problems (examples)                    | Status |
| --- | -------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| 06  | Lists and Tuples           | Lists, methods, slicing, changing vs not changing, tuples, unpacking, copying | Max of a list, remove duplicates, rotate a list | DONE   |
| 07  | Dictionaries and Sets      | Key/value pairs, counting, sets, membership                                   | Word counter, first unique letter, Two Sum      | DONE   |
| 08  | Comprehensions and Sorting | List/dict/set comprehensions, sorted, key, enumerate, zip                     | Squares of evens, sort by length, group words   | DONE   |

## Part 3: Writing real programs

| #   | Chapter                      | What it covers                                                        | Practice problems (examples)              | Status |
| --- | ---------------------------- | --------------------------------------------------------------------- | ----------------------------------------- | ------ |
| 09  | Functions                    | def, return, arguments, defaults, \*args/\*\*kwargs, scope, recursion | Factorial, Fibonacci, safe divide         | DONE   |
| 10  | Errors and Files             | try/except, raise, reading and writing files, with, JSON              | Count words in a file, safe number reader | DONE   |
| 11  | Modules and Standard Library | import, collections, itertools, datetime, random, pip and venv        | Most common word, days until a date       | DONE   |
| 12  | Object-Oriented Python       | Classes, self, methods, inheritance, dunder methods, dataclass        | Bank account, Stack class, Money class    | DONE   |

## Part 4: Going deeper

| #   | Chapter                           | What it covers                                           | Practice problems (examples)      | Status |
| --- | --------------------------------- | -------------------------------------------------------- | --------------------------------- | ------ |
| 13  | Iterators, Generators, Decorators | Iteration, yield, closures, decorators, context managers | Number generator, timer decorator | DONE   |
| 14  | How Python Works Inside           | Names and objects, is vs ==, copying, memory, GIL        | Spot the bug, alias or copy       | DONE   |
| 15  | Concurrency                       | Threads, processes, asyncio, which one to pick           | Parallel downloads (simulated)    | DONE   |
| 16  | Testing, Typing, Clean Code       | pytest, type hints, debugging, PEP 8                     | Write tests for your own function | DONE   |

## Part 5: Interview preparation

| #   | Chapter               | What it covers                                                                         | Status |
| --- | --------------------- | -------------------------------------------------------------------------------------- | ------ |
| 17  | Interview Problem Set | Hash map, two pointers, sliding window, stack, binary search, BFS/DFS, heap, LRU, trie | NEXT   |

## Writing rules used for every card

- Simple words and short sentences. Explain every new technical term clearly the first time it appears.
- Give detailed, complete explanations with edge cases, clear examples, and real walkthroughs (no need to cut short).
- Only use things that earlier cards already taught (or say clearly "you will learn this in chapter N").
- Every code example is run and its output is checked before the card is published.
