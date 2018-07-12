import {VisitOrder} from "../VisitOrder";

export const VisitOrderSchemaV1 = {
    name: VisitOrder.getSchemaName(),
    primaryKey: 'midnightEpoch',
    properties: {
        midnightEpoch: 'int',
        visitList: 'Visit[]'
    }
};