
export interface CategoryResponse {
    payload: {
        data: {
            categoryID: number;
            name: string;
            description: string;
            createdAt: string;
        };
    };
    messages: string[];
    errorCode: number;
}

export interface UserResponse {
    payload: {
        data: {
            userID: number;
            userAlias: string;
            email: string;
            firstName: string;
            surname: string;
            phone: string;
            passwordHash: string;
            statusId: number;
            createdAt: string;
            updatedAt: string;
            roleId: number;
        };
    };
    messages: string[];
    errorCode: number;
}

export interface PostResponse {
    payload: {
        data: {
            postID: number;
            parentPostID: number | null;
            userID: number;
            categoryID: number;
            title: string;
            content: string;
            statusId: number;
            isTopic: boolean;
            owner: boolean;
            createdAt: string;
            updatedAt: string;
        }[];
    };
    messages: string[];
    errorCode: number;
}

export interface PostDetailResponse {
    payload: {
        data: {
            post: {
                postID: number;
                parentPostID: number | null;
                userID: number;
                categoryID: number;
                title: string;
                content: string;
                statusId: number;
                isTopic: boolean;
                owner: boolean;
                createdAt: string;
                updatedAt: string;
            };
            tags: {
                tagID: number;
                tagName: string;
                createdAt: string;
            }[];
        };
    };
    messages: string[];
    errorCode: number;
}
