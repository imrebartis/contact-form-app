'use strict';

import * as expressOriginal from 'express';

// Define the user type explicitly
export interface User {
  id: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
}

// Extend express Request with our properties
export interface RequestWithAuth extends expressOriginal.Request {
  user?: User;
  isAuthenticated(): boolean;
  params: any;
  body: any;
  query: any;
}

// Make sure Response includes all needed methods
export interface ResponseWithMethods extends expressOriginal.Response {
  status(code: number): ResponseWithMethods;
  json(body?: any): ResponseWithMethods;
  send(body?: any): ResponseWithMethods;
}

// Define NextFunction type
export interface NextFn {
  (err?: any): void;
}

// Export type aliases for convenience
export type Request = RequestWithAuth;
export type Response = ResponseWithMethods;
export type NextFunction = NextFn;
