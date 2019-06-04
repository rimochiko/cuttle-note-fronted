import axios from 'axios';

export default {
    createPost,
    updatePost,
    getOnePost,
    uploadImage,
    sendEditStatus,
    deleteDraft,
    lockPost
}

function createPost (args) {
    let query;
    if (args.groupId) {
        if (args.parentId) {
            query = `
            mutation {
                data:
                groupTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${escape(args.content)}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    parentId: ${args.parentId},
                    groupId: "${args.groupId}"
                ) {
                    code,
                    msg,
                    result {
                        id,
                        date
                    }
                }
            }`;        
        } else {
            query = `
            mutation {
                data:
                groupTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${escape(args.content)}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    groupId: "${args.groupId}"
                ) {
                    code,
                    msg,
                    result {
                        id,
                        date
                    }
                }
            }`;         
        }
    } else {
        if (args.parentId) {
            query = `
            mutation {
                data:
                userTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${escape(args.content)}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    parentId: ${args.parentId}
                ) {
                    code,
                    msg,
                    result {
                        id,
                        date
                    }
                }
            }`;        
        } else {
            query = `
            mutation {
                data:
                userTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${escape(args.content)}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish}
                ) {
                    code,
                    msg,
                    result {
                        id,
                        date
                    }
                }
            }`;         
        }
    }

    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
    })

}

function updatePost (args) {
    let query;
    if (args.groupId) {
        query = `
        mutation {
            data:
            groupTextPostUpdate (
                postId: ${args.postId || 0},
                token: "${args.token}",
                userId: "${args.userId}",
                title: "${args.title || '无标题'}",
                content: "${escape(args.content)}",
                isAuth: ${args.Auth ? args.Auth : 1},
                publish: ${args.publish},
                draftId: ${args.draftId || 0},
                groupId: "${args.groupId}"
            ) {
                code,
                msg,
                result {
                    id,
                    date
                }
            }
        }`;
    } else {
        query = `
        mutation {
            data:
            userTextPostUpdate (
                postId: ${args.postId || 0},
                token: "${args.token}",
                userId: "${args.userId}",
                title: "${args.title || '无标题'}",
                content: "${escape(args.content)}",
                isAuth: ${args.Auth ? args.Auth : 1},
                publish: ${args.publish},
                draftId: ${args.draftId || 0}
            ) {
                code,
                msg,
                result {
                    id,
                    date
                }
            }
        }`;
    }

    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
    })
}

function getOnePost (args) {
const query = `
query {
    data:
    post(
    userId:"${args.userId}",
    postId: ${args.postId},
    token: "${args.token}",
    isUpdate: ${args.isUpdate ? true : false}
    ) {
        code,
        msg,
        result {
            author {
                nickname
                id
            }
            belongGroup {
                nickname
                id
            }
            recentTime
            recentUser {
                nickname
                id
            }
            title
            content,
            parent,
            status,
            auth,
            type
        }
    }
}
`
return axios({
    url: '/graphql',
    method: 'post',
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodeURIComponent("query")+"="+encodeURIComponent(query)
    })
}

function uploadImage ({userId, token, imgbase}) {
    const query = `
    mutation {
        data:
        uploadImage(
            userId: "${userId}",
            token: "${token}",
            imgbase: "${imgbase}"            
        ) {
            code,
            msg,
            result {
                url
            }
        }
    }
    `;
    return axios({
    url: '/graphql',
    method: 'post',
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodeURIComponent("query")+"="+encodeURIComponent(query)
    })
}

function sendEditStatus ({postId, userId, token, isLock}) {
let query;
if (isLock) {
    query = `
    mutation {
        data:
        lockPost(
            postId: ${postId},
            userId: "${userId}",
            token: "${token}"
        ) {
            code,
            msg
        }
    }
    `;
} else {
    query = `
    mutation {
        data:
        unlockPost(
            postId: ${postId},
            userId: "${userId}",
            token: "${token}"
        ) {
            code,
            msg
        }
    }
    `
}

return axios.post('/graphql', {query});
}

function deleteDraft ({token, userId, draftId}) {
    const query = `
    mutation {
        data:
        postDelete(
            postId: ${draftId},
            token: "${token}",
            userId: "${userId}",
            absolute: 1
        ) {
            code,
            msg
        }   
    }

    `;
    return axios.post('/graphql', {query});   
}

function lockPost ({
    token,
    userId,
    postId
}) {
    // 0-加锁成功,1-他人正在编辑,2-内容有变动
    const query = `
    mutation {
        data:
        lockPost(
            userId: "${userId}",
            token: "${token}",
            postId: ${postId}
        ) {
            msg,
            code
        }      
    }
    `
    return axios.post('/graphql', {query});   
}