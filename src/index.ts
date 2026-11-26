// packages/agent-types/src/index.ts

export { STAGES } from './stage';
export type { Stage } from './stage';

export type {
  ProgressEvent,
  ProgressEventType,
  AgentOutputPayload,
  GateOpenPayload,
  GateClosedPayload,
} from './progress';

export type {
  ConversationTurn,
  UserInputSignal,
  GateAnswerSignal,
} from './signal';

export type { SessionStageAddendum } from './session';
