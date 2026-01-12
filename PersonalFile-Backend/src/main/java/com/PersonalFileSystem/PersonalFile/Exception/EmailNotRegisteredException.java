package com.PersonalFileSystem.PersonalFile.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EmailNotRegisteredException extends RuntimeException {

    public EmailNotRegisteredException(String message) {
        super(message);
    }
}
