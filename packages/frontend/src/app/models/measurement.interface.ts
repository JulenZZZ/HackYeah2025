import { MeasurementKind } from "./measurement-kind.enum";

/**
 * Single stat for measurement.
 */
export interface MeasurementModel {

    name: string,

    kind: MeasurementKind,

    amount: number,

    icon: string,

    threshold: number
}
