package com.unihub.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MissingRequiredAnswersException extends RuntimeException {
    public MissingRequiredAnswersException(String message) {
        super(message);
    }
}
