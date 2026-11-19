import { getVerdict } from "./verdict";

describe("getVerdict", () => {
    it("says Ride when there is little rain and little wind", () => {
        expect(getVerdict(10, 12)).toBe("Ride");
    });

    it("says Wait when the rain chance is above 40%", () => {
        expect(getVerdict(60, 12)).toBe("Wait");
    });

    it("says Walk when the wind is above 30 km/h", () => {
        expect(getVerdict(10, 45)).toBe("Walk");
    });

    it("says Wait, not Walk, when there is rain and strong wind", () => {
        expect(getVerdict(60, 45)).toBe("Wait");
    });

    it("still says Ride exactly at the limits (40% and 30 km/h)", () => {
        expect(getVerdict(40, 30)).toBe("Ride");
    });

    it("says Ride with no rain and no wind at all", () => {
        expect(getVerdict(0, 0)).toBe("Ride");
    });
});
