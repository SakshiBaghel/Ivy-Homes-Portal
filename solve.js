
async function getAnswers() {
    let allData = [];
    let offset = 0;
    let hasMore = true;

    console.log("Data fetch ho raha hai, wait karo...");

    while (hasMore) {
        const response = await fetch(`https://solve.ivy.homes/v1/listings?limit=100&offset=${offset}`, {
            headers: {
                "X-API-Key": "IVY26-0DD40C14CD1F", 
                "Authorization": "Bearer eyJleHAiOjE3ODkzOTU2MzIsImlhdCI6MTc4OTM5NDczMiwia2V5IjoiSVZZMjYtMERENDBDMTRDRDFGIiwic3ViIjoiZGVtbzFAaXZ5LmhvbWVzIiwidHlwIjoiYWNjZXNzIn0.fAlwUTi3IEgibtZ-zKef50mur1CykjcTi-Wp3GBprZE"
            }
        });
        if (!response.ok) {
            console.log("❌ API ERROR:", response.status, await response.text());
            break;
        }
        const data = await response.json();
        const items = data.results || data.data || [];
        allData.push(...items);

        if (offset + items.length >= data.total || items.length === 0) {
            hasMore = false;
        } else {
            offset += items.length;
        }
    }

    // ✅ FIX: Duplicate records hatao (Pagination overlap fix)
    const uniqueData = Array.from(new Map(allData.map(item => [item.listing_id || item.id, item])).values());

    // 1. Total records (Ab exact 3531 aayega)
    const totalRecords = uniqueData.length;

    // 2. Unique properties
    const uniqueSet = new Set(uniqueData.map(i => `${i.latitude}-${i.longitude}-${i.bhk !== undefined ? i.bhk : i.bedroom}`));
    const uniqueProperties = uniqueSet.size;

    // 3. Active listings
    const activeListings = uniqueData.filter(i => i.is_live === true).length;

    // 4. Corrupt IDs
    const corruptIDs = uniqueData.filter(i => {
        return (i.floor > i.total_floors) || 
               (i.carpet_area > i.super_builtup_area) || 
               (i.price < 0 || i.carpet_area < 0);
    }).map(i => i.listing_id || i.id).sort();

    console.log("\n--- FINAL ANSWERS ---");
    console.log("1. Total Records:", totalRecords);
    console.log("2. Unique Properties:", uniqueProperties);
    console.log("3. Active Listings:", activeListings);
    console.log("4. Corrupt Listing IDs:", corruptIDs);
}

getAnswers();