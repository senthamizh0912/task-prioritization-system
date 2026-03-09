package com.tasksystem.backend.repository;

import com.tasksystem.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find tasks by user ID and sort by priority score descending
    List<Task> findByUserIdOrderByPriorityScoreDesc(String userId);

}
