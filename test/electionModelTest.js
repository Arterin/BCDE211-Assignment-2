/* globals describe it xdescribe xit beforeEach expect TodoList localStorage STORAGE_KEY */
var assert = require("assert");
var assert = require("chai").assert;
var expect = require("chai").expect;
var should = require("chai").should();
var Electorate = require("../electionModel.js").Electorate;
var Candidate = require("../electionModel.js").Candidate

describe("electionModel", function () {
  var theElectorate;

  function getCandidateNames(allCandidates) {
    const allCandidateNames = [];
    for (const aCandidate of allCandidates) {
      allCandidateNames.push(aCandidate.candidateName);
    }
    return allCandidateNames;
  }

  beforeEach(function () {
    theElectorate = new Electorate("testElectorate");
  });

  describe("setNewCandidate", function () {

    describe("a single candidate is added with name of bob, party of testParty and votes of 1", function () {
      var theCandidate;
      beforeEach(function () {
        theElectorate.setNewCandidate("bob", "testParty", 1);
        theCandidate = theElectorate.candidates[0];
      });

      describe("the single candidate added", function () {

        it("should have candidateName equal to bob", function () {
          expect(theCandidate.candidateName).to.equal('bob');
        });

        it("should have partyName equal to testParty", function () {
          expect(theCandidate.partyName).to.equal('testParty');
        });

        it("should have votes equal to 1", function () {
          expect(theCandidate.votes).to.equal(1);
        });        
      });

      describe("the candidates list", function () {

        it("should have one entry", function () {
          expect(theElectorate.candidates.length).to.equal(1)
        })
      })
    });

    describe("when three candidates are added", function () {
      it("candidates list should have three entries", function() {
        theElectorate.setNewCandidate("bink", "testParty1", 1)
        theElectorate.setNewCandidate("bonk", "testParty2", 2)
        theElectorate.setNewCandidate("bosh", "testParty3", 3)
        expect(theElectorate.candidates.length).to.equal(3)
      })
    })
  });
});
