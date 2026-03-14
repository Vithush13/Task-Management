package com.taskmanagement.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String error;

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    public static ApiResponse<?> error(String message) {
        ApiResponse<?> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setError(message);
        return response;
    }
}