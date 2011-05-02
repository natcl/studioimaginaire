/*
 * IRremote: IRsendDemo - demonstrates sending IR codes with IRsend
 * An IR LED must be connected to Arduino PWM pin 3.
 * Version 0.1 July, 2009
 * Copyright 2009 Ken Shirriff
 * http://arcfn.com
 */

#include <IRremote.h>

IRsend irsend;
uint32_t byte1;
uint32_t byte2;
uint32_t byte3;
uint32_t byte4;
uint32_t final_byte;
//irsend.sendSamsung(0xE0E040BF, 32);
void setup()
{
  Serial.begin(9600);
}

void loop() {
  	// send data only when you receive data:
	byte1 = 0xE0;
        byte2 = 0xE0;
        byte3 = 0;
        byte4 = 0;
        if (Serial.available() > 1) {
		// read the incoming byte:
                byte3 = Serial.read();
                byte4 = Serial.read();
                final_byte = (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | (byte4);
                irsend.sendSamsung(final_byte, 32);
		Serial.println("I received: ");
		Serial.println(byte1, HEX);
                Serial.println(byte2, HEX);
                Serial.println(byte3, HEX);
                Serial.println(byte4, HEX);
                Serial.println(final_byte, HEX);
	}
}

