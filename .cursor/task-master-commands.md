# Task Master Quick Reference

## Task Management

- `Can you help me implement task X?` - Start working on a specific task
- `What tasks are available?` - List all tasks
- `Create a new task for X` - Create a new task
- `Mark task X as complete` - Complete a task

## Working with Task Master

### Starting a Task
```
Can you help me implement task 2?
```

This will:
1. Set task 2 as your active task
2. Show all steps required to complete the task
3. Maintain context about this task during your work

### Creating a New Task
```
Create a new task for implementing user authentication
```

This will:
1. Create a new task for implementing user authentication
2. Generate an implementation plan
3. Add it to the tasks list

### Viewing Tasks
```
What tasks are available?
```

This will list all current tasks with their status and priority.

### Completing a Task
```
Mark task 2 as complete
```

This will:
1. Update the task status to "Completed"
2. Add a completion date
3. Move it to the completed tasks section

## MCP Configuration

To use Task Master with the MCP server, you need to:

1. Edit `.cursor/claude-taskmaster-config.json` to add your Anthropic API key
2. Enable the MCP in your Cursor settings

## Example: Task Implementation Flow

1. Check available tasks: `What tasks are available?`
2. Start implementing: `Can you help me implement task 2?`
3. Follow the guided implementation
4. Mark as complete: `Mark task 2 as complete`
5. Create new task as needed: `Create a new task for X` 