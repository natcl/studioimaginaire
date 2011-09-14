#!/usr/bin/python

#pip 213 PIP On / Off 217 PIP Swap 151 PIP Channel + 155 PIP Channel - 090 PIP Size 091 Sound Mode
#050 PIP channel +
#051 PIP channel -
#032 PIP
#033 swap
#0172 pip swap
import sys

input = int(sys.argv[1])
binary = bin(input)
reversed = '0b' + binary[::-1].replace('b0','')
inverted = 255 - int(reversed,2)
print hex(int(reversed,2))
print hex(inverted)
