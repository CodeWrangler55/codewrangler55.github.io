---
title: "A Journey into NLP Complexity"
date: "2024-08-30T08:25:15"
slug: "a-journey-into-nlp-complexity"
source: "https://firstnormalform.com/2024/08/30/a-journey-into-nlp-complexity/"
---
# A Journey into NLP Complexity

After about 9 chapters into writing my first detective novel, I came upon a realization: I wanted to switch the roles of 2 of my characters.  My Watson had become a more interesting character than my Sherlock, and they were turning into the true protagonist.  The only problem was that one was male and one female, so a simple search-and-replace of names would not get the job done.

Have no fear!!! I have access to a barrage of Large Language Models and world class NLP libraries that can surely handle this for me. ***Little did he know…***

“Watson sat in the living room with Susan’s brother.  Susan went to the cupboard and pulled out his favorite coffee mug.  She told her brother about the waitress last night, and they had a good laugh.  He said goodnight to his brother, and they left Mrs. Jones’ house.”

This short example is contrived to illustrate some of the challenges with the English language faced by Natural Language Processing.  We use pronouns in place of names, but when we start writing naturally, it is not mathematically, 100% clear who “he” refers to.  Is it Watson’s or Susan’s brother?  It gets worse when we chain pronouns in sentence after sentence. When I applied ChatGPT, Gemini, and Claude to this problem, I received output with the occasional misgendered pronoun.  It changed the name of the protagonist to Susan, but some of the pronouns still referred to her with “his” because **it **wasn’t sure if the coffee cup was Susan’s, Watson’s, or the brother’s favorite.  Did you have a passing micro-thought about which LLM I was referring to by “it” in the above sentence? That’s the problem.. or at least part of it.

Other issues:

- “Mr. Jones” became “Mrs. Jones”, but my protagonist is not married.

- “He said goodnight to his brother” should have been “his sister”.

- Although this issue is not illustrated, the word “waitress” is a gendered word. Had I wanted to change the gender of that character, the professional words would have to be changed as well.

I turned to LLMs with great expectations to solve my writing problems, but alas they were but visions of paradise lost.

#coreference #NLP #LLM #coreference_resolution
