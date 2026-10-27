import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { Message } from "@/type"

export interface GetMessagesOptions {
    limit?: number;
    before?: string;
}

export interface GetMessagesResponse {
    msgs: Message[];
    hasMore: boolean;
    nextCursor: string | null;
}

export const getAllMessages = async (
    room: string,
    options?: GetMessagesOptions
): Promise<GetMessagesResponse> => {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) {
        params.set("limit", String(options.limit));
    }
    if (options?.before) {
        params.set("before", options.before);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetchHelper<{
        msgs: Message[];
        hasMore?: boolean;
        nextCursor?: string | null;
    }>(`messages/${room}${query}`);

    return {
        msgs: response?.msgs || [],
        hasMore: response?.hasMore ?? false,
        nextCursor: response?.nextCursor ?? null,
    };
};
