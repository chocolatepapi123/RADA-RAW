// src/data/useRadaStore.ts
import { useState, useEffect } from 'react';
import { RadaStore, SpotItem, EventItem, ThriftItem } from '../types';

const STORAGE_KEY = 'rada_app_persistent_store';

const initialStoreState: RadaStore = {
  spots: [],
  events: [],
  thrift: []
};

export function useRadaStore() {
  const [store, setStore] = useState<RadaStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialStoreState;
    } catch (e) {
      console.error('Failed to parse local storage data:', e);
      return initialStoreState;
    }
  });

  // Sync state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [store]);

  // Action: Add New Spot
  const addSpot = (spot: Omit<SpotItem, 'id' | 'createdAt'>) => {
    const newSpot: SpotItem = {
      ...spot,
      id: 'spot_' + Date.now(),
      createdAt: Date.now()
    };
    setStore(prev => ({ ...prev, spots: [newSpot, ...prev.spots] }));
  };

  // Action: Add New Event
  const addEvent = (event: Omit<EventItem, 'id' | 'createdAt'>) => {
    const newEvent: EventItem = {
      ...event,
      id: 'evt_' + Date.now(),
      createdAt: Date.now()
    };
    setStore(prev => ({ ...prev, events: [newEvent, ...prev.events] }));
  };

  // Action: Add New Thrift Fit
  const addThriftItem = (item: Omit<ThriftItem, 'id' | 'createdAt'>) => {
    const newItem: ThriftItem = {
      ...item,
      id: 'thrift_' + Date.now(),
      createdAt: Date.now()
    };
    setStore(prev => ({ ...prev, thrift: [newItem, ...prev.thrift] }));
  };

  return {
    store,
    addSpot,
    addEvent,
    addThriftItem
  };
}
