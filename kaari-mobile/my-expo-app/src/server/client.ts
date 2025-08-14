// Central client that can be passed via context/providers to screens/hooks

import * as actions from './actions';

export type ServerClient = typeof actions;

export const serverClient: ServerClient = actions;


