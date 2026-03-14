package com.taskmanagement.service;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.TaskPriority;
import com.taskmanagement.entity.TaskStatus;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Page<Task> getTasks(User user, TaskStatus status, TaskPriority priority, Pageable pageable) {
        if (status != null && priority != null) {
            return taskRepository.findByUserAndStatusAndPriority(user, status, priority, pageable);
        } else if (status != null) {
            return taskRepository.findByUserAndStatus(user, status, pageable);
        } else if (priority != null) {
            return taskRepository.findByUserAndPriority(user, priority, pageable);
        } else {
            return taskRepository.findByUser(user, pageable);
        }
    }

    public Page<Task> getAllTasks(TaskStatus status, TaskPriority priority, Pageable pageable) {
        if (status != null || priority != null) {
            return taskRepository.findAllWithFilters(status, priority, pageable);
        }
        return taskRepository.findAll(pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public Task createTask(TaskRequest taskRequest, User user) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
        task.setUser(user);
        
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, TaskRequest taskRequest, User user) {
        Task task = getTaskById(id);
        
        // Check if user is authorized to update this task
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }
        
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
        
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id, User user) {
        Task task = getTaskById(id);
        
        // Check if user is authorized to delete this task
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to delete this task");
        }
        
        taskRepository.delete(task);
    }

    @Transactional
    public Task markTaskAsCompleted(Long id, User user) {
        Task task = getTaskById(id);
        
        // Check if user is authorized to update this task
        if (!task.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }
        
        task.setStatus(TaskStatus.DONE);
        return taskRepository.save(task);
    }
}