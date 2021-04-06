/* globals describe it xdescribe xit beforeEach expect TodoList localStorage STORAGE_KEY */
var assert = require("assert");
var assert = require("chai").assert;
var expect = require("chai").expect;
var should = require("chai").should();
var Electorate = require("../electionModel.js").Electorate;
var Candidate = require("../electionModel.js").Candidate;
var STORAGE_KEY = require("../electionModel.js").STORAGE_KEY
var LocalStorage = require('node-localstorage').LocalStorage

describe("electionModel", function () {
    var theElectorate;
    var localStorage;

    function getCandidateNames(allCandidates) {
        const allCandidateNames = [];
        for (const aCandidate of allCandidates) {
            allCandidateNames.push(aCandidate.candidateName);
        }
        return allCandidateNames;
    }

    beforeEach(function () {
        theElectorate = new Electorate("testElectorate");
        localStorage = new LocalStorage("./storage");
    });

    // FEATURE 1. Create a whole that acts as a facade for parts.
    // FEATURE 2. Add a part.
    describe("setNewCandidate", function () {
        describe("a single candidate is added with name of bob, party of testParty and votes of 1", function () {
            var theCandidate;
            beforeEach(function () {
                theElectorate.setNewCandidate("bob", "testParty", 1);
                theCandidate = theElectorate.candidates[0];
            });

            describe("the single candidate added", function () {
                it("should have candidateName equal to bob", function () {
                    expect(theCandidate.candidateName).to.equal("bob");
                });

                it("should have partyName equal to testParty", function () {
                    expect(theCandidate.partyName).to.equal("testParty");
                });

                it("should have votes equal to 1", function () {
                    expect(theCandidate.votes).to.equal(1);
                });
            });

            describe("the candidates list", function () {
                it("should have one entry", function () {
                    expect(theElectorate.candidates.length).to.equal(1);
                });
            });
        });

        describe("when three candidates are added", function () {
            it("candidates list should have three entries", function () {
                theElectorate.setNewCandidate("bink", "testParty1", 1);
                theElectorate.setNewCandidate("bonk", "testParty2", 2);
                theElectorate.setNewCandidate("bosh", "testParty3", 3);
                expect(theElectorate.candidates.length).to.equal(3);
            });
        });
    });

    // FEATURE 6. Save all parts to LocalStorage
    describe("saveCandidates", function () {

        beforeEach(function () {
            localStorage.clear()
            theElectorate.setNewCandidate("blub", "testParty1", 100);
            theElectorate.saveCandidates();
        })

        it("should save a candidate from storage when there is one candidate", function () {
            var electorateJSON = localStorage.getItem(STORAGE_KEY)
            expect(electorateJSON).to.exist
        });

        it("should have the correct JSON for the saved candidate in localStorage", function () {
            var electorateJSON = localStorage.getItem(STORAGE_KEY)
            expect(electorateJSON).to.equal('[{"candidateName":"blub","partyName":"testParty1","votes":100}]')
        })
    });

    // FEATURE 7. Load all parts from LocalStorage.
    describe("loadCandidates", function () {

        beforeEach(function () {
            localStorage.clear()
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.saveCandidates();
        })

        it("should load a candidate from localstorage when it has a single candidate", function () {
            // New blank electorate.
            theElectorate2 = new Electorate("testElectorate")
            // Load.
            theElectorate2.loadCandidates()
            var loadedCandidates = theElectorate2.candidates
            expect(loadedCandidates.length).to.equal(1)
        })

        it("should have the correct array for the loaded candidate in .candidates", function () {
            // New blank electorate.
            theElectorate3 = new Electorate("testElectorate")
            // Load.
            theElectorate3.loadCandidates()
            candidatesJSON = theElectorate3.candidates
            expect(candidatesJSON).to.deep.equal([ { candidateName: 'tim', partyName: 'testParty1', votes: 100 } ])
        })
    })

    // FEATURE 3. Sort parts.
    describe("sortCandidatesByVoteCount", function () {

        it("should sort candidates by vote count, high to low", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 101);
            theElectorate.setNewCandidate("tom", "testParty3", 1000);
            actualOrderCandidates = theElectorate.sortCandidatesByVoteCount()
            expectedOrderCandidates = [
                { candidateName: 'tom', partyName: 'testParty3', votes: 1000 },
                { candidateName: 'tam', partyName: 'testParty2', votes: 101 },
                { candidateName: 'tim', partyName: 'testParty1', votes: 100 }
            ]
            expect(actualOrderCandidates).to.deep.equal(expectedOrderCandidates)
        })

        it("should sort by name alphabetically in case of a tie in votes", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 100);
            theElectorate.setNewCandidate("tam", "testParty2", 101);
            theElectorate.setNewCandidate("tom", "testParty3", 1000);
            theElectorate.setNewCandidate("atim", "testParty1", 100);
            actualOrderCandidates = theElectorate.sortCandidatesByVoteCount()
            expectedOrderCandidates = [
                { candidateName: 'tom', partyName: 'testParty3', votes: 1000 },
                { candidateName: 'tam', partyName: 'testParty2', votes: 101 },
                { candidateName: 'atim', partyName: 'testParty1', votes: 100 },
                { candidateName: 'tim', partyName: 'testParty1', votes: 100 }
            ]
            expect(actualOrderCandidates).to.deep.equal(expectedOrderCandidates)
        })
    })

    // FEATURE 4. Filter parts.
    describe("getCandidatesByVoteThreshold", function () {

        it("should filter candidates who do not meet or exceed the vote threshold out", function () {
            theElectorate.setNewCandidate("tim", "testParty1", 1058);
            theElectorate.setNewCandidate("tam", "testParty2", 51);
            theElectorate.setNewCandidate("tom", "testParty3", 50);
            theElectorate.setNewCandidate("atim", "testParty1", 0);
            theElectorate.setNewCandidate("xtim", "testParty1", 49);
            expectedOrderFilteredCandidates = [
                { candidateName: 'tim', partyName: 'testParty1', votes: 1058 },
                { candidateName: 'tam', partyName: 'testParty2', votes: 51 },
                { candidateName: 'tom', partyName: 'testParty3', votes: 50 }
            ]
            actualOrderFilteredCandidates = theElectorate.getCandidatesByVoteThreshold(50)
            expect(actualOrderFilteredCandidates).to.deep.equal(expectedOrderFilteredCandidates)
        })
    })

    describe("getLeadingCandidate", function () {

        it("should return the name of the candidate with the most votes", function() {
            theElectorate.setNewCandidate("tim", "testParty1", 1058);
            theElectorate.setNewCandidate("tam", "testParty2", 51);
            theElectorate.setNewCandidate("tom", "testParty3", 50);
            expectedResult = "tim"
            actualResult = theElectorate.getLeadingCandidate()
            expect(actualResult).to.equal(expectedResult)
        })
    })
});
