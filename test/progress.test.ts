// packages/agent-types/test/progress.test.ts
import { describe, expect, it } from 'vitest';
import type {
  ProgressEvent,
  ProgressEventType,
  AgentOutputPayload,
  GateOpenPayload,
  GateClosedPayload,
} from '../src/progress';
import type { Stage } from '../src/stage';

describe('ProgressEvent', () => {
  it('accepts a minimal stage_transition event', () => {
    const stage: Stage = 'processing';
    const ev: ProgressEvent = {
      sessionId: 'sess_abc',
      turnId: 'turn_001',
      eventId: 'evt_123',
      seq: 0,
      type: 'stage_transition',
      stage,
      timestamp: 1717430000,
    };
    expect(ev.type).toBe('stage_transition');
  });

  it('accepts an agent_output event with payload', () => {
    const payload: AgentOutputPayload = {
      content: 'Here is the draft.',
    };
    const ev: ProgressEvent = {
      sessionId: 'sess_abc',
      turnId: 'turn_001',
      eventId: 'evt_124',
      seq: 1,
      type: 'agent_output',
      timestamp: 1717430001,
      payload: payload as unknown as Record<string, unknown>,
    };
    expect(ev.payload?.content).toBe('Here is the draft.');
  });

  it('accepts a terminal_failure event', () => {
    const ev: ProgressEvent = {
      sessionId: 'sess_abc',
      turnId: 'turn_001',
      eventId: 'evt_125',
      seq: 2,
      type: 'terminal_failure',
      timestamp: 1717430002,
      payload: { reason: 'activity exhausted retries' },
    };
    expect(ev.type).toBe('terminal_failure');
  });

  it('carries reworkAttempt when stage is rework', () => {
    const ev: ProgressEvent = {
      sessionId: 'sess_abc',
      turnId: 'turn_001',
      eventId: 'evt_126',
      seq: 3,
      type: 'stage_transition',
      stage: 'rework',
      reworkAttempt: 1,
      timestamp: 1717430003,
    };
    expect(ev.reworkAttempt).toBe(1);
  });
});

describe('ProgressEventType', () => {
  it('is the union of the three documented event kinds', () => {
    const kinds: ProgressEventType[] = ['stage_transition', 'agent_output', 'terminal_failure'];
    expect(kinds).toHaveLength(3);
  });
});

describe('AgentOutputPayload', () => {
  it('accepts a content-only payload', () => {
    const p: AgentOutputPayload = { content: 'hi' };
    expect(p.content).toBe('hi');
  });

  it('accepts a partial flag', () => {
    const p: AgentOutputPayload = { content: 'partial draft', partial: true };
    expect(p.partial).toBe(true);
  });

  it('accepts a reviewerOverruled flag for rework-cap case', () => {
    const p: AgentOutputPayload = {
      content: 'final draft, reviewer was not happy',
      reviewerOverruled: true,
    };
    expect(p.reviewerOverruled).toBe(true);
  });
});

describe('gate events', () => {
  it('accepts a gate_open event with its payload', () => {
    const payload: GateOpenPayload = {
      gateId: 'gate_1',
      prompt: 'Release this answer?',
      detail: 'The reviewer approved it.',
      options: ['Approve', 'Request changes', 'Stop'],
    };
    const type: ProgressEventType = 'gate_open';
    const ev: ProgressEvent = {
      sessionId: 's', turnId: 't', eventId: 'e', seq: 4, type, stage: 'sign-off', timestamp: 0,
      payload: payload as unknown as Record<string, unknown>,
    };
    expect(ev.payload?.gateId).toBe('gate_1');
  });

  it('accepts a gate_open without detail', () => {
    const payload: GateOpenPayload = { gateId: 'g', prompt: 'p', options: ['Yes'] };
    expect(payload.detail).toBeUndefined();
  });

  it('accepts a gate_closed event, answered or timed out', () => {
    const answered: GateClosedPayload = { gateId: 'g', optionIndex: 0, timedOut: false };
    const timedOut: GateClosedPayload = { gateId: 'g', optionIndex: 2, timedOut: true };
    const type: ProgressEventType = 'gate_closed';
    expect([answered, timedOut].map((p) => p.timedOut)).toEqual([false, true]);
    expect(type).toBe('gate_closed');
  });
});
