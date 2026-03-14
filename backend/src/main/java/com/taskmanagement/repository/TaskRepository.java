package com.taskmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.TaskPriority;
import com.taskmanagement.entity.TaskStatus;
import com.taskmanagement.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    Page<Task> findByUser(User user, Pageable pageable);
    
    Page<Task> findByUserAndStatus(User user, TaskStatus status, Pageable pageable);
    
    Page<Task> findByUserAndPriority(User user, TaskPriority priority, Pageable pageable);
    
    Page<Task> findByUserAndStatusAndPriority(User user, TaskStatus status, TaskPriority priority, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Task> findAllWithFilters(@Param("status") TaskStatus status, 
                                  @Param("priority") TaskPriority priority, 
                                  Pageable pageable);
    
    Page<Task> findAll(Pageable pageable);
}