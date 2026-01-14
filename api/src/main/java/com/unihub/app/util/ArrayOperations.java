package com.unihub.app.util;

public class ArrayOperations {
    public static String toPostgresArray(String[] choices) {
        if (choices == null || choices.length == 0) return "{}";
        return "{" + String.join(",", choices) + "}";
    }
}
