export function getMilesFromDateSummary(dateWiseSummary) {
    let totalComputedMiles = 0;
    let totalExtraMiles = 0;
    let totalVisits = 0;
    for (const date in dateWiseSummary) {
        totalComputedMiles += dateWiseSummary[date].computedMiles;
        totalExtraMiles += dateWiseSummary[date].extraMiles;
        totalVisits += dateWiseSummary[date].nVisits;
    }
    return {
        totalComputedMiles,
        totalExtraMiles,
        totalVisits
    };
}
