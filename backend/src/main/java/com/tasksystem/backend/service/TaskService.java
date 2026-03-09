package com.tasksystem.backend.service;

import com.tasksystem.backend.model.Task;
import com.tasksystem.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Get all tasks for a specific user, sorted by priority score descending
     */
    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findByUserIdOrderByPriorityScoreDesc(userId);
    }

    /**
     * Create a new task
     */
    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }
        calculateAndSetPriority(task);
        return taskRepository.save(task);
    }

    /**
     * Update an existing task
     */
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTaskName(taskDetails.getTaskName());
            task.setDeadline(taskDetails.getDeadline());
            task.setUrgency(taskDetails.getUrgency());
            task.setImportance(taskDetails.getImportance());
            task.setEffort(taskDetails.getEffort());
            task.setStatus(taskDetails.getStatus());
            
            // Recalculate priority if any factors changed
            calculateAndSetPriority(task);
            
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Task not found with id " + id);
        }
    }

    /**
     * Delete a task
     */
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    /**
     * Calculate Priority Score Algorithm:
     * priority_score = (urgency * 2) + importance - effort
     */
    private void calculateAndSetPriority(Task task) {
        if (task.getUrgency() != null && task.getImportance() != null && task.getEffort() != null) {
            int score = (task.getUrgency() * 2) + task.getImportance() - task.getEffort();
            task.setPriorityScore(score);
        } else {
            task.setPriorityScore(0); // Default if factors are missing
        }
    }
}
