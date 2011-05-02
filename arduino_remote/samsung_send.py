#!/usr/bin/python
# -*- coding: ascii -*-

import serial

power = '0xE0E040BF'
hdmi = '0xE0E09768'
tv = '0xE0E0D827'

serial_port = '/dev/tty.usbserial-A7005Ot5'

ser = serial.Serial(serial_port, 9600, timeout=1)  
ser.write(chr(int('40',16)))
ser.write(chr(int('BF',16)))
print chr(int('BF',16))
