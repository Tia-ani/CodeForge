package com.codeforge.exception;

/**
 * Custom exception thrown when a requested resource (User, Problem, etc.) is not found.
 * Part of the Global Exception Handling strategy.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
