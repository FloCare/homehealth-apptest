// Helper functions to decide how a specific entity is displayed in the App

export const milesRenderString = (miles) => {
    if (miles === null || miles === undefined) return '__';
    return parseFloat(miles).toFixed(1);
};
