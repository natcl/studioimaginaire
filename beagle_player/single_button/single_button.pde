int val = 0;
int pin = 7;
int sendFlag = 0;
char serialin = 0;

void setup(){
  Serial.begin(9600); 
  pinMode(pin, INPUT);
  digitalWrite(pin, HIGH);
}
  
void loop()
{
  if (Serial.available() > 0){
    serialin = Serial.read();
    if (serialin == '1'){
      sendFlag = 1;
    }
    if (serialin == '0'){
      sendFlag = 0;
    }
  }
  val = digitalRead(pin);
  if (sendFlag){
    if (val == HIGH)
      Serial.print(0);
    else
      Serial.print(1);
  }

}
