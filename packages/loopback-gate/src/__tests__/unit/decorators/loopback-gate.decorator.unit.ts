import {expect} from '@loopback/testlab';
import {gateWith, getGateMethodMetadata, LogGate} from '../../../';

describe('Gates', () => {
    describe('@gateWith decorator', () => {
        it('accepts a single gate', () => {

            class TestController {
                @gateWith(LogGate)
                whoAmI() {}    
            }

            const metadata = getGateMethodMetadata(TestController, 'whoAmI');
            expect(metadata).to.eql( { gates: [LogGate] });
        });
    });
});

