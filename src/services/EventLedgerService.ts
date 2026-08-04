/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateSnapshot } from '../core/RuntimeContext';

export interface LedgerEvent {
  id: string;
  timestamp: string;
  type: string;
  payload: Record<string, any>;
  hash: string;
  previousHash: string;
}

export class EventLedgerService {
  private static STORAGE_KEY = 'argos_continuity_spine_ledger';
  private events: LedgerEvent[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Loads ledger history from persistent local storage or seeds the initial block.
   */
  private loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(EventLedgerService.STORAGE_KEY);
        if (stored) {
          this.events = JSON.parse(stored);
          return;
        }
      }
      
      // Seed the very first Genesis Block!
      this.append('GENESIS_BOOT', {
        operator: 'kelseaziegler@gmail.com',
        message: 'Sovereign Root personality initialized.',
        confidence: 0.95
      });
    } catch (e) {
      console.error('Failed to parse persistent ledger:', e);
      this.events = [];
    }
  }

  private saveToStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(EventLedgerService.STORAGE_KEY, JSON.stringify(this.events));
      }
    } catch (e) {
      console.error('Failed to persist ledger state:', e);
    }
  }

  /**
   * Appends an event, computes an incremental crypto-hash, and commits to persistent storage.
   */
  public append(type: string, payload: Record<string, any>): LedgerEvent {
    const previous = this.events[this.events.length - 1];
    const previousHash = previous ? previous.hash : '00000000000000000000000000000000';
    
    const id = `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const timestamp = new Date().toLocaleTimeString();
    
    // Quick deterministic hash representation (adhering to browser sandbox constraints)
    const payloadStr = JSON.stringify(payload);
    const rawData = `${id}-${timestamp}-${type}-${payloadStr}-${previousHash}`;
    let hashVal = 0;
    for (let i = 0; i < rawData.length; i++) {
      hashVal = (hashVal << 5) - hashVal + rawData.charCodeAt(i);
      hashVal |= 0; // Convert to 32bit integer
    }
    const hash = `INTEGRITY-HASH:0x${Math.abs(hashVal).toString(16).padStart(8, '0')}`;

    const newEvent: LedgerEvent = {
      id,
      timestamp,
      type,
      payload,
      hash,
      previousHash
    };

    this.events.push(newEvent);
    this.saveToStorage();
    return newEvent;
  }

  /**
   * Replays entire transaction log to reconstruct the current nominal state parameters.
   */
  public replayAndReconstruct(): Partial<StateSnapshot> {
    const state: Partial<StateSnapshot> = {
      aggression: 0.5,
      caution: 0.5,
      exploration: 0.25,
      explorationRate: 0.25,
      operatingState: 'SHIP'
    };

    for (const ev of this.events) {
      switch (ev.type) {
        case 'AGGRESSION_TUNE':
          if (typeof ev.payload.value === 'number') state.aggression = ev.payload.value;
          break;
        case 'CAUTION_TUNE':
          if (typeof ev.payload.value === 'number') state.caution = ev.payload.value;
          break;
        case 'EXPLORATION_TUNE':
          if (typeof ev.payload.value === 'number') state.exploration = ev.payload.value;
          break;
        case 'EXPLORATION_RATE_TUNE':
          if (typeof ev.payload.value === 'number') state.explorationRate = ev.payload.value;
          break;
        case 'OPERATING_STATE_TRANSITION':
          if (ev.payload.state) state.operatingState = ev.payload.state;
          break;
        case 'SNAPSHOT_RESTORE':
          if (ev.payload.snapshot) {
            state.aggression = ev.payload.snapshot.aggression;
            state.caution = ev.payload.snapshot.caution;
            state.exploration = ev.payload.snapshot.exploration;
            state.explorationRate = ev.payload.snapshot.explorationRate;
            state.operatingState = ev.payload.snapshot.operatingState;
          }
          break;
      }
    }

    return state;
  }

  public getEvents(): LedgerEvent[] {
    return [...this.events].reverse();
  }

  public clearLedger() {
    this.events = [];
    localStorage.removeItem(EventLedgerService.STORAGE_KEY);
    this.loadFromStorage();
  }
}

export const eventLedgerInstance = new EventLedgerService();
