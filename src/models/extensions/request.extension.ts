import express from "express";

export interface CustomRequest extends express.Request {
  user?: {
    id?: string;
  }
}