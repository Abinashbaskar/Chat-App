import { SOCKET_URL } from "@/constants";

export const getFullImageUri = (path: string | null | undefined) => {
    if (!path) return undefined;
    if (path.startsWith("data:image") || path.startsWith("http")) {
        return path;
    }
    // If it's a relative path starting with /uploads, prepend SOCKET_URL
    return `${SOCKET_URL}${path}`;
};
