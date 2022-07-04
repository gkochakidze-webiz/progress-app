const { gql } = require('apollo-server');

module.exports = gql`
type Startup {
  _id: ID
  name: String
  createdAt: String
  isCompleted: Boolean
  phases: [Phase]
}

type Phase {
   _id: ID
  name: String
  isCompleted: Boolean
  tasks: [Task] 
}

type Task {
   _id: ID
  name: String
  isCompleted: Boolean
}

input CreateStartupInput {
  name: String
}

input AddPhaseInput {
  startupId: ID
  name: String
}

input AddTaskInput {
  phaseId: ID
  name: String
}

input CompleteTaskInput {
  taskId: ID!
}

type Query {
  startups: [Startup]
  startup(ID: ID): Startup
}

type Mutation {
  createStartup(input: CreateStartupInput): Startup
  addPhase(input: AddPhaseInput): Phase
  addTask(input: AddTaskInput): Task
  completeTask(input: CompleteTaskInput): Boolean
}`