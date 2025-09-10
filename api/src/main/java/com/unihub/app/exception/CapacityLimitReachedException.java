package com.unihub.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CapacityLimitReachedException extends RuntimeException {
    public CapacityLimitReachedException(String message) {
        super(message);
    }
}
