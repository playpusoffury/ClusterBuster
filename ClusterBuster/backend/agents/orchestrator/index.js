class OrchestratorAgent {
  constructor() {
    this.agents = new Map();
    this.taskQueue = [];
    this.activeJobs = new Map();
  }

  async delegateTask(task, priority = 'normal') {
    // Add task to queue with priority
    this.taskQueue.push({ task, priority, timestamp: Date.now() });
    
    // Process queue based on priority
    await this.processQueue();
  }

  async processQueue() {
    // Sort queue by priority and timestamp
    this.taskQueue.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return a.timestamp - b.timestamp;
    });

    // Process tasks
    for (const task of this.taskQueue) {
      await this.assignTask(task);
    }
  }

  async assignTask(task) {
    // Find available agent
    const agent = await this.findAvailableAgent(task.type);
    if (!agent) {
      throw new Error(`No available agent for task type: ${task.type}`);
    }

    // Assign and monitor task
    this.activeJobs.set(task.id, {
      agent,
      task,
      startTime: Date.now(),
      status: 'running'
    });

    try {
      const result = await agent.execute(task);
      this.activeJobs.set(task.id, { ...this.activeJobs.get(task.id), status: 'completed' });
      return result;
    } catch (error) {
      this.activeJobs.set(task.id, { ...this.activeJobs.get(task.id), status: 'failed', error });
      throw error;
    }
  }

  async findAvailableAgent(taskType) {
    // Check agent availability and load
    const agents = Array.from(this.agents.values())
      .filter(agent => agent.type === taskType && agent.isAvailable());
    
    if (agents.length === 0) return null;

    // Return agent with lowest current load
    return agents.reduce((a, b) => a.currentLoad < b.currentLoad ? a : b);
  }

  async monitorAgentHealth() {
    // Regular health checks
    for (const [id, agent] of this.agents) {
      try {
        const health = await agent.checkHealth();
        if (!health.healthy) {
          await this.handleAgentFailure(id, agent);
        }
      } catch (error) {
        await this.handleAgentFailure(id, agent);
      }
    }
  }

  async handleAgentFailure(agentId, agent) {
    // Handle agent failures and recovery
    const affectedTasks = Array.from(this.activeJobs.entries())
      .filter(([_, job]) => job.agent.id === agentId);

    for (const [taskId, job] of affectedTasks) {
      await this.reassignTask(taskId, job);
    }
  }

  async reassignTask(taskId, job) {
    // Reassign failed task to another agent
    const newAgent = await this.findAvailableAgent(job.task.type);
    if (!newAgent) {
      throw new Error(`No available agent for failed task reassignment: ${taskId}`);
    }

    this.activeJobs.set(taskId, {
      ...job,
      agent: newAgent,
      retries: (job.retries || 0) + 1,
      status: 'reassigned'
    });

    return this.assignTask(job.task);
  }
}

module.exports = OrchestratorAgent;
