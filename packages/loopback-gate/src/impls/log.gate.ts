import { Gate } from "../types";
import { Request } from "express";
import { RequestContext } from "@loopback/rest";

export class LogGate implements Gate {
    async gate(context: RequestContext, request: Request) {
      console.log("Gate the request for url", request.url);
      return Promise.resolve();
    }
  }