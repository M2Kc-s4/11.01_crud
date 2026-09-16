import { AbstractReader } from "../common/abstract.reader";
import type { EnrollmentRead } from "@contracts";

export class EnrollmentReader extends AbstractReader<EnrollmentRead> {
    protected override tablename: string = 'enrollments_r'
}