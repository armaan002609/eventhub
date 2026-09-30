const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create or find the Hackathon
  const hackathon = await prisma.hackathon.create({
    data: {
      title: "AIIU Canoeing & Kayaking 2026-27",
      organizer: "CGC University, Mohali",
      location: "Sukhna Lake, Chandigarh",
      themes: ["Sports", "Canoeing", "Kayaking"],
      startsAt: new Date("2026-10-15T00:00:00Z"),
      endsAt: new Date("2026-10-20T00:00:00Z"),
      isPublished: true,
      participants: 0,
    }
  });

  console.log("Created Hackathon:", hackathon.id);

  const committeesData = [
    // Reception Committee
    {
      hackathonId: hackathon.id,
      committeeName: "Reception Committee",
      inCharge: "Mr. Sumit Malik",
      contactDetails: "Mob: 9416168258",
      responsibility: "Coordinate and attend all calls related to the team.",
      duty: "Additionally, 3 personnel from the Transport Department will be assigned under his coordination.",
      venue: "Chandigarh Railway Station, 17 sector & 43 sector Bus Stand",
      remarks: ""
    },
    {
      hackathonId: hackathon.id,
      committeeName: "Reception Committee",
      inCharge: "Mr. Sanjay Yadav",
      contactDetails: "Mob: 8602394437",
      responsibility: "Boys Hostel Coordinator",
      duty: "Assist with Hostel Location and Accommodation Guidance",
      venue: "CGC University (Block - 4, Reception area of DCPD)",
      remarks: "The Hostel Warden will be responsible for receiving the security fee in CASH."
    },
    {
      hackathonId: hackathon.id,
      committeeName: "Reception Committee",
      inCharge: "Mr. Ridham Thakral",
      contactDetails: "Mob: 9780919312",
      responsibility: "Boys Hostel Coordinator",
      duty: "Assist with Hostel Location and Accommodation Guidance",
      venue: "CGC University (Block - 4)",
      remarks: ""
    },
    {
      hackathonId: hackathon.id,
      committeeName: "Reception Committee",
      inCharge: "Dr. Pushpa",
      contactDetails: "Mob: 8847690228",
      responsibility: "Girls Hostel Coordinator",
      duty: "Assist with Hostel Location and Accommodation Guidance",
      venue: "CGC University (Block - 4)",
      remarks: ""
    },
    
    // Transport Committee
    {
      hackathonId: hackathon.id,
      committeeName: "Transport Committee",
      inCharge: "Mr. Sukhwinder (Transport Manager)",
      contactDetails: "",
      responsibility: "Transport Dept. will provide 5 Buses for Transporting Teams from Railway station, Bustand-17 & 43 to CGC University & Competitive Arena Sukhna Lake",
      duty: "04 Buses - Railway Station, 02 Buses - 17 - Bustand, 04 Buses - 43 - Bustand",
      venue: "Chandigarh Railway Station, 17 & 43 sector Bus Stand",
      remarks: "Branding of Buses. Requirement of 10 Buses"
    },
    {
      hackathonId: hackathon.id,
      committeeName: "Transport Committee",
      inCharge: "Mr. Sumit Malik (Sports)",
      contactDetails: "Mob: 9416168258",
      responsibility: "The Incharge of Transport will ensure that the Teams reach in time to the Station - railway/Bustand/Venue",
      duty: "Ensure on time arrival",
      venue: "Sukhna Lake Chandigarh",
      remarks: ""
    },
    {
      hackathonId: hackathon.id,
      committeeName: "Transport Committee",
      inCharge: "Schedule Manager (Mr. Sumit Malik)",
      contactDetails: "",
      responsibility: "Mr. Sumit Malik will make transport schedule every evening",
      duty: "05 Buses at Sukhna Lake Chandigarh",
      venue: "Sukhna Lake Chandigarh",
      remarks: ""
    },
    
    // Registration Committee
    {
      hackathonId: hackathon.id,
      committeeName: "Registration Committee",
      inCharge: "Ms. Anjali Jangra",
      contactDetails: "Mob: 9996574397",
      responsibility: "DOCUMENTATION & ELIGIBILITY",
      duty: "10 - SSC STUDENTS, 10 - SAC STUDENTS",
      venue: "CGC University (Block - 4, Reception area of DCPD)",
      remarks: "10th, 12th. Adharcard, Apaar ID, Migration Certificate, University ID Card & GAP year"
    },
    
    // Boarding & Lodging
    {
      hackathonId: hackathon.id,
      committeeName: "Boarding & Lodging Committee",
      inCharge: "Dr. Arvinder Singh Kang",
      contactDetails: "",
      responsibility: "Hostel Warden's (Boys & Girls) will look after the Boarding & Lodging arrangements",
      duty: "They will make the Boarding & Lodging to the athletes in time",
      venue: "Hostel's CGC University, Mohali",
      remarks: "Submit the menu schedule wise to the Sr. Director Sports"
    },
    
    // Refreshment
    {
      hackathonId: hackathon.id,
      committeeName: "Refreshment Committee (VIP)",
      inCharge: "Dr. Kang",
      contactDetails: "",
      responsibility: "Coordinate the breakfast, lunch, and dinner arrangements for all teams and officials.",
      duty: "Arrange packed breakfast and lunch for teams from campus to Sukhna Lake",
      venue: "From Campus to Sukhna Lake Chandigarh",
      remarks: "Final menu decided by Vice Chancellor & Director's Sports"
    },
    
    // Technical Committee
    {
      hackathonId: hackathon.id,
      committeeName: "Technical Committee",
      inCharge: "Director Competition & Mr. Arun",
      contactDetails: "",
      responsibility: "Conduct the competition strictly as per AIIU norms, rules, regulations, and schedule.",
      duty: "Coordinate with technical officials and teams, ensure proper venue/equipment arrangements",
      venue: "Sukhna Lake Chandigarh",
      remarks: ""
    },
    
    // Track & Boats
    {
      hackathonId: hackathon.id,
      committeeName: "Track & Boats Committee",
      inCharge: "Mr. Gurjeet Singh (Rowing Coach)",
      contactDetails: "",
      responsibility: "Laying of Track in the Lake. Ensure complete technical, course, and equipment arrangements",
      duty: "Prepare and maintain the competition course, lane markings, buoys",
      venue: "Sukhna Lake Chandigarh",
      remarks: ""
    },
    
    // Discipline
    {
      hackathonId: hackathon.id,
      committeeName: "Discipline Committee",
      inCharge: "Dr. Ashwani (Assoc. Director Applied Science)",
      contactDetails: "Mob: 8872048011",
      responsibility: "To Maintain the discipline",
      duty: "To Maintain the discipline at Sukhna Lake & Hostel's",
      venue: "CGC University & Sukhna Lake",
      remarks: "15 Volunteers from DSA (SAC)"
    }
  ];

  for (const c of committeesData) {
    await prisma.committee.create({ data: c });
  }

  console.log("Successfully seeded", committeesData.length, "committee duties.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
