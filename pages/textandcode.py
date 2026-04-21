filename = "pattern.txt"

message = open(filename)

stitch_map = {0: " oo", 1: " o", 2: " .", 3: " ..", 4: " ...", 5: " x", 6: " xx", 7: " xxx", 8:" t", 9: " tt", 10: " ttt", 11: " T", 12: " TT", 13:" TTT", 14:" p", 15:" pp", 16:" ppp"}
punc = set()

def load_punc():
    for c in range((48-33)):
        punc.add(chr(33+c))
    for c in range((65-58)):
        punc.add(chr(58+c))
    for c in range((97-91)):
        punc.add(chr(91+c))
    for c in range((127-123)):
        punc.add(chr(123+c))

def length_and_punc_and_caps():
    i = 0
    pattern = ""
    for line in message:
        pattern_line = ""
        words = line.split(" ")
        for word in words:
            i+=1
            stitch = stitch_map[len(word)]
            if ("A" <= word[0] and word[0] <= "Z"):
                stitch+="-inc"
            back = False
            end = False
            for c in word:
                if c in punc:
                    back = True
                if c == ".":
                    end = True
            if back:
                stitch += "-b"
            if end:
                stitch += "-dec"
            pattern_line += stitch
            if (i >= 10):
                pattern_line+="\n"
                i = 0
        pattern+=pattern_line
        
    print(pattern)

# def grammer() 

def main():
    load_punc()
    print("making patterns")
    length_and_punc_and_caps()

main()

### IDEAS
# length of words
# punctuation
# capital letters
# parts of speech - hard to automate
# vowels/consanants
# frequency of letters

# different stitches
# different numbers of stitches
# front/back/both loops
# increases and decreases
# in the round or flat?

### STITCH LIBRARY
# chain - ch
# slip stitch - st
# single - sc
# half-double - hdc
# double - dc
# triple - tc

### MODIFIERS
# increase - inc (2 of the same stitch in one loop)
# decrease - dec (use two stitches in one stitch to shrink the work)
# back loop only - blo (only use the back loop of the stitch being worked into)
# front loop only - flo (only use the front loop of the stitch being worked into)
# skip - sk (skip over a stitch, similar to decrease in effect without the use of chains)

### COMBOS
# bubble or popcorn - pop - can be done with any size, best with double, 
#           make 3+ stitches in one working loop and finish off with one working loop on the top
# 