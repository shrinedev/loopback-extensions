import { BindingKey, inject } from '@loopback/context';
import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, ResolvedRoute, RestBindings, Send, SequenceHandler } from '@loopback/rest';
import { GateBindings, GateRequestFn } from '@shrinedev/loopback-gate';

const SequenceActions = RestBindings.SequenceActions;

export const ROUTE_BINDING = BindingKey.create<ResolvedRoute>('core.route');

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(GateBindings.GATE_ACTION_PROVIDER)
    public gate: GateRequestFn,
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      // Store route in context
      context.bind(ROUTE_BINDING).to(route);

      // !!IMPORTANT: gates fail on static routes!
      // TODO
      // if (!(route instanceof StaticAssetsRoute)) {
      //   await this.gate(context, request);
      // }

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
