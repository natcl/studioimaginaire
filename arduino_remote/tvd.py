#!/usr/bin/python

import sys
import OSC

hexcode = sys.argv[1]
client = OSC.OSCClient()
client.connect( ('192.168.1.78', 9001) ) # note that the argument is a tupple and not two arguments
msg = OSC.OSCMessage() #  we reuse the same variable msg used above overwriting it
msg.setAddress("/tvd")
msg.append(hexcode)
client.send(msg) # now we dont need to tell the client the address anymore
