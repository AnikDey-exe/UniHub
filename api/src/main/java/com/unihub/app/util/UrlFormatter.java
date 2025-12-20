package com.unihub.app.util;

public class UrlFormatter {
    public static String extractDomain(String url) {
        if (url == null || url.isEmpty()) return null;

        int protocolEnd = url.indexOf("://");
        if (protocolEnd != -1) url = url.substring(protocolEnd + 3);

        if (url.startsWith("www.")) url = url.substring(4);

        int firstSlash = url.indexOf('/');
        if (firstSlash != -1) url = url.substring(0, firstSlash);

        return url.trim();
    }
}
