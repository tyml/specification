export function Cached() {
    return function(target: any, key: string, value: any) {
		return {
            value: function () {
                const cKey = "__cached_" + key;
                let result = this[cKey];
                if (result === undefined) {
                    result = value.value.apply(this, []);
                    this[cKey] = result;
                }
                return result;
            }
        }
	};
}
