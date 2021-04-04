/* globals localStorage */

// FEATURE 13. Provide default values
const STORAGE_KEY = 'candidates'

// FEATURE 2. Add a part.
class Candidate{
    constructor(newPartyName, newCandidateName, newVotes) {
        this.candidateName = newCandidateName
        this.partyName = newPartyName
        this.votes = newVotes || 0 // FEATURE 13. Provide default values.
    }
}

// FEATURE 1. Create a whole that acts as a facade for parts.
// FEATURE 2. Add a part.
class Electorate {
    constructor (newElectorateName) {
        this.electorateName = newElectorateName
        this.candidates = []
        this.candidateCount = this.candidates.length
    }

    // FEATURE 2. Add a part.
    setNewCandidate (newPartyName, newCandidateName, newVotes) {
        if (!this.candidates.some(i => i.candidateName === newCandidateName)) {
            // The candidate doesn't exist in the electorate, so add them. candidateName is unique.
            var newCandidate = new Candidate(newPartyName, newCandidateName, newVotes)
            this.candidates.push(newCandidate)
        }
    }

    // FEATURE 3. Sort parts.
    // TODO clean this mess up, not one line.
    sortCandidatesByVoteCount () {
        return this.candidates.sort((a, b) => (a.votes > b.votes) ? -1 : (a.votes === b.votes) ? ((a.candidateName > b.candidateName) ? 1 : -1) : 1)
    }

    //FEATURE 4. Filter parts.
    getCandidatesByVoteThreshold (threshold) {
        return this.candidates.filter(candidate => candidate.votes >= threshold)
    }

    // FEATURE 5. Delete a selected part.
    deleteCandidate (targetCandidateName) {
        const index = this.candidates.findIndex(i => i.candidateName === targetCandidateName)
        this.candidates.splice(index, 1)
    }

    //  FEATURE 6. Save all parts to LocalStorage.
    save () {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.candidates))
    }

    // FEATURE 7. Load all parts from LocalStorage.
    // FEATURE 13. Provide default values.
    load () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    }

    // TODO editing

    // FEATURE 12. A calculation across many parts.
    getLeadingCandidate () {
        var dataArray = [];
        for(var o in this.candidates) {
            dataArray.push(this.candidates[o].votes);
        }
        var leaderIndex = dataArray.indexOf(Math.max(...dataArray))
        return this.candidates[leaderIndex].candidateName
    }

    // FEATURE 15. Get all parts.
    getAllCandidates () {
        return this.candidates
    }
}

testElectorate = new Electorate("testElectorate")
testElectorate.setNewCandidate("party1", "bob", 1000)
testElectorate.setNewCandidate("party2", "steeve", 50)
testElectorate.setNewCandidate("party3", "roberto", 1500)
testElectorate.setNewCandidate("party4", "aaron", 1500)
console.log(testElectorate.candidates)
//test = testElectorate.sortCandidatesByVoteCount()
//console.log(test)


