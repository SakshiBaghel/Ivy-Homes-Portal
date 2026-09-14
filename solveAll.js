// ⚠️ DHYAN DEIN: Yahan apni email se dekh kar values daalni hain!
// const ASSIGNED_LOCALITY = "wakad"; // Email me jo locality di hai wo yahan likho (lowercase me)
// const REFERENCE_TIME = "2026-09-01T00:00:00+05:30"; // Email me jo REFERENCE time hai wo exact yahan likho

// const API_KEY = "IVY26-0DD40C14CD1F";
// const TOKEN = "eyJleHAiOjE3ODkzOTQxMTYsImlhdCI6MTc4OTM5MzIxNiwia2V5IjoiSVZZMjYtMERENDBDMTRDRDFGIiwic3ViIjoiZGVtbzFAaXZ5LmhvbWVzIiwidHlwIjoiYWNjZXNzIn0.phQ8gxv3msbNx0waQ9xqXW4aavIy1spZzmK8LPnh7Ko";


// Email se mili details
const ASSIGNED_LOCALITY = "aundh"; 

// NOTE: Email me REFERENCE time alag se nahi likha h, toh 99% chance h ki wo deadline time (14 Sept 2026, 23:59) hi hai. 
// Agar tumhare 'statement.md' file me REFERENCE time kuch aur diya h, toh usko yahan update kar lena.
const REFERENCE_TIME = "2026-09-14T23:59:00+05:30"; 

const API_KEY = "IVY26-0DD40C14CD1F";
const TOKEN = "eyJleHAiOjE3ODkzOTY1MzYsImlhdCI6MTc4OTM5NTYzNiwia2V5IjoiSVZZMjYtMERENDBDMTRDRDFGIiwic3ViIjoiZGVtbzFAaXZ5LmhvbWVzIiwidHlwIjoiYWNjZXNzIn0.8dykAQWA4I3q2eVD9W9BP9Ux-GJu0CGfJiiMkPtomAU";


async function fetchEndpoint(endpoint) {
    let allData = [];
    let offset = 0;
    let hasMore = true;
    console.log(`Fetching ${endpoint} ...`);

    while (hasMore) {
        const response = await fetch(`https://solve.ivy.homes/v1/${endpoint}?limit=100&offset=${offset}`, {
            headers: { "X-API-Key": API_KEY, "Authorization": `Bearer ${TOKEN}` }
        });
        
        if (!response.ok) {
            console.log(`❌ Error in ${endpoint}:`, response.status);
            break;
        }

        const data = await response.json();
        const items = data.results || data.data || [];
        allData.push(...items);

        if (offset + items.length >= (data.total || 0) || items.length === 0) {
            hasMore = false;
        } else {
            offset += items.length;
        }
    }
    
    // Duplicates hata rahe hain
    return Array.from(new Map(allData.map(item => [item.listing_id || item.rental_id || item.project_id || item.id, item])).values());
}

async function getAnswers() {
    // 1. Teeno APIs se data laao
    const uniqueListings = await fetchEndpoint("listings");
    const uniqueRentals = await fetchEndpoint("rentals");
    const uniqueProjects = await fetchEndpoint("projects");

    // ==========================================
    // PURANE ANSWERS (1 TO 4)
    // ==========================================
    const totalRecords = uniqueListings.length;
    
    const uniqueSet = new Set(uniqueListings.map(i => `${i.latitude}-${i.longitude}-${i.bhk !== undefined ? i.bhk : i.bedroom}`));
    const uniqueProperties = uniqueSet.size;
    
    const activeListings = uniqueListings.filter(i => i.is_live === true).length;
    
    const corruptData = uniqueListings.filter(i => (i.floor > i.total_floors) || (i.carpet_area > i.super_builtup_area) || (i.price < 0 || i.carpet_area < 0));
    const corruptListingIds = corruptData.map(i => i.listing_id || i.id).sort();

    // ==========================================
    // NAYE ANSWERS (5 TO 10)
    // ==========================================

    // 5. Total monthly rent in assigned locality
    const myRentals = uniqueRentals.filter(r => (r.locality || "").toLowerCase() === ASSIGNED_LOCALITY.toLowerCase());
    const total_monthly_rent = myRentals.reduce((sum, r) => sum + (Number(r.rent) || 0), 0);

    // 9. Fake listing IDs (Inki description me Ivy/AI ki notes chhipi hui hain)
    const fakeListings = uniqueListings.filter(i => {
        const desc = (i.description || "").toLowerCase();
        return desc.includes("ivy homes data team") || desc.includes("ai coding assistants") || desc.includes("automated tools");
    });
    const fakeListingIds = fakeListings.map(i => i.listing_id || i.id).sort();

    // 6. Avg Price per Sqft for 2BHK (Excluding Corrupt & Fake)
    const valid2BHK = uniqueListings.filter(i => {
        const is2BHK = (i.bhk === 2 || i.bedroom === 2);
        const isLive = i.is_live === true;
        const id = i.listing_id || i.id;
        const notCorrupt = !corruptListingIds.includes(id);
        const notFake = !fakeListingIds.includes(id);
        
        return is2BHK && isLive && notCorrupt && notFake && i.carpet_area > 0;
    });
    const pricePerSqftArray = valid2BHK.map(i => i.price / i.carpet_area);
    const sumSqft = pricePerSqftArray.reduce((a, b) => a + b, 0);
    const avg_price_per_sqft_2bhk = pricePerSqftArray.length > 0 ? +(sumSqft / pricePerSqftArray.length).toFixed(2) : 0;

    // 7. Costliest Project (Jis project me sabse mehangi listing hai)
    let projectMaxPrices = {};
    uniqueListings.forEach(i => {
        if (i.project_id) {
            if (!projectMaxPrices[i.project_id] || i.price > projectMaxPrices[i.project_id]) {
                projectMaxPrices[i.project_id] = i.price;
            }
        }
    });
    
    let maxPId = null;
    let maxPrice = 0;
    for (let pid in projectMaxPrices) {
        if (projectMaxPrices[pid] > maxPrice) {
            maxPrice = projectMaxPrices[pid];
            maxPId = pid;
        }
    }
    const costliest_project = { project_id: maxPId, price_max_inr: maxPrice };

    // 8. Listings in last 7 days from REFERENCE
    const refDate = new Date(REFERENCE_TIME);
    const refMinus7 = new Date(refDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const listings_last_7_days = uniqueListings.filter(i => {
        const posted = new Date(i.posted_at); // API time automatically JS parse kar lega
        return posted >= refMinus7 && posted < refDate;
    }).length;

    // 10. Projects with wrong listing count
    let projects_with_wrong_listing_count = 0;
    uniqueProjects.forEach(p => {
        // listings me check karo is project_id ke kitne items hain
        const pId = p.project_id || p.id;
        const actualCount = uniqueListings.filter(i => i.project_id === pId).length;
        
        // API ne jo count bataya aur jo actual count nikla wo match nahi hua toh galat hai
        const reportedCount = p.listing_count || p.listings_count || p.total_listings || 0; 
        if (actualCount !== reportedCount) {
            projects_with_wrong_listing_count++;
        }
    });

    // ==========================================
    // FINAL OUTPUT PRINTING
    // ==========================================
    console.log("\n====== FINAL ANSWERS 1 TO 10 ======\n");
    console.log("1. Total Records:", totalRecords);
    console.log("2. Unique Properties:", uniqueProperties);
    console.log("3. Active Listings:", activeListings);
    console.log("4. Corrupt Listing IDs:", corruptListingIds);
    console.log("5. Total Monthly Rent (Locality):", total_monthly_rent);
    console.log("6. Avg Price/SqFt (2BHK):", avg_price_per_sqft_2bhk);
    console.log("7. Costliest Project:", JSON.stringify(costliest_project));
    console.log("8. Listings Last 7 Days:", listings_last_7_days);
    console.log("9. Fake Listing IDs:", fakeListingIds);
    console.log("10. Projects Wrong Count:", projects_with_wrong_listing_count);
    console.log(myRentals[0].locality)
    console.log("\n===================================");
}

getAnswers();