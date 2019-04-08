import { expect } from "chai";
import "mocha";

import DynamoDBManager from "../../controllers/utilities/DynamoDBManager";

describe ("DynamoDBManager", function() {

  describe("sanitizeForStorage", () => {

    const _dynamo = new DynamoDBManager({table_name: "test"});

    it("returns a empty object", () => {

      expect(_dynamo.sanitizeForStorage({})).to.deep.equal({});

    });

    it("returns a object unadulterated", () => {

      const tester = {
        something: "else",
        blarg: ["some", {}, "dargs"],
        whateevr: 123,
        thang: {
          bangodango: true,
        },
      };

      expect(_dynamo.sanitizeForStorage(tester)).to.deep.equal(tester);

    });

    it("removes a null object", () => {

      const tester = {
        something: "else",
        blarg: ["some", {}, "dargs"],
        whateevr: 123,
        bongwater: null,
        thang: {
          bangodango: true,
        },
      };

      const result = Object.assign({}, tester);
      delete result.bongwater;

      expect(_dynamo.sanitizeForStorage(tester)).to.deep.equal(result);

    });

    it("removes a empty string object", () => {

      const tester = {
        something: "else",
        blarg: ["some", {}, "dargs"],
        whateevr: 123,
        bongwater: "",
        thang: {
          bangodango: true,
        },
      };

      const result = Object.assign({}, tester);
      delete result.bongwater;

      expect(_dynamo.sanitizeForStorage(tester)).to.deep.equal(result);

    });

    // Technical Debt:  Feature not supported
    xit("removes a undefined object", () => {

      const tester = {
        something: "else",
        blarg: ["some", {}, "dargs"],
        whateevr: 123,
        bongwater: undefined,
        thang: {
          bangodango: true,
        },
      };

      const result = Object.assign({}, tester);
      delete result.bongwater;

      expect(_dynamo.sanitizeForStorage(tester)).to.deep.equal(result);

    });

  });

});
