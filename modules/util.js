"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errhand = exports.messageCapSlice = void 0;
function messageCapSlice(outString) {
    const outStrings = [];
    const MESSAGE_CAP = 2000;
    while (outString.length > MESSAGE_CAP) {
        let index = outString.slice(0, MESSAGE_CAP).lastIndexOf("\n");
        if (index === -1 || index >= MESSAGE_CAP) {
            index = outString.slice(0, MESSAGE_CAP).lastIndexOf(",");
            if (index === -1 || index >= MESSAGE_CAP) {
                index = outString.slice(0, MESSAGE_CAP).lastIndexOf(" ");
                if (index === -1 || index >= MESSAGE_CAP) {
                    index = MESSAGE_CAP - 1;
                }
            }
        }
        outStrings.push(outString.slice(0, index + 1));
        outString = outString.slice(index + 1);
    }
    outStrings.push(outString);
    return outStrings;
}
exports.messageCapSlice = messageCapSlice;
function errhand(e) {
    console.error(e);
}
exports.errhand = errhand;
//# sourceMappingURL=util.js.map