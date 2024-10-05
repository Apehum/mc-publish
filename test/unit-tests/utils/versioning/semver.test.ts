import { describe, expect, test } from "@jest/globals";
import semver from "semver";

describe("SemVer", () => {
    test("mcVersions", () => {
        const versions = ["1.16.5", ">=1.20.1", ">=1.19 <1.19.3"];

        expect(
            versions.some((version) => semver.satisfies("1.16.5", version))
        ).toStrictEqual(true);

        expect(
            versions.some((version) => semver.satisfies("1.19.3", version))
        ).toStrictEqual(false);

        expect(
            versions.some((version) => semver.satisfies("1.21.0", version))
        ).toStrictEqual(true);
    });
});
