import {expect} from '@loopback/testlab';
import {gateWith, getGateMethodMetadata, LogGate} from '../../../';
import { gateAllWith, getGateClassMetadata } from '../../../decorators';

class RedGate extends LogGate {};
class BlueGate extends LogGate {};

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

        it('accepts a multiple gates', () => {

            class TestController {
                @gateWith(LogGate, RedGate)
                whoAmI() {}    
            }

            const metadata = getGateMethodMetadata(TestController, 'whoAmI');
            expect(metadata).to.eql( { gates: [LogGate, RedGate] });
        });

        it('applies multiple gates in order', () => {

            class TestController {
                @gateWith(RedGate, BlueGate)
                whoAmI() {}    

                @gateWith(BlueGate, RedGate)
                whoAreYou() {}    
            }

            const metadataWhoAmI = getGateMethodMetadata(TestController, 'whoAmI');
            expect(metadataWhoAmI).to.eql( { gates: [RedGate, BlueGate] });

            const metadataWhoAreYou = getGateMethodMetadata(TestController, 'whoAreYou');
            expect(metadataWhoAreYou).to.eql( { gates: [BlueGate, RedGate] });
        });
    });

    describe('@gateAllWith decorator', () => {
        it('accepts a single gate', () => {

            @gateAllWith(LogGate)
            class TestController {             
                whoAmI() {}    
            }

            const metadata = getGateClassMetadata(TestController);
            expect(metadata).to.eql( { gates: [LogGate] });
        });

        it('accepts a multiple gates and mantains order', () => {

            @gateAllWith(BlueGate, RedGate)
            class TestController {}

            @gateAllWith(RedGate, BlueGate)
            class TestController2 {}

            const metadata = getGateClassMetadata(TestController);
            expect(metadata).to.eql( { gates: [BlueGate, RedGate] });

            const metadata2 = getGateClassMetadata(TestController2);
            expect(metadata2).to.eql( { gates: [RedGate, BlueGate] });
        });


        it('applies inheritied gates', () => {
            @gateAllWith(BlueGate)
            class BaseController {}

            @gateAllWith(RedGate)
            class TestController extends BaseController{}

            @gateAllWith(RedGate)
            class NoBaseControllerTestController {};

            const metadata = getGateClassMetadata(TestController);
            expect(metadata).to.eql( { gates: [BlueGate, RedGate] });

            const noBaseControllerMetadata = getGateClassMetadata(NoBaseControllerTestController);
            expect(noBaseControllerMetadata).to.eql( { gates: [RedGate] });
        });

    });
});

