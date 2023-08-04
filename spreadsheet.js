/**
 * Base64 Encode Input
 * @param {any | Array<any[]>} input - Input cell, or range of cells
 * @param {boolean} [OPT_webSafe=true] - If should use websafe variant of base64
 * @param {boolean} [OPT_plainText=false] - If should treat input as plaintext instead of UTF-8
 */
function base64Encode(input, OPT_webSafe, OPT_plainText) {
    if (!input) return input;
    const charSet = OPT_plainText ? Utilities.Charset.US_ASCII : Utilities.Charset.UTF_8;
    const useWebSafe = OPT_webSafe !== false;
    const encoder = useWebSafe ? Utilities.base64EncodeWebSafe : Utilities.base64Encode;
    if (Array.isArray(input)) {
        return input.map(t => base64Encode(t, OPT_webSafe, OPT_plainText));
    }

    return encoder(input, charSet);
}
/**
 
Base64 Decode Input
@param {any | Array<any[]>} input - Input cell, or range of cells
@param {boolean} [OPT_webSafe=true] - If should use websafe variant of base64
@param {boolean} [OPT_plainText=false] - If should treat input as plaintext instead of UTF-8 */
function base64Decode(input, OPT_webSafe, OPT_plainText) {
    if (!input) return input; 
    const charSet = OPT_plainText ? Utilities.Charset.US_ASCII : Utilities.Charset.UTF_8; 
    const useWebSafe = OPT_webSafe !== false; 
    const decoder = useWebSafe ? Utilities.base64DecodeWebSafe : Utilities.base64Decode; 
    if (Array.isArray(input)) { 
        return input.map(t => base64Decode(t, OPT_webSafe, OPT_plainText)); 
    }
    return Utilities.newBlob(decoder(input, charSet)).getDataAsString();
}