import { expect } from "chai"
import "mocha"

import { KinesisManager } from "../"

describe("KinesisManager", function() {
  describe("constructor", () => {
    it("Successfully constructs with argumentation", () => {
      const k = new KinesisManager({ region: "us-east-1" })
      expect(k instanceof KinesisManager).to.equal(true)
    })
  })
})
