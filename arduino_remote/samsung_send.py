#!/usr/bin/python
# -*- coding: ascii -*-

import sys, time
import serial
from ircodes import un40c5000 as ircodes

serial_port = '/dev/tty.usbserial-A7005Ot5'

byte1 = ircodes[sys.argv[1]][6:8]
byte2 =  ircodes[sys.argv[1]][8:10]

ser = serial.Serial(serial_port, 9600)
time.sleep(5)
ser.write(chr(int(byte1,16)))
ser.write(chr(int(byte2,16)))

time.sleep(5)
