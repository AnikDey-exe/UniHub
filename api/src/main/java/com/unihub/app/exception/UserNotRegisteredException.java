package com.unihub.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserNotRegisteredException extends RuntimeException {
    public UserNotRegisteredException(String message) {
        super(message);
    }
}
