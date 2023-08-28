package com.sber;

public enum TimeFrame {
    M1("M1", 60000),
    M5("M5", 300000),
    M15("M15",900000),
    M30("M30",1800000),
    H1("H1",3600000);
    String code;
    long milliseconds;
    TimeFrame(String p1, long p2) {
        code = p1;
        milliseconds = p2;
    }
}
