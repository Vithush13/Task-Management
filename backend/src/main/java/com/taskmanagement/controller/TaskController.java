package com.taskmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.ApiResponse;
import com.taskmanagement.dto.TaskDTO;
import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.TaskPriority;
import com.taskmanagement.entity.TaskStatus;
import com.taskmanagement.entity.User;
import com.taskmanagement.security.UserDetailsImpl;
import com.taskmanagement.service.TaskService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<?> getTasks(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        User user = getUserFromUserDetails(currentUser);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Task> tasks;
        if (user.getRole().name().equals("ADMIN")) {
            tasks = taskService.getAllTasks(status, priority, pageable);
        } else {
            tasks = taskService.getTasks(user, status, priority, pageable);
        }
        
        Page<TaskDTO> taskDTOs = tasks.map(this::convertToDTO);
        return ResponseEntity.ok(ApiResponse.success(taskDTOs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        
        User user = getUserFromUserDetails(currentUser);
        Task task = taskService.getTaskById(id);
        
        // Check authorization
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body(ApiResponse.error("You are not authorized to view this task"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(convertToDTO(task)));
    }

    @PostMapping
    public ResponseEntity<?> createTask(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @Valid @RequestBody TaskRequest taskRequest) {
        
        User user = getUserFromUserDetails(currentUser);
        Task task = taskService.createTask(taskRequest, user);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", convertToDTO(task)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest taskRequest) {
        
        User user = getUserFromUserDetails(currentUser);
        Task task = taskService.updateTask(id, taskRequest, user);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", convertToDTO(task)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        
        User user = getUserFromUserDetails(currentUser);
        taskService.deleteTask(id, user);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> markTaskAsCompleted(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        
        User user = getUserFromUserDetails(currentUser);
        Task task = taskService.markTaskAsCompleted(id, user);
        return ResponseEntity.ok(ApiResponse.success("Task marked as completed", convertToDTO(task)));
    }

    private User getUserFromUserDetails(UserDetailsImpl userDetails) {
        User user = new User();
        user.setId(userDetails.getId());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        return user;
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setUserId(task.getUser().getId());
        return dto;
    }
}