#!/usr/bin/env python

import sys, time, os, subprocess
import serial
from daemon import Daemon

class MyDaemon(Daemon):
    def __init__(self,arg):
        super(MyDaemon,self).__init__(arg)
        self.arduino = serial.Serial('/dev/ttyACM0',9600)
    def run(self):
        time.sleep(5)
        self.arduino.write('1')
        while True:
            state = self.arduino.read()
            if state == '1':
                open('/home/root/button_pressed','w')
                subprocess.call(['aplay', '-f', 'S16_BE','-c','1', '-r', '44100', '/home/root/cnr9400v3mix.aif'])
                self.arduino.flushInput()
    def stop(self):
        super(MyDaemon, self).stop()
        self.arduino.write('0')

if __name__ == "__main__":
    daemon = MyDaemon('/tmp/mplayer-startup.pid')
    if len(sys.argv) == 2:
        if 'start' == sys.argv[1]:
            daemon.start()
        elif 'stop' == sys.argv[1]:
            daemon.stop()
        elif 'restart' == sys.argv[1]:
            daemon.restart()
        else:
            print "Unknown command"
            sys.exit(2)
        sys.exit(0)
    else:
        print "usage: %s start|stop|restart" % sys.argv[0]
        sys.exit(2)
