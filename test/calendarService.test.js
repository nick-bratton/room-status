import assert from 'assert'
import {getFakeEntries} from "../src/calendarService.js"
import {isSameDay} from "../src/components/dates.js"

describe('getFakeEntries', () => {
    it('Should return an array of 3 fake entries for today', () => {
        const now = new Date()
        const fakeEntries = getFakeEntries()
        const isArray = fakeEntries instanceof Array
        const lengthIsRight = isArray && fakeEntries.length === 3
        let allToday = true
        for(const entry in fakeEntries) {
            if(!isSameDay(entry.start, now)) {
                allToday = false
                break
            }
        }
        assert(lengthIsRight && allToday)
    })
})
