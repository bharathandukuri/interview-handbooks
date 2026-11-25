---
type: question
title: "Is Python compiled or interpreted?"
difficulty: easy
mostAsked: true
tags: [interview, how-python-runs]
related: [python.getting-started.script-vs-repl]
revision:
  - "Python is called an interpreted language: the interpreter reads and runs your code"
  - "Behind the scenes, CPython turns code into bytecode first, then runs it"
---

## Answer

Python is usually called an **interpreted** language. A program called the **interpreter** reads your code and runs it. You do not need a separate "build" step before you run your program.

There is one more detail. The most common Python (called **CPython**) first turns your code into a simpler form called **bytecode**, and then runs that. This happens by itself, so you never have to do it.

A short answer for an interview: "Python is interpreted. The interpreter runs the code directly. CPython makes bytecode first, but that is automatic."

## Why interviewers ask

It checks that you know the basic idea of how Python runs your code. A simple, clear answer is enough.

## Follow-ups

- What is the difference between a script and the REPL?
- What is CPython?
