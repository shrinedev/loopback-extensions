import { Screen } from "../types";
import { Request } from "express";
import { RequestContext } from "@loopback/rest";

export class LogScreen implements Screen {
    async screen(context: RequestContext, request: Request) {
      console.log("Screening the request for url", request.url);
      return Promise.resolve();
    }
  }