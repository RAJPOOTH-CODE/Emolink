export const encodeData = (data) => {
    try {
        const json = JSON.stringify(data);
        const bytes = new TextEncoder().encode(json);
        let binary = "";
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // Use Base64URL (safe for URLs without encoding)
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    } catch (e) {
        console.error("Encoding error:", e);
        return "";
    }
};

export const decodeData = (str) => {
    if (!str) return null;
    try {
        // Convert Base64URL back to standard Base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const json = new TextDecoder().decode(bytes);
        return JSON.parse(json);
    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
};
