const Startup = require('../models/startup');
const Phase = require('../models/phase');
const Task = require('../models/task');

module.exports = {
  Query: {
    async startups() {
      return await Startup
        .find()
        .populate({
          path: 'phases',
          populate: [{ path: 'tasks' }]
        })
        .sort({ createdAt: -1 });
    },
    async startup(_, { ID }) {
      return await Startup
        .findById(ID)
        .populate({
          path: 'phases',
          populate: [{ path: 'tasks' }]
        });
    }
  },
  Mutation: {
    async createStartup(_, { input: { name } }) {
      const createdStartup = new Startup({
        name: name,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        phases: []
      });

      const res = await createdStartup.save();
    
      return {
        _id: res.id,
        ...res._doc
      };
    },
    async addPhase(_, { input: { startupId, name } }) {
      const startup = await Startup.findById(startupId);
      if (!startup) return new Error('Startup does not exist');
      if (startup.isCompleted) return new Error('Startup is already completed');

      const createdPhase = new Phase({
        name: name,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        tasks: [],
        startup: startup._id
      });

      const res = await createdPhase.save();

      startup.phases.push(res.id);
      await startup.save();

      return {
        _id: res.id,
        ...res._doc
      }
    },
    async addTask(_, { input: { phaseId, name } }) {
      const phase = await Phase.findById(phaseId);
      if (!phase) return new Error('Phase does not exist');
      if (phase.isCompleted) return new Error('Phase is already completed');

      const createdTask = new Task({
        name: name,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        phase: phase._id
      });

      const res = await createdTask.save();

      phase.tasks.push(res.id);
      await phase.save();

      return {
        _id: res.id,
        ...res._doc
      }
    }, 
    async completeTask(_, { input: { taskId } }) {
      const task = await Task.findById(taskId)
        .populate({
          path: 'phase',
          populate: [{ 
            path: 'startup',
            populate: [{ path: 'phases' }]
          }, {
            path: 'tasks'
          }]
        });

      const phase = task.phase;
      const startup = phase.startup;

      if (task.isCompleted) return true;
    
      let previousPhaseIsCompleted = false;
      for (let i = 0; i < startup.phases.length; i++) {
        if (startup.phases[i]._id.equals(phase._id) && (i === 0 || startup.phases[i - 1].isCompleted)) {
          previousPhaseIsCompleted = true;
          break;
        }
      }
      if (!previousPhaseIsCompleted) return false;
    
      await Task.updateOne({_id: task._id}, {$set: {isCompleted: true}});
          
      const completedTasksNum = phase.tasks.reduce((num, task) => num + (task.isCompleted ? 1 : 0), 0);
      if (completedTasksNum !== phase.tasks.length - 1) return true;
      await Phase.updateOne({_id: phase._id}, {$set: {isCompleted: true}});
    
      const completedPhasesNum = startup.phases.reduce((num, phase) => num + (phase.isCompleted ? 1 : 0), 0);
      if (completedPhasesNum !== startup.phases.length - 1) return true;
      await Startup.updateOne({_id: startup._id}, {$set: {isCompleted: true}});

      return true;
    }
  }
}