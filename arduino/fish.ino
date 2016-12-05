#include <DS1302.h>
#include <SPI.h>
#include <WiFi.h>
#include <SD.h>
#include <Servo.h>
#include <OneWire.h>

/*
 * 상자 밖으로 나와야하는 것들은 앞에다 배치.
 * SD 카드(4번 핀)과 와이파이(10~13번 핀)은 고정.
 * 7번 핀은 왜인지 모르겠으나 제대로 작동을 안 함.
 * 모터: 0, 수온: 1, 릴레이: 2, LED: 3, SD: 4, RTC: 6, 8, 9, WiFi: 10~13
 */

const int PIN_MOTOR = 0;
const int PIN_TEMP = 1;
const int PIN_RELAY = 2;
const int PIN_LEDS = 3;
const int PIN_SD = 4;
const uint8_t PIN_RST = 5;
const uint8_t PIN_DAT = 6;
const uint8_t PIN_CLK = 8;

/*
 * 서보 모터가 0도에서 진동하면 MIN 값을 조금씩 높여주고,
 * 180도에서 진동하면 MAX 값을 조금씩 낮춰줘야함.
 */
const int MIN_SERVO = 580;
const int MAX_SERVO = 2400;

Servo ms;
OneWire ds(PIN_TEMP);
char ssid[20]; // AP 이름
char pass[20]; // AP 비밀번호
int port = 7979; // 서비스하고자 하는 포트.
byte mac[6]; // 맥 주소를 저장할 변수.
String mac2 = ""; // 맥 주소를 이어붙여 저장할 변수.
IPAddress ip; // 로컬 아이피 주소를 저장할 변수.
String ip2 = ""; // 내부 IP 주소를 이어붙여 저장할 변수.
int status = WL_IDLE_STATUS; // 와이파이 쉴드의 상태를 표시하는 코드
WiFiServer server(port); // 아두이노를 웹서버로 만듦.
String id, feedTime, waitTime, onTemp, offTemp, onTime, offTime; // SD 카드에 저장된 값들.
String nowTime; // 현재 시간을 저장할 변수.
float temp; // 온도값을 저장할 변수.
DS1302 rtc(PIN_RST, PIN_DAT, PIN_CLK); // 리얼 타임 컨트롤러 객체를 만듦.

void setup() {
  // 초기에 한번만 실행되는 코드로 세팅을 위한 코드들은 여기 넣어야함.

  // 서보모터와 릴레이, LED의 초기 설정.
  ms.attach(PIN_MOTOR, MIN_SERVO, MAX_SERVO);
  ms.write(0);
  pinMode(PIN_LEDS, OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);

  // 시리얼 통신을 하지 않을 경우에는 아래 begin과 while문을 주석 처리하면 됨.
  // PC가 아닌 다른 전원 공급 수단을 사용하는 경우에는 무조건 주석 처리해야 함.
  Serial.begin(9600);
  while (!Serial) {
    ; // 시리얼 포트 연결을 위해 대기.
  }

  getTemp(); // 온도 값이 초기에는 이상한 값을 뿜어내므로 한 번 실행해줘야댐.

  // SD카드 초기 설정.
  Serial.print("Initializing SD card...");
  if (!SD.begin(PIN_SD)) {
    Serial.println("initialization failed!");
    return;
  }

  // SD카드에 저장된 정보들을 불러옴.
  id = getData("id"); // 유저 ID
  feedTime = getData("feedtime"); // 밥 줄 시간
  waitTime = getData("waittime"); // 밥을 줄 때 모터가 대기하는 시간
  onTime = getData("ontime"); // 조명을 켤 시간
  offTime = getData("offtime"); // 조명을 끌 시간

  delay(1000); // 이 딜레이가 없으면 시리얼 통신을 하지 않는 경우에는 와이파이 연결이 안 됨.
  Serial.println("initialization done.");

  // 와이파이 쉴드의 연결상태 파악
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // 프로그램을 진행하지 않음
    while (true);
  }

  // 와이파이 쉴드 펌웨어 버전 체크
  String fv = WiFi.firmwareVersion();
  if (fv != "1.1.0") {
    Serial.println("Please upgrade the firmware");
  }

  // 와이파이 연결 시도
  while (status != WL_CONNECTED) {
    strcpy(ssid, getData("apid").c_str());
    strcpy(pass, getData("appw").c_str());
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    /*
     * WPA/WPA2 인증 방식으로 연결.
     * 개방형이거나 WEP 인증 방식인 경우 바꿔줘야 됨.
     */
    status = WiFi.begin(ssid, pass);

    // 와이파이 연결을 위해 10초간 대기.
    delay(10000);
  }
  // 아두이노 서버 열기.
  server.begin();

  // 와이파이 연결 상태를 보여줌.
  printWifiStatus();

  // IP 주소를 하나로 이어줌.
  ip = WiFi.localIP();
  for(int i=0; i<4; i++) {
    ip2 += ip[i];
    if(i != 3) {
      ip2 += ".";
    }
  }

  // 맥 주소를 하나로 이어줌.
  WiFi.macAddress(mac);
  for(int i=5; i>=0; i--) {
    if(mac[i] < 17) {
      mac2 += "0";
    }
    mac2 += String(mac[i], HEX);
    if(i!=0) {
      mac2 += "-";
    }
  }
  mac2.toUpperCase();

  // 아두이노의 현재 포트, 아이피를 DB에 등록.
  conServ("i4m1g.dothome.co.kr", "/php/ip.php", "mode=update&port=7979&l_ip=" + ip2 + "&mac=" + mac2);

  // 조명이 켜졌다고 DB에 저장된 채로 아두이노가 꺼졌을 경우를 대비해...
  conServ("i4m1g.dothome.co.kr", "/php/func.php", "func=light&status=on&id=" + id);

  // 시리얼 통신을 하지 않는 경우에 릴레이가 켜짐으로써 준비가 완료됐다는 걸 알리기 위함.
  digitalWrite(PIN_RELAY, HIGH);
  digitalWrite(PIN_LEDS, HIGH);
}

void loop() {
  // 반복적으로 실행되는 내용들.
  WiFiClient client = server.available();
  if (client) { // 새로운 클라이언트가 아두이노로 접속한 경우

    // LED를 꺼버리는 이유는 LED가 켜졌을 때만 통신이 가능하다는 것을 알려주기 위함.
    digitalWrite(PIN_LEDS, LOW);

    Serial.println("\nnew client");
    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    String buffer = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        buffer += c;
        if (c == '\n' && currentLineIsBlank) { // 버퍼에 모든 내용을 다 담았을 때 실행 됨.
          break;
        }
        if (c == '\n') { // 버퍼의 첫 번째 줄에 있는 내용을 가지고 판단함.
          Serial.println(buffer);
          if(buffer.indexOf("HTTP/1.1") >= 0) { // 클라이언트가 접속한 경우
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: text/html");
            client.println("Connection: close");  // 응답을 모두 완료한 후에 연결을 종료시킴.
            client.println("Access-Control-Allow-Origin: *"); // CORS 요청을 어디서든 허용함.
            client.println();
          }
          if(buffer.indexOf("id_send") >= 0) { // SD 카드에 유저 id 저장.
            id = getParam(buffer, "id_send");
            writeData("id", id);
            client.print(1);
          } else if(buffer.indexOf("time_test") >= 0) { // 시간이 잘 돌아가고 있는지 웹에 뿌려주기 위함.
            client.print(getTime());
          } else if(buffer.indexOf("mode=manual") >= 0) { // 수동
            if(buffer.indexOf("func=feed") >= 0) { // 밥주기 버튼을 누른 경우
              Serial.println("Feed");

              ms.write(180);
              delay(500 + waitTime.toInt() * 1000);
              ms.write(0);

              client.print(1);
              Serial.println(1);
            } else if(buffer.indexOf("func=temp") >= 0) { // 수온 뿌려주기
              Serial.println("Temp");
              client.print(getTemp());
            } else {
              if(buffer.indexOf("status=on") >= 0) { // 조명 켜기 버튼을 누른 경우
                Serial.println("Light ON");

                digitalWrite(PIN_RELAY, HIGH);

                client.print(1);
                Serial.println(1);
              } else if(buffer.indexOf("status=off") >= 0) { // 조명 끄기 버튼을 누른 경우
                Serial.println("Light OFF");

                digitalWrite(PIN_RELAY, LOW);

                client.print(1);
                Serial.println(1);
              }
            }
          } else { // 자동
            if(buffer.indexOf("func=feed") >= 0) { // 자동 밥주기 설정을 한 경우
              feedTime = getParam(buffer, "feed_time");
              if(feedTime.indexOf("00:00:01") == 0) { // 자동 밥주기를 삭제한 경우
                delData("feedtime");
                feedTime = "dummy";
              } else { // 자동 밥주기 시간을 설정한 경우
                writeData("feedtime", feedTime);
              }
              waitTime = getParam(buffer, "wait_time");
              writeData("waittime", waitTime);
            } else if(buffer.indexOf("func=light") >= 0) { // 자동 조명 ON/OFF를 설정한 경우
              onTime = getParam(buffer, "onTime");
              if(onTime.indexOf("00:00:01") == 0) { // 자동 조명 ON을 삭제한 경우
                delData("ontime");
                onTime = "dummy";
              } else { // 자동 조명 ON을 설정한 경우
                writeData("ontime", onTime);
              }
              offTime = getParam(buffer, "offTime");
              if(offTime.indexOf("00:00:01") == 0) { // 자동 조명 OFF를 삭제한 경우
                delData("offtime");
                offTemp = "dummy";
              } else { // 자동 조명 OFF를 설정한 경우.
                writeData("offtime", offTime);
              }
            }
          }
          buffer = "";
          currentLineIsBlank = true;
        } else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      } else { // 만약 올바르지 않은 접속이 들어왔을 경우 바로 disconeect 시켜버림.
        // 데이터를 받을 약간의 여유를 줌.
      delay(1);

      // 연결 종료.
      client.stop();
      Serial.println("client disonnected");
      digitalWrite(PIN_LEDS, HIGH);
      }
    }
    // 데이터를 받을 약간의 여유를 줌.
    delay(1);

    // 연결 종료.
    client.stop();
    Serial.println("client disonnected");
    digitalWrite(PIN_LEDS, HIGH);
  }

  delay(1000);
  // 시간을 받아옴.
  nowTime = getTime();
  Serial.println(nowTime); // 현재 시간

  // 현재 시간과 자동 밥주기 시간이 일치하면
  if(feedTime.indexOf(nowTime) == 0) {
    Serial.println("Auto Feed!!");

    ms.write(180);
    delay(waitTime.toInt() * 1000);
    ms.write(0);

    // DB에 오늘 밥 준 횟수 +1 하기 위함.
    conServ("i4m1g.dothome.co.kr", "/php/func.php", "func=feed&id=" + id);
  }

  // 현재 시간과 자동 조명 ON 시간이 일치하면
  if(onTime.indexOf(nowTime) == 0) {
    Serial.println("Auto Light ON!!");

    digitalWrite(PIN_RELAY, HIGH);

    // DB에 현재 조명이 켜져있다고 저장하기 위함.
    conServ("i4m1g.dothome.co.kr", "/php/func.php", "func=light&status=on&id=" + id);
  }
  // 현재 시간과 자동 조명 OFF 시간이 일치하면
  else if(offTime.indexOf(nowTime) == 0) {
    Serial.println("Auto Light OFF!!");

    digitalWrite(PIN_RELAY, LOW);

    // DB에 현재 조명이 꺼져있다고 저장하기 위함.
    conServ("i4m1g.dothome.co.kr", "/php/func.php", "func=light&status=off&id=" + id);
  }

}

// 와이파이의 연결 상태를 출력하는 함수.
void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

// 파라미터의 값을 얻어오는 함수.
String getParam(String req, String param) {
  int idx = req.indexOf(param) + param.length() + 1;
  String temp = req.substring(idx);
  idx = temp.indexOf("&") >= 0 ? temp.indexOf("&") : temp.indexOf(" HTTP/1.1");
  return temp.substring(0, idx);
}

// 아두이노가 클라이언트가 되어 다른 서버로 연결.
void conServ(String _server, String file, String params) {
  WiFiClient client; // 아두이노를 이번엔 클라이언트로 만들어줌.
  char server[100]; // 아누이노에서 접근하고자하는 서버
  strcpy(server, _server.c_str());
  if (client.connect(server, 80)) {
    Serial.println("connected"); // 서버 연결 성공
    // 서버의 ip.php로 파라미터 mode에는 update, port에는 사용자가 지정한 port, l_ip에는 아두이노의 사설 IP를 실어서 보냄.
    Serial.println("ARDUINO: forming HTTP request message");
    client.print("GET ");
    client.print(file);
    client.print("?");
    client.print(params);
    client.println(" HTTP/1.1");
    client.print("HOST: ");
    client.println(server);
    client.println();
    Serial.println("ARDUINO: HTTP message sent");
    /*
     * 서버와 요청/응답 처리를 통신하기 위해 약간의 시간 지연.
     * 시리얼 모니터에 뿌려주기 위해 과하게 시간을 줌.
     */
    delay(5000);

    if (client.available()) { // 요청에 대한 응답이 있는 경우.
      Serial.println("ARDUINO: HTTP message received");
      Serial.println("ARDUINO: printing received headers and script response...\n");
      while (client.available()) {
        char c = client.read();
        Serial.print(c);
      }
      Serial.println("\n");
    } else { // 아무런 응답이 없는 경우.
      Serial.println("ARDUINO: no response received / no response received in time");
    }
    client.stop(); // 연결 종료.
  }
}

// SD 카드에 데이터 작성.
void writeData(String var, String val) {
  // 이미 데이터가 존재하면 삭제
  if(SD.exists(var + ".txt")) {
    SD.remove(var + ".txt");
  }
  // 데이터가 존재하지 않으니 재생성.
  File file = SD.open(var + ".txt", FILE_WRITE);
  if(file) {
    Serial.println("Writing to " + var);
    file.print(val);
    file.close();
  } else {
    Serial.println("error opening file" + var);
  }
}

// SD 카드의 불필요한 데이터는 삭제.
void delData(String var) {
  Serial.println("Delete " + var);
  if(SD.exists(var + ".txt")) {
    SD.remove(var + ".txt");
  }
}

// SD 카드에서 데이터 얻어오기.
String getData(String var) {
  File file = SD.open(var + ".txt");
  String temp = "";
  if (file) {
    // read from the file until there's nothing else in it:
    while (file.available()) {
      temp += (char)file.read();
    }
    Serial.println(var + ": " + temp);
    // close the file:
    file.close();
  } else {
    // if the file didn't open, print an error:
    Serial.println("error opening " + var);
  }
  return temp;
}

// 현재 시간 얻어오기.
String getTime() {
  Time t = rtc.time();
  String h(t.hr);
  String m(t.min);
  String s(t.sec);
  String time = (h.length()<2 ? "0"+h : h) + ":" + (m.length()<2 ? "0"+m : m) + ":" + (s.length()<2 ? "0"+s : s);
  return time;
}

// 현재 온도 얻어오기.
float getTemp() {
  byte i;
  byte type_s;
  byte data[12];
  byte addr[8];

  if ( !ds.search(addr)) {
    Serial.println("No more addresses.");
    Serial.println();
    ds.reset_search();
    delay(250);
    return 0.0;
  }

  ds.reset();
  ds.select(addr);
  ds.write(0x44, 1);        // start conversion, with parasite power on at the end

  delay(1000);     // maybe 750ms is enough, maybe not
  // we might do a ds.depower() here, but the reset will take care of it.

  ds.reset();
  ds.select(addr);
  ds.write(0xBE);         // Read Scratchpad

  for ( i = 0; i < 9; i++) {           // we need 9 bytes
    data[i] = ds.read();
  }

  ds.reset_search();
  delay(250);

  // Convert the data to actual temperature
  // because the result is a 16 bit signed integer, it should
  // be stored to an "int16_t" type, which is always 16 bits
  // even when compiled on a 32 bit processor.
  int16_t raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // "count remain" gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    // at lower res, the low bits are undefined, so let's zero them
    if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms
    //// default is 12 bit resolution, 750 ms conversion time
  }
  return (float)raw / 16.0;
}
