export class QueryHelper {
    static nameContainsQuery(searchTerm){
        return this.orQuery(this.containsQueryIgnoreCase('firstName', searchTerm),
                            this.containsQueryIgnoreCase('lastName', searchTerm));
    }

    static orQuery = (exp1, exp2) => {
        return `(${exp1} OR ${exp2})`;
    };

    static andQuery = (exp1, exp2) => {
        return `(${exp1} AND ${exp2})`;
    };

    // Ignores case
    static containsQueryIgnoreCase = (field, value) => {
        return `${field} CONTAINS[c] "${value}"`;
    };
}
