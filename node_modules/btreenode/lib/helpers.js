module.exports.strcmp = function(str1, str2) {
	return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
}

module.exports.isNullOrUndefined = function(value) {
	return (value == null || value == undefined);
}

types = {
	"[object Boolean]": "boolean",
	"[object Number]": "number",
	"[object String]": "string",
	"[object Function]": "function",
	"[object Array]": "array",
	"[object Date]": "date",
	"[object RegExp]": "regexp",
	"[object Object]": "object"
};

module.exports.getType = function(obj) {
	return obj == null ? String(obj) : types[toString.call(obj)] || "object"
}