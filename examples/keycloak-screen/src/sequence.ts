import {inject, BindingKey} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  StaticAssetsRoute,
  ResolvedRoute,
} from '@loopback/rest';

import {ScreenBindings, ScreenRequestFn} from '@shrinedev/loopback-screen';

const SequenceActions = RestBindings.SequenceActions;

export const ROUTE_BINDING = BindingKey.create<ResolvedRoute>('core.route');

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(ScreenBindings.SCREEN_ACTION_PROVIDER)
    public screen: ScreenRequestFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      // Store route in context
      context.bind(ROUTE_BINDING).to(route);

      // !!IMPORTANT: screens fail on static routes!
      if (!(route instanceof StaticAssetsRoute)) {
        await this.screen(context, request);
      }

      if (response.headersSent) {
        console.log('Headers are already sent!');
        return;
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
