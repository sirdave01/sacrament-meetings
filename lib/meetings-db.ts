// this is an in-memory data module that holds
// at least Five Meeting Records and export query functions

// importing the types.ts files to be used in the in-memory data module

import type { SacramentMeeting } from "./types";

// creating the meetings array using the information in the SacramentMeeting Interface
const meetings: SacramentMeeting[] = [

    {

        id: 1,

        date: "2026-05-03",

        meetingType: "regular",

        presiding: "Bishop Smith",

        conducting: "Brother Jones",

        openingHymn: { number: 2, title: "The Spirit of God" },

        openingPrayer: "Sister Williams",

        wardBusiness: [{ description: "Sustaining of new Primary president" }],

        stakeBusiness: false,

        sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },

        speakers: [

            { name: "Sister Brown", topic: "Faith in Jesus Christ", type: "speaker" },

            { name: "Youth Choir", topic: "", type: "musical-number" }

        ],

        closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },

        closingPrayer: "Brother Davis",

        announcements: ["Ward temple night: May 10"]

    },

    {

        id: 2,

        date: "2026-05-10",

        meetingType: "stake",

        presiding: "Stake President Johnson",

        conducting: "Brother Lee",

        openingHymn: { number: 1, title: "The Morning Breaks" },

        openingPrayer: "Brother Kim",

        wardBusiness: [],

        stakeBusiness: true,

        sacramentHymn: { number: 174, title: "I Stand All Amazed" },

        speakers: [
        
            { name: "Brother Martinez", topic: "The Atonement of Jesus Christ", type: "speaker" },
            
            { name: "Sister Garcia", topic: "The Plan of Salvation", type: "speaker" }

        ],

        closingHymn: { number: 34, title: "Come, Come, Ye Saints" },

        closingPrayer: "Sister Hernandez",

        announcements: ["Stake youth conference: May 15"]
    },

    {

        id: 3,

        date: "2026-05-17",

        meetingType: "general",

        presiding: "President Thompson",

        conducting: "Brother Wilson",

        openingHymn: { number: 3, title: "Now Let Us Rejoice" },

        openingPrayer: "Sister Anderson",

        wardBusiness: [],

        stakeBusiness: false,

        sacramentHymn: { number: 175, title: "I Know That My Redeemer Lives" },

        speakers: [

            { name: "Brother Taylor", topic: "The Restoration of the Gospel", type: "speaker" },

            { name: "Sister Thomas", topic: "The Book of Mormon", type: "speaker" }

        ],

        closingHymn: { number: 35, title: "Rejoice, the Lord is King" },

        closingPrayer: "Brother White",

        announcements: ["General Conference: May 21-22"]
    },

    {

        id: 4,

        date: "2026-05-24",

        meetingType: "testimony",

        presiding: "Bishop Smith",

        conducting: "Brother Jones",

        openingHymn: { number: 4, title: "Come, Follow Me" },

        openingPrayer: "Sister Williams",

        wardBusiness: [{ description: "Sustaining of new Relief Society president" }],

        stakeBusiness: false,

        sacramentHymn: { number: 176, title: "I Need Thee Every Hour" },

        speakers: [

            { name: "Sister Brown", topic: "Testimony of Jesus Christ", type: "speaker" },

            { name: "Brother Davis", topic: "Testimony of the Book of Mormon", type: "speaker" }

        ],

        closingHymn: { number: 36, title: "Jesus, the Very Thought of Thee" },

        closingPrayer: "Brother Davis",

        announcements: ["Ward service project: May 30"]
    },

    {

        id: 5,

        date: "2026-05-31",

        meetingType: "regular",

        presiding: "Bishop Smith",

        conducting: "Brother Jones",

        openingHymn: { number: 5, title: "The Spirit of God" },

        openingPrayer: "Sister Williams",
        
        wardBusiness: [{ description: "Sustaining of new Young Men president" }],

        stakeBusiness: false,

        sacramentHymn: { number: 177, title: "I Stand All Amazed" },

        speakers: [

            { name: "Brother Martinez", topic: "Faith in Jesus Christ", type: "speaker" },

            { name: "Sister Garcia", topic: "The Atonement of Jesus Christ", type: "speaker" }

        ],

        closingHymn: { number: 37, title: "Come, Come, Ye Saints" },

        closingPrayer: "Sister Hernandez",

        announcements: ["Ward youth activity: June 5"]
    },

    {

        id: 6,

        date: "2026-06-07",

        meetingType: "stake",

        presiding: "Stake President Johnson",

        conducting: "Brother Lee",

        openingHymn: { number: 6, title: "The Morning Breaks" },

        openingPrayer: "Brother Kim",

        wardBusiness: [],

        stakeBusiness: true,

        sacramentHymn: { number: 178, title: "I Know That My Redeemer Lives" },

        speakers: [

            
            { name: "Brother Taylor", topic: "The Restoration of the Gospel", type: "speaker" },
            
            { name: "Sister Thomas", topic: "The Book of Mormon", type: "speaker" }
        
        ],

        closingHymn: { number: 38, title: "Rejoice, the Lord is King" },

        closingPrayer: "Sister White",

        announcements: ["Stake youth conference: June 12"]
    }
];

// Create a reusable lookup function that can optionally filter by date.
// This matches the route handler expectation for ?date=YYYY-MM-DD.
export function getMeetings(date?: string | null): SacramentMeeting[] {

    const normalizedDate = date?.trim();

    if (normalizedDate) {

        return meetings.filter((meeting) => meeting.date === normalizedDate);

    }

    return meetings;

}

// Keep the original helper name as a compatibility alias for the rest of the app.
export const getAllMeetings = getMeetings;

// Create the export function to get a meeting by its ID.
export function getMeetingById(id: number): SacramentMeeting | undefined {

    return meetings.find((meeting) => meeting.id === id);

}